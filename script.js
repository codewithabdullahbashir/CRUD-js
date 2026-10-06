
const UserAPI = "http://localhost:3000/users";

async function signup(event) {
  if (event) event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const check = await fetch(`${UserAPI}?email=${encodeURIComponent(email)}`);
    const existing = await check.json();

    if (existing.length > 0) {
      alert("Email already exists");
      return;
    }

    const response = await fetch(UserAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      alert("Signup failed");
      return;
    }

    const newUser = await response.json();
    localStorage.setItem("user", JSON.stringify(newUser));

    window.location.href = "dashboard.html";
  } catch (err) {
    console.error(err);
    alert("Could not reach the server");
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch(UserAPI);
  const users = await response.json();

  for (let user of users) {
    if (user.email === email) {
      if (user.password === password) {
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "dashboard.html";

        return;
      }

      alert("Wrong password");
      return;
    }
  }

  alert("User not found");
}



