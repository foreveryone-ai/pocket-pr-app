import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-Rwxnnb4oN5GILqClRY012swM",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getSentiment(text: string) {
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Return the sentiment for each line seperated by '\n'. For example, 'That video was amazing!' should return POSITIVE. The output format should be similar to POSITIVE\nPOSITIVE\nNEGATIVE",
      },
      { role: "user", content: text },
    ],
  });
  console.log(completion.data.choices[0].message);
}
