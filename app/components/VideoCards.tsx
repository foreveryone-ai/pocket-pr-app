import VideoCommentsCaptionsButton from "./VideoCommentsCaptionsButton";
import Image from "next/image";
import Link from "next/link";

type VideoCardProps = {
  key: number;
  videoId: string;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
};

export default function VideoCard({
  key,
  title,
  imageUrl,
  videoId,
}: VideoCardProps) {
  // Function to truncate the title if it exceeds 25 characters
  const truncateTitle = (title: string, limit: number = 25) => {
    return title.length > limit ? `${title.substring(0, limit)}...` : title;
  };

  return (
    <div
      key={key}
      className="relative bg-slate-200 text-black w-full rounded-2xl aspect-[4/3]"
    >
      <figure className="m-0 absolute inset-0 rounded-2xl">
        <Image
          width={640}
          height={480}
          src={imageUrl}
          alt={title}
          className="rounded-2xl object-cover"
        />
      </figure>
      <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
        <VideoCommentsCaptionsButton videoId={videoId} />
        <Link
          className="btn btn-secondary text-white"
          href={`/dashboard/${videoId}`}
        >
          {truncateTitle(title)}
        </Link>
      </div>
    </div>
  );
}
