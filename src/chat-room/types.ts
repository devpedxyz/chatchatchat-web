export interface ChatRoom {
  id: string;
  participants: ChatRoomParticipant[];
  messages: ChatMessage[];
  latestMessage: ChatMessage | null;
}

export interface ChatMessage {
  id: string;
  content: string;
  author: ChatRoomParticipant;
  sentAt: number;
}

export interface ChatRoomParticipant {
  id: string;
  userId: string;
  name: string;
  profilePicture: string;
}

export type SidebarChatRoom = Omit<ChatRoom, "participants" | "messages">;
