-- =====================================================
-- Tanzania Safari — database schema
-- Charset/collation chosen for full Unicode support.
-- =====================================================

CREATE DATABASE IF NOT EXISTS tanzania_safari
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tanzania_safari;

-- ---------------------------------------------------
-- users
-- Optional admin/staff accounts for a future back office.
-- Passwords must always be stored hashed (e.g. password_hash()
-- with PASSWORD_DEFAULT) — never in plain text.
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(150) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------
-- destinations
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS destinations (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(80) NOT NULL UNIQUE,
  name         VARCHAR(150) NOT NULL,
  region       VARCHAR(150) DEFAULT NULL,
  description  TEXT DEFAULT NULL,
  hero_image   VARCHAR(255) DEFAULT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------
-- safaris
-- Price is nullable; a NULL price means "price on request"
-- in the frontend rather than inventing a figure.
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS safaris (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug             VARCHAR(80) NOT NULL UNIQUE,
  title            VARCHAR(150) NOT NULL,
  summary          VARCHAR(500) DEFAULT NULL,
  description      TEXT DEFAULT NULL,
  duration_days    SMALLINT UNSIGNED DEFAULT NULL,
  price_from       DECIMAL(10,2) DEFAULT NULL,
  currency         CHAR(3) DEFAULT 'USD',
  category         ENUM('wildlife', 'mountain', 'beach') NOT NULL DEFAULT 'wildlife',
  primary_destination_id INT UNSIGNED DEFAULT NULL,
  hero_image       VARCHAR(255) DEFAULT NULL,
  is_active        TINYINT(1) NOT NULL DEFAULT 1,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_safaris_destination
    FOREIGN KEY (primary_destination_id) REFERENCES destinations(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------
-- bookings
-- One row per safari request submitted through booking.html.
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name         VARCHAR(150) NOT NULL,
  email             VARCHAR(190) NOT NULL,
  phone             VARCHAR(40) NOT NULL,
  country           VARCHAR(100) NOT NULL,
  safari_id         VARCHAR(80) NOT NULL,      -- safari slug submitted from the form
  travel_date       DATE NOT NULL,
  travelers         SMALLINT UNSIGNED NOT NULL,
  duration          VARCHAR(40) DEFAULT NULL,
  accommodation     VARCHAR(40) DEFAULT NULL,
  special_requests  TEXT DEFAULT NULL,
  status            ENUM('new', 'contacted', 'confirmed', 'cancelled') NOT NULL DEFAULT 'new',
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_bookings_status (status),
  INDEX idx_bookings_safari (safari_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------
-- contact_messages
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  email       VARCHAR(190) NOT NULL,
  subject     VARCHAR(200) NOT NULL,
  message     TEXT NOT NULL,
  status      ENUM('new', 'read', 'replied') NOT NULL DEFAULT 'new',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_status (status)
) ENGINE=InnoDB;

-- ---------------------------------------------------
-- Seed data (matches the six safaris on the frontend).
-- Prices are intentionally left NULL — see safaris.price_from note.
-- ---------------------------------------------------
INSERT INTO destinations (slug, name, region) VALUES
  ('serengeti', 'Serengeti National Park', 'Northern Tanzania'),
  ('ngorongoro', 'Ngorongoro Conservation Area', 'Rift Valley Highlands'),
  ('tarangire', 'Tarangire National Park', 'Northern Tanzania'),
  ('manyara', 'Lake Manyara', 'Rift Valley Floor'),
  ('kilimanjaro', 'Mount Kilimanjaro', 'Kilimanjaro Region'),
  ('zanzibar', 'Zanzibar', 'Indian Ocean Coast')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO safaris (slug, title, summary, duration_days, category, primary_destination_id) VALUES
  ('serengeti', 'Serengeti Safari', 'Endless plains, big cats and the Great Migration.', 6, 'wildlife', (SELECT id FROM destinations WHERE slug = 'serengeti')),
  ('ngorongoro', 'Ngorongoro Crater Safari', 'A volcanic caldera with exceptional wildlife density.', 3, 'wildlife', (SELECT id FROM destinations WHERE slug = 'ngorongoro')),
  ('tarangire', 'Tarangire Safari', 'Ancient baobabs and large elephant herds.', 4, 'wildlife', (SELECT id FROM destinations WHERE slug = 'tarangire')),
  ('manyara', 'Lake Manyara Safari', 'Tree-climbing lions and flamingo-lined shores.', 2, 'wildlife', (SELECT id FROM destinations WHERE slug = 'manyara')),
  ('kilimanjaro', 'Kilimanjaro Adventure', 'A guided ascent of Africa''s highest peak.', 7, 'mountain', (SELECT id FROM destinations WHERE slug = 'kilimanjaro')),
  ('zanzibar', 'Tanzania & Zanzibar Experience', 'Northern circuit safari paired with Zanzibar''s beaches.', 9, 'beach', (SELECT id FROM destinations WHERE slug = 'zanzibar'))
ON DUPLICATE KEY UPDATE title = VALUES(title);
