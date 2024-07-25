import express from "express";
import cors from "cors";
import cron from "node-cron";
import http from "http"; // Import http
import { Server as SocketIOServer } from "socket.io"; // Import Socket.IO
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import eventRouter from "./routes/event.routes";
import bookingRouter from "./routes/booking.routes";
import chatService from "./services/chat.service";
import chatRouter from "./routes/chat.routes";
import analyticsRouter from "./routes/analytics.routes";

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// const run = async () => {
//   cron.schedule("*/5 * * * * *", async () => {
//     console.log("checking the database for new users...");
//   });
// };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/event", eventRouter);
app.use("/book", bookingRouter);
app.use("/chat", chatRouter);
app.use("/analytics", analyticsRouter);

chatService(io);

server.listen(3005, () => {
  console.log("Server is running on port 3005");
});

// run().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });
