import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { CallbackManager } from "langchain/callbacks";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { LLMChain, loadSummarizationChain } from "langchain/chains";
import { getCaptionSummaries } from "./supabaseClient";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import type { SmallComment } from "./supabaseClient";
import { storeAllCaptionSummary } from "@/lib/supabaseClient";
import { getAllCaptionSummary } from "./supabaseClient";

export type CreateEmbeddingsArgs = {
  video_id: string;
  id: string;
  author_display_name: string;
  author_image_url: string;
  text_display: string;
  like_count: number;
  channelId: string;
};

export class PocketChain {
  // captions can be the OG captions or the a summary that has already been created
  captions: string;
  channelId: string;
  batches: SmallComment[][];

  constructor(
    videoCaptions?: string,
    channelId?: string,
    commentBatches?: SmallComment[][]
  ) {
    this.captions = videoCaptions || "";
    this.channelId = channelId || "";
    this.batches = commentBatches || [];
    console.log("Passed channelId: ", this.channelId);
  }
  async summarizeCaptions() {
    // created the class here to set the maxConcurrency property
    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      modelName: "gpt-4",
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
      modelName: "gpt-4",
      // what does this mean?
      maxConcurrency: 100,
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
      console.error("error on summarize chat history");
      console.error(error);
    }
  }

  async createEmbeddings(comments: CreateEmbeddingsArgs[]): Promise<boolean> {
    try {
      let vectorStore;
      console.log("comsums: ", comments);
      console.log("Used channelId: ", this.channelId);
      const comSum = comments.map((comment) => comment.text_display);
      const comSumMeta = comments.map((obj) => ({
        video_id: obj.video_id,
        id: obj.id,
        author_display_name: obj.author_display_name,
        author_image_url: obj.author_image_url,
        like_count: obj.like_count,
        channel_id: this.channelId,
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

      // pass in, text and metadata. metadata is an array of objects
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

      // if the operation is successful, return true.
      return true;
    } catch (error) {
      console.error(error);
      // if an error is caught, return false
      return false;
    }
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
  async chat(
    userFirstName: string,
    videoid: string,
    userMessage: string,
    chatHistory: string[]
  ) {
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
    const foundDocuments = await vectorStore.similaritySearch(userMessage, 25, {
      video_id: videoid,
    });

    console.log("documents retrieved: ", foundDocuments);

    // convert the LLM's callback-based API into a stream-based API
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Initialize the LLM to use to answer the question.
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4",
      temperature: 0.6,
      streaming: true,
      callbackManager: CallbackManager.fromHandlers({
        handleLLMNewToken: async (token: string) => {
          await writer.ready;
          await writer.write(encoder.encode(`data: ${token}\n\n`));
        },
        handleLLMEnd: async () => {
          await writer.ready;
          await writer.close();
        },
        handleLLMError: async (e: Error) => {
          await writer.ready;
          await writer.abort(e);
        },
      }),
    });

    const template = `You are a sophisticated PR agent named Kevin, who is trained to understand a user's audience and anticipate challenges. Engage with your client {userFirstName}, who is seeking feedback on their digital content, be it a YouTube video, blog post, or another form of publication, and answer their questions to the best of your ability. When the client mentions a "video" or "post," they reference a piece of content summarized for you as a "transcription." To provide guidance, rely on this transcription, the chatHistory of your engagement, and the comments left by the user's audience in the comment section of the discussed content. Offer accurate feedback, recommendations, and conflict mitigation strategies as necessary based on the audience's reaction to the user's content.

    Guidelines:
    
    Formatting: Structure your responses using paragraph breaks to make the content clearer and more readable. Whenever you wish to create a new paragraph in your response, interject a double line break "||" to indicate a new paragraph.
    Direct References: When referencing comments that are provided in the prompt, always offer them as direct examples to maintain clarity and authenticity.
    Accuracy: Always ensure that feedback and responses provided are based on the information available. Do not invent or provide fictional feedback or comments.
    Constructive Feedback: Prioritize offering constructive advice to the client instead of just being appealing.
    Safety: Ensure all recommendations avoid causing psychological or physical harm.
    Solution-Oriented Approach: Frame your responses to address potential issues or conflicts the client might encounter, taking cues from audience feedback. If speculating or hypothesizing, clearly indicate as such.
    clientName: {userFirstName}
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
    // console.log("template: ", template);
    // console.log("chatPrompt: ", chatPrompt);
    console.log("creating chain...");
    const chain = new LLMChain({
      llm: chat,
      prompt: chatPrompt,
    });

    console.log(`Video captions: ` + this.captions);

    chain
      .call({
        userFirstName: userFirstName,
        transcription: this.captions,
        chatHistory: summary,
        comments: `
      ${foundDocuments.map((document) => document.pageContent + "\n")}`,
      })
      .catch((e: Error) => console.error(e));

    return new Response(stream.readable, {
      headers: { "Content-Type": "text/event-stream" },
    });
  }
}

export class AllSummaryHandler {
  async summarizeSummaries(channel_id: string) {
    const authToken = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!authToken) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

    const existingSummary = await getAllCaptionSummary(authToken, channel_id);

    if (Array.isArray(existingSummary) && existingSummary.length > 0) {
      return existingSummary[0].body as string;
    } else {
      const response = await getCaptionSummaries(authToken, channel_id);

      if (!response.data || response.data.length === 0) {
        throw new Error(
          `No captionSummary records exist for channel_id: ${channel_id}`
        );
      }

      const summaries = response.data.map((summary) => summary.summaryText);

      const model = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0,
        modelName: "gpt-4",
        maxConcurrency: 100,
      });

      const text_splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      });

      const docs = await text_splitter.createDocuments(summaries);

      const chain = loadSummarizationChain(model, {
        type: "map_reduce",
        returnIntermediateSteps: true,
      });

      try {
        const res = await chain.call({
          input_documents: docs,
        });

        const summarizedText = res && res.text;

        const authToken = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!authToken) {
          throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
        }
        await storeAllCaptionSummary(authToken, channel_id, summarizedText);

        return summarizedText;
      } catch (error) {
        console.error("error on summarize summaries");
        console.error(error);
      }
    }
  }
}

export class ChannelChain {
  captions: string;
  channelId: string;
  batches: SmallComment[][];

  constructor(
    videoCaptions?: string,
    channelId?: string,
    commentBatches?: SmallComment[][]
  ) {
    this.captions = videoCaptions || "";
    this.channelId = channelId || "";
    this.batches = commentBatches || [];
    console.log("Passed channelId: ", this.channelId);
  }

  async summarizeChatHistory(history: string[]) {
    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      modelName: "gpt-4",
      maxConcurrency: 100,
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
      return res && res.text;
    } catch (error) {
      console.error("error on summarize chat history");
      console.error(error);
    }
  }

  async chat(
    userFirstName: string,
    channel_id: string,
    userMessage: string,
    chatHistory: string[],
    allCaptionsSummary: string
  ) {
    console.log("Chat method called with parameters:");
    console.log("User First Name: ", userFirstName);
    console.log("Channel ID: ", channel_id);
    console.log("Message: ", userMessage);
    console.log("Message History: ", chatHistory);

    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    const summary = await this.summarizeChatHistory(chatHistory);

    const client = createClient(url, supabaseKey);
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
      }
    );

    const foundDocuments = await vectorStore.similaritySearch(userMessage, 25, {
      channel_id: channel_id,
    });

    const authToken = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!authToken) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4",
      temperature: 0.6,
      streaming: true,
      callbackManager: CallbackManager.fromHandlers({
        handleLLMNewToken: async (token: string) => {
          await writer.ready;
          await writer.write(encoder.encode(`data: ${token}\n\n`));
        },
        handleLLMEnd: async () => {
          await writer.ready;
          await writer.close();
        },
        handleLLMError: async (e: Error) => {
          await writer.ready;
          await writer.abort(e);
        },
      }),
    });

    const template = `You are a sophisticated PR agent named Kevin, who is trained to understand a user's audience and anticipate challenges. Engage with your client {userFirstName}, who is seeking feedback on their digital content, be it a YouTube video, blog post, or another form of publication, and answer their questions to the best of your ability. When the client mentions a "video" or "post," they reference a piece of content summarized for you as a "transcription." To provide guidance, rely on this transcription, the chatHistory of your engagement, and the comments left by the user's audience in the comment section of the discussed content. Offer accurate feedback, recommendations, and conflict mitigation strategies as necessary based on the audience's reaction to the user's content.

    Guidelines:
    
    Formatting: Structure your responses using paragraph breaks to make the content clearer and more readable. Whenever you wish to create a new paragraph in your response, interject a double line break "||" to indicate a new paragraph.
    Direct References: When referencing comments that are provided in the prompt, always offer them as direct examples to maintain clarity and authenticity.
    Accuracy: Always ensure that feedback and responses provided are based on the information available. Do not invent or provide fictional feedback or comments.
    Constructive Feedback: Prioritize offering constructive advice to the client instead of just being appealing.
    Safety: Ensure all recommendations avoid causing psychological or physical harm.
    Solution-Oriented Approach: Frame your responses to address potential issues or conflicts the client might encounter, taking cues from audience feedback. If speculating or hypothesizing, clearly indicate as such.
    clientName: {userFirstName}
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
    // console.log("template: ", template);
    // console.log("chatPrompt: ", chatPrompt);
    try {
      console.log("creating chain...");
      // ... rest of the chat method implementation
      const chain = new LLMChain({
        llm: chat,
        prompt: chatPrompt,
      });

      console.log(`Video captions: ` + this.captions);

      chain.call({
        userFirstName: userFirstName,
        transcription: allCaptionsSummary, // Use allCaptionsSummary as the transcription
        chatHistory: summary,
        comments: `
      ${foundDocuments.map((document) => document.pageContent + "\n")}`,
        channel_id: channel_id,
      });
    } catch (e: any) {
      console.error(
        "error occured while creating or calling the LLMChain: ",
        e
      );
    }

    return new Response(stream.readable, {
      headers: { "Content-Type": "text/event-stream" },
    });
  }
}
