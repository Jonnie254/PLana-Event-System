import { Router } from "express";
import {
  protectedGetRoomMessages,
  protectedPostRoomMessage,
} from "../controller/chat.controller";
let chatRouter = Router();

chatRouter.get("/allmessages", protectedGetRoomMessages);
chatRouter.post("/postmssage", protectedPostRoomMessage);

export default chatRouter;
