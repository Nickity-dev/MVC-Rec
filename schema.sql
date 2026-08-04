CREATE DATABASE IF NOT EXISTS eventhub;
USE eventhub;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('organizador', 'participante') NOT NULL DEFAULT 'participante'
);

CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT NOT NULL,
  data_inicio DATETIME NOT NULL,
  local VARCHAR(150) NOT NULL,
  capacidade INT NOT NULL,
  organizador_id INT NOT NULL,
  FOREIGN KEY (organizador_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS inscricoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evento_id INT NOT NULL,
  usuario_id INT NOT NULL,
  data_inscricao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evento_id) REFERENCES eventos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO usuarios (nome, email, senha, tipo) VALUES
('Ana Organizadora', 'ana@eventhub.com', '$2a$10$7Jf1s9e0n0m8c6jvIJNd6utYy2eA2xA2YbIouG8azfvtpOIExWvlu', 'organizador'),
('Bruno Participante', 'bruno@eventhub.com', '$2a$10$7Ns2yM5sL0Jotv0fQ8Yj0es4rfT9IdwV5hS8gbgyl2K9vR1XrS4j2', 'participante');

INSERT INTO eventos (titulo, descricao, data_inicio, local, capacidade, organizador_id) VALUES
('Tech Meetup 2026', 'Encontro de tecnologia com palestras e networking.', '2026-09-15 19:00:00', 'Centro de Convenções', 120, 1),
('Workshop de UX', 'Sessão prática sobre design de experiência.', '2026-10-05 14:00:00', 'Sala Azul', 80, 1);

INSERT INTO inscricoes (evento_id, usuario_id) VALUES
(1, 2);
