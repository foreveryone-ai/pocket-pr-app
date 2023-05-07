import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <SignIn path="/sign-in" routing="path" />
      </main>
    </>
  );
}
