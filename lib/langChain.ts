import { z } from "zod";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
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
  loadQAMapReduceChain,
  loadQAStuffChain,
} from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import type { SmallComment } from "./supabaseClient";
import { SENTIMENT } from "@prisma/client";

export type EmotionalAnalysisArgs = {
  author_display_name: string;
  author_image_url: string;
  like_count: number;
  CommentSummary: {
    summaryText: string;
    sentiment: SENTIMENT;
  };
};

export class PocketChain {
  // captions can be the OG captions or the a summary that has already been created
  captions: string;
  batches: SmallComment[][];

  constructor(videoCaptions: string, commentBatches: SmallComment[][]) {
    this.captions = videoCaptions;
    this.batches = commentBatches;
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
      return res;
    } catch (error) {
      console.error("error on summarize captions!");
      console.error(error);
    }
  }

  async processComments() {
    console.log("batches object: ", this.batches);
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
            words: z
              .array(z.string().describe("relavant keywords or phrases"))
              .describe("an array of the most relavent keywords or phrases"),
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
          `Give sentiment and summary for each of the comment objects based on the text_display field, as well as the most relavant keywords or phrases. Use the following summary for context when analysing the comments: {captions}`
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
    });
    console.log("entering for loop to send batches...");
    let counter = 0;
    let summariesToReturn: {
      id: string;
      sentiment: string;
      summary: string;
      words: [];
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
        summariesToReturn.push(response.output.comments);
      } catch (error) {
        console.error("hit catch!!");
        console.error(error);
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
    sentimentBreakdown: string,
    commentSummaries: EmotionalAnalysisArgs[]
  ) {
    // Initialize the LLM to use to answer the question.
    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });

    console.log("comsums: ", commentSummaries);
    const comSum = commentSummaries.map(
      (sum) => sum.CommentSummary.summaryText
    );
    const comSumMeta = commentSummaries.map((obj) => ({
      author_display_name: obj.author_display_name,
      author_image_url: obj.author_image_url,
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

    console.log("docs");
    console.log(docs);
    // Create a vector store from the documents.
    // may need asure key?
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-ada-002",
        batchSize: 512,
      })
    );

    // Initialize a retriever wrapper around the vector store
    const retriever = vectorStore.asRetriever();

    const info = retriever.getRelevantDocuments(
      "Find dominant emotions such as joy, sadness, anger, fear, surprise, and disgust"
    );

    // TODO: send relavent documents to openai
    // prompt to openai

    const stuffChain = loadQAStuffChain(model);

    const stuffResult = await stuffChain.call({
      inputDocuments: info,
      question: `Based on the comment summaries and caption below, can you infer any dominant emotions such as joy, sadness, anger, fear, surprise, and disgust? Provide a distribution of these emotions, if possible.
      [${JSON.parse(JSON.stringify(this.captions)).text_display}]`,
    });

    return stuffResult;
  }
}
