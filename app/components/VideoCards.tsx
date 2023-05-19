import Image from "next/image";

type VideoCardProps = {
  key: number;
  title: string;
  description: string;
  imageUrl: string;
};
export default function VideoCard({
  key,
  title,
  description,
  imageUrl,
}: VideoCardProps) {
  return (
    <div key={key} className="card bg-slate-200 text-black w-96">
      <figure>
        <Image
          width={200}
          height={200}
          src={imageUrl}
          alt={description}
        ></Image>
      </figure>
      <h2 className="card-title">{title}</h2>
      <p className="card-body">{description}</p>
    </div>
  );
}
