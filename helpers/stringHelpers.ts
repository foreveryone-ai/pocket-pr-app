export default class StringHelpers {
  removeTimestamps(caption: string): string {
    // Regular expression to match the timestamp pattern
    const timestampRegex =
      /\d{1,2}:\d{1,2}:\d{1,2}\.\d{3},\d{1,2}:\d{1,2}:\d{1,2}\.\d{3}/g;

    // Replace timestamps with an empty string
    return caption.replace(timestampRegex, "").trim();
  }
}
