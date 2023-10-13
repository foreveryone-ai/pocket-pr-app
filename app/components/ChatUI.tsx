"use client";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { BaseSyntheticEvent, useState } from "react";
import { GrSend } from "react-icons/gr";
import { BiSolidCopy } from "react-icons/bi";
import NavBar from "./NavBar";

export const runtime = "edge";

type ChatUIProps = {
  videoid: string;
  captionsSummary: string;
  userName: string | null | undefined;
};

export default function ChatUI({
  videoid,
  captionsSummary,
  userName = "User",
}: ChatUIProps) {
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
        },
      });
      //TODO: save history here?
      console.log(output);
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
            <div className="chat chat-start">
              <div className="text-black chat-bubble bg-gray-200">
                Hey {userName}, I&apos;m Keusel! Your friendly, Kangaroo PR
                Assistant. Ask me anything to get started.
              </div>
            </div>
            {messages &&
              messages.map((message, index) =>
                index % 2 === 0 ? (
                  <div className="chat chat-end" key={index}>
                    <div className="text-white chat-bubble">
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
                      <div className="chat-bubble bg-gray-200 text-black">
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
            className="p-4 border-t border-gray-200 flex"
            onSubmit={handleSubmit}
          >
            <div className="relative flex-grow">
              <input
                type="text"
                onChange={handleInput}
                value={inputValue}
                placeholder="Type here"
                className="input w-full pr-20 bg-gray-800"
                maxLength={500}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-small">
                {inputValue.length}/500
              </div>
            </div>
            <Button
              isIconOnly
              size="lg"
              variant="light"
              className="flex-none rounded-md"
              type="submit"
            >
              <GrSend />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
