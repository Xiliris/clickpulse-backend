CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE verify_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE websites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (owner) REFERENCES users(username)
);

CREATE TABLE verify_websites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain) REFERENCES websites(domain)
);

CREATE TABLE total_page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    views INT DEFAULT 1,
    page_views INT DEFAULT 1,
    date DATE,
    FOREIGN KEY (domain) REFERENCES websites(domain)
);

CREATE TABLE entry_page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    views INT DEFAULT 1,
    date DATE,
    FOREIGN KEY (domain) REFERENCES websites(domain)
);

CREATE TABLE exit_page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    views INT DEFAULT 1,
    date DATE,
    FOREIGN KEY (domain) REFERENCES websites(domain)
);

CREATE TABLE visited_page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    views INT DEFAULT 1,
    date DATE,
    FOREIGN KEY (domain) REFERENCES websites(domain)
);

CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    device VARCHAR(255) NOT NULL,
    views INT DEFAULT 1,
    date DATE,
    FOREIGN KEY (domain) REFERENCES websites(domain)
);

CREATE TABLE browsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    browser VARCHAR(255) NOT NULL,
    views INT DEFAULT 1,
    date DATE,
    FOREIGN KEY (domain) REFERENCES websites(domain)
);

CREATE TABLE operating_systems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    os VARCHAR(255) NOT NULL,
    views INT DEFAULT 1,
    date DATE,
    FOREIGN KEY (domain) REFERENCES websites(domain)
);

CREATE TABLE session_duration (
     id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    requests INT NOT NULL,
    date DATE,
    FOREIGN KEY (domain) REFERENCES websites(domain)
)

CREATE TABLE bounce_rate (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    requests INT NOT NULL,
    bounces INT NOT NULL,
    date DATE,
    FOREIGN KEY (domain) REFERENCES websites(domain)
)