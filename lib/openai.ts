import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-Rwxnnb4oN5GILqClRY012swM",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export class OpenaiPreProcessor {
  //TODO: implement methods for sentiment analysis, keyword extraction, and summarization
  // function that will conditionally get a summary of the captions if it is past a certain length.

  async getSentiment(text: string) {
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
  async getReport(text: string) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Based on the YouTube video comments separated by '\n' and the following subtitles of the YouTube video, delimited by '\n', return an analytical report on the comment section in relation to the topic of and content discussed in the YouTube video subtitles. The report should take note of repeated sentiments and opinions expressed, as well as constructive criticism and feedback. Most importantly, any sign of conflict, distrust, or anger towards the YouTube creator who posted the video should be highlighted and summarized. Finally, give the YouTube creator a few suggestions on what types of videos their audience wants to see more, and how the creator might navigate any conflict, distrust, tension or anger that their audience feels towards them.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });
    console.log(completion.data.choices[0].message);
  }
  async getVideoSummary(text: string) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Summarize the topics being discussed in the comments. Highlight any reoccuring points of conflict. Each comment is delimited by the new line symbol '\n'",
        },
        { role: "user", content: text },
      ],
    });
    console.log(completion.data.choices[0].message);
  }
}

class OpenaiProcessor {
  //TODO: implement final call for analysis to openai.
}
