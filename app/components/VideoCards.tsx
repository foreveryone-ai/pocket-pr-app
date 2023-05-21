import Image from "next/image";
import { VideoModal } from "./VideoModal";

type VideoCardProps = {
  key: number;
  title: string;
  description: string;
  imageUrl: string;
  width: number;
  height: number;
};
export default function VideoCard({
  key,
  title,
  description,
  imageUrl,
  width,
  height,
}: VideoCardProps) {
  return (
    <div key={key} className="card bg-slate-200 text-black w-96">
      <figure>
        <Image
          width={width}
          height={height}
          src={imageUrl}
          alt={description}
        ></Image>
      </figure>
      <h2 className="card-title">{title}</h2>
      <p className="card-body">{description}</p>
      <div>
        <VideoModal />
      </div>
    </div>
  );
}
