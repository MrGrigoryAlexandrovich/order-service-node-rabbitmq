import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on("error", (err) => console.error("❌ Redis error:", err));
client.connect().then(() => console.log("✅ Redis connected"));

export default client;
