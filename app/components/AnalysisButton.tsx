"use client";
import { BaseSyntheticEvent, useState } from "react";

type AnalysisButtonProps = {
  title: string;
  videoid: string;
};
export default function AnalysisButton({
  title,
  videoid,
}: AnalysisButtonProps) {
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(true);

  const handleClick = async (event: BaseSyntheticEvent) => {
    setOpen(!open);
    try {
      // check to make sure the collaps is opening to display the message
      if (open) {
        const res = await fetch(
          `/api/analysis/${title.toLowerCase()}/${videoid}`
        );
        setDescription((await res.json()).message);
      }
    } catch (err) {
      setError(err as string);
    }
  };

  return (
    <div className="md:w-full w-[280px] collapse bg-[#7AD9F8] opacity-80 text-black text-center">
      <input onClick={handleClick} type="checkbox" className="w-full" />
      <div className="collapse-title text-xl font-medium">{title}</div>
      <div className="collapse-content ">
        <p className="text-black">{error ? error : description}</p>
      </div>
    </div>
  );
}
