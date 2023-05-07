"use client";

import { useRouter } from "next/navigation";
import {
  useUser,
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import { SignIn } from "@clerk/clerk-react";

const NavBar = () => {
  const router = useRouter();
  const handleHomeRoute = () => {
    router.push("/");
  };

  return (
    <div className="navbar bg-primary justify-between p-5">
      <button
        className="btn btn-ghost normal-case text-xl"
        onClick={handleHomeRoute}
      >
        Pocket<b>PR</b>
      </button>
      <div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </div>
  );
};

export default NavBar;
