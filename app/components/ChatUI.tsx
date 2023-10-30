"use client";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { BaseSyntheticEvent, useState, useEffect } from "react";
import { GrSend } from "react-icons/gr";
import { BiSolidCopy } from "react-icons/bi";
import NavBar from "./NavBar";
import { updateChatHistory } from "@/lib/api";

export const runtime = "edge";

type ChatUIProps = {
  videoid: string;
  captionsSummary: string;
  userName: string | null | undefined;
  chatHistory?: string[];
  conversationId: string;
  channelId: string;
};

export default function ChatUI({
  videoid,
  captionsSummary,
  userName = "User",
  chatHistory,
  conversationId,
  channelId,
}: ChatUIProps) {
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(true);
  const [archivedChat, setArchivedChat] = useState<string[]>(
    chatHistory ? chatHistory : []
  );

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const secondLastMessage = messages[messages.length - 2];
      if (isUpdating === false) {
        updateChatHistory(
          videoid,
          conversationId,
          secondLastMessage,
          lastMessage,
          channelId
        );
      }
    }
  }, [channelId, conversationId, isUpdating, messages, videoid]);

  const handleSubmit = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    setMessages([...messages, inputValue, "loading"]); // Add a temporary message with "loading"
    setInputValue(""); // Clear the text input immediately
    handleResponse(inputValue);
  };

  const handleResponse = async (userMessage: string) => {
    await getGPTResponse(userMessage);
  };

  const handleInput = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    setInputValue(event.target.value as string);
    console.log(inputValue);
  };

  const getGPTResponse = async (userMessage: string) => {
    setIsUpdating(true);
    try {
      console.log(messages[messages.length - 1]);
      await fetchEventSource(`/api/chat/${videoid}`, {
        method: "POST",
        body: JSON.stringify({
          message: userMessage,
          messageHistory: messages,
          captionsSummary: captionsSummary,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        onmessage(ev) {
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            prevMessages[prevMessages.length - 1].replace("loading", "") +
              ev.data,
          ]);
          setIsUpdating(true);
        },
      });

      setIsUpdating(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex pt-12 justify-center bg-green-800">
      <div className="px-4 sm:px-6 lg:px-8 w-full sm:max-w-2xl lg:max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 text-center border-b border-gray-200 text-black font-semibold">
            New Chat
          </div>

          <div
            className="p-4 overflow-y-auto"
            style={{ maxHeight: "500px", minHeight: "500px" }}
          >
            <div className="chat chat-start"></div>
            {archivedChat &&
              archivedChat.map((mes, idx) =>
                idx % 2 === 0 ? (
                  <div className="flex justify-end py-4" key={idx}>
                    <div className="bg-black text-white rounded-xl p-2 pl-3">
                      {mes.split("||").map((paragraph, i) => (
                        <p key={i}>
                          {paragraph}
                          <br />
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="chat chat-start" key={idx}>
                    <div className="flex items-center">
                      <div className="rounded-xl p-2 pl-3 bg-gray-200 text-black">
                        <>
                          {mes.split("||").map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </>
                      </div>
                      <Button
                        isIconOnly
                        size="lg"
                        variant="light"
                        className="flex-none rounded-md ml-2"
                        onClick={() => navigator.clipboard.writeText(mes)}
                      >
                        <BiSolidCopy />
                      </Button>
                    </div>
                  </div>
                )
              )}

            {messages &&
              messages.map((message, index) =>
                index % 2 === 0 ? (
                  <div className="flex justify-end py-4" key={index}>
                    <div className=" bg-black text-white rounded-xl p-2 pl-3">
                      {message.split("||").map((paragraph, i) => (
                        <p key={i}>
                          {paragraph}
                          <br />
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="chat chat-start" key={index}>
                    <div className="flex items-center">
                      <div className="rounded-xl p-2 pl-3 bg-gray-200 text-black">
                        {message === "loading" ? (
                          <Spinner />
                        ) : (
                          <>
                            {message.split("||").map((paragraph, i) => (
                              <p key={i}>{paragraph}</p>
                            ))}
                          </>
                        )}
                      </div>
                      <Button
                        isIconOnly
                        size="lg"
                        variant="light"
                        className="flex-none rounded-md ml-2"
                        onClick={() => navigator.clipboard.writeText(message)}
                      >
                        <BiSolidCopy />
                      </Button>
                    </div>
                  </div>
                )
              )}
          </div>
          <form
            className="pt-4 pb-2 pl-3 border-t border-gray-200 flex"
            onSubmit={handleSubmit}
          >
            <div className="relative flex-grow">
              <input
                type="text"
                onChange={handleInput}
                value={inputValue}
                placeholder="Type here"
                className="input w-full rounded-xl pr-20 bg-gray-800"
                maxLength={500}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-small">
                {inputValue.length}/500
              </div>
            </div>
            <div className="px-1">
              <Button
                isIconOnly
                size="md"
                variant="light"
                className="flex-none rounded-md p-1"
                type="submit"
              >
                <GrSend />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
