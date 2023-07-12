import { OpenAI } from "langchain/llms/openai";
import { loadQAMapReduceChain } from "langchain/chains";
import { Document } from "langchain/document";
import type Comment from "postcss/lib/comment";

class PocketChain {
  captions: string;
  batches: Comment[][];

  constructor(videoCaptions: string, commentBatches: Comment[][]) {
    this.captions = videoCaptions;
    this.batches = commentBatches;
  }
  async summarizeCaptions() {
    // TODO: created the class here to set the maxConcurrency property
    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      // what does this mean?
      maxConcurrency: 10,
      maxTokens: 2000,
    });
    const summaryChain = loadQAMapReduceChain(model);
    const docs = [new Document({ pageContent: this.captions })];
    const summaryRes = await summaryChain.call({
      input_documents: docs,
      question: "Summarize the documents provided",
    });
  }
}
