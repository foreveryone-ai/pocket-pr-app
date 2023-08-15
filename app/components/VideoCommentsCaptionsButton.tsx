"use client";

import { useState } from "react";

type VideoCommentsCaptionsButtonProps = {
  videoId: string;
  source: string;
};
export default function VideoCommentsCaptionsButton({
  videoId,
  source,
}: VideoCommentsCaptionsButtonProps) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleUpdate = async () => {
    console.log("hi from vccb button");
    setLoading(true);
    const res = await fetch(`/api/update/video-data/${videoId}`);
    console.log("source is: ", source);
    if (source === "video") {
      setSummary((await res.json()).message);
    } else {
      setIsComplete(true);
    }
  };
  return (
    <>
      {summary ? (
        summary
      ) : (
        <button
          // change the look of the button when it is clicked
          className="btn glass btn-outline text-slate-300"
          onClick={handleUpdate}
          disabled={isComplete}
        >
          {isComplete ? "Update Complete" : "Update"}
        </button>
      )}
    </>
  );
}
