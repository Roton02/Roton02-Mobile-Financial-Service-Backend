# Real-time Chat Application

This is a simple real-time chat application built using **Node.js, Express.js, MongoDB, and Socket.io**. The application allows users to communicate in real-time with authentication and message persistence.

## 🚀 Features

- **User Authentication** (JWT-based authentication - Sign Up & Login)
- **Real-time Messaging** using Socket.io
- **Message Persistence** (Messages stored in MongoDB)
- **User List** (Fetch all registered users)
- **Previous Chat History** (Fetch previous messages between users)
- **RESTful API Endpoints** for user and chat management
- **Secure Password Hashing** using bcrypt.js
- **Deployment Ready** Vercel

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt.js, Socket.io
- **Database:** MongoDB
- **Real-time Communication:** Socket.io
- **Version Control:** Git & GitHub

---

## 📌 Installation & Setup

### Prerequisites

- **Node.js**
- **MongoDB**
- **Git**

### Steps to Run Locally

1. Clone the repository:

   ```sh
   git clone https://github.com/Roton02/zin-chat.git
   cd zin-chat
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file and configure it:
   ```env
   #
   //NODE_ENV = "development"
   NODE_ENV = "production"
   PORT = 5000
   BCRYPT_SALT
   ```
   JWT_SECRET
   DATABASE_URL

also create a config file and configure the env like

   #
   
   import dotenv from 'dotenv'
   import path from 'path'
   
   dotenv.config({ path: path.join(process.cwd(), '.env') })
   
   export default {
   database_url: process.env.DATABASE_URL,
   port: process.env.PORT,
   NODE_ENV: process.env.NODE_ENV,
   BCRYPT_SALT: process.env.BCRYPT_SALT,
   JWT_SECRET: process.env.JWT_SECRET,
}

````

4. Start the server:
```sh
npm run dev
````

5. The server will run on `http://localhost:5000`

---

## 🔌 API Endpoints

### **User Authentication**

| Method | Endpoint             | Description                            |
| ------ | -------------------- | -------------------------------------- |
| POST   | `/api/auth/register` | Register a new user                    |
| POST   | `/api/auth/login`    | Login user and get JWT token in cookie |

### **User Management**

| Method | Endpoint     | Description                    |
| ------ | ------------ | ------------------------------ |
| GET    | `/api/users` | Fetch list of registered users |

### **Chat Management**

| Method | Endpoint                | Description                           |
| ------ | ----------------------- | ------------------------------------- |
| POST   | `/api/messages/`        | Store new messages                    |
| GET    | `/api/messages/:userId` | Fetch previous messages between users |

---

## ⚡ WebSocket Events (Socket.io)

| Event        | Description                        |
| ------------ | ---------------------------------- |
| `connect`    | When a user connects to the server |
| `message`    | Sent when a user sends a message   |
| `userJoined` | Sent when a user joins the chat    |
| `userLeft`   | Sent when a user leaves the chat   |
| `disconnect` | When a user disconnects            |

---

---

## 🛡 Security Measures

- Passwords are **hashed** using bcrypt.js
- JWT is used for **secure authentication**
- Environment variables (`.env`) are used to store sensitive data

---
