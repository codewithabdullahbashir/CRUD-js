const TodoAPI = "http://localhost:3000/todos";

const user = JSON.parse(localStorage.getItem("user"));

const todoInput = document.getElementById("todoInput");
const todoContainer = document.getElementById("todos");
const empty = document.getElementById("empty-todos");

document.getElementById("user-name").innerText = user.name;

function getTodos(callback) {
  fetch(TodoAPI)
    .then((response) => response.json())
    .then((todos) => callback(todos));
}

function loadTodos() {
  getTodos(function (todos) {
    const userTodo = todos.filter(function (todo) {
      return todo.userId === user.id;
    });

    todoContainer.innerHTML = "";

    if (userTodo.length === 0) {
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";

    for (let todo of userTodo) {
      const div = document.createElement("div");

      div.innerHTML = `
        <span>${todo.text}</span>

        <button onclick="editTodo('${todo.id}', '${todo.text}')">
          Update
        </button>

        <button onclick="deleteTodo('${todo.id}')">
          Delete
        </button>
      `;

      todoContainer.appendChild(div);
    }
  });
}

function addTodo() {
  const text = todoInput.value.trim();

  if (text === "") {
    alert("Enter a todo");
    return;
  }

  fetch(TodoAPI, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      userId: user.id,
      text: text,
    }),
  }).then(function () {
    todoInput.value = "";

    loadTodos();
  });
}

function editTodo(id, oldText) {
  const newText = prompt("Edit todo", oldText);

  if (newText === null) {
    return;
  }

  fetch(`${TodoAPI}/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      text: newText,
    }),
  }).then(function () {
    loadTodos();
  });
}
function deleteTodo(id) {
  fetch(`${TodoAPI}/${id}`, {
    method: "DELETE",
  }).then(function () {
    loadTodos();
  });
}

function logout() {
  localStorage.removeItem("user");

  window.location.href = "index.html";
}

loadTodos();
