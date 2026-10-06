CREATE TABLE announcements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  created_by BIGINT UNSIGNED NOT NULL,
  recipient_mode VARCHAR(20) NOT NULL,
  recipient_value VARCHAR(255) NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_announcements_created_at (created_at)
);

ALTER TABLE notifications
  ADD COLUMN announcement_id BIGINT UNSIGNED NULL,
  ADD INDEX idx_notifications_announcement_id (announcement_id);