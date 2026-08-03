const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'server/database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("--- STUDENTS ---");
  db.all("SELECT id, full_name, department, semester, subject_id FROM students", (err, rows) => {
    if (err) console.error(err);
    else console.table(rows);
  });

  console.log("--- SUBJECTS ---");
  db.all("SELECT id, subject_name, department, semester FROM subjects", (err, rows) => {
    if (err) console.error(err);
    else console.table(rows);
  });

  console.log("--- ASSIGNMENTS ---");
  db.all("SELECT id, title, subject_id, department, semester FROM assignments", (err, rows) => {
    if (err) console.error(err);
    else console.table(rows);
  });

  console.log("--- JOIN RESULT ---");
  db.all(`
    SELECT a.id, a.title, s.department as subj_dept, s.semester as subj_sem
    FROM assignments a
    JOIN subjects s ON a.subject_id = s.id
  `, (err, rows) => {
    if (err) console.error(err);
    else console.table(rows);
  });
});
