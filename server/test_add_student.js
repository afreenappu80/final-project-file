async function testAddStudent() {
  try {
    // Login as Admin
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@admin.com',
        password: 'admin'
      })
    });
    
    const cookie = loginRes.headers.get('set-cookie');
    console.log("Login Cookie:", cookie);

    // Add student
    const res = await fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify({
        student_id: 'STU' + Date.now(),
        roll_number: 'RN' + Date.now(),
        admission_number: '',
        full_name: 'Test Student',
        email: `test${Date.now()}@test.com`,
        gender: 'Male',
        department: 'Computer Science',
        password: 'Password123!',
        branch: '',
        semester: '',
        phone: '',
        subject_id: ''
      })
    });
    
    const data = await res.json();
    console.log(res.status, data);
  } catch (error) {
    console.error(error.message);
  }
}

testAddStudent();
