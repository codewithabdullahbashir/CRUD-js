
const TodoAPI = "http://localhost:3000/todos";

const user = JSON.parse(localStorage.getItem("user"));

const todoInput = document.getElementById("todoInput");
const todoContainer = document.getElementById("todos");
const empty = document.getElementById("empty");

document.getElementById("user-name").innerText = user.name;





function logout() {
  localStorage.removeItem("user");

  window.location.href = "index.html";
}

loadTodos();

