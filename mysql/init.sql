-- init.sql

-- Create `insurance_app` database (if not already created)
CREATE DATABASE IF NOT EXISTS insurance_app;

-- Use the created database
USE insurance_app;

-- Create the `applications` table
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    dob DATE,
    gender VARCHAR(10),
    contact_number VARCHAR(15),
    email VARCHAR(100),
    insurance_type VARCHAR(50),
    coverage_amount INT,
    policy_start_date DATE,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the `insurance_applications` table
CREATE TABLE insurance_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    insurance_type ENUM('Health', 'Life', 'Vehicle', 'Home') NOT NULL,
    coverage_amount DECIMAL(10, 2) NOT NULL,
    policy_start_date DATE NOT NULL,
    comments TEXT
);

-- Optional: Insert a test record into the applications table
INSERT INTO applications (first_name, last_name, dob, gender, contact_number, email, insurance_type, coverage_amount, policy_start_date, comments)
VALUES ('John', 'Doe', '1990-05-15', 'Male', '1234567890', 'john@example.com', 'Health', 5000, '2025-03-01', 'No additional info.');
