# 👔 CoutureWay

> A modern AI-powered custom tailoring platform that bridges customers, tailors, and fashion businesses through a seamless digital experience.

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)
![Flask](https://img.shields.io/badge/Backend-Flask-000000?logo=flask)
![SQLAlchemy](https://img.shields.io/badge/Database-SQLAlchemy-red)
![REST API](https://img.shields.io/badge/API-REST-success)

---

# 📖 Overview

CoutureWay is a full-stack custom tailoring platform designed to modernize the tailoring experience. Customers can browse products, schedule tailoring appointments, provide measurements, place customized orders, and track their purchases, while administrators manage products, orders, appointments, and customer interactions through a scalable backend.

The project combines a modern React frontend with a Flask REST API backend, providing a clean separation between the user interface and business logic for better scalability and maintainability.

---

# ✨ Features

## Customer

- User Authentication
- Browse Tailoring Services
- Product Catalog
- Custom Clothing Orders
- Shopping Cart
- Secure Checkout Flow
- Measurement Management
- Appointment Booking
- Order Tracking
- Notifications
- Responsive UI

---

## Admin

- Dashboard
- Product Management
- Order Management
- Customer Management
- Appointment Scheduling
- Notification System

---

# 🏗️ Project Architecture

```
                React + TypeScript
                       │
                REST API Requests
                       │
                 Flask Backend
                       │
      ┌────────────────┼────────────────┐
      │                │                │
 Authentication    Business Logic   Validation
      │                │                │
      └────────────────┼────────────────┘
                       │
                  SQL Database
```

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Router
- ShadCN UI

## Backend

- Flask
- Flask REST API
- SQLAlchemy
- JWT Authentication
- Flask Migrate
- Marshmallow

## Database

- SQL (SQLite for development)
- Easily configurable for PostgreSQL or MySQL

---

# 📂 Project Structure

```
CoutureWay
│
├── src/
│   ├── components/
│   ├── routes/
│   ├── lib/
│   └── assets/
│
├── flask-backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   │
│   ├── migrations/
│   ├── requirements.txt
│   └── run.py
│
├── public/
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/aryan-12-16-05/CoutureWay.git

cd CoutureWay
```

---

# Frontend Setup

Install dependencies

```bash
npm install
```

Run frontend

```bash
npm run dev
```

---

# Backend Setup

Navigate to backend

```bash
cd flask-backend
```

Create virtual environment

```bash
python -m venv venv
```

Activate environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run backend

```bash
python run.py
```

---

# Environment Variables

Frontend

```
VITE_API_URL=http://localhost:5000/api
```

Backend

```
SECRET_KEY=your_secret_key

DATABASE_URL=sqlite:///coutureway.db

JWT_SECRET_KEY=your_jwt_secret
```

---

# REST API

Example endpoints

```
POST   /api/auth/register

POST   /api/auth/login

GET    /api/products

POST   /api/orders

GET    /api/profile

POST   /api/appointments

GET    /api/notifications
```

---

# Future Improvements

- Payment Gateway Integration
- AI-Based Size Recommendation
- AI Fashion Assistant
- Email Notifications
- SMS Notifications
- Inventory Management
- Analytics Dashboard
- Multi-Vendor Support
- Cloud Deployment
- Docker Support

---

# Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# License

This project is intended for educational and portfolio purposes.

---

# Author

Developed with ❤️ as a full-stack custom tailoring platform using React, Flask, and SQL.