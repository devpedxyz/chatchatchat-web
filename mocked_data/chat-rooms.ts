import { ChatRoom, ChatRoomParticipant } from "../src/chat-room/types";
import { User } from "../src/user/types";
import { users } from "./users";

export const chatRooms: ChatRoom[] = [];

let chatRoom: ChatRoom;

for (let i = 0; i < 20; i++) {
  chatRoom = {
    id: "chatRoom_" + (i + 1) + "-" + Date.now(),
    latestMessage: null,
    messages: [],
    participants: [],
  };

  let user: User;
  let usedIndex: number;
  const usedIndexes: { [key: number]: boolean } = {};

  for (let j = 0; j < Math.random() * 10; j++) {
    do {
      usedIndex = Math.round(Math.random() * (users.length - 1));
    } while (usedIndexes[usedIndex]);

    user = users[usedIndex];

    chatRoom.participants.push({
      ...user,
      userId: user.id,
      id: `participant_${chatRoom.id}_${user.id}`,
    });
  }

  let author: ChatRoomParticipant;

  for (let k = 0; k < Math.random() * 100; k++) {
    author =
      chatRoom.participants[
        Math.round(Math.random() * (chatRoom.participants.length - 1))
      ];

    chatRoom.messages.push({
      id: `message_${chatRoom.id}_${author.id}_${k + 1}-${Date.now()}`,
      content: "This message is sent by " + author.name,
      author,
      sentAt: Date.now() - (k + 1) * 10,
    });
  }

  chatRoom.latestMessage = chatRoom.messages[chatRoom.messages.length - 1];

  chatRooms.push(chatRoom);
}
