const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

let dbPromise;

async function getDb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(__dirname, '..', 'database.sqlite'),
      driver: sqlite3.Database
    }).then(async (db) => {
      await db.exec('PRAGMA foreign_keys = ON');
      await initializeSchema(db);
      return db;
    });
  }
  return dbPromise;
}

async function initializeSchema(db) {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL CHECK(role IN ('admin', 'student')),
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        student_id TEXT NOT NULL UNIQUE,
        roll_number TEXT NOT NULL UNIQUE,
        admission_number TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
        dob DATE,
        blood_group TEXT,
        department TEXT,
        branch TEXT,
        semester INTEGER,
        section TEXT,
        year INTEGER,
        address TEXT,
        parent_name TEXT,
        parent_phone TEXT,
        profile_image TEXT,
        subject_id INTEGER,
        status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department_name TEXT NOT NULL UNIQUE,
        hod_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_code TEXT NOT NULL UNIQUE,
        subject_name TEXT NOT NULL,
        department TEXT, 
        semester INTEGER,
        credits INTEGER,
        faculty_name TEXT,
        status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        attendance_date DATE NOT NULL,
        attendance_status TEXT NOT NULL,
        remarks TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        UNIQUE (student_id, subject_id, attendance_date)
    );

    CREATE TABLE IF NOT EXISTS marks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        internal_marks DECIMAL(5,2) DEFAULT 0,
        external_marks DECIMAL(5,2) DEFAULT 0,
        assignment_marks DECIMAL(5,2) DEFAULT 0,
        lab_marks DECIMAL(5,2) DEFAULT 0,
        project_marks DECIMAL(5,2) DEFAULT 0,
        total_marks DECIMAL(6,2) DEFAULT 0,
        percentage DECIMAL(5,2) DEFAULT 0,
        grade TEXT,
        remarks TEXT,
        semester INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        user_role TEXT NOT NULL,
        student_id INTEGER, 
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_name TEXT NOT NULL,
        report_type TEXT,
        generated_by INTEGER NOT NULL, 
        generated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_path TEXT,
        FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date DATE NOT NULL,
        department TEXT,
        semester INTEGER,
        priority TEXT DEFAULT 'Medium',
        subject_id INTEGER NOT NULL,
        created_by INTEGER NOT NULL, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assignment_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assignment_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        status TEXT DEFAULT 'Submitted',
        grade TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE (assignment_id, student_id)
    );
  `;
  await db.exec(schema);
  
  // Create default admin user
  const adminQuery = await db.get("SELECT * FROM users WHERE email = 'admin@example.com'");
  if (!adminQuery) {
    const hashed = await bcrypt.hash('admin123', 10);
    const result = await db.run("INSERT INTO users (role, email, password) VALUES ('admin', 'admin@example.com', ?)", [hashed]);
    await db.run("INSERT INTO admins (user_id, username) VALUES (?, 'admin')", [result.lastID]);
  }
}

// Wrapper to mock mysql2 pool
const pool = {
  execute: async (sql, params = []) => {
    const db = await getDb();
    // Convert ? parameters to SQLite syntax if needed, but ? works in SQLite too.
    
    // SQLite doesn't support SELECT ... FOR UPDATE or complex things sometimes, but basic CRUD works.
    // Replace MySQL-specific stuff if any:
    // e.g. CURDATE() -> DATE('now')
    sql = sql.replace(/CURDATE\(\)/g, "DATE('now')");
    sql = sql.replace(/NOW\(\)/g, "DATETIME('now')");
    
    // Deal with COUNT(*) issues where it returns BigInt or integer.
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
    if (isSelect) {
      const rows = await db.all(sql, params);
      return [rows, []]; // Return rows and empty fields array
    } else {
      const result = await db.run(sql, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }, []];
    }
  },
  query: async (sql, params = []) => {
    return await pool.execute(sql, params);
  },
  getConnection: async () => {
    return {
      release: () => {},
      execute: pool.execute,
      query: pool.query,
      beginTransaction: async () => {
         const db = await getDb();
         await db.run("BEGIN TRANSACTION");
      },
      commit: async () => {
         const db = await getDb();
         await db.run("COMMIT");
      },
      rollback: async () => {
         const db = await getDb();
         await db.run("ROLLBACK");
      }
    };
  }
};

module.exports = pool;
