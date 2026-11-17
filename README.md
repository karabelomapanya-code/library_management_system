\# 📚 Library Management System



Full-stack web app built for \*\*BIWA2110 — Web Application Development (Lab Test, 20%)\*\*.



\## Stack

\- \*\*Frontend:\*\* React + Vite + React Router

\- \*\*Backend:\*\* Node.js + Express

\- \*\*Database:\*\* MySQL

\- \*\*Comms:\*\* Fetch API (React → Express → MySQL)



\## Features

\- \*\*Dashboard\*\* — book availability + low-stock highlighting (< 2 copies)

\- \*\*Book Management\*\* — full CRUD (Title, Author, Genre, ISBN, Quantity)

\- \*\*Transactions\*\* — add stock / borrow; atomic updates with history log

\- \*\*User Management\*\* — login + admin CRUD (hashed passwords with bcrypt)



\## Setup



\### 1. Database

```sql

CREATE DATABASE library\_db;

USE library\_db;



CREATE TABLE users (

&#x20; id INT AUTO\_INCREMENT PRIMARY KEY,

&#x20; name VARCHAR(255) NOT NULL,

&#x20; membership\_id VARCHAR(50) UNIQUE NOT NULL,

&#x20; role ENUM('admin','member') NOT NULL DEFAULT 'member',

&#x20; password VARCHAR(255) NOT NULL

);



CREATE TABLE books (

&#x20; id INT AUTO\_INCREMENT PRIMARY KEY,

&#x20; title VARCHAR(255) NOT NULL,

&#x20; author VARCHAR(255) NOT NULL,

&#x20; genre VARCHAR(100),

&#x20; isbn VARCHAR(20) UNIQUE NOT NULL,

&#x20; quantity INT NOT NULL DEFAULT 0

);



CREATE TABLE transactions (

&#x20; id INT AUTO\_INCREMENT PRIMARY KEY,

&#x20; book\_id INT NOT NULL,

&#x20; user\_id INT,

&#x20; type ENUM('add','borrow') NOT NULL,

&#x20; quantity INT NOT NULL,

&#x20; created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,

&#x20; FOREIGN KEY (book\_id) REFERENCES books(id) ON DELETE CASCADE,

&#x20; FOREIGN KEY (user\_id) REFERENCES users(id) ON DELETE SET NULL

);

Default admin login
- Membership ID: **ADMIN001**
- Password: **admin123**

API Endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/books` | List all books |
| POST | `/books` | Create book |
| PUT | `/books/:id` | Update book |
| DELETE | `/books/:id` | Delete book |
| GET | `/users` | List users |
| POST | `/users` | Create user |
| POST | `/users/login` | Login |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| GET | `/transactions` | Transaction history |
| POST | `/transactions` | Record add/borrow |

Student Info
- **Name:** KARABELO MAPANYA
- **Student Number:** 901020555
- **Module:** BIWA2110

