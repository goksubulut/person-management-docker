# Person Management App (Dockerized)

This project is a simple full-stack web application that allows users to manage people records.  
It includes a React frontend, an Express.js backend, and a PostgreSQL database.  
The entire system runs using Docker Compose.

---

# Technologies

Frontend
- React (Vite)
- JavaScript
- Fetch API

Backend
- Node.js
- Express.js
- PostgreSQL

DevOps
- Docker
- Docker Compose

---

# Features

Create a person  
View all people  
Update a person  
Delete a person  

Form validation (client and server side)

Email uniqueness enforced in database

---

# Project Structure
person-management-docker
│
├── backend
│ ├── Dockerfile
│ ├── package.json
│ └── src
│ ├── index.js
│ └── db.js
│
├── db
│ └── init.sql
│
├── frontend
│ ├── Dockerfile
│ ├── package.json
│ └── src
│
├──.env.example
├──.gitignore
├── docker-compose.yml
└── README.md


---

# Running the Project

## Requirements

- Docker Desktop installed
- Git installed

---

## Clone the repository
git clone https://github.com/YOUR_USERNAME/person-management-docker.git

cd person-management-docker

---

## Start the application
docker compose up --build


---

## Application URLs

Frontend


http://localhost:5173


Backend API


http://localhost:5070/api/health

---

# API Endpoints

GET all people
GET /api/people


Get person by id


GET /api/people/:id

Create person
POST /api/people


Update person


PUT /api/people/:id


Delete person


DELETE /api/people/:id


---

# Database

PostgreSQL database is initialized automatically using


db/init.sql
The table structure:


people

id (SERIAL PRIMARY KEY)

full_name

email (UNIQUE)

created_at

---

# Validation Rules

Full name cannot be empty  
Email must follow valid format  
Email must be unique

---

# Docker Services

The application runs with three containers:

Frontend container (React)  
Backend container (Express API)  
Database container (PostgreSQL)

---

# Screenshots

(Add screenshots here if required)

Home Page – Person Registration

People List Page
