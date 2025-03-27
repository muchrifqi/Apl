document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Simulate backend validation with Google Sheets
    validateUser(username, password);
  });
  
  function validateUser(username, password) {
    // Replace with your Google Sheets API endpoint
    const sheetUrl = 'https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec';
  
    fetch(sheetUrl, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Login berhasil!');
          window.location.href = 'parent-dashboard.html'; // Redirect to dashboard
        } else {
          alert('Username atau password salah.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat memproses login.');
      });
  }