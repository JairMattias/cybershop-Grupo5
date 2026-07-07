document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const found = users.find(u => u.username === username && u.password === password);

      const error = document.getElementById('loginError');

      if (found) {
        localStorage.setItem('currentUser', username);
        window.location.href = 'app.html';
      } else {
        if (error) error.textContent = 'Usuario o contraseña incorrectos';
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('newUsername').value.trim();
      const password = document.getElementById('newPassword').value.trim();

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const exists = users.some(u => u.username === username);

      const error = document.getElementById('registerError');

      if (exists) {
        if (error) error.textContent = 'Ese usuario ya existe';
        return;
      }

      users.push({ username, password });
      localStorage.setItem('users', JSON.stringify(users));
      window.location.href = 'login.html';
    });
  }
});

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}