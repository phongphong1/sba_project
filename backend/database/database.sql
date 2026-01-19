-- Roles and Permissions Tables
CREATE TABLE `roles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) UNIQUE NOT NULL,
  `description` TEXT
);

CREATE TABLE `permissions` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `description` TEXT
);

CREATE TABLE `role_permissions` (
  `role_id` BIGINT UNSIGNED,
  `permission_id` BIGINT UNSIGNED,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
);

-- Users and Subscriptions Tables
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `reputation` INT DEFAULT 0,
  `avatar_url` TEXT,
  `bio` TEXT,
  `role_id` BIGINT UNSIGNED,
  `status` ENUM('ACTIVE', 'BANNED', 'PENDING') DEFAULT 'PENDING',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL
);

CREATE TABLE `subscriptions` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED,
  `plan_type` ENUM('MONTHLY', 'YEARLY', 'LIFETIME'),
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `status` ENUM('ACTIVE', 'EXPIRED', 'CANCELED', 'PENDING') DEFAULT 'PENDING',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Documents and Categories Tables
CREATE TABLE `categories` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) UNIQUE NOT NULL,
  `description` TEXT
);

CREATE TABLE `documents` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED,
  `category_id` BIGINT UNSIGNED,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `description` TEXT,
  `view_count` INT DEFAULT 0,
  `download_count` INT DEFAULT 0,
  `is_vip` BOOLEAN DEFAULT FALSE,
  `status` ENUM('DRAFT', 'DELETED', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);

CREATE TABLE `document_versions` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `doc_id` BIGINT UNSIGNED,
  `version_name` VARCHAR(50) DEFAULT 'latest',
  `file_url` TEXT NOT NULL,
  `file_type` VARCHAR(20), -- pdf, docx, zip...
  `file_size` INT, -- đơn vị KB
  `changelog` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`doc_id`) REFERENCES `documents`(`id`) ON DELETE CASCADE
);

-- Tags, Questions, Comments, Votes, and Bookmarks Tables
CREATE TABLE `tags` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) UNIQUE NOT NULL,
  `slug` VARCHAR(60) UNIQUE NOT NULL,
  `color_code` VARCHAR(7)
);

CREATE TABLE `document_tags` (
  `doc_id` BIGINT UNSIGNED,
  `tag_id` BIGINT UNSIGNED,
  PRIMARY KEY (`doc_id`, `tag_id`),
  FOREIGN KEY (`doc_id`) REFERENCES `documents`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
);

CREATE TABLE `questions` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `doc_id` BIGINT UNSIGNED NULL, -- Có thể hỏi chung hoặc hỏi về 1 tài liệu cụ thể
  `user_id` BIGINT UNSIGNED,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `content` TEXT NOT NULL,
  `is_solved` BOOLEAN DEFAULT FALSE,
  `is_pinned` BOOLEAN DEFAULT FALSE,
  `pin_priority` INT DEFAULT 0,
  `vote_point` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`doc_id`) REFERENCES `documents`(`id`)
);

CREATE TABLE `comments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `question_id` BIGINT UNSIGNED,
  `user_id` BIGINT UNSIGNED,
  `parent_id` BIGINT UNSIGNED NULL, -- Hỗ trợ comment lồng nhau (Reply)
  `content` TEXT NOT NULL,
  `is_accepted` BOOLEAN DEFAULT FALSE, -- Dùng cho câu trả lời đúng nhất
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON DELETE SET NULL
);

CREATE TABLE `votes` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED,
  `target_id` BIGINT UNSIGNED,
  `target_type` ENUM('QUESTION', 'COMMENT'),
  `vote_value` TINYINT, -- 1 hoặc -1
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_vote` (`user_id`, `target_id`, `target_type`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `bookmarks` (
  `user_id` BIGINT UNSIGNED,
  `doc_id` BIGINT UNSIGNED,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `doc_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`doc_id`) REFERENCES `documents`(`id`) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `receiver_id` BIGINT UNSIGNED,
  `sender_id` BIGINT UNSIGNED NULL,
  `type` ENUM('NEW_COMMENT', 'ANSWER_ACCEPTED', 'NEW_REPLY', 'SYSTEM_ALERT'),
  `reference_id` BIGINT UNSIGNED, -- ID của document/question liên quan
  `content` TEXT,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);

CREATE INDEX idx_categories_slug ON categories(slug);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_category_id ON documents(category_id);
CREATE INDEX idx_documents_slug ON documents(slug);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_is_vip ON documents(is_vip);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_view_count ON documents(view_count DESC);
CREATE INDEX idx_documents_download_count ON documents(download_count DESC);

CREATE INDEX idx_document_versions_doc_id ON document_versions(doc_id);

CREATE INDEX idx_tags_slug ON tags(slug);

CREATE INDEX idx_questions_doc_id ON questions(doc_id);
CREATE INDEX idx_questions_user_id ON questions(user_id);
CREATE INDEX idx_questions_slug ON questions(slug);
CREATE INDEX idx_questions_is_solved ON questions(is_solved);
CREATE INDEX idx_questions_created_at ON questions(created_at);
CREATE INDEX idx_questions_vote_point ON questions(vote_point DESC);

CREATE INDEX idx_comments_question_id ON comments(question_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_target_id ON votes(target_id);
CREATE INDEX idx_votes_target_type ON votes(target_type);

CREATE INDEX idx_notifications_receiver_id ON notifications(receiver_id);
CREATE INDEX idx_notifications_sender_id ON notifications(sender_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Additional constraints
ALTER TABLE subscriptions ADD CONSTRAINT chk_subscription_dates CHECK (end_date > start_date);
ALTER TABLE users ADD CONSTRAINT chk_reputation_non_negative CHECK (reputation >= 0);
ALTER TABLE documents ADD CONSTRAINT chk_view_count_non_negative CHECK (view_count >= 0);
ALTER TABLE documents ADD CONSTRAINT chk_download_count_non_negative CHECK (download_count >= 0);
-- ALTER TABLE questions ADD CONSTRAINT chk_vote_point_range CHECK (vote_point >= -1000 AND vote_point <= 10000);
