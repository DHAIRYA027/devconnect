# DevConnect — A Social Network for Developers

A full-stack social platform where developers share posts (with code snippets),
follow each other, and get **real-time notifications**. Built with the MERN
stack and Socket.io.

![Stack](https://img.shields.io/badge/stack-MERN-6e5bff) ![License](https://img.shields.io/badge/license-MIT-blue)

> _Demo login:_ `aisha@demo.dev` / `password123` (after seeding)

---

## ✨ Features

- **JWT authentication** — register / login, password hashing with bcrypt, protected routes
- **Posts** — create, like, comment, delete, with optional syntax-highlighted code snippets
- **Follow system** — follow/unfollow users; a personalized feed of people you follow
- **Real-time notifications** — likes, comments, and follows pushed live over WebSockets (Socket.io)
- **Profiles** — bio, skills, GitHub link, avatar, follower/following counts
- **Explore & search** — discover all developers and their latest posts
- **Polished dark UI** — responsive, custom-themed, no UI framework

## 🏗️ Tech Stack

| Layer       | Tech                                              |
| ----------- | ------------------------------------------------- |
| Frontend    | React (Vite), React Router, Axios, Context API    |
| Realtime    | Socket.io (client + server)                       |
| Backend     | Node.js, Express                                  |
| Database    | MongoDB + Mongoose                                |
| Auth        | JSON Web Tokens, bcryptjs                         |

## 📁 Architecture

```
devconnect/
├── server/                 # Express REST API + Socket.io
│   └── src/
│       ├── config/         # DB connection
│       ├── models/         # User, Post (embedded comments), Notification
│       ├── controllers/    # Route logic
│       ├── routes/         # /auth /users /posts /notifications
│       ├── middleware/     # JWT auth guard, central error handler
│       ├── socket.js       # Authenticated WebSocket layer
│       └── server.js       # App entrypoint
└── client/                 # React single-page app
    └── src/
        ├── api/            # Axios instance w/ token interceptor
        ├── context/        # Auth + Socket providers
        ├── components/     # Navbar, PostCard, CreatePost, ...
        └── pages/          # Feed, Explore, Profile, Notifications, ...
```

## 🚀 Getting Started

**Prerequisites:** Node.js 18+, and MongoDB running locally (or a MongoDB Atlas URI).

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # adjust values if needed
npm run seed              # optional: load demo users + posts
npm run dev               # starts API on http://localhost:5050
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev               # starts app on http://localhost:5173
```

Open http://localhost:5173 and log in with the demo account (if you seeded),
or register a new one.

## 🔌 API Reference

| Method | Endpoint                     | Description                  | Auth |
| ------ | ---------------------------- | ---------------------------- | ---- |
| POST   | `/api/auth/register`         | Create account, returns JWT  | —    |
| POST   | `/api/auth/login`            | Log in, returns JWT          | —    |
| GET    | `/api/auth/me`               | Current user                 | ✓    |
| GET    | `/api/posts/feed`            | Posts from people you follow | ✓    |
| GET    | `/api/posts/explore`         | All recent posts             | ✓    |
| POST   | `/api/posts`                 | Create a post                | ✓    |
| POST   | `/api/posts/:id/like`        | Toggle like                  | ✓    |
| POST   | `/api/posts/:id/comment`     | Add comment                  | ✓    |
| DELETE | `/api/posts/:id`             | Delete own post              | ✓    |
| GET    | `/api/users/:username`       | Public profile               | ✓    |
| PUT    | `/api/users/me`              | Update own profile           | ✓    |
| POST   | `/api/users/:id/follow`      | Toggle follow                | ✓    |
| GET    | `/api/notifications`         | Notification history         | ✓    |

**WebSocket:** client connects to Socket.io with its JWT; server emits
`notification:new` to the recipient's sockets in real time.

## 🧠 Notable Engineering Decisions

- **Embedded vs. referenced data** — comments are *embedded* in the Post document
  (always read together, bounded count); the follow graph and likes are *referenced*
  by ObjectId for flexibility.
- **Authenticated sockets** — the WebSocket handshake reuses the same JWT as the REST
  API, so realtime respects the same identity without a second auth scheme.
- **Optimistic UI** — likes update instantly on the client and reconcile with the
  server response, so the app feels snappy.
- **Central error handling** — controllers `throw`; one Express middleware formats
  every error response (incl. Mongo duplicate-key and validation errors).

## 📜 License

MIT — built as a portfolio project.
