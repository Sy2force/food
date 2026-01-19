# 🇮🇱 Flavors of Israel

> The Ultimate Guide to Israeli Gastronomy. A full-stack platform connecting foodies with the best chefs, restaurants, and recipes from Israel.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v18+-green.svg)
![React](https://img.shields.io/badge/react-v18-blue.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based auth with Role-Based Access Control (User, Business, Admin).
- **Business Dashboard**: Dedicated interface for restaurant owners to manage dishes, cards, and recipes.
- **Admin Panel**: Comprehensive oversight with analytics and moderation tools.
- **Explore Feed**: Interactive feed of culinary cards and community posts.
- **Internationalization (i18n)**: Full support for English, French, and Hebrew (including RTL layout).
- **Responsive Design**: Modern, fluid UI built with Tailwind CSS and Framer Motion.

## 🛠 Tech Stack

### Backend
- **Node.js & Express**: RESTful API architecture.
- **MongoDB & Mongoose**: Data modeling and persistence.
- **Security**: Helmet, CORS, Rate Limiting, bcrypt, JWT.
- **Validation**: Joi for request payload validation.
- **Logging**: Morgan and custom file-based logging for errors.
- **Testing**: Jest & Supertest.

### Frontend
- **React (Vite)**: Fast and modern frontend framework.
- **Tailwind CSS**: Utility-first styling.
- **Zustand**: Lightweight state management with persistence.
- **Framer Motion**: Smooth animations.
- **React Hook Form & Yup**: robust form handling.
- **i18next**: Advanced internationalization.
- **Testing**: Vitest & React Testing Library.

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/flavors-of-israel.git
cd flavors-of-israel
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env variables (MONGODB_URI, JWT_SECRET, PORT=5001)
npm run seed  # Seed the database with initial data
npm start     # Start the server
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5001/api
npm run dev
```

## 🧪 Running Tests

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 🔑 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@test.com` | `password123` |
| **Business** | `business@test.com` | `password123` |
| **User** | `user@test.com` | `password123` |

## 🌍 Deployment

### Backend (Render)
1. Push `backend` folder to a repository.
2. Create a Web Service on Render.
3. Set Build Command: `npm install`.
4. Set Start Command: `node server.js`.
5. Add Environment Variables: `MONGODB_URI`, `JWT_SECRET`.

### Frontend (Vercel)
1. Push `frontend` folder to a repository.
2. Import project into Vercel.
3. Set Framework Preset: `Vite`.
4. Add Environment Variable: `VITE_API_URL` (pointing to your Render backend).

## 📄 License
MIT © 2026 Flavors of Israel
