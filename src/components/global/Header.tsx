"use client";
import { Navbar } from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const paths = usePathname().split("/");
  const currentActiveRoute = paths[paths.length - 1];

  return (
    <Navbar
      fluid={true}
      rounded={true}
    >
      <Navbar.Brand href="/" as={Link}>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          RochyRD
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link
          href="/"
          active={currentActiveRoute == ""}
          as={Link}
        >
          Home
        </Navbar.Link>
        <Navbar.Link
          href="/albums"
          active={currentActiveRoute == "albums"}
          className="flex flex-row"
          as={Link}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="black"
            viewBox="0 0 496 512"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path d="M248,8C111,8 0,119 0,256C0,393 111,504 248,504C385,504 496,393 496,256C496,119 385,8 248,8ZM88,256L56,256C56,150.1 142.1,64 248,64L248,96C159.8,96 88,167.8 88,256ZM248,352C195,352 152,309 152,256C152,203 195,160 248,160C301,160 344,203 344,256C344,309 301,352 248,352ZM248,224C230.3,224 216,238.3 216,256C216,273.7 230.3,288 248,288C265.7,288 280,273.7 280,256C280,238.3 265.7,224 248,224Z">
            </path>
          </svg>
          Albums
        </Navbar.Link>
        <Navbar.Link
          href="/upload"
          active={currentActiveRoute == "upload"}
          as={Link}
        >
          Upload
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
