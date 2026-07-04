<?php
/*
 * includes/sharepoint_alert.php
 *
 * Sends an email to the lab whenever SharePoint sync fails on any form
 * (Service Request, Equipment Reservation, Inquiry). The user has already
 * received their success email at this point — SharePoint logging runs
 * non-blocking — so this alert is purely an internal heads-up that the
 * SharePoint side of the pipeline is broken and needs to be checked.
 *
 * Recipients are LAB_EMAIL + DEV_SUPP_CC_LIST from mpact_config.php.
 * Toggle SHAREPOINT_ALERT_ENABLED in the config to silence these
 * without removing the call sites.
 *
 * Requires: mpact_config.php must be included before this file
 * (PHPMailer + createMailer + the LAB_EMAIL/DEV_SUPP_CC_LIST constants).
 */

if (defined('MPCT_SP_ALERT_LOADED')) {
    return;
}
define('MPCT_SP_ALERT_LOADED', true);


/*
 * Send an alert email for a SharePoint failure.
 *
 *   $formType — short label that goes in the subject line, e.g.
 *               'Service Request', 'Equipment Reservation', 'Inquiry'.
 *   $e        — the Exception caught around the SharePoint block.
 *               $e->getMessage() already names the failure stage
 *               ('SharePoint auth failed', 'SharePoint list insert
 *               failed: ...', etc.) since each throw site is labeled.
 *   $context  — optional associative array of extra fields to surface
 *               in the email (submitter name, email, request ID, etc.).
 *               Anything in here gets rendered as a key/value table.
 *
 * Returns true on send, false on send failure or when alerts are
 * disabled. Never throws — the caller is already inside a catch and
 * we don't want to mask the original error.
 */
function notifySharePointFailure(string $formType, Throwable $e, array $context = []): bool
{
    if (defined('SHAREPOINT_ALERT_ENABLED') && SHAREPOINT_ALERT_ENABLED === false) {
        return false;
    }

    try {
        $mail = createMailer();
        $mail->addAddress(LAB_EMAIL);
        addCcRecipients($mail, DEV_SUPP_CC_LIST);

        $prefix = defined('SHAREPOINT_ALERT_SUBJECT_PREFIX')
            ? SHAREPOINT_ALERT_SUBJECT_PREFIX
            : '[MPaCT Alert]';
        $mail->Subject = trim($prefix . ' SharePoint sync failed — ' . $formType);

        $mail->Body    = buildSharePointAlertHtml($formType, $e, $context);
        $mail->AltBody = buildSharePointAlertText($formType, $e, $context);

        return (bool) $mail->send();
    } catch (Throwable $alertError) {
        // Don't let a broken alert path mask the original SharePoint error.
        error_log('MPCT SharePoint alert email failed: ' . $alertError->getMessage());
        return false;
    }
}


/* HTML body — table layout that mirrors the form notification emails. */
function buildSharePointAlertHtml(string $formType, Throwable $e, array $context): string
{
    $when      = date('Y-m-d H:i:s T');
    $stage     = htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
    $where     = htmlspecialchars($e->getFile() . ':' . $e->getLine(), ENT_QUOTES, 'UTF-8');
    $form      = htmlspecialchars($formType, ENT_QUOTES, 'UTF-8');
    $serverIp  = htmlspecialchars($_SERVER['SERVER_NAME'] ?? gethostname() ?: 'unknown', ENT_QUOTES, 'UTF-8');

    $rows = '';
    $rows .= alertRow('Form',        $form);
    $rows .= alertRow('When',        htmlspecialchars($when, ENT_QUOTES, 'UTF-8'));
    $rows .= alertRow('Server',      $serverIp);
    $rows .= alertRow('Failure',     $stage);
    $rows .= alertRow('Source',      $where);
    foreach ($context as $key => $val) {
        $rows .= alertRow(
            htmlspecialchars(ucwords(str_replace('_', ' ', (string) $key)), ENT_QUOTES, 'UTF-8'),
            htmlspecialchars((string) $val, ENT_QUOTES, 'UTF-8')
        );
    }

    return '<!doctype html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#222;">'
         . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0;"><tr><td align="center">'
         . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;border:1px solid #e3e3e3;">'
         . '<tr><td style="background:#7a0019;color:#ffffff;padding:18px 24px;font-size:18px;font-weight:bold;">'
         . '<img src="cid:naulogo" alt="NAU" style="height:28px;vertical-align:middle;margin-right:10px;border:0;"> SharePoint Sync Failed'
         . '</td></tr>'
         . '<tr><td style="padding:24px;font-size:14px;line-height:1.55;">'
         . '<p style="margin:0 0 14px 0;">A submission was processed and the user was notified by email, but logging the record to SharePoint did <strong>not</strong> succeed. The data below shows the failure reason and a snapshot of the submission so the team can re-run or backfill it manually.</p>'
         . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0; background:#fff8e1; border-left:4px solid #FFC627; border-radius:4px;">'
         . '<tr><td style="padding:12px 14px; font-size:13px; color:#5a4500; line-height:1.55;">'
         . '<strong style="color:#7a0019;">Note:</strong> This SharePoint failure may be temporary (transient auth or network blip). Please check the relevant SharePoint list shortly to confirm whether the record appeared on a delayed retry. <strong>If it has not</strong>, this submission must be entered into SharePoint manually using the snapshot below — manual backfill is the agreed fallback whenever SharePoint sync fails.'
         . '</td></tr></table>'
         . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;">'
         . $rows
         . '</table>'
         . '<p style="margin:18px 0 0 0;color:#666;font-size:12px;">This alert is automated. Toggle off by setting <code>SHAREPOINT_ALERT_ENABLED</code> to <code>false</code> in <code>mpact_config.php</code>.</p>'
         . '</td></tr></table>'
         . '</td></tr></table></body></html>';
}


/* Single row for the alert table. Caller already escaped both args. */
function alertRow(string $label, string $value): string
{
    return '<tr>'
         . '<td style="padding:8px 12px;border-bottom:1px solid #eee;background:#fafafa;font-weight:bold;width:140px;vertical-align:top;">' . $label . '</td>'
         . '<td style="padding:8px 12px;border-bottom:1px solid #eee;vertical-align:top;word-break:break-word;">' . $value . '</td>'
         . '</tr>';
}


/* Plain-text fallback for clients that don't render HTML. */
function buildSharePointAlertText(string $formType, Throwable $e, array $context): string
{
    $lines   = [];
    $lines[] = 'SharePoint Sync Failed';
    $lines[] = str_repeat('-', 40);
    $lines[] = 'Form:    ' . $formType;
    $lines[] = 'When:    ' . date('Y-m-d H:i:s T');
    $lines[] = 'Server:  ' . ($_SERVER['SERVER_NAME'] ?? (gethostname() ?: 'unknown'));
    $lines[] = 'Failure: ' . $e->getMessage();
    $lines[] = 'Source:  ' . $e->getFile() . ':' . $e->getLine();
    foreach ($context as $key => $val) {
        $lines[] = ucwords(str_replace('_', ' ', (string) $key)) . ': ' . (string) $val;
    }
    $lines[] = '';
    $lines[] = 'A submission was processed and the user was notified, but the SharePoint';
    $lines[] = 'log step failed. Re-run or backfill the record manually.';
    $lines[] = '';
    $lines[] = 'NOTE: This may be temporary (transient auth/network). Please check the';
    $lines[] = 'relevant SharePoint list shortly to confirm whether the record appeared';
    $lines[] = 'on a delayed retry. If it has not, this submission must be entered into';
    $lines[] = 'SharePoint manually using the snapshot above — manual backfill is the';
    $lines[] = 'agreed fallback whenever SharePoint sync fails.';
    return implode("\n", $lines);
}
