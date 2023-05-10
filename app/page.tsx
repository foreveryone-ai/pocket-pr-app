import Link from "next/link";

export default function Home() {
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
              Silence the <i>noise</i> and turn <u>feedback</u> into <b>fame</b>
              .
            </h1>
            <p className="mb-6 text-lg">
              PocketPR analyzes digital interactions to create a robust
              understanding of your public image in order to guide your decision
              making to maximize your bottom line.
            </p>

            <Link className="btn" href="/dashboard">
              Sign-In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
