const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const departments = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Artificial Intelligence and Data Science (AIDS)'
];

db.serialize(() => {
  const stmt = db.prepare("INSERT INTO departments (department_name, hod_name) VALUES (?, ?)");
  
  departments.forEach((dept, index) => {
    const hodName = `Dr. HOD ${index + 1}`;
    stmt.run(dept, hodName, (err) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          console.log(`Department ${dept} already exists.`);
        } else {
          console.error(`Error inserting ${dept}:`, err.message);
        }
      } else {
        console.log(`Successfully inserted ${dept}`);
      }
    });
  });
  
  stmt.finalize(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database seeding complete and connection closed.');
      }
    });
  });
});
