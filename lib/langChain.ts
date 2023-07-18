import path from "path";
import * as fs from "fs";
import { z } from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { createStructuredOutputChainFromZod } from "langchain/chains/openai_functions";
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import type { SmallComment } from "./supabaseClient";
import { util } from "prettier";

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
      console.log({ res });
      // update summary?
      this.captions = res && res.res.text;
      return { res };
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
      // what does this mean?
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
        // const pathToOutput = path.join(__dirname, "out.txt");
        // fs.appendFile(
        //   pathToOutput,
        //   JSON.stringify(response, null, 2),
        //   (err: NodeJS.ErrnoException | null) => {
        //     if (err) throw err;
        //     console.log("Data appended to file");
        //   }
        // );

        console.log(JSON.stringify(list));
        console.log(JSON.stringify(response, null, 2));
      } catch (error) {
        console.error("hit catch!!");
        console.error(error);
      }
    }
  }
}
