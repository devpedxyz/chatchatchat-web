import type { NextPage } from "next";
import create from "zustand";
import Head from "next/head";
import { MouseEventHandler, useEffect, useRef, WheelEventHandler } from "react";
import { ChatRoom, SidebarChatRoom } from "../src/chat-room/types";
import { getChatRoom, getSidebarChatRooms } from "../src/chat-room";
import Image from "next/image";
import { User } from "../src/user/types";
import { getCurrentUser } from "../src/user";
import { format, formatDistanceToNow } from "date-fns";

interface Session {
  user: User | null;
}
interface AppState {
  session: Session;
  fetchStatus: { [key: string]: string };
  fetchCurrentUser: () => void;
  sidebarChatRooms: SidebarChatRoom[];
  sidebarChatRoomsFetchStatus: string;
  fetchSidebarChatRooms: () => void;
  selectedChatRoomId: string | null;
  selectChatRoomById: (chatRoomId: string) => void;
  selectedChatRoom: ChatRoom | null;
  chatRoomFetchStatus: string;
}

const useStore = create<AppState>((set) => ({
  session: {
    user: null,
  },
  fetchStatus: {
    user: "idle",
  },
  fetchCurrentUser: () => {
    set({ fetchStatus: { user: "started" } });
    getCurrentUser().then((user) =>
      set({ session: { user }, fetchStatus: { user: "succeeded" } })
    );
  },
  sidebarChatRooms: [],
  sidebarChatRoomsFetchStatus: "idle",
  fetchSidebarChatRooms: () => {
    set({ sidebarChatRoomsFetchStatus: "started" });

    getSidebarChatRooms().then((scrs) =>
      set({ sidebarChatRooms: scrs, sidebarChatRoomsFetchStatus: "succeeded" })
    );
  },
  selectedChatRoomId: null,
  selectedChatRoom: null,
  selectChatRoomById: (chatRoomId) => {
    set({ selectedChatRoomId: chatRoomId, chatRoomFetchStatus: "started" });

    getChatRoom(chatRoomId).then((cr) =>
      set(() => ({ selectedChatRoom: cr, chatRoomFetchStatus: "succeeded" }))
    );
  },
  chatRoomFetchStatus: "idle",
}));

const Home: NextPage = () => {
  const currentUser = useStore((state) => state.session.user);
  const fetchStatus = useStore((state) => state.fetchStatus);
  const fetchCurrentUser = useStore((state) => state.fetchCurrentUser);
  const sidebarChatRooms = useStore((state) => state.sidebarChatRooms);
  const sidebarChatRoomsFetchStatus = useStore(
    (state) => state.sidebarChatRoomsFetchStatus
  );
  const fetchSidebarChatRooms = useStore(
    (state) => state.fetchSidebarChatRooms
  );
  const selectedChatRoom = useStore((state) => state.selectedChatRoom);
  const selectedChatRoomId = useStore((state) => state.selectedChatRoomId);
  const selectChatRoomById = useStore((state) => state.selectChatRoomById);
  const selectChatRoomHandler: MouseEventHandler<HTMLLIElement> = (e) => {
    selectChatRoomById(e.currentTarget.dataset.chatRoomId!);
  };
  const chatRoomFetchStatus = useStore((state) => state.chatRoomFetchStatus);
  const chatRoomRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    fetchSidebarChatRooms();
  }, [currentUser]);

  useEffect(() => {
    if (!chatRoomRef.current) return;

    const fetchMoreMessagesHandler: EventListener = (e) => {
      const target = e.currentTarget as HTMLElement;

      if (target.scrollTop === 0) {
        // fetch more
        console.log("fetching older messages...");
      }
    };

    chatRoomRef.current.addEventListener("scroll", fetchMoreMessagesHandler);

    if (chatRoomFetchStatus === "succeeded") {
      chatRoomRef.current.scrollTo(0, chatRoomRef.current.scrollHeight);
    }

    return () =>
      chatRoomRef.current?.removeEventListener(
        "scroll",
        fetchMoreMessagesHandler
      );
  }, [chatRoomFetchStatus, chatRoomRef]);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="ChatChatChat by DevPed.XYZ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {fetchStatus.user === "started" ? (
        <h1 className="text-center m-16">Loading...</h1>
      ) : currentUser ? (
        <div className="flex w-full flex-wrap">
          <header className="w-full h-16">
            <h1>ChatChatChat</h1>
            <h2>Hello, {currentUser.name}</h2>
          </header>
          <aside className="w-1/5 h-[calc(100vh-128px)] overflow-y-auto">
            {sidebarChatRoomsFetchStatus === "started" ? (
              <p className="text-center">Loading...</p>
            ) : sidebarChatRooms.length ? (
              <ul className="py-4">
                {sidebarChatRooms.map((chatRoom) => (
                  <li
                    key={chatRoom.id}
                    data-chat-room-id={chatRoom.id}
                    className={
                      "p-4 border-b cursor-default select-none" +
                      (chatRoom.id === selectedChatRoomId
                        ? " bg-slate-400"
                        : "")
                    }
                    onClick={selectChatRoomHandler}
                  >
                    {chatRoom.latestMessage ? (
                      <div className="flex">
                        <div className="flex justify-center items-center flex-[1_0_20%]">
                          <Image
                            src={chatRoom.latestMessage.author.profilePicture}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                        <div className="flex-initial ml-4 w-4/5">
                          <p className="font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                            {chatRoom.latestMessage.author.name}
                          </p>
                          <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                            {chatRoom.latestMessage.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      "No message yet"
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              "No chat room available!"
            )}
          </aside>
          <main
            ref={chatRoomRef}
            className="w-4/5 p-4 h-[calc(100vh-128px)] overflow-y-auto"
          >
            {chatRoomFetchStatus === "started" ? (
              <p className="text-center">Loading...</p>
            ) : selectedChatRoom ? (
              <>
                {selectedChatRoom.messages.length ? (
                  <ul>
                    {selectedChatRoom.messages.map((message) => (
                      <li
                        key={message.id}
                        className={
                          "flex mb-8" +
                          (currentUser.id === message.author.userId
                            ? " flex-row-reverse"
                            : "")
                        }
                      >
                        <div className="p-4 rounded bg-red-200 max-w-[75%]">
                          {message.content}
                        </div>
                        <span
                          className={`self-end text-xs text-gray-500 ${
                            currentUser.id === message.author.userId
                              ? "mr-2"
                              : "ml-2"
                          }`}
                        >
                          {format(message.sentAt, "HH:mm น.")}
                        </span>
                      </li>
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
      ) : (
        "Error loading user information"
      )}
    </div>
  );
};

export default Home;
