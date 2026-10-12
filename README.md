# 🛍️ Node.js E-commerce API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-5.x-yellow)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen)
![Stripe](https://img.shields.io/badge/Stripe-Payment-blue)
![Redis](https://img.shields.io/badge/Redis-Caching-red)
![Multer](https://img.shields.io/badge/Multer-FileUpload-purple)
![Sharp](https://img.shields.io/badge/Sharp-ImageOptimization-orange)
![Helmet](https://img.shields.io/badge/Helmet-Security-lightgrey)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue)
![Bcrypt](https://img.shields.io/badge/Bcrypt-Hashing-red)
![ExpressValidator](https://img.shields.io/badge/ExpressValidator-Validation-green)
![Compression](https://img.shields.io/badge/Compression-Performance-blue)
![CORS](https://img.shields.io/badge/CORS-CrossOrigin-brightgreen)
![CookieParser](https://img.shields.io/badge/CookieParser-Cookies-darkgreen)
![Morgan](https://img.shields.io/badge/Morgan-Logging-yellow)
![UUID](https://img.shields.io/badge/UUID-UniqueID-purple)
![Pluralize](https://img.shields.io/badge/Pluralize-Helpers-orange)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Emails-blue)
![Slugify](https://img.shields.io/badge/Slugify-SEO-darkblue)
![HPP](https://img.shields.io/badge/HPP-HTTPProtection-grey)
![RateLimiter](https://img.shields.io/badge/RateLimiter-Security-red)
![Nodemon](https://img.shields.io/badge/Nodemon-DevTool-teal)

---

## 💡 Overview

* **Modular Architecture**: controllers, models, routes, services per module.
* **Factory Handlers**: CRUD operations reusable across models.
* **Rate Limiter Factory**: applied per sensitive endpoint.
* **Validation**: all modules with Mongoose schema & custom validators.
* **Plugins & Middlewares**: slugifyPlugin, imageUrlPlugin, preMiddlewares.
* **Production Logging**: Morgan logs to files.
* **JWT Authentication & Role-based Access Control**.
* **File Uploads**: Multer + image optimization.
* **Stripe Integration**: checkout sessions, webhook, order creation.
* **Full E-commerce Features**: cart, wishlist, coupons, multi-address, orders, reviews.
* **Products Caching with Redis**: top 10, latest, top-rated, related products are cached for performance.

---

## 🚀 Quick Start

```bash
# Clone repository
git clone [https://github.com/Youssef33715/ecommerce-api.git](https://github.com/Youssef33715/ecommerce-api.git)
cd ecommerce-api

# Install dependencies
npm install

# Run in development
npm run start:dev

# Run in production
npm run start:prod
