"use client";

import { useRouter } from "next/navigation";

const NavBar = () => {
  const router = useRouter();
  const handleHomeRoute = () => {
    router.push("/");
  };

  return (
    <div className="navbar bg-base-100">
      <button
        className="btn btn-ghost normal-case text-xl"
        onClick={handleHomeRoute}
      >
        Pocket<b>PR</b>
      </button>
    </div>
  );
};

export default NavBar;
