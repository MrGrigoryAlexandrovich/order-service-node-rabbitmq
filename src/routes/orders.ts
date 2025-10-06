import { Router, Request, Response } from "express";
import Order, { IOrder } from "../models/Order";
import redisClient from "../config/redis";
import { publishOrder } from "../rabbitmq";

const router = Router();

// CREATE order
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, customerName, customerEmail } = req.body;
    const order: IOrder = await Order.create({
      title,
      customerName,
      customerEmail,
    });

    await redisClient.setEx(`order:${order._id}`, 3600, JSON.stringify(order));
    await redisClient.del("orders:all");

    publishOrder(order);

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// GET all orders (with Redis cache)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const cacheData = await redisClient.get("orders:all");
    if (cacheData) {
      console.log("📥 Serving from Redis cache");
      return res.json(JSON.parse(cacheData));
    }

    const orders: IOrder[] = await Order.find({});
    await redisClient.setEx("orders:all", 3600, JSON.stringify(orders));

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// GET order by ID (with Redis cache)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cacheData = await redisClient.get(`order:${id}`);
    if (cacheData) {
      console.log("📥 Serving single order from Redis cache");
      return res.json(JSON.parse(cacheData));
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await redisClient.setEx(`order:${id}`, 3600, JSON.stringify(order));

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
