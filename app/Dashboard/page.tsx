import { auth, currentUser } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = auth();
  const user = await currentUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-primary-content">
      <div className="p-5">
        Hello, {user?.firstName}. Welcome to <b>PocketPR</b>. Your user ID is{" "}
        {userId}.
      </div>
    </main>
  );
}
