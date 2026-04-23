<?php
/*
 * ServiceRequestSubmission.php
 * ---------------------------
 * This file handles submissions from ServiceRequest.html, which offers three
 * distinct service types through a single unified backend:
 *
 *   - 3D Printing    (form id="printing-form")
 *   - Laser Structuring (form id="laser-form")
 *   - 3D Scanning    (form id="scanning-form")
 *
 * Each service has its own set of required fields, optional fields, field labels,
 * and allowed upload file types. Rather than writing separate PHP files for each
 * service, everything is driven by the $services registry at the top of this file.
 * The execution logic at the bottom is generic — it reads whatever service type
 * the form posted and looks it up in $services to get the right rules.
 *
 * Flow:
 *   1. Validate service type and required fields
 *   2. If shipping was selected, validate the shipping address fields too
 *   3. Sanitize, validate, and normalize any uploaded files
 *   4. Build the email detail rows from posted data
 *   5. Send an internal notification to the lab
 *   6. Send a confirmation copy back to the user
 *   7. Return a JSON response that the JavaScript on ServiceRequest.html reads
 */

// Start output buffering so any stray PHP notice before respond() can't corrupt
// the JSON body. respond() calls ob_clean() before writing its payload.
ob_start();

// Log errors to the server log but never display them to the browser — exposed
// stack traces can leak file paths and server internals.
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// PHPMailer is loaded manually (not via Composer autoload) because this project
// doesn't use Composer. The three files below are the entire PHPMailer library —
// no additional dependencies are needed for SMTP sending.
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// --- Constants ---------------------------------------------------------------
// These are defined at the top so they are easy to update without digging into
// the logic below. LAB_EMAIL is both the recipient of internal notifications and
// the "reply-to" address shown on user confirmation emails.
define('LAB_EMAIL', 'akhil.kinnera@nau.edu');
define('SENDER_EMAIL', 'akhil.kinnera@nau.edu');
define('SENDER_NAME', 'MPaCT Nano Lab');

// Local testing: Mailpit SMTP trap. Emails stay on this machine.
define('SMTP_HOST', 'localhost');
define('SMTP_PORT', 1025);

// Per-file and total upload limits. 25 MB per file accommodates larger STL/Gerber
// files, but we also cap the combined total at 50 MB inside validateUploads()
// so one submission can't flood the email server with attachments.
define('MAX_FILE_SIZE_BYTES', 25 * 1024 * 1024); // 25 MB per file
define('MAX_FILES_PER_UPLOAD', 10);

// Shown in the email table cell when the submitter didn't include any files.
// Defined as a constant so both the HTML and plain-text versions stay in sync.
define('DEFAULT_UPLOAD_HINT', 'No files uploaded');

// --- BLOCKED_MIME_TYPES ------------------------------------------------------
// This is a plain PHP array constant, which is valid in PHP 7+ (no serialize()
// workaround needed). It lists MIME types whose magic bytes indicate executable
// or script content — things that should never be uploaded to a university
// research lab portal regardless of what extension the user attached.
//
// Why magic bytes and not just the extension? Because anyone can rename
// "malware.php" to "drawing.pdf" and a pure extension check would let it through.
// The finfo_file() call in validateUploads() reads the actual first bytes of
// the file to determine what it really is — that check uses this list.
define('BLOCKED_MIME_TYPES', [
    'application/x-php',
    'application/x-httpd-php',
    'application/x-sh',
    'application/x-shellscript',
    'application/x-executable',
    'application/x-elf',           // Linux ELF binary
    'application/x-msdos-program',
    'application/x-msdownload',    // Windows PE / .exe
    'text/x-php',
    'text/x-script.python',
    'text/x-perl',
    'text/x-ruby',
]);

// --- $services registry -------------------------------------------------------
// This is the configuration table that drives everything below. Each top-level
// key ('printing', 'laser', 'scanning') must match the value that ServiceRequest.html
// puts in the hidden <input name="service_type"> field inside each form.
//
// What each sub-key means:
//   title            — used in email subjects and headings
//   required         — fields that must be non-empty for the submission to proceed;
//                      PHP will return a human-readable error if any are missing
//   fields           — the ordered list of fields to show in the email detail table;
//                      this controls both order and visibility
//   labels           — human-readable column names for the email table;
//                      without this, the raw field names (e.g. 'print_size_length')
//                      would appear verbatim in the email
//   uploadField      — the name of the <input type="file"> in the HTML form
//   allowedExtensions — the whitelist for that service's file uploads; each service
//                       accepts different formats (STL for printing, Gerber for laser, etc.)
$services = [
    'printing' => [
        'title' => '3D Printing Service Request',
        'required' => [
            'first_name', 'last_name', 'email', 'affiliation', 'department',
            'project_title', 'application_category', 'project_abstract',
            'print_size_length', 'print_size_width', 'print_size_height',
            'quantity', 'material', 'color', 'deadline', 'delivery'
        ],
        'fields' => [
            'affiliation', 'department', 'project_title', 'application_category', 'project_abstract',
            'print_size_length', 'print_size_width', 'print_size_height',
            'quantity', 'material', 'color', 'filament_estimate', 'deadline', 'delivery',
            'shipping_contact_name', 'shipping_speed', 'shipping_address_line1', 'shipping_address_line2',
            'shipping_city', 'shipping_state', 'shipping_zip', 'shipping_country', 'carrier_preference',
            'notes'
        ],
        'labels' => [
            'affiliation' => 'Affiliation',
            'department' => 'Organization / Department',
            'project_title' => 'Project Title',
            'application_category' => 'Application Category',
            'project_abstract' => 'Project Abstract / End Goal',
            'print_size_length' => 'Length (mm)',
            'print_size_width' => 'Width (mm)',
            'print_size_height' => 'Height (mm)',
            'quantity' => 'Quantity',
            'material' => 'Material',
            'color' => 'Preferred Filament Color',
            'filament_estimate' => 'Estimated Filament Use (g)',
            'deadline' => 'Requested Completion Date',
            'delivery' => 'Delivery Method',
            'shipping_contact_name' => 'Shipping Contact Name',
            'shipping_speed' => 'Shipping Speed',
            'shipping_address_line1' => 'Shipping Address Line 1',
            'shipping_address_line2' => 'Shipping Address Line 2',
            'shipping_city' => 'Shipping City',
            'shipping_state' => 'Shipping State / Province',
            'shipping_zip' => 'Shipping ZIP / Postal Code',
            'shipping_country' => 'Shipping Country',
            'carrier_preference' => 'Carrier Preference',
            'notes' => 'Additional Notes'
        ],
        'uploadField' => 'files',
        // 3D model formats (STL, 3MF, OBJ, STEP…) plus images. ZIP removed — users must upload individual files.
        'allowedExtensions' => ['stl', '3mf', 'obj', 'ply', 'step', 'stp', 'iges', 'igs', 'pdf', 'jpg', 'jpeg', 'png']
    ],
    'laser' => [
        'title' => 'Laser Structuring Service Request',
        'required' => [
            'first_name', 'last_name', 'email', 'affiliation', 'organization',
            'project_title', 'application_category', 'project_abstract',
            'substrate_type', 'target_material',
            'substrate_dim_length', 'substrate_dim_width', 'substrate_dim_thickness',
            'quantity', 'deadline', 'delivery'
        ],
        'fields' => [
            'affiliation', 'organization', 'project_title', 'application_category', 'project_abstract',
            'substrate_type', 'target_material',
            'substrate_dim_length', 'substrate_dim_width', 'substrate_dim_thickness',
            'min_feature', 'quantity', 'deadline', 'delivery',
            'shipping_contact_name', 'shipping_speed', 'shipping_address_line1', 'shipping_address_line2',
            'shipping_city', 'shipping_state', 'shipping_zip', 'shipping_country', 'carrier_preference',
            'notes'
        ],
        'labels' => [
            'affiliation' => 'Affiliation',
            'organization' => 'Organization / Department',
            'project_title' => 'Project Title',
            'application_category' => 'Application Category',
            'project_abstract' => 'Project Abstract / End Goal',
            'substrate_type' => 'Substrate Type',
            'target_material' => 'Target Material / Layer',
            'substrate_dim_length' => 'Substrate Length (mm)',
            'substrate_dim_width' => 'Substrate Width (mm)',
            'substrate_dim_thickness' => 'Substrate Thickness (mm)',
            'min_feature' => 'Minimum Feature Size (um)',
            'quantity' => 'Number of Units',
            'deadline' => 'Requested Completion Date',
            'delivery' => 'Delivery Method',
            'shipping_contact_name' => 'Shipping Contact Name',
            'shipping_speed' => 'Shipping Speed',
            'shipping_address_line1' => 'Shipping Address Line 1',
            'shipping_address_line2' => 'Shipping Address Line 2',
            'shipping_city' => 'Shipping City',
            'shipping_state' => 'Shipping State / Province',
            'shipping_zip' => 'Shipping ZIP / Postal Code',
            'shipping_country' => 'Shipping Country',
            'carrier_preference' => 'Carrier Preference',
            'notes' => 'Additional Notes'
        ],
        'uploadField' => 'design_files',
        // Gerber and CAD vector formats for PCB and laser layout work. ZIP removed.
        'allowedExtensions' => ['gbr', 'gerber', 'dxf', 'dwg', 'svg', 'pdf', 'jpg', 'jpeg', 'png', 'step', 'stp']
    ],
    'scanning' => [
        'title' => '3D Scanning Service Request',
        'required' => [
            'first_name', 'last_name', 'email', 'affiliation', 'organization',
            'project_title', 'application_category', 'project_abstract',
            'scan_mode', 'object_size', 'surface_type',
            'object_dim_length', 'object_dim_width', 'object_dim_height',
            'output_format', 'color_capture', 'quantity',
            'dropoff_confirm', 'usb_confirm'
        ],
        'fields' => [
            'affiliation', 'organization', 'project_title', 'application_category', 'project_abstract',
            'scan_mode', 'object_size', 'surface_type',
            'object_dim_length', 'object_dim_width', 'object_dim_height',
            'output_format', 'color_capture', 'quantity', 'dropoff_date', 'dropoff_confirm', 'usb_confirm', 'notes'
        ],
        'labels' => [
            'affiliation' => 'Affiliation',
            'organization' => 'Organization / Department',
            'project_title' => 'Project Title',
            'application_category' => 'Application Category',
            'project_abstract' => 'Project Abstract / End Goal',
            'scan_mode' => 'Scan Mode',
            'object_size' => 'Object Size Category',
            'surface_type' => 'Object Surface Type',
            'object_dim_length' => 'Object Length (mm)',
            'object_dim_width' => 'Object Width (mm)',
            'object_dim_height' => 'Object Height (mm)',
            'output_format' => 'Output Format',
            'color_capture' => 'Color Capture',
            'quantity' => 'Number of Objects to Scan',
            'dropoff_date' => 'Preferred Drop-off Date',
            'dropoff_confirm' => 'Drop-off Confirmation',
            'usb_confirm' => 'USB Confirmation',
            'notes' => 'Additional Notes'
        ],
        'uploadField' => 'reference_files',
        // Reference photos and simple drawings only. ZIP removed.
        'allowedExtensions' => ['jpg', 'jpeg', 'png', 'tif', 'tiff', 'pdf']
    ]
];

// --- Helper functions --------------------------------------------------------

// Trims whitespace and HTML-encodes special characters so the value is safe to
// embed in HTML. All user-supplied text goes through this before we touch it.
function clean(string $value): string
{
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

// Reads a POST field and returns it already cleaned. Use this when you need a
// value for validation logic or when building display strings that go directly
// into HTML without any further transformation.
//
// IMPORTANT: Do NOT use post() to read field values that will also be passed
// through formatValue(). That function does its own htmlspecialchars() call
// afterwards, so using post() first would double-encode things like "Faculty &
// Staff" into "Faculty &amp;amp; Staff" in the email.
function post(string $key): string
{
    return isset($_POST[$key]) ? clean((string) $_POST[$key]) : '';
}

// Sends a JSON response and immediately stops execution. Every code path in
// this file ends with a call to respond() — success or failure, it always
// tells the JavaScript on ServiceRequest.html exactly what happened.
function respond(bool $ok, string $msg): void
{
    if (ob_get_length()) {
        ob_clean();
    }
    header('Content-Type: application/json');
    echo json_encode(['success' => $ok, 'message' => $msg]);
    exit;
}

// Checks that a list of POST fields are all non-empty. If any are missing,
// it responds with a human-readable error and stops. The field key is
// converted from snake_case to "Title Case" so users see something like
// "Missing required field: Project Title." instead of raw machine names.
function requireFields(array $keys, array $labels = []): void
{
    foreach ($keys as $key) {
        if (empty(post($key))) {
            $display = $labels[$key] ?? ucwords(str_replace('_', ' ', $key));
            respond(false, 'Missing required field: ' . $display . '.');
        }
    }
}

// Translates the machine values that HTML <select> elements post into the
// human-readable labels we want to show in emails. For example, 'nau_faculty_staff'
// becomes 'NAU Faculty / Staff', and 'pickup' becomes 'Lab Pickup (Free)'.
//
// The static keyword means the $map array is only built once per PHP request,
// not every time this function is called. For a page that calls it thirty times
// (one per detail row), that is a meaningful saving.
//
// Any value not found in the map falls back to ucwords(str_replace('_', ' ', $raw)),
// which at least makes it readable even if it is not a perfect translation.
function formatValue(string $raw): string
{
    static $map = [
        'new_user'           => 'Yes — First-time user',
        'refresher'          => 'Yes — Refresher needed',
        'no'                 => 'No',
        'yes'                => 'Yes',
        'self_service'       => 'Self-service',
        'staff_assisted'     => 'Staff-assisted session',
        'full_service'       => 'Full service (sample-in / data-out)',
        // Affiliation (legacy names from older form versions)
        'nau_student'        => 'NAU Student',
        'nau_faculty_staff'  => 'NAU Faculty / Staff',
        'external_academic'  => 'External Academic / Researcher',
        'industry'           => 'Industry / Commercial',
        // Affiliation (current HTML option values)
        'internal_research'  => 'NAU Internal Researcher/Faculty',
        'internal_student'   => 'NAU Student',
        'commercial'         => 'Industry / Commercial',
        // Departments / colleges
        'sanghi_engineering' => 'Steve Sanghi College of Engineering',
        'ceias'              => 'College of Engineering, Informatics & Applied Sciences',
        'cefns'              => 'College of the Environment, Forestry & Natural Sciences',
        'franke_business'    => 'W.A. Franke College of Business',
        'education'          => 'College of Education',
        'arts_letters'       => 'College of Arts & Letters',
        'social_behavioral'  => 'College of Social & Behavioral Sciences',
        'health_human'       => 'College of Health & Human Services',
        'graduate'           => 'Graduate College',
        // Delivery
        'pickup'             => 'Lab Pickup (Free)',
        'ship'               => 'Ship to Address',
        'standard'           => 'Standard (Ground, typically 2-5 business days)',
        'one_to_two_day'     => '1-2 Business Days',
        // Application categories — 3D Printing
        'prototype'          => 'Prototype Development',
        'functional'         => 'Functional Part',
        'research'           => 'Educational / Research',
        'art'                => 'Art & Custom Design',
        'medical'            => 'Medical / Prosthetics',
        'tooling'            => 'Tooling / Fixtures',
        // Application categories — Laser
        'rf'                 => 'RF & Microwave Circuits',
        'microfluidics'      => 'Microfluidics / Channels',
        'flex'               => 'Flexible Electronics',
        'thinfilm'           => 'Thin Film Removal / Coating Ablation',
        'ceramic'            => 'Ceramic Machining',
        'general'            => 'General PCB Prototyping',
        // Application categories — Scanning
        'reverse_eng'        => 'Reverse Engineering',
        'quality_inspect'    => 'Quality Inspection / Metrology',
        'digital_archive'    => 'Digital Archiving / Preservation',
        '3d_printing_prep'   => '3D Print File Preparation',
        'art_design'         => 'Art & Custom Design',
        // Scan modes
        'laser_hd'           => 'Laser HD — Fine detail, objects ≥ 10 mm (0.05 mm res)',
        'ir_rapid'           => 'IR Rapid — Large objects ≥ 50 mm, fast capture (0.2 mm res)',
        // Object sizes
        'tiny'               => 'Tiny — 10 to 100 mm (Laser HD recommended)',
        'small'              => 'Small — 100 to 500 mm (Laser HD or IR Rapid)',
        'medium'             => 'Medium — 500 mm to 1 m (IR Rapid recommended)',
        'large'              => 'Large — over 1 m (contact lab manager first)',
        // Surface types
        'matte'              => 'Matte / Textured',
        'glossy'             => 'Glossy / Reflective',
        'dark'               => 'Dark / Black',
        'transparent'        => 'Transparent / Translucent',
        'mixed'              => 'Mixed surfaces',
        // Output formats
        'stl'                => 'STL (3D Printing ready)',
        'obj'                => 'OBJ (with texture)',
        'ply'                => 'PLY (Point cloud)',
        '3mf'                => '3MF',
        'asc'                => 'ASC (ASCII point cloud)',
        'multiple'           => 'Multiple formats',
        // Substrate types (laser)
        'fr4'                => 'FR4 (Standard PCB)',
        'rogers'             => 'Rogers RF Laminate',
        'glass'              => 'Glass (Borosilicate/Soda-lime)',
        'pet'                => 'PET / Flexible Film',
        'silicon'            => 'Silicon Wafer',
        // Target materials (laser)
        'copper'             => 'Copper',
        'gold'               => 'Gold',
        'ito'                => 'ITO (Indium Tin Oxide)',
        'silver'             => 'Silver',
        'aluminum'           => 'Aluminum',
        // Generic
        'other'              => 'Other',
        'unsure'             => 'Not sure — let staff recommend',
        // Filament color values
        'light_green'        => 'Light Green',
        'dark_gray'          => 'Dark Gray',
    ];
    if ($raw === '') return '';
    return $map[$raw] ?? ucwords(str_replace('_', ' ', $raw));
}

/**
 * Strip everything unsafe from a user-supplied filename before it touches
 * an email header or an HTML attribute.
 *
 * basename() removes path components (../../etc/passwd style traversal).
 * The first preg_replace removes null bytes and CRLF sequences — these are
 * the classic MIME header injection attack: if a filename contains a newline
 * followed by "Bcc: attacker@evil.com", some mail servers will parse that as
 * a real header and silently CC the attacker on every email.
 * The second preg_replace keeps only printable ASCII so nothing unexpected
 * survives into email headers or HTML.
 * Finally, the result is capped at 200 characters to stay within MIME limits.
 */
function sanitizeFilename(string $raw): string
{
    $name = basename($raw);                          // drop any path component
    $name = preg_replace('/[\x00-\x1F\x7F\r\n]/', '', $name); // strip control chars + CRLF
    $name = preg_replace('/[^\x20-\x7E]/', '', $name);         // printable ASCII only
    $name = trim($name, ". \t");                     // no leading/trailing dots or spaces
    $name = substr($name, 0, 200);
    return $name === '' ? 'upload' : $name;
}

/**
 * Turns PHP's awkward $_FILES structure into a plain, predictable array
 * of file entries, each with name/tmp_name/error/size keys.
 *
 * When a form uses <input type="file" multiple>, PHP stores $_FILES as
 * nested arrays: $_FILES['files']['name'][0], [1], etc. But when the input
 * is NOT multiple (or only one file was selected), PHP stores it flat:
 * $_FILES['files']['name'] = 'single_file.stl'. This function handles both
 * shapes so the rest of the code never has to worry about which format it got.
 *
 * We also cap the loop at MAX_FILES_PER_UPLOAD to prevent someone from
 * submitting 500 files via a crafted request.
 */
function normalizeUploadFiles(string $fieldName): array
{
    if (!isset($_FILES[$fieldName])) {
        return [];
    }

    $f = $_FILES[$fieldName];
    $files = [];

    if (is_array($f['name'])) {
        // Multi-file upload: $_FILES['field']['name'] is an array
        $count = min(count($f['name']), MAX_FILES_PER_UPLOAD);
        for ($i = 0; $i < $count; $i++) {
            if (empty($f['name'][$i])) {
                continue;
            }
            $files[] = [
                'name'     => sanitizeFilename((string) $f['name'][$i]),
                'tmp_name' => (string) $f['tmp_name'][$i],
                'error'    => (int)    $f['error'][$i],
                'size'     => (int)    $f['size'][$i],
            ];
        }
    } else {
        // Single-file upload: $_FILES['field']['name'] is a plain string
        if (!empty($f['name'])) {
            $files[] = [
                'name'     => sanitizeFilename((string) $f['name']),
                'tmp_name' => (string) $f['tmp_name'],
                'error'    => (int)    $f['error'],
                'size'     => (int)    $f['size'],
            ];
        }
    }

    return $files;
}

/**
 * Validates each uploaded file and returns only the ones that pass.
 * Responds and exits immediately if anything dangerous or oversized is found.
 *
 * Two-layer file type check:
 *   1. Extension allowlist  — the per-service list from $services['allowedExtensions'].
 *      Quick and cheap, but easily defeated by renaming a file.
 *   2. Magic-byte MIME check — finfo reads the actual first bytes of the file.
 *      This is the real security gate. Even if someone uploads "evil.php" renamed
 *      to "design.pdf", finfo will detect the PHP signature and block it.
 *
 * Both layers are needed: extension alone is too weak; MIME alone would block
 * legitimate files whose MIME type isn't in our blocked list but whose extension
 * we don't want (e.g. .exe with a text/plain signature — still not a 3D model).
 *
 * If finfo_open is unavailable on the server, we log a warning and fall back to
 * extension-only checking rather than failing the entire submission.
 */
function validateUploads(array $files, array $allowedExtensions): array
{
    if (count($files) > MAX_FILES_PER_UPLOAD) {
        respond(false, 'Too many files uploaded. Maximum is ' . MAX_FILES_PER_UPLOAD . ' files per submission.');
    }

    $blockedMimes = BLOCKED_MIME_TYPES;
    $finfo = function_exists('finfo_open') ? finfo_open(FILEINFO_MIME_TYPE) : null;
    if ($finfo === null) {
        error_log('MPCT Upload Warning: finfo_open unavailable — magic-byte MIME check skipped.');
    }

    $totalSize = 0;
    $validated = [];

    foreach ($files as $file) {
        // PHP upload error codes: anything other than UPLOAD_ERR_OK (0) means
        // the browser-to-server transfer itself failed. Retry is the right advice.
        if ($file['error'] !== UPLOAD_ERR_OK) {
            respond(false, 'One or more uploaded files failed during upload. Please retry.');
        }

        // Skip empty file entries (browser submitted a file input with nothing selected)
        if ($file['size'] <= 0) {
            continue;
        }

        // Per-file size cap
        if ($file['size'] > MAX_FILE_SIZE_BYTES) {
            respond(false, 'Each uploaded file must be 25 MB or smaller.');
        }

        // Running total across all files in this submission
        $totalSize += $file['size'];
        if ($totalSize > 50 * 1024 * 1024) {
            respond(false, 'Total upload size must not exceed 50 MB across all files.');
        }

        // is_uploaded_file() verifies the file came through PHP's upload mechanism
        // and wasn't injected by pointing tmp_name at an arbitrary server path.
        if (!is_uploaded_file($file['tmp_name'])) {
            respond(false, 'Invalid file upload detected.');
        }

        // Layer 1: Extension allowlist
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($extension === '' || !in_array($extension, $allowedExtensions, true)) {
            respond(false, 'File type not accepted for this service: ' . clean($file['name'])
                . '. Allowed: ' . implode(', ', $allowedExtensions) . '.');
        }

        // Layer 2: Magic-byte MIME check — reads the actual file bytes,
        // not the extension. Rejects known executable/script signatures.
        if ($finfo !== null) {
            $detectedMime = finfo_file($finfo, $file['tmp_name']);
            if ($detectedMime !== false && in_array($detectedMime, $blockedMimes, true)) {
                respond(false, 'File rejected due to unsafe content type: ' . clean($file['name']) . '.');
            }
        }

        $validated[] = $file;
    }

    // Always close the finfo resource to release the shared magic database handle
    // (finfo_close is deprecated in PHP 8.5+ — resources are freed automatically)
    if ($finfo !== null && PHP_VERSION_ID < 80500) {
        finfo_close($finfo);
    }

    return $validated;
}

/**
 * Validates that a numeric POST field falls within the given inclusive range.
 * Silently skips empty values (requireFields already handles missing-required).
 */
function validateNumericRange(string $field, float $min, float $max, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (!is_numeric($val)) {
        respond(false, "$label must be a valid number.");
    }
    $num = (float) $val;
    if ($num < $min || $num > $max) {
        respond(false, "$label must be between $min and $max.");
    }
}

/**
 * Enforces a maximum character length on a POST field using mb_strlen so
 * multi-byte UTF-8 characters count correctly.
 */
function enforceMaxLength(string $field, int $max): void
{
    $val = trim($_POST[$field] ?? '');
    if (mb_strlen($val) > $max) {
        $label = ucwords(str_replace('_', ' ', $field));
        respond(false, "$label exceeds the $max-character limit.");
    }
}

/**
 * Validates that a numeric POST field is a whole number (integer).
 * Rejects decimals like 1.5. Silently skips empty values.
 */
function validateInteger(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (!is_numeric($val) || floor((float) $val) != (float) $val) {
        respond(false, "$label must be a whole number.");
    }
}

/**
 * Validates a date field is a valid Y-m-d value between today and six months
 * from now, mirroring the HTML date input min/max restrictions set in JS.
 */
function validateDateInRange(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    $date = DateTime::createFromFormat('Y-m-d', $val);
    if (!$date || $date->format('Y-m-d') !== $val) {
        respond(false, "$label must be a valid date (YYYY-MM-DD).");
    }
    $today   = new DateTime('today');
    $maxDate = (new DateTime('today'))->modify('+6 months');
    if ($date < $today) respond(false, "$label cannot be in the past.");
    if ($date > $maxDate) respond(false, "$label must be within 6 months from today.");
}

/**
 * Returns true when the string contains Unicode emoji characters.
 * The range covers the major Emoji blocks defined in Unicode 15.
 */
function containsHtmlTags(string $text): bool
{
    return (bool) preg_match(
        '/<\s*\/?(script|img|iframe|object|embed|svg|form|input|button|a\s|div|span|style|link|meta|base|body|html)\b/i',
        $text
    ) || (bool) preg_match(
        '/(on\w+\s*=|javascript\s*:)/i',
        $text
    );
}

function containsEmoji(string $text): bool
{
    return (bool) preg_match(
        '/[\x{1F300}-\x{1F9FF}\x{2600}-\x{27BF}\x{FE00}-\x{FE0F}\x{1FA00}-\x{1FAFF}]/u',
        $text
    );
}

/**
 * Heuristic for keyboard-mashing: 4 or more consecutive identical characters
 * (e.g. "aaaa", "zzzz", "1111") are a strong signal the user pasted garbage.
 */
function looksLikeMashing(string $text): bool
{
    return (bool) preg_match('/(.)\1{3,}/u', $text);
}

/**
 * Validates a name field: Unicode letters, spaces, hyphens, apostrophes,
 * and dots only. Rejects digits, most punctuation, and emoji.
 */
function validateNameField(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (containsEmoji($val)) {
        respond(false, "$label cannot contain emoji.");
    }
    if (!preg_match('/^[\p{L}\s\'\-\.]+$/u', $val)) {
        respond(false, "$label should contain letters, spaces, hyphens, or apostrophes only.");
    }
}

/**
 * Validates a general text field for emoji and obvious keyboard mashing.
 * Used on org/dept, abstract, and notes fields.
 */
function validateTextField(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (containsHtmlTags($val)) {
        respond(false, "$label cannot contain HTML or script-like content.");
    }
    if (containsEmoji($val)) {
        respond(false, "$label cannot contain emoji.");
    }
    if (looksLikeMashing($val)) {
        respond(false, "$label appears to contain invalid input. Please provide a meaningful response.");
    }
}

/**
 * Enforces a maximum word count on a textarea field, matching the
 * data-max-words="500" attribute in the HTML form.
 */
function enforceWordLimit(string $field, int $maxWords, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    $count = count(preg_split('/\s+/', $val, -1, PREG_SPLIT_NO_EMPTY));
    if ($count > $maxWords) {
        respond(false, "$label must not exceed $maxWords words (currently $count words).");
    }
}

/**
 * Attaches each validated file to a PHPMailer instance directly from the PHP
 * temp path. This must happen before the script exits — PHP automatically
 * deletes temp upload files when the request ends. We never move or copy files
 * to a permanent location, so the temp file is our only window to attach them.
 *
 * The filename passed to addAttachment() has already been sanitized by
 * normalizeUploadFiles(), so no further escaping is needed here.
 */
function attachUploads(PHPMailer $mail, array $files): void
{
    foreach ($files as $file) {
        $mail->addAttachment($file['tmp_name'], $file['name']);
    }
}

/**
 * Creates a fresh, pre-configured PHPMailer instance for one email send.
 *
 * Why a factory function instead of one shared instance?
 * PHPMailer keeps state between sends — recipients, attachments, headers.
 * If we called $mail->clearAddresses() between the lab email and the user
 * email, we could still accidentally carry over the wrong Subject or
 * attachments. A factory guarantees a clean slate every time, which is
 * especially important here because both emails get file attachments added
 * after this function returns.
 *
 * The logo is embedded via CID (Content-ID) rather than a remote URL.
 * Gmail and Outlook block remote images by default, so the NAU logo would
 * appear as a broken image placeholder in most inboxes. Embedding it
 * directly in the email means it always renders without the recipient
 * needing to click "load images".
 */
function createMailer(): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->Port = SMTP_PORT;
    $mail->SMTPAuth  = false;   // NAU's internal relay does not require credentials
    $mail->SMTPSecure = '';     // No TLS — internal network only, not exposed to internet
    $mail->SMTPAutoTLS = false; // Prevent PHPMailer from trying to upgrade to TLS anyway

    $mail->setFrom(SENDER_EMAIL, SENDER_NAME);
    $mail->isHTML(true);
    $mail->CharSet  = 'UTF-8';
    $mail->Encoding = 'base64'; // base64 handles all UTF-8 characters safely in email

    // Custom headers that help with deliverability and inbox threading
    $mail->XMailer  = 'MPaCT Nano Service Request Mailer';
    $mail->MessageID = '<' . uniqid('mpct-service-', true) . '@nau.edu>';
    $mail->Priority  = 3; // Normal priority (1=High, 3=Normal, 5=Low)

    // Embed the NAU logo as a CID image so it always renders in email clients.
    // The 'naulogo' string here is the Content-ID referenced as cid:naulogo
    // in the HTML body's <img src="cid:naulogo"> tags.
    $logoPath = __DIR__ . '/Images/NAU.png';
    if (file_exists($logoPath)) {
        $mail->addEmbeddedImage($logoPath, 'naulogo', 'NAU.png', 'base64', 'image/png');
    }

    return $mail;
}

// =============================================================================
// Main execution
// =============================================================================

// Only accept POST requests. A direct browser visit or a crawler hitting this
// URL directly would get a clean JSON error instead of a PHP warning or blank page.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

// Read and validate the service type. This must be one of the keys in $services
// ('printing', 'laser', 'scanning'). Any other value means the request was
// tampered with or came from somewhere other than our form.
$serviceType = post('service_type');
if (!isset($services[$serviceType])) {
    respond(false, 'Invalid service type.');
}

// Pull the configuration for this specific service. All the required fields,
// labels, and upload rules live inside $meta from here on.
$meta = $services[$serviceType];
requireFields($meta['required'], $meta['labels']);

// Shipping address fields are only required when the user selects "ship" as the
// delivery method. For lab pickup they are skipped entirely — both in validation
// here and in the detail rows loop below. We check delivery before requiring
// the address fields so lab-pickup submissions don't fail on fields they never saw.
if (post('delivery') === 'ship') {
    requireFields([
        'shipping_contact_name',
        'shipping_speed',
        'shipping_address_line1',
        'shipping_city',
        'shipping_state',
        'shipping_zip'
    ]);

    // Basic shape checks on shipping fields. These are not address-accurate
    // validations — carriers validate on label generation — but they catch
    // obvious copy-paste garbage and keep email output readable.
    enforceMaxLength('shipping_contact_name',  100);
    enforceMaxLength('shipping_address_line1', 200);
    enforceMaxLength('shipping_address_line2', 200);
    enforceMaxLength('shipping_city',          100);
    enforceMaxLength('shipping_state',         50);
    enforceMaxLength('shipping_zip',           20);

    $zip = trim($_POST['shipping_zip'] ?? '');
    // US ZIP: 5 digits or 5+4 with hyphen. Allow general alnum+space+hyphen
    // for future international flexibility (country is currently locked to US).
    if ($zip !== '' && !preg_match('/^[A-Za-z0-9][A-Za-z0-9 \-]{2,19}$/', $zip)) {
        respond(false, 'Shipping ZIP / Postal Code format looks invalid.');
    }
}

// Clean and extract the contact fields that appear in both email templates.
// $phone is capped at 255 characters — there is no valid phone number longer
// than that, and it prevents an absurdly long string from reaching the email.
$firstName = post('first_name');
$lastName  = post('last_name');
$email     = post('email');
$phone     = mb_substr(post('phone'), 0, 255);
$fullName  = trim($firstName . ' ' . $lastName);

// Basic email format validation. filter_var uses PHP's built-in RFC-compliant
// check; it doesn't guarantee the address exists, but it catches obvious typos
// like missing @ or missing domain.
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.');
}

// --- Server-side content and range validation ---------------------------------
// These checks mirror the JS client-side rules and run even if JS is disabled
// or bypassed, providing defense-in-depth for every submission.

// Name fields: letters, spaces, hyphens, apostrophes, and Unicode letters only
validateNameField('first_name', 'First Name');
validateNameField('last_name',  'Last Name');
enforceMaxLength('first_name',    25);
enforceMaxLength('last_name',     25);
enforceMaxLength('email',         50);
enforceMaxLength('project_title', 100);

// The org/dept field name differs between printing and the other two services
$orgField = ($serviceType === 'printing') ? 'department' : 'organization';
enforceMaxLength($orgField, 100);
validateTextField($orgField, 'Organization / Department');

// Textareas: check for emoji, mashing, and the 500-word limit
validateTextField('project_abstract', 'Project Abstract');
enforceWordLimit('project_abstract', 500, 'Project Abstract');
enforceMaxLength('project_abstract', 2500);

if (!empty(trim($_POST['notes'] ?? ''))) {
    validateTextField('notes', 'Additional Notes');
    enforceWordLimit('notes', 500, 'Additional Notes');
    enforceMaxLength('notes', 2500);
}

// Service-specific numeric dimension and date range checks
if ($serviceType === 'printing') {
    validateNumericRange('print_size_length', 1,   325,  'Print Length (mm)');
    validateNumericRange('print_size_width',  1,   320,  'Print Width (mm)');
    validateNumericRange('print_size_height', 1,   325,  'Print Height (mm)');
    validateNumericRange('quantity',          1,   9999, 'Quantity');
    validateInteger('quantity', 'Quantity');
    validateNumericRange('filament_estimate', 0,   99999, 'Estimated Filament Use (g)');
    validateDateInRange('deadline', 'Requested Completion Date');
}
if ($serviceType === 'laser') {
    validateNumericRange('substrate_dim_length',    1,   305,  'Substrate Length (mm)');
    validateNumericRange('substrate_dim_width',     1,   229,  'Substrate Width (mm)');
    validateNumericRange('substrate_dim_thickness', 0.1, 7,    'Substrate Thickness (mm)');
    validateNumericRange('quantity',                1,   9999, 'Quantity');
    validateInteger('quantity', 'Quantity');
    validateDateInRange('deadline', 'Requested Completion Date');
}
if ($serviceType === 'scanning') {
    validateNumericRange('object_dim_length', 1, 1000, 'Object Length (mm)');
    validateNumericRange('object_dim_width',  1, 1000, 'Object Width (mm)');
    validateNumericRange('object_dim_height', 1, 1000, 'Object Height (mm)');
    validateNumericRange('quantity', 1, 9999, 'Number of Objects to Scan');
    validateInteger('quantity', 'Number of Objects to Scan');
    validateDateInRange('dropoff_date', 'Preferred Drop-off Date');
}

// Normalize and validate uploaded files. normalizeUploadFiles() unifies PHP's
// two possible $_FILES array shapes into one consistent format, then
// validateUploads() runs the size, extension, and magic-byte checks.
$uploadedFiles  = normalizeUploadFiles($meta['uploadField']);

// 3D printing requires at least one model file — JS enforces this with
// data-required-upload, but PHP must also check in case JS was bypassed.
if ($serviceType === 'printing' && empty($uploadedFiles)) {
    respond(false, '3D model files are required for printing requests. Please attach at least one file.');
}

$validatedFiles = validateUploads($uploadedFiles, $meta['allowedExtensions']);

// Build two versions of the file list — one for the HTML email table cell
// and one for the plain-text AltBody. The HTML version is a <ul> list with
// item sizes; the plain-text version is indented dashes on separate lines.
// Both fall back to DEFAULT_UPLOAD_HINT ('No files uploaded') when empty.
$uploadedFilesDisplay = DEFAULT_UPLOAD_HINT;   // HTML version for the email table
$uploadedFilesPlain   = DEFAULT_UPLOAD_HINT;   // Plain-text version for AltBody
if (!empty($validatedFiles)) {
    $htmlItems  = '';
    $plainLines = [];
    foreach ($validatedFiles as $file) {
        $sizeKb     = round($file['size'] / 1024, 1);
        $safeName   = htmlspecialchars($file['name'], ENT_QUOTES, 'UTF-8');
        $htmlItems .= "<li style='margin:2px 0;'>{$safeName} ({$sizeKb} KB)</li>";
        $plainLines[] = '    - ' . $file['name'] . ' (' . $sizeKb . ' KB)';
    }
    $uploadedFilesDisplay = "<ul style='margin:4px 0; padding-left:18px;'>{$htmlItems}</ul>";
    $uploadedFilesPlain   = "\n" . implode("\n", $plainLines);
}

// Timestamp for the email header. This uses PHP's default timezone which
// should be set to America/Phoenix in php.ini. Phoenix never observes DST —
// Arizona stays on MST year-round — so this will always show the correct
// local time without a daylight-saving jump in the summer.
$timestamp = date('F j, Y \a\\t g:i A T');

// These accumulate as we loop through the fields below.
// $detailRows builds the <tr> HTML for the email table.
// $plainDetails builds the plain-text equivalent for AltBody.
$detailRows   = '';
$plainDetails = '';

// $isPickup controls whether shipping address rows are included.
// When the user chose lab pickup, those fields were never shown in the form
// and were never filled in, so we skip them completely rather than showing
// a row of blank dashes in the email.
$isPickup = (post('delivery') === 'pickup');
$shippingOnlyFields = [
    'shipping_contact_name', 'shipping_speed',
    'shipping_address_line1', 'shipping_address_line2',
    'shipping_city', 'shipping_state', 'shipping_zip',
    'shipping_country', 'carrier_preference'
];

foreach ($meta['fields'] as $field) {
    // Skip all shipping address rows when the submitter chose lab pickup.
    // This keeps the email clean — no empty rows for fields the person never saw.
    if ($isPickup && in_array($field, $shippingOnlyFields, true)) {
        continue;
    }

    $label = $meta['labels'][$field] ?? $field;

    // Read raw from $_POST, NOT through post(). If we used post() here it would
    // call htmlspecialchars() on the value. Then formatValue() would call it again
    // via htmlspecialchars() below, double-encoding ampersands and quotes into
    // visible &amp;amp; in the email. One clean → one escape is the rule.
    $raw = trim($_POST[$field] ?? '');

    // Checkboxes for the scanning form post a value only when checked and nothing
    // when unchecked. We map that to "Confirmed" / "Not confirmed" so the email
    // doesn't show a confusing blank or raw checkbox value.
    if ($field === 'dropoff_confirm' || $field === 'usb_confirm') {
        $formatted = !empty($raw) ? 'Confirmed' : 'Not confirmed';
    } else {
        $formatted = formatValue($raw);
    }

    // Single call to htmlspecialchars() here — this is the one and only place
    // the value gets HTML-encoded before going into the email body.
    $value      = $formatted !== '' ? htmlspecialchars($formatted, ENT_QUOTES, 'UTF-8') : '—';
    $plainValue = $formatted !== '' ? $formatted : '—'; // plain text needs no escaping

    $detailRows .= "
            <tr>
                <td style='padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;'>$label</td>
                <td style='padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;'>$value</td>
            </tr>";
    $plainDetails .= "  $label: $plainValue\n";
}

// Append the uploaded files row at the end of the detail table.
// This always appears regardless of delivery method.
$detailRows .= "
            <tr>
                <td style='padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;'>Uploaded Files</td>
                <td style='padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;'>$uploadedFilesDisplay</td>
            </tr>";
$plainDetails .= "  Uploaded Files: $uploadedFilesPlain\n";

$serviceTitle = $meta['title'];
$labSubject   = 'New Service Request: ' . $serviceTitle . ' from ' . $fullName;
$userSubject  = 'We received your service request - MPaCT Nano Lab';

// --- Internal notification email body ----------------------------------------
// Table-based layout because Outlook (which NAU staff likely use) does not
// support CSS Flexbox or Grid in emails. Inline styles are required for the
// same reason — many email clients strip <style> blocks from the <head>.
// $detailRows is already HTML-escaped at the point each row was built,
// so it is safe to embed directly here.
$labBody = '<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . $labSubject . '</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f2f5; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;">
        <tr>
            <td align="center" style="padding:30px 20px;">
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background:#003466; padding:20px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="180" valign="middle">
                                        <img src="cid:naulogo" alt="Northern Arizona University" width="160" style="display:block; height:auto; border:0;">
                                    </td>
                                    <td valign="middle" style="padding-left:16px; border-left:2px solid rgba(255,255,255,0.3);">
                                        <h1 style="margin:0; font-size:18px; font-weight:700; color:#ffffff; letter-spacing:0.3px;">MPaCT Nano Lab</h1>
                                        <p style="margin:3px 0 0 0; font-size:12px; color:#9bb8d7;">Microelectronics Processing, Characterization &amp; Testing</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr><td style="background:#FFC627; height:4px; font-size:0; line-height:0;">&nbsp;</td></tr>

                    <tr>
                        <td style="padding:28px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td style="background:#eef3f8; padding:12px 16px; border-radius:6px; border-left:4px solid #003466;">
                                        <span style="font-size:13px; color:#666; text-transform:uppercase; letter-spacing:0.5px;">New Submission</span><br>
                                        <strong style="font-size:17px; color:#003466;">' . $serviceTitle . '</strong>
                                    </td>
                                    <td align="right" valign="top" style="background:#eef3f8; padding:12px 16px; border-radius:6px;">
                                        <span style="font-size:12px; color:#888;">' . $timestamp . '</span>
                                    </td>
                                </tr>
                            </table>

                            <h2 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">Contact Information</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;">Name</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $fullName . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Email</td>
                                    <td style="padding:10px 16px; border-bottom:1px solid #e8e8e8; font-size:14px;"><a href="mailto:' . $email . '" style="color:#003466; text-decoration:none;">' . $email . '</a></td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Phone</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . ($phone ?: '—') . '</td>
                                </tr>
                            </table>

                            <h2 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">' . $serviceTitle . ' Details</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $detailRows . '
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#f8f9fa; padding:16px 32px; border-top:1px solid #e8e8e8;">
                            <p style="margin:0; font-size:12px; color:#999; text-align:center;">
                                This email was sent from the MPaCT Nano Lab Service Request portal.<br>
                                You can reply directly to this email to reach the requester.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

// Plain-text AltBody for the internal notification. Spam filters look for
// multipart/alternative messages (HTML + plain text together); a message with
// only an HTML part scores worse on several spam rubrics. The plain text also
// acts as a readable fallback for screen readers and text-only mail clients.
$labPlain = "NEW SERVICE REQUEST: $serviceTitle
Submitted: $timestamp
---

CONTACT INFORMATION
  Name: $fullName
  Email: $email
  Phone: " . ($phone ?: 'Not provided') . "

$serviceTitle DETAILS
$plainDetails
---
Sent from MPaCT Nano Lab service request form (nau.edu)
";

// --- User confirmation email body --------------------------------------------
// Same table-based layout as the lab email. Uses the same $detailRows and
// $plainDetails strings so the user sees exactly the same field summary
// that the lab team sees in their notification.
$userBody = '<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . $userSubject . '</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f2f5; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;">
        <tr>
            <td align="center" style="padding:30px 20px;">
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background:#003466; padding:20px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="180" valign="middle">
                                        <img src="cid:naulogo" alt="Northern Arizona University" width="160" style="display:block; height:auto; border:0;">
                                    </td>
                                    <td valign="middle" style="padding-left:16px; border-left:2px solid rgba(255,255,255,0.3);">
                                        <h1 style="margin:0; font-size:18px; font-weight:700; color:#ffffff; letter-spacing:0.3px;">MPaCT Nano Lab</h1>
                                        <p style="margin:3px 0 0 0; font-size:12px; color:#9bb8d7;">Microelectronics Processing, Characterization &amp; Testing</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr><td style="background:#FFC627; height:4px; font-size:0; line-height:0;">&nbsp;</td></tr>

                    <tr>
                        <td style="padding:28px 32px;">
                            <h2 style="margin:0 0 16px 0; font-size:22px; color:#003466;">Thank you, ' . $firstName . '!</h2>
                            <p style="font-size:15px; line-height:1.7; color:#444; margin:0 0 8px 0;">
                                We have received your <strong style="color:#003466;">' . $serviceTitle . '</strong> request and it is now in our review queue.
                            </p>
                            <p style="font-size:15px; line-height:1.7; color:#444; margin:0 0 24px 0;">
                                A lab representative will follow up with next steps and timeline details.
                            </p>

                            <h3 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">Your Submission</h3>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;">Name</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $fullName . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Email</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $email . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Service</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $serviceTitle . '</td>
                                </tr>' . $detailRows . '
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background:#eef3f8; padding:16px 20px; border-radius:6px; border-left:4px solid #003466;">
                                        <p style="margin:0; font-size:14px; color:#555; line-height:1.6;">
                                            <strong style="color:#003466;">Need immediate help?</strong><br>
                                            Email us at <a href="mailto:' . LAB_EMAIL . '" style="color:#003466; text-decoration:underline;">' . LAB_EMAIL . '</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#f8f9fa; padding:20px 32px; border-top:1px solid #e8e8e8; text-align:center;">
                            <p style="margin:0 0 4px 0; font-size:13px; color:#666; font-weight:600;">MPaCT Nano Lab</p>
                            <p style="margin:0; font-size:12px; color:#999; line-height:1.5;">
                                Microelectronics Processing, Characterization &amp; Testing<br>
                                Northern Arizona University
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

$userPlain = "Thank you, $firstName!

We have received your $serviceTitle request and it is currently being reviewed by our team.

YOUR SUBMISSION
  Name: $fullName
  Email: $email
  Service: $serviceTitle
$plainDetails
Need immediate help? Email us at " . LAB_EMAIL . "

---
MPaCT Nano Lab
Microelectronics Processing, Characterization & Testing
Northern Arizona University
";

// --- Send both emails --------------------------------------------------------
// Two separate createMailer() calls, not one reused instance. See createMailer()
// for the reasoning — state leakage between sends is a real risk with PHPMailer.
//
// Files are attached to both emails. The lab needs to review the actual design
// files, and the user should receive their uploads back as confirmation that
// everything came through. Since attachUploads() reads from the PHP temp path,
// both attach calls must happen before this script exits.
//
// addReplyTo() on the lab email means that when staff hits Reply in their mail
// client, the response goes directly to the submitter — not back to the lab.
//
// Errors are caught, logged with the actual PHPMailer message, and returned to
// the user as a polite message with the direct lab email address as a fallback.
try {
    $labMail = createMailer();
    $labMail->addAddress(LAB_EMAIL);
    // CC lines commented out for local testing — emails go to Mailpit only
    // $labMail->addCC('Akhil.Kinnera@nau.edu');
    // $labMail->addCC('Sethuprasad.Gorantla@nau.edu');
    // $labMail->addCC('Krishna-Dev.Palem@nau.edu');
    $labMail->addReplyTo($email, $fullName);
    $labMail->Subject = $labSubject;
    $labMail->Body    = $labBody;
    $labMail->AltBody = $labPlain;
    attachUploads($labMail, $validatedFiles);
    $labMail->send();

    respond(true, 'Your service request has been submitted successfully. A confirmation email has been sent.');
} catch (Exception $e) {
    error_log('MPCT Service Request Error: ' . $e->getMessage());
    respond(false, 'We were unable to send your request at this time. Please try again or email us directly at ' . LAB_EMAIL . '.');
}
