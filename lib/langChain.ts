import path from "path";
import * as fs from "fs";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { FunctionalTranslator } from "langchain/retrievers/self_query/functional";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { AttributeInfo } from "langchain/schema/query_constructor";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  PromptTemplate,
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  PipelinePromptTemplate,
} from "langchain/prompts";
import { createStructuredOutputChainFromZod } from "langchain/chains/openai_functions";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import {
  LLMChain,
  loadSummarizationChain,
  VectorDBQAChain,
  loadQAMapReduceChain,
  loadQAStuffChain,
  RetrievalQAChain,
} from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import type { SmallComment } from "./supabaseClient";
import { SENTIMENT } from "@prisma/client";
export type EmotionalAnalysisArgs = {
  video_id: string;
  id: string;
  author_display_name: string;
  author_image_url: string;
  text_display: string;
  like_count: number;
  comment_summary: {
    summaryText: string;
    sentiment: SENTIMENT;
  };
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

  async processComments() {
    console.log("creating zod schema...");
    const zodSchema = z.object({
      comments: z
        .array(
          z.object({
            id: z.string().describe("the id from the coorisponding comment"),
            sentiment: z
              .string()
              .describe(
                "sentiment, should be one of POSITIVE, NEGATIVE, or NEUTRAL"
              ),
            summary: z
              .string()
              .describe("summary of the coorisponding comment"),
          })
        )
        .describe(
          "an array of comment objects, for each comment object that was passed in"
        ),
    });
    console.log("creating llm object...");
    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      modelName: "gpt-3.5-turbo-0613",
    });
    console.log("llm created...");
    console.log("creating prompt...");
    const prompt = new ChatPromptTemplate({
      promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
          `Give sentiment and summary for each of the comment objects based on the text_display field. Use the following video_captions for context when analysing the comments.
          video_captions: {captions}`
        ),
        HumanMessagePromptTemplate.fromTemplate("{input_text}"),
      ],
      inputVariables: ["input_text", "captions"],
    });
    console.log("prompt created");
    console.log("creating json chain...");

    const jsonChain = createStructuredOutputChainFromZod(zodSchema, {
      prompt,
      llm,
      verbose: true,
    });
    console.log("entering for loop to send batches...");

    let logCounter = 0;
    let counter = 0;
    let summariesToReturn: {
      id: string;
      sentiment: string;
      summary: string;
    }[] = [];
    for (let list of this.batches) {
      // create documents based on a batch
      counter++;
      console.log("in for loop no. " + counter + "/" + this.batches.length);

      try {
        const response = await jsonChain.call({
          // try adding {} around the input_text, or at the end
          input_text: JSON.stringify(list),
          captions: this.captions,
        });
        console.log(JSON.stringify(response, null, 2));

        // Use this to log the output to a file
        // try {
        //   const ROUTE = path.join(__dirname, "../../../logs");
        //   fs.appendFileSync(
        //     ROUTE + `log${logCounter}.txt`,
        //     JSON.stringify(response, null, 2)
        //   );

        //   logCounter++;
        // } catch (error) {
        //   console.error("error on logging", error);
        // }

        summariesToReturn.push(response.output.comments);
      } catch (error) {
        console.error("hit catch!!");
        console.error(error);
        return [];
      }
    }
    console.log("summariesToReturn");
    console.log(summariesToReturn);
    return summariesToReturn.flat(1);
  }
  static async sentimentBreakdown(sentiment: {
    pos: number;
    neg: number;
    neu: number;
  }) {
    console.log("start sentimentBreakdown: ", sentiment);
    const llm = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.2,
      modelName: "gpt-3.5-turbo",
    });

    const prompt = PromptTemplate.fromTemplate(
      `You are a public relations assistant with a sense of humor that is appropriate to a professional environment. The following represents a sentiment analysis, based on You Tube comments from the user's video. Reflect on the sentiment distribution. Are the comments predominantly positive, negative, or neutral? pos: {pos}, neg: {neg}, neu: {neu}`
    );

    const formattedPrompt = await prompt.format({
      pos: sentiment.pos,
      neg: sentiment.neg,
      neu: sentiment.neu,
    });

    const sentimentRes = await llm.predict(formattedPrompt);
    return sentimentRes;
  }
  async emotionalAnalysis(
    comments: EmotionalAnalysisArgs[],
    embeddingsExist: boolean
  ) {
    let vectorStore;
    console.log("comsums: ", comments);
    const comSum = comments.map((comment) => comment.text_display);
    const comSumMeta = comments.map((obj) => ({
      video_id: obj.video_id,
      id: obj.id,
      author_display_name: obj.author_display_name,
      author_image_url: obj.author_image_url,
      like_count: obj.like_count,
      sentiment: obj.comment_summary.sentiment as string,
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

    // for query only...
    if (embeddingsExist) {
      vectorStore = await SupabaseVectorStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        {
          client,
          tableName: "documents",
        }
      );
    } else {
      vectorStore = await SupabaseVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings(),
        {
          client,
          tableName: "documents",
          queryName: "match_documents",
        }
      );
    }

    //query, k (num of docs to return), {} metadata filter
    const q1 = await vectorStore.similaritySearch(
      "Return comments with a strong emotions",
      3,
      { video_id: comSumMeta[0].video_id }
    );

    console.log("q1", q1);

    // Initialize the LLM to use to answer the question.
    const llm = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });

    const template2 =
      PromptTemplate.fromTemplate(`You are a public relations consultant. First, use the captions to understand the content of the YouTube video. Then, summarize the emotional breakdown of the comments in relation to the video. 
    captions: {captions}
    comments: {comments}`);

    console.log("captions type: ", typeof this.captions);
    console.log("captions: ", this.captions);

    // const caption = JSON.stringify(this.captions);
    // console.log("stringified: ", caption);
    // const captionObj = JSON.parse(caption);
    // console.log("objectified: ", captionObj);

    const formattedTemp = await template2.format({
      captions: this.captions,
      comments:
        q1[0].pageContent + "\n" + q1[1].pageContent + "\n" + q1[2].pageContent,
    });

    console.log("formattedTemp", formattedTemp);

    const predictionRes = await llm.predict(formattedTemp);

    console.log("predictionRes", predictionRes);

    return predictionRes;
  }
  async hasEmbeddings(videoid: string) {
    // verify supabase credentials
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    const client = createClient(url, supabaseKey);
    // for query only...
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
  async chat(videoid: string, userMessage: string) {
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

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

    const template = `You are a helpful public relations assistant that is having a conversation with your client about a You Tube video that they have created. Use the transcription from the video, as well as the commments to respond to your client.
    transcription: {transcription},
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

    const response = await chain.call({
      transcription: this.captions,
      comments: `
      ${foundDocuments.map((document) => document.pageContent + "\n")}`,
    });

    console.log("chat response: ", response);
    return response.text;
  }
}
