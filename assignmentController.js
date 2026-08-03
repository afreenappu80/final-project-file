const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all("SELECT id, full_name, department, semester, subject_id FROM students", (err, rows) => {
    console.log("--- STUDENTS ---");
    console.table(rows);
    
    db.all("SELECT id, subject_name, department, semester FROM subjects", (err, rows) => {
      console.log("--- SUBJECTS ---");
      console.table(rows);
      
      db.all("SELECT id, title, subject_id, department, semester FROM assignments", (err, rows) => {
        console.log("--- ASSIGNMENTS ---");
        console.table(rows);
        
        db.all(`
          SELECT a.id, a.title, s.department as subj_dept, s.semester as subj_sem
          FROM assignments a
          JOIN subjects s ON a.subject_id = s.id
          WHERE s.department LIKE '%Computer Science%'
        `, (err, rows) => {
          console.log("--- JOIN RESULT ---");
          console.table(rows);
        });
      });
    });
  });
});
