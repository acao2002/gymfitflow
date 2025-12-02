DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS takeclass;
DROP TABLE IF EXISTS take;
DROP TABLE IF EXISTS teach;
DROP TABLE IF EXISTS train;
DROP TABLE IF EXISTS class;
DROP TABLE IF EXISTS group_trainer;
DROP TABLE IF EXISTS personal_trainer;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS trainer;
DROP TABLE IF EXISTS membership;

CREATE TABLE membership (
    plan_id INT PRIMARY KEY,
    plan_name VARCHAR(20) NOT NULL,
    duration_months INT NOT NULL
);

CREATE TABLE trainer (
    trainer_id INT PRIMARY KEY,
    first VARCHAR(30) NOT NULL,
    middle VARCHAR(30),
    last VARCHAR(30) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    join_date DATE NOT NULL,
    hourly_rate DECIMAL(7,2) NOT NULL,
    rating INT
);

CREATE TABLE personal_trainer (
    trainer_id INT PRIMARY KEY,
    max_members INT NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainer(trainer_id) ON DELETE CASCADE
);

CREATE TABLE group_trainer (
    trainer_id INT PRIMARY KEY,
    max_classes INT NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainer(trainer_id) ON DELETE CASCADE
);

CREATE TABLE member (
    member_id INT PRIMARY KEY,
    first VARCHAR(30) NOT NULL,
    middle VARCHAR(30),
    last VARCHAR(30) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    join_date DATE NOT NULL,
    trainer_id INT,
    membership_id INT NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainer(trainer_id) ON DELETE SET NULL,
    FOREIGN KEY (membership_id) REFERENCES membership(plan_id) ON DELETE RESTRICT
);

CREATE TABLE class (
    class_id INT PRIMARY KEY,
    class_name VARCHAR(40) NOT NULL,
    schedule_time VARCHAR(40) NOT NULL,
    max_capacity INT NOT NULL,
    trainer_id INT NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainer(trainer_id) ON DELETE CASCADE
);

CREATE TABLE train (
    trainer_id INT NOT NULL,
    member_id INT NOT NULL,
    PRIMARY KEY (trainer_id, member_id),
    FOREIGN KEY (trainer_id) REFERENCES personal_trainer(trainer_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE
);

CREATE TABLE teach (
    trainer_id INT NOT NULL,
    class_id INT NOT NULL,
    PRIMARY KEY (trainer_id, class_id),
    FOREIGN KEY (trainer_id) REFERENCES group_trainer(trainer_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES class(class_id) ON DELETE CASCADE
);

CREATE TABLE takeclass (
    class_id INT NOT NULL,
    member_id INT NOT NULL,
    PRIMARY KEY (class_id, member_id),
    FOREIGN KEY (class_id) REFERENCES class(class_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE
);

CREATE TABLE attendance (
    attendance_id INT PRIMARY KEY,
    date DATE NOT NULL,
    class_id INT NOT NULL,
    member_id INT NOT NULL,
    FOREIGN KEY (class_id) REFERENCES class(class_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE
);