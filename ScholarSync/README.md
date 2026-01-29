# ScholarSync

ScholarSync is a student-focused productivity and academic resource platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: JWT-based auth with Role-Based Access Control (Student, Admin).
- **Dashboard**: Overview of tasks, notes, projects, and resources.
- **Task Management**: Create, update, delete, and prioritize tasks with deadlines.
- **Notes App**: Rich text notes management (currently text-based).
- **Project Tracking**: Manage academic projects with status updates.
- **Resource Sharing**: Share and categorize academic resources (links).
- **Admin Panel**: View system stats and manage users.
- **Dark Mode UI**: Modern, aesthetic dark-themed interface using Tailwind CSS.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Headless UI / React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JSON Web Tokens (JWT), Bcrypt

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd ScholarSync
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file based on .env.example (or use provided defaults for dev)
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the App**
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:5000`

## Default Credentials

- **Sign up** a new user to test Student features.
- **Admin Access**: Manually update a user's role to `admin` in MongoDB to access the Admin Panel, or use the registration flow if modified to allow role selection (default is student).

## License

MIT
