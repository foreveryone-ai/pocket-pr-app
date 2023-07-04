"use client";
type VideoCommentsCaptionsButtonProps = {
  videoId: string;
};
export default function VideoCommentsCaptionsButton({
  videoId,
}: VideoCommentsCaptionsButtonProps) {
  const handleUpdate = async () => {
    console.log("hi from vccb button");
    const res = await fetch(`/api/update/video-data/${videoId}`);
    console.log(await res.json());
  };
  return (
    <button className="btn" onClick={handleUpdate}>
      update
    </button>
  );
}
