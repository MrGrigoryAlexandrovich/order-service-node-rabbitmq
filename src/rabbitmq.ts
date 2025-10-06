import amqp, { Channel } from "amqplib";

let channel: Channel | null = null;
let connection: any = null;

const RABBITMQ_RETRY_INTERVAL = 5000; // 5s

export const connectRabbitMQ = async (): Promise<void> => {
  while (!channel) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL as string);
      if (connection && typeof connection.createChannel === "function") {
        channel = await connection.createChannel();
        if (channel) {
          await channel.assertQueue("orders");
        }
        console.log("✅ RabbitMQ connected");
      } else {
        throw new Error("Connection object does not have createChannel()");
      }
    } catch (err) {
      console.error("❌ RabbitMQ connection failed, retrying in 5s...", err);
      await new Promise((res) => setTimeout(res, RABBITMQ_RETRY_INTERVAL));
    }
  }
};

export const publishOrder = async (order: unknown): Promise<void> => {
  if (!channel) {
    console.warn("⚠️ RabbitMQ channel not ready, order not published:", order);
    return;
  }

  try {
    channel.sendToQueue("orders", Buffer.from(JSON.stringify(order)), {
      persistent: true,
    });
    console.log("📤 Order published to RabbitMQ:", order);
  } catch (err) {
    console.error("❌ Failed to publish order:", err);
  }
};

// Graceful shutdown
const closeRabbitMQ = async () => {
  try {
    if (channel) await channel.close();
    if (connection && typeof connection.close === "function") {
      await connection.close();
    }
    console.log("✅ RabbitMQ connection closed");
  } catch (err) {
    console.error("❌ Error closing RabbitMQ:", err);
  }
};

process.on("exit", closeRabbitMQ);
process.on("SIGINT", () => process.exit());
process.on("SIGTERM", () => process.exit());
