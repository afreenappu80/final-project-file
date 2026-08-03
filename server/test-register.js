async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: "Test Student",
        student_id: "STU002",
        roll_number: "R002",
        admission_number: "A002",
        email: "teststu2@example.com",
        phone: "1234567890",
        password: "Password123!",
        gender: "Male",
        department: "Computer Science",
        branch: "CSE",
        semester: 1
      })
    });
    const data = await res.json();
    console.log({status: res.status, data});
  } catch (err) {
    console.error(err.message);
  }
}

test();
