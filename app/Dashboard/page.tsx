import { auth } from "@clerk/nextjs";

export default function Home() {
  const { userId } = auth();

  console.log(userId);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-primary-content">
      <div className="p-5">
        Hello, {userId}. Welcome to <b>PocketPR</b>.
      </div>
    </main>
  );
}
