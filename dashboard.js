
const TodoAPI = "http://localhost:3000/todos";

const user = JSON.parse(localStorage.getItem("user"));

const todoInput = document.getElementById("todoInput");
const todoContainer = document.getElementById("todos");
const empty = document.getElementById("empty");

document.getElementById("user-name").innerText = user.name;


async function loadTodos() {
  const response = await fetch(TodoAPI);
  const todos = await response.json();

  const userTodo = todos.filter((todo) => todo.userId === user.id);

  todoContainer.innerHTML = "";

  if (userTodo.length === 0) {
    empty.style.display = "block";
    return;
  }

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
}

async function addTodo() {
  const text = todoInput.value.trim();

  if (text === "") {
    alert("Enter a todo");
    return;
  }

  await fetch(TodoAPI, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      userId: user.id,
      text: text,
    }),
  });

  todoInput.value = "";

  loadTodos();
}





function logout() {
  localStorage.removeItem("user");

  window.location.href = "index.html";
}

loadTodos();

