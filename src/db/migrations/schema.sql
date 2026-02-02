CREATE DATABASE IF NOT EXISTS note_sync;
USE note_sync;
CREATE TABLE IF NOT EXISTS users(
user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
username VARCHAR(50) NOT NULL UNIQUE,
email VARCHAR(255) NOT NULL UNIQUE,
hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS notes(
note_id CHAR(36) PRIMARY KEY DEFAULT(UUID()),
owner_id CHAR(36) NOT NULL,
title VARCHAR(255),
content TEXT,
FOREIGN KEY fk_note_owner  (owner_id)
	REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contributions(
user_id CHAR(36) NOT NULL,
note_id CHAR(36) NOT NULL,
permisson ENUM('viewer', 'editor') DEFAULT 'editor',
status ENUM('pending', 'accepted', 'declined'),
PRIMARY KEY(user_id, note_id),
FOREIGN KEY fk_contribution_note(note_id) REFERENCES notes(note_id) ON DELETE CASCADE,
FOREIGN KEY fk_contributions_user(user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS refresh_tokens(
token_id INT PRIMARY KEY AUTO_INCREMENT,
user_id CHAR(36) NOT NULL,
token VARCHAR(255) NOT NULL UNIQUE,
expires_at DATETIME NOT NULL,

FOREIGN KEY fk_token_user(user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE
)