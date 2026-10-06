const TodoAPI = "http://localhost:3000/todos";

const user = JSON.parse(localStorage.getItem("user"));

const todoInput = document.getElementById("todoInput");
const todoContainer = document.getElementById("todos");
const empty = document.getElementById("empty-todos");

document.getElementById("user-name").innerText = user.name;

function getTodos() {
  return new Promise((resolve, reject) => {
    fetch(TodoAPI)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function loadTodos() {
  getTodos()
    .then((todos) => {
      const userTodo = todos.filter((todo) => {
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
    })
    .catch((error) => {
      console.error("Error loading todos:", error);
      alert(error.message);
    });
}

function addTodoCall(todoList) {
  return new Promise((resolve, reject) => {
    fetch(TodoAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoList),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function addTodo() {
  const text = todoInput.value.trim();

  if (text === "") {
    alert("Enter a todo");
    return;
  }

  addTodoCall({
    userId: user.id,
    text: text,
  })
    .then(() => {
      todoInput.value = "";
      loadTodos();
    })
    .catch((error) => {
      console.error("Error adding todo:", error);
      alert(error.message);
    });
}

function updateTodoApiCall(id, newText) {
  return new Promise((resolve, reject) => {
    fetch(`${TodoAPI}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newText,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function editTodo(id, oldText) {
  const newText = prompt("Edit todo", oldText);

  if (newText === null) {
    return;
  }

  if (newText.trim() === "") {
    alert("Todo cannot be empty");
    return;
  }

  updateTodoApiCall(id, newText.trim())
    .then(() => {
      loadTodos();
    })
    .catch((error) => {
      console.error("Error updating todo:", error);
      alert(error.message);
    });
}

function deleteTodoApiCall(id) {
  return new Promise((resolve, reject) => {
    fetch(`${TodoAPI}/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }

        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function deleteTodo(id) {
  const confirmDelete = confirm("Are you sure you want to delete this todo?");

  if (!confirmDelete) {
    return;
  }

  deleteTodoApiCall(id)
    .then(() => {
      loadTodos();
    })
    .catch((error) => {
      console.error("Error deleting todo:", error);
      alert(error.message);
    });
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

loadTodos();
