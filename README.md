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

🔧 Environment Variables (.env)
The project requires a .env file in the root directory with the following variables:
مقتطف الرم
NODE_ENV=development
PORT=8000

# Database
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
DB_PASS=YOUR_DB_PASSWORD

# Allow all origins (only for development)
CLIENT_URL=*

# BaseURL Image
BASE_URL=http://localhost:8000

# JWT
JWT_SECRET_KEY=YOUR_JWT_SECRET_KEY
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET_KEY=YOUR_JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRES_IN=7d

# Email Settings
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=YOUR_EMAIL_USER
EMAIL_PASSWORD=YOUR_EMAIL_PASSWORD
EMAIL_FROM_NAME=E-shop
EMAIL_FROM=your_email@gmail.com

# Stripe Settings
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET
STRIPE_WEBHOOK_SECRET_KEY=YOUR_STRIPE_WEBHOOK_SECRET

# Redis settings
REDIS_URL=YOUR_REDIS_URL

🔐 JWT Authentication & Role-based Access ControlAccess Token:Short-lived (15 minutes)Used to access protected endpointsSent via header: Authorization: Bearer <access_token>Refresh Token:Long-lived (7 days)Used to get a new Access Token without loginSent to endpoint /auth/refresh-token to renew tokenRoles: Admin, Manager, UserControls access to sensitive endpoints: Users, Orders, Products, CouponsPro-level Notes:Tokens are encrypted with JWT_SECRET_KEY and JWT_REFRESH_SECRET_KEY.Refresh token can be stored in HttpOnly cookie or local storage.Full protection on all CRUD operations and sensitive models.Base URL: {{BASE_URL}}/api/v1 | Authentication: Bearer Token (JWT) | Total Endpoints: 90+🔐 Authentication & AuthorizationMethodEndpointDescriptionAccess / RolesPOST/auth/signupRegister new userPublicPOST/auth/loginLogin user, issue access & refresh tokensPublicPOST/auth/logoutLogout user, clear refresh token cookiePrivateGET/auth/refresh-tokenGet new access token using refresh tokenPrivatePOST/auth/password/forgotRequest password reset code via emailPublicPOST/auth/password/verifyVerify password reset codePublicPOST/auth/password/resetReset password using verified codePublicNote: AccessToken expires in 15m, RefreshToken expires in 7d, stored in httpOnly cookie.👤 UsersMethodEndpointDescriptionAccess / RolesGET/usersGet all usersAdminPOST/usersCreate new userAdminGET/users/meGet logged-in user profileUserPUT/users/meUpdate profileUserPUT/users/me/passwordChange passwordUserPUT/users/me/deactivateDeactivate my accountUserPUT/users/:id/deactivateDeactivate user by adminAdminPUT/users/:id/reactivateReactivate user by adminAdminPUT/users/:id/passwordChange user password by adminAdminGET/users/:idGet specific user by adminAdminPUT/users/:idUpdate user by adminAdminDELETE/users/:idDelete userAdmin📦 CategoriesMethodEndpointDescriptionAccess / RolesGET/categoriesGet all categoriesPublicPOST/categoriesCreate new categoryAdmin / ManagerGET/categories/:idGet category by IDPublicPUT/categories/:idUpdate categoryAdmin / ManagerDELETE/categories/:idDelete categoryAdminSubCategoriesMethodEndpointDescriptionAccess / RolesGET/subcategoriesGet all subcategoriesPublicPOST/subcategoriesCreate subcategoryAdmin / ManagerGET/subcategories/:idGet subcategory by IDPublicPUT/subcategories/:idUpdate subcategoryAdmin / ManagerDELETE/subcategories/:idDelete subcategoryAdminNested Routes:MethodEndpointDescriptionAccess / RolesGET/categories/:categoryId/subcategoriesGet subcategories for categoryPublicPOST/categories/:categoryId/subcategoriesCreate subcategory under categoryAdmin / Manager🏷️ BrandsMethodEndpointDescriptionAccess / RolesGET/brandsList all brandsPublicPOST/brandsCreate brandAdmin / ManagerGET/brands/:idGet brand by IDPublicPUT/brands/:idUpdate brandAdmin / ManagerDELETE/brands/:idDelete brandAdmin🛒 CartMethodEndpointDescriptionAccess / RolesGET/cartGet logged user's cartUserPOST/cartAdd product to cartUserPUT/cart/:itemIdUpdate cart item quantityUserDELETE/cart/:itemIdRemove cart itemUserDELETE/cart/clearClear entire cartUserPUT/cart/apply-couponApply couponUser🧾 OrdersMethodEndpointDescriptionAccess / RolesPOST/orders/:cartIdCreate cash orderUserGET/orders/meGet my ordersUserGET/orders/me/:idGet my order by IDUserGET/ordersGet all ordersAdmin / ManagerGET/orders/checkout-session/:cartIdStripe checkout sessionUserPUT/orders/:id/payMark order as paidAdmin / ManagerPUT/orders/:id/deliverMark order as deliveredAdmin / ManagerNote: Both Stripe checkout orders and cash orders use atomic order creation to prevent duplicates. Stripe uses stripeSessionId, and cash orders ensure uniqueness by validating cart contents and order records before creation.🛍️ ProductsMethodEndpointDescriptionAccess / RolesGET/productsGet all productsPublicGET/products/:idGet product by IDPublicPOST/productsCreate productAdmin / ManagerPUT/products/:idUpdate productAdmin / ManagerDELETE/products/:idDelete productAdminGET/products/top-tenTop 10 productsPublicGET/products/latestLatest productsPublicGET/products/top-ratedTop rated productsPublicGET/products/:id/relatedRelated productsPublic⭐ ReviewsMethodEndpointDescriptionAccess / RolesGET/reviewsGet all reviewsPublicGET/reviews/:idGet review by IDPublicPOST/products/:productId/reviewsCreate review for productUserGET/products/:productId/reviewsGet reviews for productPublicGET/products/:productId/reviews/:reviewIdGet specific review for productPublicPUT/reviews/:idUpdate reviewUserDELETE/reviews/:idDelete reviewUser / Admin💖 WishlistMethodEndpointDescriptionAccess / RolesGET/wishlistGet my wishlistUserPOST/wishlistAdd product to wishlistUserDELETE/wishlist/:productIdRemove from wishlistUser📍 AddressesMethodEndpointDescriptionAccess / RolesGET/addressesGet my addressesUserPOST/addressesAdd new addressUserDELETE/addresses/:addressIdRemove addressUser🎟️ CouponsMethodEndpointDescriptionAccess / RolesGET/couponsGet all couponsAdmin / ManagerPOST/couponsCreate couponAdmin / ManagerGET/coupons/:idGet coupon by IDAdmin / ManagerPUT/coupons/:idUpdate couponAdmin / ManagerDELETE/coupons/:idDelete couponAdminPATCH/coupons/activate/:idActivate couponAdminPATCH/coupons/deactivate/:idDeactivate couponAdmin💰 Pricing SettingsMethodEndpointDescriptionAccess / RolesGET/settingsGet pricing settingsAdminPUT/settingsUpdate pricing settingsAdmin✅ All endpoints follow JWT Authentication & Role-based Access Control.🔒 Refresh token & access token mechanism implemented for secure session handling.⚡ Stripe checkout & webhook handle atomic operations to prevent overselling.⚡ Stripe Webhook Integration (Local Testing)1️⃣ Run BackendBashnpm run start:dev
2️⃣ Run Stripe CLIBashstripe listen --forward-to localhost:8000/webhook-checkout
Connects Stripe to /webhook-checkout endpoint locally.3️⃣ Trigger Checkout SessionBashstripe trigger checkout.session.completed \
  --add checkout_session:client_reference_id=<CART_ID> \
  --add checkout_session:metadata[userId]=<USER_ID>
Replace <CART_ID> and <USER_ID> with real database values.4️⃣ VerifyCheck console logs:BashCheckout Session Completed: cs_test_...
Cart ID: ...
User ID: ...
Order created from Stripe webhook: ...
Order is created, stock updated, cart cleared.Duplicate sessions ignored to prevent multiple orders.5️⃣ NotesLogs appear only in development mode.Transactions are atomic to prevent overselling.Webhook ready for production, use correct Stripe secret in .env.🏗️ Architecture & SkillsFactory Handlers for all CRUD operationsRate Limiter Factory reusable for any moduleValidation for all models & inputsPlugins: slugifyPlugin, imageUrlPluginPre-Middlewares & Model Methods for pre-save, pre-update, computed fieldsModular Project StructureProduction Logging with morgan and file streams🎯 Key Features✅ Authentication & SecurityJWT-based authentication with refresh tokensPassword reset via email verification codeAccount deactivation/reactivationRole-based access control (Admin, Manager, User)✅ Advanced Product ManagementMulti-image upload supportProduct variants (colors, sizes)Stock quantity trackingRelated products suggestionsTop-rated, latest, and top 10 products✅ E-commerce FeaturesShopping cart with coupon supportWishlist functionalityMultiple shipping addressesCash and online payment (Stripe)Order tracking and status management✅ Reviews & RatingsUser reviews on productsRating system (1-5 stars)Review ownership validation✅ Advanced QueryingPagination supportField selectionKeyword searchSorting (ascending/descending)Filtering by multiple criteria✅ Admin FeaturesComplete user managementCoupon management with activation/deactivationOrder status management (paid/delivered)Pricing settings (tax & shipping)Product, category, brand CRUD operations✅ File Upload SupportCategory imagesBrand logosProduct images (cover + gallery)User profile picturesMultipart/form-data handling

# Run in production
npm run start:prod
