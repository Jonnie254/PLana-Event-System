import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import getIdFromToken from "../middleware/token.id";
import { verifyToken } from "../middleware/token.validation";

const prisma = new PrismaClient();

export const getRoomMessages = async (req: Request, res: Response) => {
  const { chatRoomId } = req.params;

  try {
    const messages = await prisma.chatMessage.findMany({
      where: { chatRoomId },
      include: { sender: true },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const postRoomMessage = async (req: Request, res: Response) => {
  const { chatRoomId, message } = req.body;
  const senderId: string = getIdFromToken(req) as string;

  try {
    const newMessage = await prisma.chatMessage.create({
      data: {
        id: uuidv4(),
        message,
        senderId,
        chatRoomId,
      },
    });
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to post message" });
  }
};
export const protectedGetRoomMessages = [verifyToken, getRoomMessages];
export const protectedPostRoomMessage = [verifyToken, postRoomMessage];
