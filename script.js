
const API = "http://localhost:3000/users";


async function signup(event) {
    if(event)event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

 
    const response = await fetch(API);
    const users = await response.json();


    for (let user of users) {

        if (user.email === email) {
            alert("Email already exists");
            return;
        }
    }


    await fetch(API, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    });

    alert("Account created");

    window.location.href = "dashboard.html";
}


async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(API);
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


function logout() {

    localStorage.removeItem("user");

    window.location.href = "index.html";
}
