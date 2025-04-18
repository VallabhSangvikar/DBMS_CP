-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS platform;
USE platform;

-- Create user table
CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    user_type ENUM('student','institute','faculty') NOT NULL
);

-- Create college_master_details table with domain field
CREATE TABLE IF NOT EXISTS college_master_details (
    college_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    college_name VARCHAR(255) NOT NULL,
    established_year YEAR NOT NULL,
    accreditation VARCHAR(50) NOT NULL,
    location_state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    campus_size DECIMAL(5,2) NOT NULL,
    contact_email VARCHAR(100) NOT NULL UNIQUE,
    contact_phone VARCHAR(15) NOT NULL UNIQUE,
    website_url VARCHAR(255) NOT NULL,
    email_domain VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- Create student_profile table
CREATE TABLE IF NOT EXISTS student_profile (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    college_id INT,
    entrance_exam_name VARCHAR(100) NOT NULL,
    entrance_exam_percentile DECIMAL(5,2) NOT NULL,
    category ENUM('General','OBC','SC','ST','EWS') NOT NULL,
    stream VARCHAR(100) NOT NULL,
    passing_year YEAR NOT NULL,
    cutoff_points DECIMAL(5,2) NOT NULL,
    interested_courses TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (college_id) REFERENCES college_master_details(college_id)
);

-- Create college_courses_details table
CREATE TABLE IF NOT EXISTS college_courses_details (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (college_id) REFERENCES college_master_details(college_id)
);

-- Create college_cutoff_details table
CREATE TABLE IF NOT EXISTS college_cutoff_details (
    cutoff_id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    course_id INT NOT NULL,
    academic_year YEAR NOT NULL,
    category ENUM('General','OBC','SC','ST','EWS') NOT NULL,
    cutoff_score DECIMAL(5,2) NOT NULL,
    last_year_lowest_percentile DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (college_id) REFERENCES college_master_details(college_id),
    FOREIGN KEY (course_id) REFERENCES college_courses_details(course_id)
);

-- Create college_faculty_details table
CREATE TABLE IF NOT EXISTS college_faculty_details (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    college_id INT NOT NULL,
    department VARCHAR(100) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    research_area TEXT,
    contact_email VARCHAR(100) NOT NULL UNIQUE,
    publications TEXT,
    experience INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (college_id) REFERENCES college_master_details(college_id)
);

-- Create college_infrastructure_details table
CREATE TABLE IF NOT EXISTS college_infrastructure_details (
    infrastructure_id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    hostel TINYINT(1) DEFAULT 0,
    library TINYINT(1) DEFAULT 0,
    lab TINYINT(1) DEFAULT 0,
    sports TINYINT(1) DEFAULT 0,
    digital_learning_resources TINYINT(1) DEFAULT 0,
    FOREIGN KEY (college_id) REFERENCES college_master_details(college_id)
);

-- Create college_placement_details table
CREATE TABLE IF NOT EXISTS college_placement_details (
    placement_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    college_id INT NOT NULL,
    academic_year YEAR NOT NULL,
    total_students_placed INT NOT NULL,
    placement_percentage DECIMAL(5,2) NOT NULL,
    highest_package DECIMAL(10,2),
    average_package DECIMAL(10,2),
    top_recruiters TEXT,
    FOREIGN KEY (student_id) REFERENCES student_profile(student_id),
    FOREIGN KEY (college_id) REFERENCES college_master_details(college_id)
);

-- Create college_scholarship_details table
CREATE TABLE IF NOT EXISTS college_scholarship_details (
    scholarship_id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    student_id INT,
    scholarship_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (college_id) REFERENCES college_master_details(college_id),
    FOREIGN KEY (student_id) REFERENCES student_profile(student_id)
);

-- Drop the existing alumni table
DROP TABLE IF EXISTS college_alumni_details;

-- Create modified college_alumni_details table without user_id dependency
CREATE TABLE IF NOT EXISTS college_alumni_details (
    alumni_id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    graduation_year YEAR NOT NULL,
    degree VARCHAR(100) NOT NULL,
    current_company VARCHAR(255),
    designation VARCHAR(255),
    package DECIMAL(10,2),
    achievements TEXT,
    linkedin_profile VARCHAR(255),
    contact_email VARCHAR(100),
    FOREIGN KEY (college_id) REFERENCES college_master_details(college_id)
);

-- Create new table for course applications
CREATE TABLE IF NOT EXISTS course_applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    faculty_id INT NOT NULL,
    application_date DATE NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    comments TEXT,
    FOREIGN KEY (student_id) REFERENCES student_profile(student_id),
    FOREIGN KEY (course_id) REFERENCES college_courses_details(course_id),
    FOREIGN KEY (faculty_id) REFERENCES college_faculty_details(faculty_id)
);