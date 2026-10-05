const TodoAPI = "http://localhost:3000/todos";

const user = JSON.parse(localStorage.getItem("user"));

const todoInput = document.getElementById("todoInput");
const todoContainer = document.getElementById("todos");
const empty = document.getElementById("empty-todos");

document.getElementById("user-name").innerText = user.name;

function getTodos(callback) {
  const request = new XMLHttpRequest();

  request.open("GET", TodoAPI);

  request.onload = function () {
    const todos = JSON.parse(request.responseText);

    callback(todos);
  };

  request.send();
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

  const request = new XMLHttpRequest();

  request.open("POST", TodoAPI);

  request.setRequestHeader("Content-Type", "application/json");

  request.onload = function () {
    todoInput.value = "";

    loadTodos();
  };

  request.send(
    JSON.stringify({
      userId: user.id,
      text: text,
    }),
  );
}

function editTodo(id, oldText) {
  const newText = prompt("Edit todo", oldText);

  if (newText === null) {
    return;
  }

  const request = new XMLHttpRequest();

  request.open("PATCH", `${TodoAPI}/${id}`);

  request.setRequestHeader("Content-Type", "application/json");

  request.onload = function () {
    loadTodos();
  };

  request.send(
    JSON.stringify({
      text: newText,
    }),
  );
}
function deleteTodo(id) {
  const request = new XMLHttpRequest();

  request.open("DELETE", `${TodoAPI}/${id}`);

  request.onload = function () {
    loadTodos();
  };

  request.send();
}

function logout() {
  localStorage.removeItem("user");

  window.location.href = "index.html";
}

loadTodos();
