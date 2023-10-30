"use client";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@nextui-org/react";
import { useState } from "react";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = ["Dashboard", "settings", "help"];

  return (
    <>
      {/* -------------------------SIGNED-IN------------------------- */}
      <SignedIn>
        <Navbar
          className="bg-black"
          onMenuOpenChange={setIsMenuOpen}
          style={{ zIndex: 9999 }}
        >
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="sm:hidden"
            />
            <NavbarBrand>
              <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <Link color="foreground" href="#">
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link href="#" aria-current="page">
                Settings
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="#">
                Help
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <UserButton />
            </NavbarItem>
          </NavbarContent>
          <NavbarMenu className="bg-black">
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color={
                    index === 2
                      ? "primary"
                      : index === menuItems.length - 1
                      ? "danger"
                      : "foreground"
                  }
                  className="w-full"
                  href="#"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </Navbar>
      </SignedIn>
      {/* -------------------------SIGNED-OUT------------------------- */}
      <SignedOut>
        <Navbar
          className="bg-black"
          onMenuOpenChange={setIsMenuOpen}
          style={{ zIndex: 9999 }}
        >
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="sm:hidden"
            />
            <NavbarBrand>
              <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <Link color="foreground" href="#">
                Features
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link href="#" aria-current="page">
                Customers
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="#">
                Integrations
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="/sign-in">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/sign-up" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
          <NavbarMenu className="bg-black">
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color={
                    index === 2
                      ? "primary"
                      : index === menuItems.length - 1
                      ? "danger"
                      : "foreground"
                  }
                  className="w-full"
                  href="#"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </Navbar>
      </SignedOut>
    </>
  );
}

// import Image from "next/image";
// import Link from "next/link";
// import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
// import { Button } from "@nextui-org/button";
// import { Spacer } from "@nextui-org/spacer";
// import {
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownSection,
//   DropdownItem,
// } from "@nextui-org/dropdown";
// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarItem,
//   NavbarMenuToggle,
//   NavbarMenu,
//   NavbarMenuItem,
// } from "@nextui-org/navbar";
// import { useRouter } from "next/navigation";
// import { FaCcStripe } from "react-icons/fa";

// export default function NavBar() {
//   const router = useRouter();

//   const toDashboard = () => {
//     router.push("/Dashboard");
//   };

//   const toSettings = () => {
//     router.push("/settings");
//   };

//   const toHelp = () => {
//     router.push("/help");
//   };

//   const handleStripe = async () => {
//     let res, url;

//     try {
//       res = await fetch("/api/account");
//     } catch (error) {
//       console.error("can't get stripe account");
//       return;
//     }

//     try {
//       url = (await res.json()).url;
//       router.replace(url);
//       return;
//     } catch (error) {
//       console.error("server error");
//       //TODO: either hide this or tell the user something...
//       return;
//     }
//   };
//   return (
//     <>
//       <div className="navbar isSticky bg-green-800 p-4">
//         {/* ----------------------------NAVBAR START---------------------------- */}
//         <NavbarBrand>
//           <SignedIn>
//             <Dropdown backdrop="blur">
//               <DropdownTrigger>
//                 <Button variant="flat" className="text-white">
//                   Menu
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 aria-label="Static Actions"
//                 // disabledKeys={["settings"]}
//               >
//                 <DropdownItem
//                   key="dashboard"
//                   onPress={toDashboard}
//                   className="text-black"
//                   color="default"
//                 >
//                   Dashboard
//                 </DropdownItem>
//                 <DropdownItem
//                   key="settings"
//                   onPress={toSettings}
//                   className="text-black"
//                   color="default"
//                 >
//                   Settings
//                 </DropdownItem>
//                 <DropdownItem
//                   key="help"
//                   onPress={toHelp}
//                   className="text-black"
//                   color="default"
//                 >
//                   Get Help
//                 </DropdownItem>
//               </DropdownMenu>
//             </Dropdown>
//           </SignedIn>
//         </NavbarBrand>

//         {/* ----------------------------NAVBAR CENTER---------------------------- */}
//         <Link href="/">
//           <Button className="navbar-center bg-gradient-to-tr from-orange-600 to-yellow-300 text-white shadow-lg">
//             <Image
//               src="/pocket-pr-text.svg"
//               alt="panda logo"
//               width={75}
//               height={50}
//             />
//           </Button>
//         </Link>

//         {/* ----------------------------NAVBAR END---------------------------- */}
//         <div className="navbar-end mr-2">
//           <SignedIn>
//             <Button isIconOnly variant="light" onPress={handleStripe}>
//               <FaCcStripe size={40} color="white" />
//             </Button>
//             <div className="px-2" />
//             <UserButton />
//           </SignedIn>
//           <SignedOut>
//             <Link href="/sign-up">
//               <Button variant="light" className="hidden md:block text-white">
//                 Sign Up
//               </Button>
//             </Link>
//             <Spacer x={1} />
//             <Link href="/sign-in">
//               <Button color="success" variant="solid">
//                 Sign In
//               </Button>
//             </Link>
//           </SignedOut>
//         </div>
//       </div>
//     </>
//   );
// }
