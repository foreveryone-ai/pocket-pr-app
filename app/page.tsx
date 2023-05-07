"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  // const handleDashboard = () => {
  //   router.push("/Dashboard");
  // };
  const handleWaitlist = () => {
    router.push("https://wy0877gswx3.typeform.com/c/uL4EZIXe");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 bg-secondary">
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1610337673044-720471f83677?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1072&q=80")`,
        }}
      >
        <div className="hero-overlay bg-opacity-75"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Turn down the <i>noise</i> & turn <u>feedback</u> into <b>fame</b>
              .
            </h1>
            <p className="mb-6 text-lg">
              PocketPR analyzes digital interactions to create a robust
              understanding of your public image in order to guide your decision
              making to maximize your bottom line.
            </p>
            <div className="p-5">
              Join <b>The Waitlist</b>
            </div>

            <button className="btn" onClick={handleWaitlist}>
              Sign-Up
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
