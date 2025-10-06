import amqp from "amqplib";
import { sendEmail } from "./sendMail";

export const consumeOrders = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();
    await channel.assertQueue("orders");

    console.log("📥 Consumer is waiting for orders...");

    channel.consume("orders", async (msg) => {
      if (msg) {
        const order = JSON.parse(msg.content.toString());
        try {
          await sendEmail({
            email: order.customerEmail,
            orderTitle: order.title,
          });
          channel.ack(msg);
          console.log("📧 Email sent for order:", order._id);
        } catch (err) {
          console.error("❌ Failed to send email for order:", order._id, err);
        }
      }
    });
  } catch (err) {
    console.error("❌ RabbitMQ consumer error:", err);
  }
};
