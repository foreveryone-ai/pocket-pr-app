import Image from "next/image";
import { VideoModal } from "./VideoModal";

type VideoCardProps = {
  key: number;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
};

export default function VideoCard({ key, title, imageUrl }: VideoCardProps) {
  return (
    <div
      key={key}
      className="relative bg-slate-200 text-black w-full"
      style={{ paddingBottom: "56.25%" }}
    >
      <figure className="m-0 absolute inset-0">
        <Image width={1280} height={720} src={imageUrl} alt={title} />
      </figure>
      <div className="absolute inset-0 flex items-center justify-center">
        <VideoModal buttonText={title} />
      </div>
    </div>
  );
}
