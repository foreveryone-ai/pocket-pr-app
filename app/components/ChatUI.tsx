"use client";

import { BaseSyntheticEvent, useState } from "react";

export default function ChatUI() {
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [assistantMessages, setAssistantMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: BaseSyntheticEvent) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setUserMessages([...userMessages, inputValue]);
      setInputValue("");
      try {
        // TODO: replace with dynamic videoid
        const response = await fetch("/api/chat/8PGIHKydMqc", {
          method: "POST",
          body: JSON.stringify({ message: inputValue }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data.message) {
          ("message received");
          setAssistantMessages([...assistantMessages, data.message]);
        } else {
          console.error("No message received");
        }
      } catch (error) {
        console.error("error on assistant response", error);
      }
    }
  };

  const handleClear = () => {
    setUserMessages([]);
  };

  return (
    <div>
      <div className="chat-messages">
        {userMessages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div className="chat-messages">
        {assistantMessages.map((message, index) => (
          <div key={index + 1000} className="text-orange-400">
            {message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            className="text-black"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button className="mr-4">Send</button>
          <button onClick={handleClear}>Clear</button>
        </form>
      </div>
    </div>
  );
}
