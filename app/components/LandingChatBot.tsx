"use client";
import React, { useState, useEffect } from "react";
import { Client as NotionClient } from "@notionhq/client";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatMessage } from "langchain/schema";

export const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<string[]>([]);

  const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });
  const chat = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = (await notion.pages.retrieve({
        page_id: "PocketPR-LandingChatBot-742966b16fda4172bc10f777025ef879",
      })) as any;
      const trainingData = response.properties.Name.title[0].plain_text;
      const systemMessage = new ChatMessage(trainingData, "system");
      const chatResponse = (await chat.call([systemMessage])) as ChatMessage;
      setResponses((prevResponses) => [...prevResponses, chatResponse.content]);
    };
    fetchData();
  }, []);

  const handleSendMessage = async () => {
    const userMessage = new ChatMessage(message, "user");
    const systemMessage = (await chat.call([userMessage])) as ChatMessage;
    setResponses([...responses, systemMessage.content as string]);
    setMessage("");
  };

  return (
    <div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
      {responses.map((response, index) => (
        <p key={index}>{response}</p>
      ))}
    </div>
  );
};
