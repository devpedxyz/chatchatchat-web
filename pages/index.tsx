import type { NextPage } from "next";
import Head from "next/head";

interface ChatRoom {
  id: string;
  participants: any[];
  messages: ChatMessage[];
  latestMessage: string;
}

interface ChatAuthor {
  id: string;
  name: string;
  profilePicture: string;
}
interface ChatMessage {
  id: string;
  content: string;
  author: ChatAuthor;
  sentAt: Date;
}

const chatRooms: Omit<ChatRoom, "participants" | "messages">[] = [];

for (let i = 0; i < 20; i++) {
  chatRooms.push({
    id: i + 1 + "",
    latestMessage: i + 1 + ": Latest Message!",
  });
}

const selectedChatRoom: ChatRoom = {
  id: "111",
  latestMessage: "ok",
  messages: [],
  participants: [],
};

for (let i = 0; i < 100; i++) {
  selectedChatRoom.messages.push({
    id: "" + i + 1,
    content: "Message #" + i + 1,
    author: {
      id: "" + i + 1,
      name: "John Doe",
      profilePicture: "",
    },
    sentAt: new Date(),
  });
}

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="ChatChatChat by DevPed.XYZ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full flex-wrap">
        <header className="w-full h-16">
          <h1>ChatChatChat</h1>
        </header>
        <aside className="w-1/5 h-[calc(100vh-128px)] overflow-y-auto">
          {chatRooms.length ? (
            <ul className="py-4">
              {chatRooms.map((chatRoom) => (
                <li key={chatRoom.id} className="p-4 border-b">
                  {chatRoom.latestMessage}
                </li>
              ))}
            </ul>
          ) : (
            "No chat room available!"
          )}
        </aside>
        <main className="w-4/5">
          {selectedChatRoom ? (
            <>
              <pre>{JSON.stringify(selectedChatRoom)}</pre>
              {selectedChatRoom.messages.length ? (
                <ul>
                  {selectedChatRoom.messages.map((message) => (
                    <li key={message.id}>{message.content}</li>
                  ))}
                </ul>
              ) : (
                "No messages yet"
              )}
            </>
          ) : (
            "No chat room selected"
          )}
        </main>
        <footer className="w-full h-16"></footer>
      </div>
    </div>
  );
};

export default Home;
