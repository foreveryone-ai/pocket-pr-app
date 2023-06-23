import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-Rwxnnb4oN5GILqClRY012swM",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getModels() {
  const openai = new OpenAIApi(configuration);
  const response = await openai.listModels();
  console.log(response.data);
}
