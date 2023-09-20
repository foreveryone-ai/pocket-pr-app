"use client";

export default function () {
  return (
    <>
      {/* default */}
      <div className="flex flex-col justify-center items-center sm:hidden ">
        <iframe
          className="rounded-2xl"
          width="350"
          height="197"
          src="https://www.youtube.com/embed/lbcpORKF-Gs?si=BEuhZ4_z6QBpKgFd&amp;controls=0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>

      {/* small minwidth=640px */}
      <div className="hidden sm:flex sm:flex-col sm:items-center md:hidden">
        <iframe
          className="rounded-2xl"
          width="600"
          height="337"
          src="https://www.youtube.com/embed/lbcpORKF-Gs?si=BEuhZ4_z6QBpKgFd&amp;controls=0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>

      {/* medium minwidth=768px */}
      <div className="hidden md:flex md:flex-col md:items-center lg:hidden">
        <iframe
          className="rounded-2xl"
          width="700"
          height="394"
          src="https://www.youtube.com/embed/lbcpORKF-Gs?si=BEuhZ4_z6QBpKgFd&amp;controls=0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>

      {/* large minwidth=1024px */}
      <div className="hidden lg:flex lg:flex-col lg:items-center xl:hidden">
        <iframe
          className="rounded-2xl"
          width="900"
          height="506"
          src="https://www.youtube.com/embed/lbcpORKF-Gs?si=BEuhZ4_z6QBpKgFd&amp;controls=0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>

      {/* xlarge minwidth=1280px */}
      <div className="hidden xl:flex xl:flex-col xl:items-center 2xl:hidden">
        <iframe
          className="rounded-2xl"
          width="1100"
          height="619"
          src="https://www.youtube.com/embed/lbcpORKF-Gs?si=BEuhZ4_z6QBpKgFd&amp;controls=0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>

      {/* 2xl minwidth=1536px */}
      <div className="hidden 2xl:flex 2xl:flex-col 2xl:items-center">
        <iframe
          className="rounded-2xl"
          width="1300"
          height="731"
          src="https://www.youtube.com/embed/lbcpORKF-Gs?si=BEuhZ4_z6QBpKgFd&amp;controls=0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
    </>
  );
}
