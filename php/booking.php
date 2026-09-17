<?php
/**
 * booking.php
 * Handles submissions from the safari booking request form.
 * Validates and sanitizes all input server-side, stores the
 * request in MySQL, and returns a JSON result the frontend
 * displays as a success/error message.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/validate.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Invalid request method.', 405);
}

if (!verify_csrf_token($_POST['csrf_token'] ?? null)) {
    json_response(false, 'Your session has expired. Please refresh the page and try again.', 403);
}

if (!check_submission_rate_limit('last_booking_submission')) {
    json_response(false, 'Please wait a moment before submitting again.', 429);
}

// ---- Collect + sanitize ----
$fullName       = clean_string($_POST['full_name'] ?? '');
$email          = clean_string($_POST['email'] ?? '');
$phone          = clean_string($_POST['phone'] ?? '');
$country        = clean_string($_POST['country'] ?? '');
$safari         = clean_string($_POST['safari'] ?? '');
$travelDate     = clean_string($_POST['travel_date'] ?? '');
$travelers      = clean_string($_POST['travelers'] ?? '');
$duration       = clean_string($_POST['duration'] ?? '');
$accommodation  = clean_string($_POST['accommodation'] ?? '');
$specialRequest = clean_string($_POST['message'] ?? '');

// Honeypot-style trap field (not present in the visible form; a bot
// filling every input field would populate it). Silently accept but
// discard so as not to tip off the bot.
if (!empty($_POST['website'] ?? '')) {
    json_response(true, 'Thank you. Your request has been received.');
}

// ---- Validate ----
$errors = [];

if ($fullName === '' || mb_strlen($fullName) > 150) {
    $errors[] = 'A valid full name is required.';
}
if ($email === '' || !is_valid_email($email)) {
    $errors[] = 'A valid email address is required.';
}
if ($phone === '' || mb_strlen($phone) > 40) {
    $errors[] = 'A valid phone number is required.';
}
if ($country === '' || mb_strlen($country) > 100) {
    $errors[] = 'Country is required.';
}
if ($safari === '') {
    $errors[] = 'Please select a preferred safari.';
}
if ($travelDate === '' || !is_valid_date($travelDate)) {
    $errors[] = 'A valid preferred travel date is required.';
}
if (!ctype_digit($travelers) || (int)$travelers < 1 || (int)$travelers > 50) {
    $errors[] = 'Number of travelers must be between 1 and 50.';
}
if (mb_strlen($specialRequest) > 2000) {
    $errors[] = 'Special requests must be under 2000 characters.';
}

if (!empty($errors)) {
    json_response(false, implode(' ', $errors), 422);
}

// ---- Persist ----
try {
    $pdo = get_db_connection();

    $stmt = $pdo->prepare(
        'INSERT INTO bookings
            (full_name, email, phone, country, safari_id, travel_date, travelers, duration, accommodation, special_requests, status, created_at)
         VALUES
            (:full_name, :email, :phone, :country, :safari_id, :travel_date, :travelers, :duration, :accommodation, :special_requests, "new", NOW())'
    );

    $stmt->execute([
        ':full_name'        => $fullName,
        ':email'            => $email,
        ':phone'            => $phone,
        ':country'          => $country,
        ':safari_id'        => $safari,
        ':travel_date'      => $travelDate,
        ':travelers'        => (int)$travelers,
        ':duration'         => $duration,
        ':accommodation'    => $accommodation,
        ':special_requests' => $specialRequest,
    ]);
} catch (PDOException $e) {
    error_log('Booking insert failed: ' . $e->getMessage());
    json_response(false, 'We could not save your request right now. Please try again shortly.', 500);
}

// A production build would also send a notification email to
// NOTIFY_EMAIL and a confirmation email to $email here, via a
// configured mail transport (e.g. PHPMailer + SMTP credentials).

json_response(true, 'Thank you, ' . $fullName . '. Your safari request has been received — our team will be in touch shortly.');
