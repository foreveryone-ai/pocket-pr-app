// npm install oneai
import OneAI from "oneai";

const oneai = new OneAI(process.env.ONEAI_API);

export async function getSentiments(text: string[]) {
  const pipeline = new oneai.Pipeline(oneai.skills.sentiments());
  const output = await pipeline.runBatch(text);
  console.log(output);
  for (let o of output.outputs) {
    console.log(o.output);
    // sentiment is found at output.outputs.output.value ex. NEG, POS
  }
}
