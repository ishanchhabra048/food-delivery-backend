# Tiffino - Full-Stack Food & Tiffin Delivery Platform

A production-grade, full-stack food and tiffin delivery web application with real-time Socket.IO status tracking, role-based dashboards (Customer, Restaurant Owner, Admin), Cloudinary asset uploads, atomic MongoDB transactions, and Cashfree payment integration.

---

## Architecture Overview

```
food-delivery/
├── server/                    # Node.js + Express 5 CommonJS Backend
│   ├── src/
│   │   ├── config/            # Cloudinary, Redis, BullMQ, Logger
│   │   ├── controllers/       # User, Restaurant, Food, Cart, Order, Payment, Upload, Admin
│   │   ├── cron/              # Automated scheduled jobs
│   │   ├── db/                # MongoDB connection
│   │   ├── middlewares/       # Auth, RBAC, Rate-limiter (Redis), Error, Multer Upload
│   │   ├── models/            # Mongoose Schemas (User, Restaurant, Food, Cart, Order, etc.)
│   │   ├── queues/            # BullMQ Email Queue
│   │   ├── routes/            # Express Routers
│   │   ├── scripts/           # Idempotent seed script & migration helpers
│   │   ├── sockets/           # Socket.IO handshake auth & order/restaurant rooms
│   │   ├── utils/             # Pino Logger, ApiError, ApiResponse, asyncHandler, cache
│   │   └── workers/           # Background email worker process
│   └── tests/                 # Automated test suite (Vitest + Supertest + MongoMemoryServer)
├── client/                    # React 18 + Vite SPA Frontend ("Vivid Kitchen" Design)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Button, Card, StatusPill, Modal, Table, ImageUploader, etc.
│   │   │   ├── layout/        # Navbar, Footer, CustomerLayout, OwnerLayout, AdminLayout, CartDrawer
│   │   │   ├── customer/      # RestaurantCard, MenuItemCard, OrderStatusTimeline, OrderCard
│   │   │   ├── owner/         # RestaurantProfileForm, MenuItemForm, OwnerOrderRow
│   │   │   └── admin/         # OwnerRequestRow
│   │   ├── context/           # AuthContext, CartContext
│   │   ├── hooks/             # useAuth, useRestaurants, useOrder, useOwnerOrders, useSocketOrder, useUpload
│   │   ├── pages/             # Customer, Owner, and Admin views
│   │   ├── lib/               # Axios instance, Socket.IO client, TanStack Query client
│   │   └── styles/            # "Vivid Kitchen" design tokens & Tailwind CSS
├── docker-compose.yml         # Local Docker setup (API + Worker + MongoDB + Redis)
└── README.md
```

---

## Getting Started Locally

### Prerequisites
- Node.js >= 20.x
- MongoDB (running locally on port `27017` or via Docker)
- Redis (running locally on port `6379` or via Docker)

---

### Quick Start with Docker

```bash
docker-compose up -d
```
This boots MongoDB, Redis, the Express API (port `5000`), and the BullMQ background worker.

---

### Manual Setup

#### 1. Backend Setup (`/server`)

```bash
cd server
npm install
cp .env.example .env
```

Start the API server:
```bash
npm run dev
```

Start the background email worker in a separate terminal:
```bash
npm run worker
```

Seed initial demo data (users, 4 restaurants, menus):
```bash
npm run seed
```

Run automated backend tests:
```bash
npm test
```

#### 2. Frontend Setup (`/client`)

```bash
cd ../client
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

## Seeded Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `customer@anyfeast.com` | `Password123!` |
| **Restaurant Owner** | `owner@anyfeast.com` | `Password123!` |
| **Administrator** | `admin@anyfeast.com` | `Password123!` |

---

## Backend Hardening & Bug Fix Summary (LLD Section 8)

| # | Finding / Gap | Solution Applied |
|---|---|---|
| **1** | Order placement and cart clearing were uncommitted writes | Wrapped `Order.create()` and `cart.save()` in atomic `mongoose.startSession()` transaction with automatic rollback. |
| **2** | Hardcoded `secure: false` on JWT cookies | Enabled `secure: process.env.NODE_ENV === "production"` with dynamic `sameSite` policy. |
| **3** | BullMQ email worker & cron were never run | Added dedicated `npm run worker` script and hooked `startCronJobs()` into server initialization. |
| **4** | Image fields were plain strings; no upload pipeline | Built Multer + Cloudinary streaming pipeline with `{ url, publicId }` schema update and delete-on-replace support. |
| **5** | Rate limiter store did not scale across instances | Integrated `rate-limit-redis` connected to Redis with memory store fallback for offline dev/test modes. |
| **6** | Unused Razorpay dependency | Uninstalled and removed from codebase. |
| **7** | `package.json` main pointed to invalid `index.js` | Updated `"main": "src/server.js"` and added `worker`, `seed`, and `test` scripts. |
| **8** | Controller logic duplication | Standardized pricing calculations, validation middlewares, and ownership verifications. |
| **9** | Raw console logs | Replaced with structured Pino logging (`utils/logger.js`) and `pino-http` with automatic `x-request-id` tracing. |
| **10** | Lack of automated test suite | Created comprehensive test suites using Vitest, Supertest, and MongoMemoryServer covering auth, orders, and uploads. |
| **11** | Containerization & Repository | Dockerfile, `docker-compose.yml`, `.env.example`, and clean Git history established. |

---

## Before & After Critical Fix Notes

### 1. Order Transaction & Cart Atomicity (`order.controller.js`)
- **Before**: `Order.create()` was executed first. If the server failed or `cart.save()` crashed immediately after, the customer was charged and the order was placed, but the cart retained the items (causing duplicate ordering).
- **After**: Both order creation and cart clearing are executed inside a MongoDB session transaction (`session.startTransaction()`). Any error causes a clean rollback of both actions (`session.abortTransaction()`).

### 2. Cookie Security Flags (`user.controller.js`)
- **Before**: Access and refresh tokens were set with `secure: false` regardless of environment.
- **After**: `secure` flag is strictly enabled in production (`process.env.NODE_ENV === "production"`), preventing tokens from ever transmitting over unencrypted HTTP.

---

## Real-Time Socket.IO Channels

- **Auth Handshake**: Validates JWT token from incoming cookies or auth payload.
- **`join:order`**: Authorizes customers, restaurant owners, and admins to receive live `order:status` updates.
- **`join:restaurant`**: Authorizes restaurant owners to receive instant `order:new` push events when a customer places an order.
- **Client Fallback**: The client automatically transitions to a 10s background HTTP polling fallback if the socket disconnects for more than 8 seconds.
