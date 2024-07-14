document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fetch('/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              window.location.href = '/member.html';
          } else {
              alert(data.message);
          }
      });
});
