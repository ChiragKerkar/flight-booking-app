const API_BASE = 'http://localhost:3000/api'; // Adjust if needed

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log('data', data);
        localStorage.setItem('token', data.access_token);
        alert('Login successful!');
    })
    .catch(err => {
        console.error(err);
        alert('Login failed');
    });
}

function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
        alert('Registration successful!');
    })
    .catch(err => {
        console.error(err);
        alert('Registration failed');
    });
}
