import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { LLMChain, loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import type { SmallComment } from "./supabaseClient";
export type CreateEmbeddingsArgs = {
  video_id: string;
  id: string;
  author_display_name: string;
  author_image_url: string;
  text_display: string;
  like_count: number;
};

export class PocketChain {
  // captions can be the OG captions or the a summary that has already been created
  captions: string;
  batches: SmallComment[][];

  constructor(videoCaptions?: string, commentBatches?: SmallComment[][]) {
    this.captions = videoCaptions || "";
    this.batches = commentBatches || [];
  }
  async summarizeCaptions() {
    // created the class here to set the maxConcurrency property
    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      // what does this mean?
      maxConcurrency: 10,
    });
    const text_splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await text_splitter.createDocuments([this.captions]);
    const chain = loadSummarizationChain(model, {
      type: "map_reduce",
      returnIntermediateSteps: true,
    });
    try {
      const res = await chain.call({
        input_documents: docs,
      });
      console.log(res);
      // update summary?
      this.captions = res && res.text;
      return this.captions;
    } catch (error) {
      console.error("error on summarize captions!");
      console.error(error);
    }
  }

  async summarizeChatHistory(history: string[]) {
    // created the class here to set the maxConcurrency property
    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      // what does this mean?
      maxConcurrency: 10,
    });
    const text_splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await text_splitter.createDocuments(history);
    const chain = loadSummarizationChain(model, {
      type: "map_reduce",
      returnIntermediateSteps: true,
    });
    try {
      const res = await chain.call({
        input_documents: docs,
      });
      console.log(res);
      // update summary?
      return res && res.text;
    } catch (error) {
      console.error("error on summarize captions!");
      console.error(error);
    }
  }

  async createEmbeddings(comments: CreateEmbeddingsArgs[]) {
    let vectorStore;
    console.log("comsums: ", comments);
    const comSum = comments.map((comment) => comment.text_display);
    const comSumMeta = comments.map((obj) => ({
      video_id: obj.video_id,
      id: obj.id,
      author_display_name: obj.author_display_name,
      author_image_url: obj.author_image_url,
      like_count: obj.like_count,
    }));

    console.log("comSum length: ", comSum.length);
    console.log("comSumMeta length: ", comSumMeta.length);
    // use chunkSize and chunkOverlap to adjust how the text is being
    // split, it will group by \n\n then \n then " "
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    console.log(comSum);
    console.log(comSumMeta);

    // maybe pass in, text and metadata. metadata is an array of objects
    const docs = await textSplitter.createDocuments(comSum, comSumMeta);

    console.log("docs length");
    console.log(docs.length);

    // Create a vector store from the documents.
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    const client = createClient(url, supabaseKey);

    vectorStore = await SupabaseVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
        queryName: "match_documents",
      }
    );
    return true;
  }

  async hasEmbeddings(videoid: string) {
    // verify supabase credentials
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    const client = createClient(url, supabaseKey);
    //for query only...
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
      }
    );
    //query, k (num of docs to return), {} metadata filter
    const foundDocuments = await vectorStore.similaritySearch("Anything", 3, {
      video_id: videoid,
    });

    console.log("q1", foundDocuments);

    if (foundDocuments && foundDocuments.length > 0) {
      return true;
    }

    return false;
  }
  async chat(videoid: string, userMessage: string, chatHistory: string[]) {
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    const summary = await this.summarizeChatHistory(chatHistory);

    console.log(`This is the summary: ${summary}`);

    const client = createClient(url, supabaseKey);

    // search embeddings based on user prompt
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
      }
    );
    //query, k (num of docs to return), {} metadata filter
    const foundDocuments = await vectorStore.similaritySearch(userMessage, 10, {
      video_id: videoid,
    });

    console.log("documents retrieved: ", foundDocuments);

    // Initialize the LLM to use to answer the question.
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });

    const template = `You are a helpful public relations assistant that is having a conversation with your client about a You Tube video that they have created. Use the transcription from the video, the chatHistory of your conversation, as well as the commments to respond to your client.
    transcription: {transcription},
    chatHistory: {chatHistory},
    comments: {comments}
    `;

    const systemMessagePrompt =
      SystemMessagePromptTemplate.fromTemplate(template);

    const humanMessagePrompt =
      HumanMessagePromptTemplate.fromTemplate(userMessage);

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      systemMessagePrompt,
      humanMessagePrompt,
    ]);

    console.log("chatPrompt: ", chatPrompt);
    const chain = new LLMChain({
      llm: chat,
      prompt: chatPrompt,
    });

    console.log(`Video captions: ` + this.captions);

    const response = await chain.call({
      transcription: this.captions,
      chatHistory: summary,
      comments: `
      ${foundDocuments.map((document) => document.pageContent + "\n")}`,
    });

    console.log("chat response: ", response);
    return response.text;
  }
}
