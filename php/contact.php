<?php
/**
 * contact.php
 * Handles submissions from the general contact form.
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

if (!check_submission_rate_limit('last_contact_submission')) {
    json_response(false, 'Please wait a moment before submitting again.', 429);
}

$name    = clean_string($_POST['name'] ?? '');
$email   = clean_string($_POST['email'] ?? '');
$subject = clean_string($_POST['subject'] ?? '');
$message = clean_string($_POST['message'] ?? '');

if (!empty($_POST['website'] ?? '')) {
    json_response(true, 'Thank you. Your message has been received.');
}

$errors = [];

if ($name === '' || mb_strlen($name) > 150) {
    $errors[] = 'A valid name is required.';
}
if ($email === '' || !is_valid_email($email)) {
    $errors[] = 'A valid email address is required.';
}
if ($subject === '' || mb_strlen($subject) > 200) {
    $errors[] = 'A subject is required.';
}
if ($message === '' || mb_strlen($message) > 3000) {
    $errors[] = 'A message under 3000 characters is required.';
}

if (!empty($errors)) {
    json_response(false, implode(' ', $errors), 422);
}

try {
    $pdo = get_db_connection();

    $stmt = $pdo->prepare(
        'INSERT INTO contact_messages (name, email, subject, message, status, created_at)
         VALUES (:name, :email, :subject, :message, "new", NOW())'
    );

    $stmt->execute([
        ':name'    => $name,
        ':email'   => $email,
        ':subject' => $subject,
        ':message' => $message,
    ]);
} catch (PDOException $e) {
    error_log('Contact insert failed: ' . $e->getMessage());
    json_response(false, 'We could not send your message right now. Please try again shortly.', 500);
}

json_response(true, 'Thank you, ' . $name . '. Your message has been received.');
