"use client";

import { useState } from "react";

type VideoCommentsCaptionsButtonProps = {
  videoId: string;
};
export default function VideoCommentsCaptionsButton({
  videoId,
}: VideoCommentsCaptionsButtonProps) {
  const [summary, setSummary] = useState("");

  const handleUpdate = async () => {
    console.log("hi from vccb button");
    const res = await fetch(`/api/update/video-data/${videoId}`);
    setSummary((await res.json()).message);
  };
  return (
    <>
      {summary ? (
        summary
      ) : (
        <button
          className="btn glass btn-outline text-slate-300"
          onClick={handleUpdate}
        >
          update
        </button>
      )}
    </>
  );
}
