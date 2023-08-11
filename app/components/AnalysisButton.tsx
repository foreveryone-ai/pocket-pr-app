"use client";

import { BaseSyntheticEvent } from "react";

type AnalysisButtonProps = {
  title: string;
};
export default function AnalysisButton({ title }: AnalysisButtonProps) {
  const handleClick = (event: BaseSyntheticEvent) => {
    console.log(title);
  };

  return (
    <div className="md:w-full w-[280px] collapse bg-[#7AD9F8] opacity-80 text-black text-center">
      <input onClick={handleClick} type="checkbox" className="w-full" />
      <div className="collapse-title text-xl font-medium">{title}</div>
      <div className="collapse-content ">
        <p className="text-black">description</p>
      </div>
    </div>
  );
}
