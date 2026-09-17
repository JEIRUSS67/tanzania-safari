<?php
/**
 * csrf.php
 * Issues a CSRF token tied to the visitor's session. The frontend
 * fetches this once per page load and includes the token as a
 * hidden field on the booking and contact forms.
 */

require_once __DIR__ . '/config.php';

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

header('Content-Type: application/json');
echo json_encode(['token' => $_SESSION['csrf_token']]);
