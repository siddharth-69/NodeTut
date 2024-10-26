// public/script.js

// DOM Elements
const toggleFormButton = document.getElementById('toggleForm');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutButton = document.getElementById('logoutButton');
const messageElement = document.getElementById('message');
const formTitle = document.getElementById('formTitle');

// Helper function to show messages
const showMessage = (message) => {
  messageElement.textContent = message;
};

// Function to check if user is logged in (by checking cookie)
const checkLoginStatus = () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='));
  if (token) {
    // User is logged in, show Logout button
    logoutButton.classList.remove('hidden');
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    toggleFormButton.classList.add('hidden');
    formTitle.textContent = 'Welcome!';
  } else {
    // User not logged in, show Login form
    logoutButton.classList.add('hidden');
    loginForm.classList.remove('hidden');
    toggleFormButton.classList.remove('hidden');
  }
};

// Toggle between Login and Register forms
toggleFormButton.addEventListener('click', () => {
  if (loginForm.classList.contains('hidden')) {
    // Switch to Login Form
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    formTitle.textContent = 'Login';
    toggleFormButton.textContent = 'Switch to Register';
  } else {
    // Switch to Register Form
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    formTitle.textContent = 'Register';
    toggleFormButton.textContent = 'Switch to Login';
  }
});

// Handle Registration
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  showMessage(result.message || 'Registration successful');
  if (response.ok) checkLoginStatus(); // Update login state
});

// Handle Login
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  showMessage(result.message || 'Login successful');
  if (response.ok) checkLoginStatus(); // Update login state
});

// Handle Logout
logoutButton.addEventListener('click', async () => {
  const response = await fetch('/auth/logout');
  const result = await response.json();
  showMessage(result.message || 'Logged out successfully');
  document.cookie = 'token=; Max-Age=-99999999;'; // Clear cookie
  checkLoginStatus(); // Update login state
});

// Check login status on page load
checkLoginStatus();
