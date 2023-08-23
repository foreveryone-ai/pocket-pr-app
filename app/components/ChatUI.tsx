"use client";

import { BaseSyntheticEvent, useState } from "react";

type ChatUIProps = {
  videoid: string;
};

export default function ChatUI({ videoid }: ChatUIProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = async (event: BaseSyntheticEvent) => {
    event.preventDefault();
    const localMessages: string[] = [];
    localMessages.push(inputValue);
    setInputValue("");
    const response = await getGPTResponse(messages[messages.length - 1]);
    localMessages.push(response);
    setMessages([...messages, localMessages[0], localMessages[1]]);
  };

  const handleInput = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    setInputValue(event.target.value as string);
    console.log(inputValue);
  };

  const clearChat = (event: BaseSyntheticEvent) => {
    console.log("clearing messages");
    event.preventDefault();
    setMessages([]);
    // this will happen before setMessages in completed
    console.log("messages now", messages.length);
  };

  const getGPTResponse = async (userMessage: string) => {
    try {
      const res = await fetch(`/api/chat/${videoid}`, {
        method: "POST",
        body: JSON.stringify(userMessage),
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
    <section>
      <div>
        {messages &&
          messages.map((message, index) => (
            <p
              key={index}
              className={index % 2 === 0 ? `text-white-300` : `text-orange-400`}
            >
              {message}
            </p>
          ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="text-black"
          onChange={handleInput}
          type="text"
          value={inputValue}
        />
        <button>send</button>
        <button onClick={clearChat}>clear</button>
      </form>
    </section>
  );
}
