"use client";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { BaseSyntheticEvent, useState } from "react";

type ChatUIProps = {
  videoid: string;
  captionsSummary: string;
};

export default function ChatUI({ videoid, captionsSummary }: ChatUIProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    setMessages([...messages, inputValue, "loading"]); // Add a temporary message with "loading"
    setInputValue(""); // Clear the text input immediately
    handleResponse(inputValue);
  };

  const handleResponse = async (userMessage: string) => {
    const response = await getGPTResponse(userMessage);
    console.log(response);
    setMessages((prevMessages) => {
      // Replace the temporary message with the actual response
      const newMessages = [...prevMessages];
      newMessages[newMessages.length - 1] = response;
      return newMessages;
    });
  };

  const handleInput = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    setInputValue(event.target.value as string);
    console.log(inputValue);
  };

  const getGPTResponse = async (userMessage: string) => {
    try {
      console.log(captionsSummary);
      const res = await fetch(`/api/chat/${videoid}`, {
        method: "POST",
        body: JSON.stringify({
          message: userMessage,
          messageHistory: messages,
          captionsSummary: captionsSummary,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data.message;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex pt-12 justify-center min-h-screen bg-green-800">
      <div className="px-4 sm:px-6 lg:px-8 w-full sm:max-w-2xl lg:max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 text-center border-b border-gray-200 text-black font-semibold">
            New Chat
          </div>

          <div
            className="p-4 overflow-y-auto"
            style={{ maxHeight: "500px", minHeight: "500px" }}
          >
            {messages &&
              messages.map((message, index) =>
                index % 2 === 0 ? (
                  <div className="chat chat-end" key={index}>
                    <div className="ctext-white chat-bubble">{message}</div>
                  </div>
                ) : (
                  <div className="chat chat-start" key={index}>
                    <div className="chat-bubble bg-gray-200 text-black">
                      {message === "loading" ? <Spinner /> : message}
                    </div>
                  </div>
                )
              )}
          </div>
          {/* <div className="p-4 border-t border-gray-200 flex"> */}
          <form
            className="p-4 border-t border-gray-200 flex"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              onChange={handleInput}
              value={inputValue}
              placeholder="Type here"
              className="input w-full"
            />
            <Button
              size="lg"
              className="flex-none rounded-md bg-green-600 ml-2"
            >
              Send
            </Button>
          </form>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
