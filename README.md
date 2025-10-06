# Orders API

A simple Node.js + TypeScript API for managing orders, using **MongoDB** as the primary database and **Redis** for caching. Includes RabbitMQ integration for sending order confirmation emails asynchronously.

---

## Features

- Create, fetch, and retrieve individual orders
- Store orders in MongoDB (source of truth)
- Cache orders in Redis for faster GET requests
- Automatic cache invalidation for updated order lists
- RabbitMQ integration for sending order confirmation emails
- Written in TypeScript for type safety

---

## Technologies

- Node.js + TypeScript
- Express.js
- MongoDB (Mongoose)
- Redis
- Nodemailer (for sending emails)
- RabbitMQ for async email processing

---

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/orders-api.git
cd orders-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/ordersdb
REDIS_HOST=redis
REDIS_PORT=6379
RABBITMQ_URL=amqp://rabbitmq
MAIL=youremail@gmail.com
MAIL_PASSWORD=yourpassword
```

---

## Running the Project

```bash
docker-compose up --build
```

This will start:

- Node.js API on `localhost:3000`
- MongoDB
- Redis
- RabbitMQ

---

## API Endpoints

### Create Order

```
POST /orders
Body:
{
  "title": "Pizza Margherita",
  "customerName": "Ahmed",
  "customerEmail": "ahmed@example.com"
}
Response: 201 Created
```

### Get All Orders

```
GET /orders
Response: 200 OK
```

### Get Order by ID

```
GET /orders/:id
Response: 200 OK
```

---

## Redis Caching

- **GET /orders/:id** → First checks Redis cache (`order:<id>`). If not found, fetches from MongoDB and caches it for 1 hour.
- **GET /orders** → Caches full list under `orders:all`. Cache is invalidated when a new order is created.

---

## RabbitMQ Email Integration

- When a new order is created, the server publishes an `order_created` message to a RabbitMQ queue.
- A separate worker service (consumer) listens to this queue and sends a confirmation email to the customer asynchronously.
- This ensures that the API responds immediately, while email delivery happens in the background without blocking the request.
