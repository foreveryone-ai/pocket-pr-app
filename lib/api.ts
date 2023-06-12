export async function getVideo(videoId: string) {
  const res = await fetch("/api/video-comments/" + videoId, {
    method: "GET",
  });
  console.log(res);
  return res;
}
