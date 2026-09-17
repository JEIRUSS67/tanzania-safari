<?php
/**
 * config.php
 * Central configuration. Real deployments should set DB_HOST, DB_NAME,
 * DB_USER and DB_PASS as environment variables (e.g. via Apache
 * SetEnv, a .env loader, or the hosting platform's secrets manager)
 * rather than editing this file directly.
 */

// Never display raw PHP errors to visitors in production.
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

// Database connection settings (placeholders — replace via environment).
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'tanzania_safari');
define('DB_USER', getenv('DB_USER') ?: 'db_user_placeholder');
define('DB_PASS', getenv('DB_PASS') ?: 'db_password_placeholder');
define('DB_CHARSET', 'utf8mb4');

// Where booking/contact notification emails would be sent.
// Placeholder — replace with a real, monitored inbox before launch.
define('NOTIFY_EMAIL', getenv('NOTIFY_EMAIL') ?: 'info@tanzaniasafari.example');

// Basic rate-limit guard: minimum seconds between submissions from
// the same session, to slow down simple form-spam scripts.
define('MIN_SECONDS_BETWEEN_SUBMISSIONS', 15);

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
]);
