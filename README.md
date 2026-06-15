# 🚀 Ecommerce API

A production-ready RESTful E-commerce API built with Node.js, Express.js, MongoDB Atlas, and Stripe.

This project provides a complete backend solution for modern e-commerce applications, including authentication, authorization, product management, shopping cart functionality, coupon management, wishlist features, order processing, and secure online payments using Stripe Checkout and Webhooks.

---

## 📌 Features

### 🔐 Authentication & Authorization
- User Registration & Login
- JWT Authentication
- Protected Routes
- Role-Based Access Control (User / Manager / Admin)
- Forgot Password via Email
- Reset Password Workflow
- Password Encryption using bcrypt

### 👥 User Management
- Manage User Profiles
- User Addresses
- Wishlist Management
- Admin User Management

### 📦 Product Management
- Create Products
- Update Products
- Delete Products
- Get Single Product
- Get All Products
- Product Image Upload
- Product Image Processing with Sharp

### 📂 Categories & Subcategories
- Full CRUD Operations
- Nested Resources Support
- Category-Subcategory Relationships

### 🏷 Brand Management
- Full CRUD Operations
- Image Upload Support

### ⭐ Reviews System
- Add Reviews
- Update Reviews
- Delete Reviews
- One Review Per User Restriction

### ❤️ Wishlist
- Add Product To Wishlist
- Remove Product From Wishlist
- Retrieve User Wishlist

### 🛒 Shopping Cart
- Add Product To Cart
- Update Product Quantity
- Remove Cart Items
- Clear Cart
- Calculate Total Price

### 🎟 Coupon System
- Create Coupons
- Apply Discount Coupons
- Automatic Price Recalculation

### 📦 Orders Management
- Cash Orders
- Card Orders
- Order Tracking
- Payment Status Management
- Delivery Status Management

### 💳 Stripe Payment Integration
- Stripe Checkout Session
- Stripe Webhooks
- Automatic Order Creation After Successful Payment
- Secure Online Payments

---

## 🛡 Security Features

This project follows modern backend security best practices:

- Helmet Security Headers
- Rate Limiting
- MongoDB Query Sanitization
- XSS Protection
- HTTP Parameter Pollution Protection (HPP)
- JWT Authentication
- Password Hashing (bcryptjs)
- Global Error Handling
- Unhandled Rejection Handling
- Uncaught Exception Handling

---

## 🏗 Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose ODM

### Authentication
- JWT
- bcryptjs

### Payments
- Stripe Checkout
- Stripe Webhooks

### File Upload & Image Processing
- Multer
- Sharp

### Validation
- Express Validator

### Security
- Helmet
- Express Rate Limit
- Express Mongo Sanitize
- HPP
- XSS Clean

### Deployment
- Vercel
- MongoDB Atlas

---

## 📂 Project Structure

```bash
├── config
├── middleware
├── models
├── routes
├── services
├── uploads
├── utils
├── validators
├── server.js
```

---

## ⚙ Environment Variables

Create a `.env` file in the root directory and add:

```env
NODE_ENV=

PORT=

DB_URL=

JWT_SECRET_KEY=
JWT_EXPIRE_TIME=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/Youssef33715/ecommerce-api.git
```

Navigate to project directory:

```bash
cd ecommerce-api
```

Install dependencies:

```bash
npm install
```

Create `.env` file and configure environment variables.

Run development server:

```bash
npm run start:dev
```

Run production server:

```bash
npm run start:prod
```

---

## 📡 API Modules

- Authentication
- Users
- Categories
- Subcategories
- Brands
- Products
- Reviews
- Wishlist
- Addresses
- Cart
- Coupons
- Orders
- Stripe Payments

---

## 🎯 Learning Outcomes

Through building this project, I gained hands-on experience with:

- RESTful API Design
- Authentication & Authorization
- MongoDB Data Modeling
- Stripe Payment Integration
- Stripe Webhooks
- Backend Security Best Practices
- Error Handling
- File Upload & Image Processing
- Deployment & Environment Management

---

## 🔮 Future Improvements

- API Documentation using Swagger
- Refresh Tokens
- Product Search Optimization
- Caching with Redis
- CI/CD Pipeline
- Docker Support
- Unit & Integration Testing

---

## 👨‍💻 Author

### Youssef Mohamed

Computer Science & Artificial Intelligence Student

Backend Developer | Future AI Engineer

GitHub:
https://github.com/Youssef33715

---

⭐ If you found this project useful, consider giving it a star.
