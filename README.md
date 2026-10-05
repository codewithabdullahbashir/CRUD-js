# Todo Dashboard App

A simple full-stack-style Todo application built with **HTML, CSS, and vanilla JavaScript**, using **JSON Server** as a fake REST API backend. Users can sign up, log in, and manage their own personal todo list (add, edit, delete).

> Built as a learning project to practice DOM manipulation, `fetch` API, CRUD operations, and `localStorage`-based sessions.

---

## Features

- User **Sign Up** with duplicate-email check
- User **Login** with email and password validation
- Session handling using `localStorage`
- Personal **Dashboard** that greets the user by name
- **Add**, **Update (edit)**, and **Delete** todos
- Each user sees **only their own** todos
- Empty state message when there are no todos
- Responsive layout (mobile friendly)
- **Logout** that clears the session

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript (ES6) |
| Backend    | [JSON Server](https://github.com/typicode/json-server) (mock REST API) |
| Storage    | `db.json` (server data), `localStorage` (login session) |

---

## Project Structure

```
todo-app/
├── index.html        # Login page (entry point)
├── signup.html       # Sign Up page
├── dashboard.html    # Todo dashboard (protected page)
├── script.js         # Auth logic: signup() and login()
├── dashboard.js      # Todo logic: load, add, edit, delete, logout
├── db.json           # JSON Server database (users + todos)
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)
- A modern web browser
- Optional: VS Code with the **Live Server** extension

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install JSON Server

```bash
npm install json-server
```

### 3. Start the backend (API server)

```bash
npx json-server db.json
```

The API now runs at **http://localhost:3000**

- Users endpoint: http://localhost:3000/users
- Todos endpoint: http://localhost:3000/todos

> If you are using the older JSON Server v0.x, use `npx json-server --watch db.json` instead.

### 4. Start the frontend

Keep the API terminal running, then open the app in one of these ways:

- **Option A (easiest):** Double-click `index.html` to open it in your browser.
- **Option B (recommended):** Right-click `index.html` in VS Code and choose **Open with Live Server**.
- **Option C:** Run a simple static server in a second terminal:
  ```bash
  npx serve .
  ```

### 5. Use the app

1. Open the app, then click **Sign Up** and create an account.
2. You are redirected to the dashboard automatically.
3. Add, edit, and delete todos.
4. Click **Logout** to end the session, then log back in anytime.

---

## How the App Works (Full Flow)

```
        ┌──────────────┐
        │  index.html  │  ← Login page
        └──────┬───────┘
               │
   ┌───────────┴───────────┐
   │ No account?           │ Has account
   ▼                       ▼
┌─────────────┐      login() in script.js
│ signup.html │      checks email + password
└──────┬──────┘             │
       │ signup()           │ success
       │ saves user         │
       ▼                    ▼
   localStorage("user") is set
               │
               ▼
      ┌────────────────┐
      │ dashboard.html │  ← reads user from localStorage
      └───────┬────────┘
              │  dashboard.js
              ▼
   Load / Add / Edit / Delete todos
              │
              ▼
          Logout → clears localStorage → back to index.html
```

### Step-by-step

#### 1. Sign Up (`signup.html` + `script.js`)

1. The user enters **Full Name**, **Email**, and **Password**.
2. `signup()` validates that no field is empty.
3. It calls `GET /users?email=<email>` to check if the email already exists.
4. If the email is new, it sends `POST /users` with `{ name, email, password }`.
5. JSON Server saves the user in `db.json` and auto-generates an `id`.
6. The new user object is stored in `localStorage` under the key `user`.
7. The browser redirects to `dashboard.html`.

#### 2. Login (`index.html` + `script.js`)

1. The user enters **Email** and **Password**.
2. `login()` fetches all users via `GET /users`.
3. It loops through them to find a matching email:
   - Email matches and password matches: user is saved to `localStorage`, redirect to dashboard.
   - Email matches but password is wrong: shows **"Wrong password"**.
   - No email match: shows **"User not found"**.

#### 3. Dashboard (`dashboard.html` + `dashboard.js`)

On page load, `dashboard.js`:

1. Reads the logged-in user from `localStorage`.
2. Shows the user's name in the welcome message.
3. Calls `loadTodos()`:
   - `GET /todos` fetches all todos.
   - Filters them by `todo.userId === user.id`, so users only see their own.
   - Renders each todo with **Update** and **Delete** buttons.
   - Shows **"No todos found."** if the list is empty.

#### 4. Todo CRUD operations

| Action | Function      | HTTP Request              | Description                         |
|--------|---------------|---------------------------|-------------------------------------|
| Create | `addTodo()`   | `POST /todos`             | Saves `{ userId, text }`            |
| Read   | `loadTodos()` | `GET /todos`              | Fetches and filters by current user |
| Update | `editTodo()`  | `PATCH /todos/:id`        | Updates the `text` via `prompt()`   |
| Delete | `deleteTodo()`| `DELETE /todos/:id`       | Removes the todo                    |

After every change, `loadTodos()` runs again to refresh the list.

#### 5. Logout

`logout()` removes `user` from `localStorage` and redirects to `index.html`.

---

## Data Model (`db.json`)

```json
{
  "users": [
    {
      "id": "1",
      "name": "Ali Khan",
      "email": "ali@example.com",
      "password": "123456"
    }
  ],
  "todos": [
    {
      "id": "1",
      "userId": "1",
      "text": "Learn JavaScript"
    }
  ]
}
```

Every todo is linked to its owner through `userId`.

---

## API Reference

Base URL: `http://localhost:3000`

| Method | Endpoint             | Purpose                   |
|--------|----------------------|---------------------------|
| GET    | `/users`             | List all users            |
| GET    | `/users?email=<e>`   | Check if an email exists  |
| POST   | `/users`             | Create a new user         |
| GET    | `/todos`             | List all todos            |
| POST   | `/todos`             | Create a todo             |
| PATCH  | `/todos/:id`         | Update a todo's text      |
| DELETE | `/todos/:id`         | Delete a todo             |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Could not reach the server` or fetch errors | Make sure JSON Server is running on port 3000. |
| `Cannot read properties of null (reading 'name')` on dashboard | You are not logged in. Go to `index.html` and log in first. |
| Port 3000 already in use | Run `npx json-server db.json --port 3001` and update the API URLs in both JS files. |
| Changes not saving | Check the terminal running JSON Server for errors, and make sure `db.json` is valid JSON. |

---

## Known Limitations

This is a learning project and is **not production-ready**:

- Passwords are stored and compared in **plain text**. Real apps must hash passwords (e.g. bcrypt) on a real backend.
- Authentication relies only on `localStorage`; there are no tokens or server-side sessions.
- `dashboard.js` does not redirect unauthenticated visitors away from the dashboard.
- Todo text is inserted with `innerHTML`, which is vulnerable to XSS. Prefer `textContent`.
- The "No todos found" message is not hidden again after the first todo is added.
- Todo text containing quote characters can break the inline `onclick` handlers.
- The checkbox and completed-style CSS exist, but completion toggling is not implemented yet.

---

## Future Improvements

- [ ] Redirect to login if the user is not authenticated
- [ ] Mark todos as completed (checkbox with strike-through)
- [ ] Hash passwords and use a real backend (Node.js/Express + database)
- [ ] Use JWT-based authentication
- [ ] Replace `prompt()` with an inline edit field or modal
- [ ] Add form validation (email format, password strength)
- [ ] Apply the existing CSS classes to dynamically rendered todos
- [ ] Add filters (All / Active / Completed)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

Made by **<Your Name>**
GitHub: [@your-username](https://github.com/your-username)
