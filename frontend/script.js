// DOM Elements
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// API Base URL
const API_BASE_URL = '/api';

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (token && user && user.role) {
    // User is already logged in, redirect to appropriate dashboard
    redirectUserByRole(user.role);
    return;
  }
  
  // Setup modal event listeners
  setupModalListeners();
  
  // Setup form submission listeners
  setupFormListeners();
});

// Setup modal event listeners
function setupModalListeners() {
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      loginModal.style.display = 'block';
    });
  }
  
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      registerModal.style.display = 'block';
    });
  }
  
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (loginModal) loginModal.style.display = 'none';
      if (registerModal) registerModal.style.display = 'none';
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (loginModal && e.target === loginModal) {
      loginModal.style.display = 'none';
    }
    if (registerModal && e.target === registerModal) {
      registerModal.style.display = 'none';
    }
  });
}

// Setup form submission listeners
function setupFormListeners() {
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
}

// Handle login form submission
async function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  try {
    // For demo purposes, simulate API response
    // In a real implementation, this would be an actual API call
    const demoUsers = [
      { username: 'pharmacy1', password: 'password', role: 'pharmacy' },
      { username: 'distributor1', password: 'password', role: 'distributor' },
      { username: 'admin1', password: 'password', role: 'admin' }
    ];
    
    const user = demoUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Simulate a successful login
      const token = 'demo_token_' + Math.random().toString(36).substring(2);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ 
        username: user.username, 
        role: user.role,
        id: Math.floor(Math.random() * 1000) 
      }));
      
      // Redirect based on user role
      redirectUserByRole(user.role);
    } else {
      alert('Invalid username or password. Please try again.');
    }
    
    /* 
    // This would be the real API call in a production environment
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      redirectUserByRole(data.user.role);
    } else {
      alert(data.message || 'Login failed. Please try again.');
    }
    */
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred. Please try again later.');
  }
}

// Handle register form submission
async function handleRegister(e) {
  e.preventDefault();
  
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('role').value;
  
  try {
    // For demo purposes, simulate API response
    // In a real implementation, this would be an actual API call
    const token = 'demo_token_' + Math.random().toString(36).substring(2);
    const user = {
      id: Math.floor(Math.random() * 1000),
      username,
      email,
      role
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Show success message
    alert('Registration successful! Redirecting to dashboard...');
    
    // Redirect based on user role
    redirectUserByRole(user.role);
    
    /* 
    // This would be the real API call in a production environment
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, role }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Registration successful! Redirecting to dashboard...');
      redirectUserByRole(data.user.role);
    } else {
      alert(data.message || 'Registration failed. Please try again.');
    }
    */
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred. Please try again later.');
  }
}

// Redirect user based on role
function redirectUserByRole(role) {
  console.log('Redirecting user with role:', role);
  
  switch (role) {
    case 'admin':
      window.location.href = '/admin/dashboard.html';
      break;
    case 'pharmacy':
      window.location.href = '/pharmacy/dashboard.html';
      break;
    case 'distributor':
      window.location.href = '/distributor/dashboard.html';
      break;
    default:
      console.error('Unknown role:', role);
      window.location.href = '/index.html';
  }
}