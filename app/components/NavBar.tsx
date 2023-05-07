"use client";

import { useRouter } from "next/navigation";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const NavBar = () => {
  const router = useRouter();
  const handleHomeRoute = () => {
    router.push("/");
  };
  const handleDashboardRoute = () => {
    router.push("/Dashboard");
  };

  return (
    <div className="navbar bg-primary">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-secondary rounded-box w-52"
          >
            <li>
              <button onClick={handleDashboardRoute}>Dashboard</button>
            </li>
            {/* <li><a>About</a></li>
            <li><a>Contact</a></li> */}
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <button
          className="btn btn-ghost normal-case text-xl"
          onClick={handleHomeRoute}
        >
          Pocket<b>PR</b>
        </button>
      </div>
      <div className="navbar-end pr-3">
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
