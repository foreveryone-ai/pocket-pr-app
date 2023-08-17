"use client";

import { useState } from "react";
import { Button } from "@nextui-org/button";

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
        <Button
          color="warning"
          // change the look of the Button when it is clicked
          className="mt-2"
          onClick={handleUpdate}
          disabled={isComplete}
        >
          {isComplete ? "Update Complete" : "Update"}
        </Button>
      )}
    </>
  );
}
