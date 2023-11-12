"use client";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { GrSend } from "react-icons/gr";
import { BiSolidCopy } from "react-icons/bi";
import NavBar from "./NavBar";
import { updateChatHistory } from "@/lib/api";

export const runtime = "edge";

type ChannelChatUIProps = {
  channelid: string;
  userName: string | null | undefined;
  chatHistory?: string[];
  conversationId: string;
};

export default function ChatUI({
  channelid,
  userName = "User",
  chatHistory,
  conversationId,
}: ChannelChatUIProps) {
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
          "" /*videoid*/,
          conversationId,
          secondLastMessage,
          lastMessage,
          channelid
        );
      }
    }
  }, [channelid, conversationId, isUpdating, messages]);

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
      await fetchEventSource(`/api/channel-chat/${channelid}`, {
        method: "POST",
        body: JSON.stringify({
          message: userMessage,
          messageHistory: messages,
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
      console.log(output);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex pt-12 justify-center bg-black">
      <div className="px-4 sm:px-6 lg:px-8 w-full sm:max-w-2xl lg:max-w-3xl mx-auto">
        <div className="bg-black rounded-lg shadow-lg">
          <div className="p-4 text-center  text-black font-semibold">
            Channel Chat
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
                    <div className="bg-gray-800 text-white rounded-xl p-2 pl-3">
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
                      <div className="rounded-xl p-2 pl-3 bg-gray-400 text-black">
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
                        className="flex-none text-white rounded-md ml-2"
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
                    <div className="bg-gray-800 text-white rounded-xl p-2 pl-3">
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
                      <div className="rounded-xl p-2 pl-3 bg-gray-400 text-black">
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
                        className="flex-none text-white rounded-md ml-2"
                        onClick={() => navigator.clipboard.writeText(message)}
                      >
                        <BiSolidCopy />
                      </Button>
                    </div>
                  </div>
                )
              )}
          </div>
          <form className="p-4  flex" onSubmit={handleSubmit}>
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
                className="flex-none bg-gray-400 text-white rounded-md p-1"
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
