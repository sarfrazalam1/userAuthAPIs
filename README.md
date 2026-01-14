# UserAuth API

A **production-ready role-based authentication API** built with Node.js, Express, and MongoDB.  
Supports three roles: **User**, **Manager**, and **Admin**.

---

## 🚀 Features

- 🔐 Secure authentication with **JWT** and **bcrypt**
- 👥 Role-based access control (**User, Manager, Admin**)
- 🛡️ Security best practices with **Helmet**, **Rate Limiting**, and **CORS**
- 📦 Environment configuration via **dotenv**
- 🗂️ MongoDB integration with **Mongoose**
- 📝 Logging with **Morgan**
- 🍪 Cookie support with **cookie-parser**
- ✅ Input validation using **Joi**
- ⚡ Global error handling with **ApiError**, **ApiResponse**, and **asyncHandler**

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/userauth.git
cd userauth

# Install dependencies
npm install

---

🛠️ Usage

# Development
- npm run dev

# Production
- npm start
# Linting
- npm run lint

---

## 🌱 Database Seeding

# To create an initial **Admin user:**

- npm run seed

# To reset the **Admin user:**

- npm run seed:reset

---

## 🔑 Authentication Flow

- Register/Login → User receives a JWT token
- JWT stored in cookies or headers
- Middleware checks role before granting access:
- User → Basic access
- Manager → Elevated access
- Admin → Full access
```

---

## 📖 API Endpoint

# Public Routes

- POST /register → Register new user (with validation)
- POST /login → Login and receive JWT (with validation)

# Private Routes (Authenticated Users)

- POST /logout → Logout current user
- GET /profile → Get user profile
- POST /refresh-token → Refresh JWT access token
- PATCH /change-password → Change password (with validation)
- PATCH /update-profile → Update profile (with validation)

# Admin Routes (Require admin role)

- GET /users → Get all users
- GET /users/:userId → Get user by ID
- PUT /users/:userId/role → Update user role
- PATCH /users/:userId/active → Soft delete (deactivate user)
- DELETE /users/:userId → Permanently delete user

---

## 📜 License

- This project is licensed under the ISC License.
