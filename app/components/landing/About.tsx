import Image from "next/image";
export default function About() {
  return (
    <>
      {/* -----------STEP 1------------ */}
      <div className="flex flex-col justify-center align-center">
        <div className="bg-black min-h-screen flex justify-center align-center">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-black gradient-text-dual">
            Close the gap.
          </h1>
        </div>
        <div className="bg-black min-h-screen flex justify-center align-center">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-black gradient-text-dual">
            More than listening.
          </h1>
        </div>
        <div className="bg-black min-h-screen flex justify-center align-center">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-black gradient-text-dual">
            Tailored support.
          </h1>
        </div>
      </div>
    </>
  );
}
