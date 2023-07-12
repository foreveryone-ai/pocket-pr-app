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
  console.log(imageUrl);

  return (
    <div
      key={key}
      className="relative bg-slate-200 text-black w-[280px] sm:w-[250px] md:w-[220px] lg:w-[250px] rounded-2xl aspect-[4/3]"
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
      <div className="absolute inset-0 flex flex-col-reverse items-start justify-start rounded-2xl">
        <VideoCommentsCaptionsButton videoId={videoId} />
        <Link
          className="btn glass btn-outline text-slate-300"
          href={`/dashboard/${videoId}`}
        >
          {truncateTitle(title)}
        </Link>
      </div>
    </div>
  );
}
