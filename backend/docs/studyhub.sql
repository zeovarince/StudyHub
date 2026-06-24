CREATE DATABASE IF NOT EXISTS studyhub;
USE studyhub;

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id_task INT AUTO_INCREMENT PRIMARY KEY,
    id_pembuat INT NOT NULL,
    judul VARCHAR(150) NOT NULL,
    deskripsi TEXT,
    mata_kuliah VARCHAR(100),
    due_date DATE NOT NULL,
    status ENUM('Belum', 'Proses', 'Selesai') DEFAULT 'Belum',
    file_lampiran VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pembuat) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE friends (
    id_pertemanan INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id_user) ON DELETE CASCADE
);
ALTER TABLE friends
  ADD COLUMN status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  ADD COLUMN requester_id INT NOT NULL DEFAULT 0,
  ADD UNIQUE KEY unique_friendship (user_id, friend_id);

CREATE TABLE task_members (
    id_member INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id_task) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
);
CREATE INDEX idx_task_status ON tasks(status);
CREATE INDEX idx_task_due_date ON tasks(due_date);
CREATE TABLE songs (
    id_song INT AUTO_INCREMENT PRIMARY KEY,
    youtube_id VARCHAR(20) NOT NULL UNIQUE,
    judul VARCHAR(255) NOT NULL,
    channel VARCHAR(150),
    durasi VARCHAR(20),
    thumbnail VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE playlists (
    id_playlist INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_playlist VARCHAR(100) NOT NULL,
    deskripsi VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE playlist_songs (
    id_playlist_song INT AUTO_INCREMENT PRIMARY KEY,
    playlist_id INT NOT NULL,
    song_id INT NOT NULL,
    urutan INT DEFAULT 0,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id_playlist) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id_song) ON DELETE CASCADE,
    UNIQUE KEY unique_song_in_playlist (playlist_id, song_id)
);

CREATE INDEX idx_playlist_user ON playlists(user_id);
CREATE INDEX idx_playlist_song_playlist ON playlist_songs(playlist_id);
-- Tabel grup studi
CREATE TABLE study_groups (
    id_group INT AUTO_INCREMENT PRIMARY KEY,
    nama_group VARCHAR(100) NOT NULL,
    deskripsi VARCHAR(255),
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id_user) ON DELETE CASCADE
);

-- Tabel anggota grup (pivot)
CREATE TABLE group_members (
    id_member INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES study_groups(id_group) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
    UNIQUE KEY unique_member (group_id, user_id)
);

-- Tabel pesan grup
CREATE TABLE group_messages (
    id_message INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    sender_id INT NOT NULL,
    message TEXT,
    file_url VARCHAR(500),
    file_type ENUM('image', 'file') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES study_groups(id_group) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE INDEX idx_group_members ON group_members(group_id);
CREATE INDEX idx_group_messages ON group_messages(group_id, created_at);
DELIMITER //

CREATE TRIGGER after_task_insert
AFTER INSERT ON tasks
FOR EACH ROW
BEGIN
    INSERT INTO task_members (task_id, user_id)
    VALUES (NEW.id_task, NEW.id_pembuat);
END //

DELIMITER ;

INSERT INTO users (nama_lengkap, email, password) VALUES
('Riel',  'riel@studyhub.com',  'password123'),
('Zaki',  'zaki@studyhub.com',  'password123'),
('Ijul',  'ijul@studyhub.com',  'password123'),
('Idan',  'idan@studyhub.com',  'password123'),
('Raffi', 'raffi@studyhub.com', 'password123');