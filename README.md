# Velocity - Food Delivery System

A full-stack food delivery application built with Node.js, Express, TypeScript, MongoDB, Redis, Socket.IO, and React. Velocity provides separate workflows for **Customers**, **Restaurants**, and **Delivery Agents**, featuring real-time order notifications, automated agent assignment, Cloudinary-backed dish image management, and Redis caching.

---

## Technical Stack

### Backend
- **Runtime & Language:** Node.js, TypeScript, Express.js (v5)
- **Database:** MongoDB with Mongoose ODM (Singleton Connection Pattern)
- **Caching:** Redis (`ioredis` / `redis`)
- **Real-Time Communication:** Socket.IO
- **File Storage:** Cloudinary & Multer (`multer-storage-cloudinary`)
- **Authentication & Security:** JWT (HTTP-only cookies) & Bcrypt

### Frontend
- **Framework & Language:** React 19, TypeScript
- **Build Tool:** Vite
- **Styling & Linting:** Vanilla CSS, ESLint

---

## Key Features

- **Multi-Role Authentication:** Separate registration, login, and authorization paths for Customers, Restaurants, and Delivery Agents using JWT cookies.
- **Dish Management:** Restaurants can upload dish images to Cloudinary, create, update, and delete menu items.
- **City-Based Caching:** Dish searches by city are cached using Redis (60-second TTL) to reduce MongoDB query load.
- **Order Placement & Auto-Assignment:** Orders automatically query and assign available ("Online") Delivery Agents located in the restaurant's city.
- **Real-Time Notifications:** Socket.IO emits real-time events to Customers, Restaurants, and Delivery Agents during order creation and status transitions (`Pending` -> `Picked` -> `Delivered`).
- **Agent Availability Tracking:** Delivery agents can update their status (`Online`/`Offline`) dynamically.

---

## Repository Structure

```text
velocity/
├── Backend/
│   ├── src/
│   │   ├── Controller/
│   │   │   ├── DishApi.ts         # Dish CRUD & Redis caching logic
│   │   │   ├── OrderApi.ts        # Order placement, agent assignment & Socket events
│   │   │   ├── UserAuthApi.ts     # User/Restaurant/Agent auth routes
│   │   │   ├── middleware.ts      # Authentication & Socket middleware
│   │   │   └── Routes.ts          # Express Router definition
│   │   ├── model/
│   │   │   ├── DatabaseConnection.ts # Mongoose singleton connection class
│   │   │   └── DatabaseSchema.ts     # Schemas for User, Restaurant, Agent, Order, Dishes
│   │   ├── services/
│   │   │   ├── Cloudinary.ts      # Cloudinary configuration
│   │   │   ├── Multer.ts          # Multer storage configuration
│   │   │   └── Redis.ts           # Redis client initialization
│   │   └── index.ts               # HTTP server & Socket.IO initialization
│   ├── .env                       # Backend environment variables
│   ├── package.json
│   └── tsconfig.json
└── Frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    └── vite.config.ts
```

---

## Environment Variables Setup

Create a `.env` file in the `Backend/` directory with the following configuration keys:

```env
# Database
DBURL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database_name>

# Security
Saltround=12
JWT_SECRET=your_jwt_secret_key

# Cloudinary Storage
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Redis Caching
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_CONNECTION_STRING=your_redis_host_or_endpoint
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** instance (local or MongoDB Atlas)
- **Redis** server (local or Redis Cloud)
- **Cloudinary** account credentials

---

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your `.env` file as described in [Environment Variables Setup](#environment-variables-setup).

4. Start the development server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:8080`.

---

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Build for production (optional):
   ```bash
   npm run build
   ```

---

## API Reference Overview

All API endpoints are prefixed with `/api`.

### Authentication & User Management
- `POST /api/User-Register` - Register a Customer, Restaurant, or Delivery Agent.
- `GET /api/User-Login` - Authenticate user and issue JWT cookie.
- `PUT /api/User-Logout` - Clear authentication cookie.
- `PUT /api/Agent-status-update` - Update Delivery Agent availability status (`Online`/`Offline`).
- `GET /api/Get-History` - Fetch previous user order history.

### Dish Management
- `POST /api/Upload-Dish` - Upload new dish with photos (Cloudinary integration, max 5 images).
- `GET /api/Fetch-dishes` - Fetch available dishes by city (uses Redis caching).
- `PUT /api/Update-Dish` - Update dish details or images.
- `DELETE /api/Delete-dish` - Remove dish entry and destroy associated Cloudinary images.
- `DELETE /api/Delete-Image` - Delete a specific dish photo from Cloudinary.

### Order Processing & Tracking
- `POST /api/Place-Order` - Place an order, auto-assign an online delivery agent, and emit Socket.IO events.
- `PUT /api/updateOrderStatus` - Update status (`Picked` / `Delivered`) and notify connected socket clients.
- `GET /api/Get-Detils` - Fetch details for a specified record ID and entity type.