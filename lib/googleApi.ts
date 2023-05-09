// type FetcherParams = {
//     url: string,
//     method: string,
//     body: {},
//     json: boolean,
// }
// fetcher wraps fetch to handle errors and boilerplate
// const fetcher = async ({ url, method, body, json = true }: FetcherParams) => {
//     const res = await fetch(`https://www.googleapis.com/youtube/v3/${url}`, {
//       method,
//       body: body && JSON.stringify(body),
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     });

//     if (!res.ok) {
//       throw new Error("API Error");
//     }

//     if (json) {
//       const data = await res.json();
//       return data;
//     }
//   };

//   export const getAllVideos = async (userId) => {
//     return fetcher({
//       url: "list",
//       method: "POST",
//       body: user,
//       json: false,
//     });
//   };
