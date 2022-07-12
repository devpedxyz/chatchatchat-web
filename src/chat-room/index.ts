import { chatRooms } from "../../mocked_data/chat-rooms";
import { ChatRoom, SidebarChatRoom } from "./types";

export const getSidebarChatRooms = () =>
  new Promise<SidebarChatRoom[]>((resolve) => {
    setTimeout(() => {
      resolve(
        chatRooms.map<SidebarChatRoom>((cr) => ({
          id: cr.id,
          latestMessage: cr.latestMessage,
        }))
      );
    }, Math.random() * 3000);
  });

export const getChatRoom = (chatRoomId: string) =>
  new Promise<ChatRoom | null>((resolve) => {
    setTimeout(() => {
      resolve(chatRooms.find((cr) => cr.id === chatRoomId) || null);
    }, Math.random() * 3000);
  });
