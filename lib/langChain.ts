import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
});
