import express from "express";
import cors from "cors";
import cron from "node-cron";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import eventRouter from "./routes/event.routes";
import bookingRouter from "./routes/booking.routes";

const run = async () => {
  cron.schedule("*/5 * * * * *", async () => {
    console.log("checking the database for new users...");
  });
};
let app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/event", eventRouter);
app.use("/book", bookingRouter);

app.listen(3005, () => {
  console.log("Server is running on port 3005");
});
