# Rate limit sandbox smoke tests
# POST minimal valid payloads to localhost:8080 handlers.
# Requires Docker Compose stack (web + mailpit) to be running.

param(
    [string]$BaseUrl = 'http://localhost:8080',
    [string]$StorageMode = $(if ($env:RATE_LIMIT_STORAGE) { $env:RATE_LIMIT_STORAGE } else { 'json' })
)

$ErrorActionPreference = 'Stop'
$passed = 0
$failed = 0

function Write-Result {
    param([string]$Name, [bool]$Ok, [string]$Detail = '')
    $script:passed += [int]$Ok
    $script:failed += [int](-not $Ok)
    $status = if ($Ok) { 'PASS' } else { 'FAIL' }
    $line = "[$status] $Name"
    if ($Detail) { $line += " - $Detail" }
    Write-Host $line
}

function Invoke-FormPost {
    param(
        [string]$Path,
        [hashtable]$Fields
    )

    $body = ($Fields.GetEnumerator() | ForEach-Object {
        "{0}={1}" -f [uri]::EscapeDataString($_.Key), [uri]::EscapeDataString([string]$_.Value)
    }) -join '&'

    return Invoke-WebRequest -Uri "$BaseUrl/$Path" -Method POST -Body $body `
        -ContentType 'application/x-www-form-urlencoded' -UseBasicParsing
}

function Invoke-ServiceRequestPost {
    param([hashtable]$Fields)

    $stlPath = Join-Path $PSScriptRoot 'fixtures\minimal.stl'
    if (-not (Test-Path $stlPath)) {
        throw "Missing fixture: $stlPath"
    }

    $curlArgs = @('-s', '-X', 'POST', "$BaseUrl/ServiceRequestSubmission.php")
    foreach ($entry in $Fields.GetEnumerator()) {
        $curlArgs += @('-F', ("{0}={1}" -f $entry.Key, [string]$entry.Value))
    }
    $curlArgs += @('-F', ("files=@$stlPath"))

    $output = & curl.exe @curlArgs
    return [PSCustomObject]@{
        Content = [string]$output
    }
}

function Get-JsonResponse {
    param($Response)
    try {
        return $Response.Content | ConvertFrom-Json
    } catch {
        return $null
    }
}

function Get-MailpitCount {
    try {
        $messages = Invoke-RestMethod -Uri 'http://localhost:8025/api/v1/messages?limit=500' -Method GET
        return @($messages.messages).Count
    } catch {
        return -1
    }
}

function Clear-Mailpit {
    try {
        Invoke-RestMethod -Uri 'http://localhost:8025/api/v1/messages' -Method DELETE | Out-Null
    } catch {
        # Mailpit may be empty or unavailable
    }
}

function Clear-RateLimitStorage {
    $base = Join-Path $PSScriptRoot '..\data\rate-limits'
    $jsonDir = Join-Path $base 'json'
    $sqliteFile = Join-Path $base 'rate_limits.sqlite'

    if (Test-Path $jsonDir) {
        Get-ChildItem $jsonDir -Filter '*.json' -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
    } else {
        New-Item -ItemType Directory -Force $jsonDir | Out-Null
    }

    if (Test-Path $sqliteFile) {
        try {
            Remove-Item -Force $sqliteFile -ErrorAction Stop
        } catch {
            $composeFile = Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) 'docker-compose.yml'
            if (Test-Path $composeFile) {
                Push-Location (Split-Path $composeFile -Parent)
                try {
                    docker compose exec -T web rm -f /var/www/html/sandbox/data/rate-limits/rate_limits.sqlite 2>$null | Out-Null
                } finally {
                    Pop-Location
                }
            }
        }
    }
}

$futureDate = (Get-Date).AddDays(14).ToString('yyyy-MM-dd')

Write-Host "=== Rate Limit Smoke Tests (storage: $StorageMode) ==="
Write-Host "Base URL: $BaseUrl"
Write-Host ''

# Preflight
try {
    $null = Invoke-WebRequest -Uri 'http://localhost:8025' -UseBasicParsing -TimeoutSec 5
    Write-Result 'Preflight: Mailpit reachable' $true
} catch {
    Write-Result 'Preflight: Mailpit reachable' $false $_.Exception.Message
    Write-Host ''
    Write-Host "Summary: $passed passed, $failed failed"
    exit 1
}

try {
    $null = Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing -TimeoutSec 5
    Write-Result 'Preflight: Web reachable' $true
} catch {
    Write-Result 'Preflight: Web reachable' $false $_.Exception.Message
    Write-Host ''
    Write-Host "Summary: $passed passed, $failed failed"
    exit 1
}

Clear-RateLimitStorage
Clear-Mailpit
$mailBefore = Get-MailpitCount

# T1 — Happy path (contact form)
$contactFields = @{
    first_name = 'Test'
    last_name  = 'User'
    email      = 'happy-path@example.test'
    category   = 'other'
    message    = 'Sandbox smoke test message.'
}

try {
    $resp = Invoke-FormPost -Path 'FormSubmission.php' -Fields $contactFields
    $json = Get-JsonResponse $resp
    $ok = ($json.success -eq $true)
    Write-Result 'T1 Happy path (contact)' $ok $(if ($ok) { $json.message } else { $resp.Content })
} catch {
    Write-Result 'T1 Happy path (contact)' $false $_.Exception.Message
}

Start-Sleep -Seconds 1
$mailAfterT1 = Get-MailpitCount
Write-Result 'T1 Mailpit messages (+2 expected)' ($mailAfterT1 -ge ($mailBefore + 2)) "count=$mailAfterT1"

Clear-RateLimitStorage
Clear-Mailpit

# T2 — IP limit (same email, repeat until blocked)
Clear-Mailpit
$ipBlocked = $false
$ipAttempt = 0
for ($i = 1; $i -le 6; $i++) {
    $ipAttempt = $i
    $fields = @{
        first_name = 'Rate'
        last_name  = 'Limit'
        email      = "ip-test-$i@example.test"
        category   = 'other'
        message    = "IP limit attempt $i"
    }
    try {
        $resp = Invoke-FormPost -Path 'FormSubmission.php' -Fields $fields
        $json = Get-JsonResponse $resp
        if ($json.success -eq $false -and $json.message -like '*network*') {
            $ipBlocked = $true
            break
        }
    } catch {
        break
    }
}
Write-Result 'T2 IP limit triggers' $ipBlocked "blocked on attempt $ipAttempt"

$mailAtBlock = Get-MailpitCount
$retryFields = @{
    first_name = 'Rate'
    last_name  = 'Limit'
    email      = 'ip-test-blocked@example.test'
    category   = 'other'
    message    = 'IP limit retry after block'
}
try {
    $null = Invoke-FormPost -Path 'FormSubmission.php' -Fields $retryFields
} catch {
    # Expected to remain blocked
}
$mailAfterRetry = Get-MailpitCount
Write-Result 'T2 No mail after IP block' ($mailAtBlock -eq $mailAfterRetry) "before=$mailAtBlock after=$mailAfterRetry"

Clear-RateLimitStorage
Clear-Mailpit

# T3 — Email limit (same IP, reuse one email until blocked)
Clear-Mailpit
$emailBlocked = $false
$emailAttempt = 0
for ($i = 1; $i -le 4; $i++) {
    $emailAttempt = $i
    $fields = @{
        first_name = 'Cap'
        last_name  = 'Tester'
        email      = 'email-cap@example.test'
        category   = 'other'
        message    = "Email limit attempt $i"
    }
    try {
        $resp = Invoke-FormPost -Path 'FormSubmission.php' -Fields $fields
        $json = Get-JsonResponse $resp
        if ($json.success -eq $false -and $json.message -like '*email address*') {
            $emailBlocked = $true
            break
        }
    } catch {
        break
    }
}
Write-Result 'T3 Email limit triggers' ($emailBlocked -and $emailAttempt -eq 3) "blocked on attempt $emailAttempt"

Clear-RateLimitStorage
Clear-Mailpit

# T6 — All four forms (happy path, unique emails)
Clear-Mailpit
$formCases = @(
    @{
        Name = 'Contact'
        Path = 'FormSubmission.php'
        Fields = @{
            first_name = 'All'
            last_name  = 'Forms'
            email      = 'all-forms-contact@example.test'
            category   = 'other'
            message    = 'All forms smoke test.'
        }
    },
    @{
        Name = 'Equipment'
        Path = 'EquipmentReservation.php'
        Fields = @{
            first_name         = 'All'
            last_name          = 'Forms'
            email              = 'all-forms-equipment@example.test'
            agreeTerms         = 'on'
            category           = 'booking'
            user_type          = 'industry'
            equipment_name     = 'Test Microscope'
            preferred_date     = $futureDate
            sample_description = 'Test sample for sandbox.'
            purpose_of_use     = 'Sandbox validation run.'
        }
    },
    @{
        Name = 'Service Request'
        Path = 'ServiceRequestSubmission.php'
        Fields = @{
            service_type           = 'printing'
            first_name             = 'All'
            last_name              = 'Forms'
            email                  = 'all-forms-service@example.test'
            affiliation            = 'External'
            department             = 'Sandbox Lab'
            project_title          = 'Smoke Test Print'
            application_category   = 'research'
            project_abstract       = 'Minimal abstract for sandbox testing.'
            print_size_length      = '10'
            print_size_width       = '10'
            print_size_height      = '10'
            quantity               = '1'
            material               = 'PLA'
            color                  = 'Blue'
            deadline               = $futureDate
            delivery               = 'pickup'
        }
    },
    @{
        Name = 'CHIPS Scholars'
        Path = 'IntelScholarshipSubmission.php'
        Fields = @{
            first_name          = 'All'
            last_name           = 'Forms'
            email               = 'all-forms-chips@example.test'
            phone               = '9285550100'
            current_institution = 'Example University'
            intended_major      = 'Electrical Engineering'
            degree_interest     = 'ms'
            target_term         = 'fall_2026'
            enrollment_status   = 'onboarding'
        }
    }
)

$allFormsOk = $true
foreach ($case in $formCases) {
    Clear-RateLimitStorage
    try {
        if ($case.Path -eq 'ServiceRequestSubmission.php') {
            $resp = Invoke-ServiceRequestPost -Fields $case.Fields
        } else {
            $resp = Invoke-FormPost -Path $case.Path -Fields $case.Fields
        }
        $json = Get-JsonResponse $resp
        $ok = ($json.success -eq $true)
        if (-not $ok) { $allFormsOk = $false }
        Write-Result ("T6 {0}" -f $case.Name) $ok $(if ($ok) { 'success' } else { $resp.Content })
    } catch {
        $allFormsOk = $false
        Write-Result ("T6 {0}" -f $case.Name) $false $_.Exception.Message
    }
}

Start-Sleep -Seconds 1
$mailAllForms = Get-MailpitCount
Write-Result 'T6 Mailpit messages (8 expected)' ($mailAllForms -ge 8) "count=$mailAllForms"

# T7 — No production leak (Mailpit recipients)
$leakFree = $true
try {
    $messages = Invoke-RestMethod -Uri 'http://localhost:8025/api/v1/messages?limit=500'
    foreach ($msg in $messages.messages) {
        $detail = Invoke-RestMethod -Uri ("http://localhost:8025/api/v1/message/{0}" -f $msg.ID)
        $recipients = @($detail.To, $detail.CC, $detail.From) | Where-Object { $_ }
        foreach ($addr in $recipients) {
            $emailAddr = if ($addr.Address) { $addr.Address } else { [string]$addr }
            if ($emailAddr -match '@nau\.edu') {
                $leakFree = $false
            }
        }
    }
} catch {
    $leakFree = $false
}
Write-Result 'T7 No @nau.edu in Mailpit' $leakFree

Write-Host ''
Write-Host "Summary: $passed passed, $failed failed (storage: $StorageMode)"
if ($failed -gt 0) { exit 1 }
exit 0
