# E-commerce Backend API

Node.js backend for e-commerce platform with Express.js, MongoDB, and JWT authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
ADMIN_EMAIL=admin@demo.com
ADMIN_PASSWORD=admin123
STRIPE_SECRET_KEY=sk_test_your-stripe-key
```

## Run

```bash
npm run dev  # development
npm start    # production
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (Admin)
- `PUT /api/products/:id` (Admin)
- `DELETE /api/products/:id` (Admin)

### Orders
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders`

### Checkout
- `POST /api/checkout/create-session`

### Health
- `GET /health`

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Stripe Payments
- bcrypt Password Hashing