"use client";

import { BaseSyntheticEvent, useState } from "react";

export default function ChatUI() {
  const [chatDisplay, setChatDisplay] = useState("");
  const [userText, setUserText] = useState("");

  const handleSend = (event: BaseSyntheticEvent) => {
    console.log("send to chat!");
  };

  const handleUserTyping = (event: BaseSyntheticEvent) => {
    setUserText(event.target.value);
    console.log(event.target.value);
  };

  return (
    <div>
      <div id="chat-display">{chatDisplay}</div>
      <div>
        <textarea
          onChange={handleUserTyping}
          name="user-text"
          id="user-text"
          cols={30}
          rows={10}
        ></textarea>
        <button onClick={handleSend}>send</button>
      </div>
    </div>
  );
}
