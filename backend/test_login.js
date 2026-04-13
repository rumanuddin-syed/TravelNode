const fetch = require('node-fetch');

async function loginAndTest() {
  const loginRes = await fetch('http://localhost:3050/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@travelnode.com', password: 'password123' }) 
  }).catch(() => null);
  
  if (loginRes && loginRes.ok) {
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    const analyticsRes = await fetch('http://localhost:3050/api/analytics/admin', {
       headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(await analyticsRes.json());
  } else {
    console.log("Login failed or admin user not found with these credentials");
  }
}
loginAndTest();
