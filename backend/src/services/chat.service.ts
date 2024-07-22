import { Socket, Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

const chatService = (io: SocketIOServer) => {
  // Middleware for authenticating users
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log("Received token:", token);

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return next(new Error("JWT secret is not defined"));
    }

    try {
      const decoded: JwtPayload = jwt.verify(token, jwtSecret) as JwtPayload;
      socket.data.userId = decoded.id;
      console.log("User authenticated:", socket.data.userId);
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User ${socket.data.userId} connected`);

    // Join a chat room
    socket.on("joinChatRoom", (chatRoomId) => {
      socket.join(chatRoomId);
      console.log(`User ${socket.data.userId} joined chat room: ${chatRoomId}`);
    });

    // Leave a chat room
    socket.on("leaveChatRoom", (chatRoomId) => {
      socket.leave(chatRoomId);
      console.log(`User ${socket.data.userId} left chat room: ${chatRoomId}`);
    });

    // Handle chat message
    socket.on("chatMessage", async (data) => {
      const { message, chatRoomId } = data;
      const userId = socket.data.userId;

      console.log("Message received:", message);

      try {
        const chatMessage = await prisma.chatMessage.create({
          data: {
            id: uuidv4(),
            message,
            senderId: userId,
            chatRoomId,
          },
          include: { sender: true },
        });

        io.to(chatRoomId).emit("newChatMessage", chatMessage);
      } catch (error) {
        console.error("Failed to create chat message:", error);
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User ${socket.data.userId} disconnected`);
    });
  });
};

export default chatService;
