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
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import type { SmallComment } from "./supabaseClient";
export type CreateEmbeddingsArgs = {
  video_id: string;
  id: string;
  author_display_name: string;
  author_image_url: string;
  text_display: string;
  like_count: number;
  channel_id: string;
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
      const comSum = comments.map((comment) => comment.text_display);
      const comSumMeta = comments.map((obj) => ({
        video_id: obj.video_id,
        id: obj.id,
        author_display_name: obj.author_display_name,
        author_image_url: obj.author_image_url,
        like_count: obj.like_count,
        channel_id: obj.channel_id,
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

// export class ChannelChain {
//   userId: string;

//   constructor(userId: string) {
//     this.userId = userId;
//   }

//   async summarizeAllCaptions() {
//     // Create the Supabase client
//     const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
//     const url = process.env.SUPABASE_URL;
//     const client = createClient(url, supabaseKey);

//     // Retrieve all caption summaries for the user's videos from the database
//     const { data, error } = await client
//       .from("Video")
//       .select("caption_summary")
//       .eq("user_id", this.userId);

//     if (error) {
//       console.error(error);
//       return;
//     }

//     // Concatenate all caption summaries
//     const allCaptions = data.map((video) => video.caption_summary).join("\n");

//     // Create the OpenAI model
//     const model = new OpenAI({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//       temperature: 0,
//       modelName: "gpt-4",
//       maxConcurrency: 10,
//     });

//     // Create the text splitter
//     const text_splitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 1000,
//     });

//     // Create the documents
//     const docs = await text_splitter.createDocuments([allCaptions]);

//     // Load the summarization chain
//     const chain = loadSummarizationChain(model, {
//       type: "map_reduce",
//       returnIntermediateSteps: true,
//     });

//     // Call the summarization chain
//     try {
//       const res = await chain.call({
//         input_documents: docs,
//       });

//       // Return the summarized captions
//       return res && res.text;
//     } catch (error) {
//       console.error("error on summarize all captions!");
//       console.error(error);
//     }
//   }

//   async summarizeChatHistory(history: string[]) {
//     // Create the OpenAI model
//     const model = new OpenAI({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//       temperature: 0,
//       modelName: "gpt-4",
//       maxConcurrency: 10,
//     });

//     // Create the text splitter
//     const text_splitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 1000,
//     });

//     // Create the documents
//     const docs = await text_splitter.createDocuments(history);

//     // Load the summarization chain
//     const chain = loadSummarizationChain(model, {
//       type: "map_reduce",
//       returnIntermediateSteps: true,
//     });

//     // Call the summarization chain
//     try {
//       const res = await chain.call({
//         input_documents: docs,
//       });

//       // Return the summarized chat history
//       return res && res.text;
//     } catch (error) {
//       console.error("error on summarize chat history");
//       console.error(error);
//     }
//   }

//   async getUserVideoIds() {
//     const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
//     const url = process.env.SUPABASE_URL;
//     const client = createClient(url, supabaseKey);

//     const { data, error } = await client
//       .from("Video")
//       .select("id")
//       .eq("user_id", this.userId);

//     if (error) {
//       console.error(error);
//       return [];
//     }

//     return data.map((video) => video.id);
//   }

//   async checkForEmbeddings(videoIds: string[]) {
//     const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
//     const url = process.env.SUPABASE_URL;
//     const client = createClient(url, supabaseKey);

//     const vectorStore = await SupabaseVectorStore.fromExistingIndex(
//       new OpenAIEmbeddings(),
//       {
//         client,
//         tableName: "documents",
//       }
//     );

//     const embeddings = {};

//     for (const videoId of videoIds) {
//       const foundDocuments = await vectorStore.similaritySearch("Anything", 3, {
//         video_id: videoId,
//       });

//       if (foundDocuments && foundDocuments.length > 0) {
//         embeddings[videoId] = foundDocuments;
//       }
//     }

//     return embeddings;
//   }

//   async initiateChat(embeddings: any, summary: string, userMessage: string) {
//     const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
//     const url = process.env.SUPABASE_URL;
//     const client = createClient(url, supabaseKey);

//     // Initialize the LLM to use to answer the question.
//     const chat = new ChatOpenAI({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//       modelName: "gpt-4",
//       temperature: 0.6,
//       streaming: true,
//       callbackManager: CallbackManager.fromHandlers({
//         handleLLMNewToken: async (token: string) => {
//           await writer.ready;
//           await writer.write(encoder.encode(`data: ${token}\n\n`));
//         },
//         handleLLMEnd: async () => {
//           await writer.ready;
//           await writer.close();
//         },
//         handleLLMError: async (e: Error) => {
//           await writer.ready;
//           await writer.abort(e);
//         },
//       }),
//     });

//     // convert the LLM's callback-based API into a stream-based API
//     const encoder = new TextEncoder();
//     const stream = new TransformStream();
//     const writer = stream.writable.getWriter();

//     const template = `You are a sophisticated PR agent named Kevin, who is trained to understand a user's audience and anticipate challenges. Engage with your client {userFirstName}, who is seeking feedback on their digital content, be it a YouTube video, blog post, or another form of publication, and answer their questions to the best of your ability. When the client mentions a "video" or "post," they reference a piece of content summarized for you as a "transcription." To provide guidance, rely on this transcription, the chatHistory of your engagement, and the comments left by the user's audience in the comment section of the discussed content. Offer accurate feedback, recommendations, and conflict mitigation strategies as necessary based on the audience's reaction to the user's content.

//     Guidelines:

//     Formatting: Structure your responses using paragraph breaks to make the content clearer and more readable. Whenever you wish to create a new paragraph in your response, interject a double line break "||" to indicate a new paragraph.
//     Direct References: When referencing comments that are provided in the prompt, always offer them as direct examples to maintain clarity and authenticity.
//     Accuracy: Always ensure that feedback and responses provided are based on the information available. Do not invent or provide fictional feedback or comments.
//     Constructive Feedback: Prioritize offering constructive advice to the client instead of just being appealing.
//     Safety: Ensure all recommendations avoid causing psychological or physical harm.
//     Solution-Oriented Approach: Frame your responses to address potential issues or conflicts the client might encounter, taking cues from audience feedback. If speculating or hypothesizing, clearly indicate as such.
//     clientName: {userFirstName}
//     transcription: {transcription},
//     chatHistory: {chatHistory},
//     comments: {comments}
//     `;

//     const systemMessagePrompt =
//       SystemMessagePromptTemplate.fromTemplate(template);

//     const humanMessagePrompt =
//       HumanMessagePromptTemplate.fromTemplate(userMessage);

//     const chatPrompt = ChatPromptTemplate.fromPromptMessages([
//       systemMessagePrompt,
//       humanMessagePrompt,
//     ]);

//     const chain = new LLMChain({
//       llm: chat,
//       prompt: chatPrompt,
//     });

//     chain
//       .call({
//         userFirstName: this.userId, // Adjust this if you have the user's name
//         transcription: summary,
//         chatHistory: summary,
//         comments: `${Object.values(embeddings).map(
//           (embedding: any) => embedding.pageContent + "\n"
//         )}`,
//       })
//       .catch((e: Error) => console.error(e));

//     return new Response(stream.readable, {
//       headers: { "Content-Type": "text/event-stream" },
//     });
//   }
// }
