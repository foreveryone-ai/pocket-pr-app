import { FC } from "react";

interface ResponsiveIframeProps {
  width: number;
  height: number;
  className: string;
}

const ResponsiveIframe: FC<ResponsiveIframeProps> = ({
  width,
  height,
  className,
}) => (
  <div className={className}>
    <iframe
      className="rounded-2xl"
      width={width}
      height={height}
      src="https://www.youtube.com/embed/QkeiXiWwk6g?si=4ztzZ9DO3PnsEYOn"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    ></iframe>
  </div>
);

export default function DemoVideo() {
  return (
    <>
      <ResponsiveIframe
        width={350}
        height={197}
        className="flex flex-col justify-center items-center sm:hidden"
      />
      <ResponsiveIframe
        width={600}
        height={337}
        className="hidden sm:flex sm:flex-col sm:items-center md:hidden"
      />
      <ResponsiveIframe
        width={700}
        height={394}
        className="hidden md:flex md:flex-col md:items-center lg:hidden"
      />
      <ResponsiveIframe
        width={900}
        height={506}
        className="hidden lg:flex lg:flex-col lg:items-center xl:hidden"
      />
      <ResponsiveIframe
        width={1100}
        height={619}
        className="hidden xl:flex xl:flex-col xl:items-center 2xl:hidden"
      />
      <ResponsiveIframe
        width={1300}
        height={731}
        className="hidden 2xl:flex 2xl:flex-col 2xl:items-center"
      />
    </>
  );
}
