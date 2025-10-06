import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { connectRabbitMQ } from "./rabbitmq";
import { consumeOrders } from "./config/orderConsumer";
import ordersRouter from "./routes/orders";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/orders", ordersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectRabbitMQ();
  consumeOrders();
  console.log(`🚀 Server running on port ${PORT}`);
});
