# ShopEase — Full Stack E-Commerce Web Application

A complete full stack e-commerce platform built with **React.js**, **Express.js**, **Node.js**, and **MongoDB** (the MERN stack). ShopEase lets customers browse and search products, manage a cart, place orders and track their order history, while admins manage the full product catalog, orders and user base from a dedicated admin panel.

> Built as an academic assignment to demonstrate full stack development, RESTful API design, JWT authentication, and clean project architecture.

---

## ✨ Features

### Customer-facing
- 🔐 **Authentication** — register, login, JWT-based session, protected routes
- 🛍️ **Product browsing** — search by keyword, filter by category, sort by price/rating/newest, pagination
- 🖼️ **Product details** — image gallery, stock status, ratings
- 🛒 **Shopping cart** — persisted in the browser, quantity controls
- 📦 **Checkout & orders** — shipping address, payment method selection, order history, order tracking with status timeline
- ⭐ **Product reviews** — leave a star rating + comment (one review per user per product)
- ❤️ **Wishlist** — save products for later
- 👤 **Profile management** — update name, password, and shipping address

### Admin panel (`/admin`)
- 📊 Dashboard with key stats (products, users, orders, revenue)
- 📦 Product management — create, edit, delete, upload product images
- 🧾 Order management — view all orders, update order status (pending → processing → shipped → delivered/cancelled)
- 👥 User management — search users, promote/demote admin role, activate/deactivate accounts, delete users

### Engineering features
- RESTful API with clear resource-based routes
- JWT authentication & role-based authorization middleware (`protect`, `admin`)
- Centralized error handling + 404 handler
- Mongoose schemas with validation and relationships (Users ↔ Orders ↔ Products)
- Image uploads via Multer, served as static files
- Email notifications via Nodemailer (order confirmation, status updates, welcome email) — gracefully disabled if SMTP isn't configured
- Database seeder script for instant demo data
- Responsive, accessible UI (Tailwind CSS) with a distinct visual identity (teal/coral/marigold palette, custom price-tag UI element)

---

## 🛠️ Tech Stack

| Layer       | Technology |
|-------------|------------|
| Frontend    | React 18, React Router, Tailwind CSS, Axios, react-hot-toast, react-icons, Vite |
| Backend     | Node.js, Express.js |
| Database    | MongoDB + Mongoose |
| Auth        | JWT (jsonwebtoken), bcryptjs |
| File upload | Multer |
| Email       | Nodemailer |

---

## 📁 Project Structure

```
ecommerce-app/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/     # Route logic (auth, products, orders, users)
│   ├── middleware/      # JWT auth, admin guard, error handling, uploads
│   ├── models/          # Mongoose schemas (User, Product, Order)
│   ├── routes/          # Express routers
│   ├── utils/           # JWT helper, email helper, DB seeder
│   ├── uploads/         # Uploaded product images (served statically)
│   ├── server.js        # App entry point
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios instance with auth interceptor
│   │   ├── components/   # Reusable UI (Navbar, ProductCard, Pagination, ...)
│   │   ├── context/      # AuthContext, CartContext
│   │   ├── pages/        # Route-level pages (Home, Products, Cart, ...)
│   │   │   └── admin/    # Admin dashboard, product/order/user management
│   │   ├── App.jsx       # Route definitions
│   │   └── main.jsx      # React entry point
│   └── vite.config.js
│
└── package.json          # Convenience scripts to run both servers together
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- A MongoDB database — either:
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally, **or**
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install dependencies
From the project root, install both the backend and frontend in one go:
```bash
npm run install-all
```
(or manually: `cd backend && npm install`, then `cd ../frontend && npm install`)

### 3. Configure environment variables
Copy the example env file and fill in your own values:
```bash
cd backend
cp .env.example .env
```
Edit `backend/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```
Email (`SMTP_*`) variables are **optional** — leave them blank and the app will simply log emails to the console instead of sending them.

### 4. (Optional) Seed sample data
Populate the database with a sample admin, customer, and 8 demo products:
```bash
cd backend
npm run seed
```
This creates:
| Role     | Email                 | Password     |
|----------|------------------------|--------------|
| Admin    | admin@example.com      | admin123     |
| Customer | customer@example.com   | customer123  |

To wipe the seeded data later: `npm run seed:destroy`

### 5. Run the app

**Option A — run both servers together** (from the project root):
```bash
npm install        # installs the root-level "concurrently" helper
npm run dev
```

**Option B — run them separately** (two terminals):
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

- Backend API → http://localhost:5000
- Frontend app → http://localhost:5173 (Vite proxies `/api` calls to the backend automatically in development)

### 6. Build for production
```bash
cd frontend
npm run build
```
Set `NODE_ENV=production` in `backend/.env` and the Express server will serve the built frontend (`frontend/dist`) directly, so you can deploy the whole app as a single Node service.

---

## 🔌 API Overview

All endpoints are prefixed with `/api`.

| Method | Endpoint                          | Description                          | Access        |
|--------|------------------------------------|---------------------------------------|---------------|
| POST   | `/auth/register`                  | Register a new user                   | Public        |
| POST   | `/auth/login`                     | Log in, returns JWT                   | Public        |
| GET    | `/auth/profile`                   | Get current user profile              | Private       |
| PUT    | `/auth/profile`                   | Update profile / password / address   | Private       |
| GET    | `/products`                       | List products (search/filter/sort/paginate) | Public  |
| GET    | `/products/categories`            | List distinct categories              | Public        |
| GET    | `/products/featured`              | List featured products                | Public        |
| GET    | `/products/:id`                   | Get a single product (id or slug)     | Public        |
| POST   | `/products`                       | Create a product                      | Admin         |
| PUT    | `/products/:id`                   | Update a product                      | Admin         |
| DELETE | `/products/:id`                   | Delete a product                      | Admin         |
| POST   | `/products/:id/reviews`           | Add a product review                  | Private       |
| POST   | `/orders`                         | Place a new order                     | Private       |
| GET    | `/orders/my`                      | Get my order history                  | Private       |
| GET    | `/orders/:id`                     | Get a single order                    | Owner / Admin |
| PUT    | `/orders/:id/pay`                 | Mark an order as paid                 | Private       |
| GET    | `/orders`                         | List all orders (filter/paginate)     | Admin         |
| PUT    | `/orders/:id/status`              | Update order status                   | Admin         |
| GET    | `/users`                          | List all users (search/paginate)      | Admin         |
| GET    | `/users/:id`                      | Get a single user                     | Admin         |
| PUT    | `/users/:id`                      | Update role / active status           | Admin         |
| DELETE | `/users/:id`                      | Delete a user                         | Admin         |
| PUT    | `/users/wishlist/:productId`      | Toggle a product in your wishlist     | Private       |
| POST   | `/upload`                         | Upload product image(s)               | Admin         |

---

## 🧪 Manual Testing Checklist

- [ ] Register a new account, then log out and log back in
- [ ] Browse products, search by keyword, filter by category, change sort order
- [ ] Open a product, add a review, add it to the cart and to the wishlist
- [ ] Go through checkout and confirm the order appears in **My Orders**
- [ ] Log in as the seeded admin and: add a product with images, edit it, update an order's status, change a user's role

---

## 🎥 Demo Video & Submission

This README covers the source code. For your assignment submission, remember to:
1. Push this repository to GitHub with this README.
2. Record a short screen-capture walking through: registration/login, browsing & search, cart & checkout, order history, and the admin panel (products/orders/users).
3. Post the video on LinkedIn with a short write-up (project overview, tech stack, key features, and a link to this GitHub repo), tagging your instructors.

---

## 📄 License

This project was built for educational purposes as part of a course assignment.
