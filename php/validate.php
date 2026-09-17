<?php
/**
 * validate.php
 * Small, dependency-free helpers for sanitizing and validating
 * incoming POST data. Client-side JS validation exists purely for
 * user experience — every rule here is re-checked server-side
 * because client-side validation can always be bypassed.
 */

function clean_string(?string $value): string
{
    $value = $value ?? '';
    $value = trim($value);
    // Strip tags to prevent stored HTML/JS; htmlspecialchars on output
    // handles the rest when data is ever echoed back into HTML.
    return strip_tags($value);
}

function is_valid_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function is_valid_date(string $date): bool
{
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d !== false && $d->format('Y-m-d') === $date;
}

function verify_csrf_token(?string $submitted): bool
{
    if (empty($_SESSION['csrf_token']) || empty($submitted)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $submitted);
}

function check_submission_rate_limit(string $sessionKey): bool
{
    $now = time();
    if (!empty($_SESSION[$sessionKey]) && ($now - $_SESSION[$sessionKey]) < MIN_SECONDS_BETWEEN_SUBMISSIONS) {
        return false;
    }
    $_SESSION[$sessionKey] = $now;
    return true;
}

function json_response(bool $success, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}
