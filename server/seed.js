const sqlite3 = require('sqlite3').verbose(); 
const db = new sqlite3.Database('database.sqlite'); 
db.serialize(() => { 
    db.run("INSERT OR IGNORE INTO departments (department_name, hod_name) VALUES ('Computer Science', 'Dr. Smith')"); 
    db.run("INSERT OR IGNORE INTO departments (department_name, hod_name) VALUES ('Mechanical Engineering', 'Dr. Johnson')"); 
    db.run("INSERT OR IGNORE INTO departments (department_name, hod_name) VALUES ('Electrical Engineering', 'Dr. Williams')"); 
}); 
db.close();
