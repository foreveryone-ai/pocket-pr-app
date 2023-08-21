"use client";

import { BaseSyntheticEvent, useState } from "react";

export default function ChatUI() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: BaseSyntheticEvent) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setMessages([...messages, inputValue]);
      setInputValue("");
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
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
