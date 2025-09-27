"use client";
import { ProfileInfo } from "@/components/partials/header/profile-info";

import { siteConfig } from "@/config/site";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const [scroll, setScroll] = useState<boolean>(false);
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1224px)");
  const { data: session, status } = useSession();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 50);
    });
    return () => window.removeEventListener("scroll", () => {});
  }, []);

  return (
    <div
      className={
        scroll
          ? "bg-card/50 backdrop-blur-lg shadow-xl z-30 dark:bg-card/70 text-black fixed top-0 left-0 w-full py-3"
          : "z-30 fixed   top-0 left-0 w-full py-3 text-default-100"
      }
    >
      <nav className="container flex justify-between items-center">
        <Link href="/" className="flex items-center gap-1">
          {/* <SiteLogo className="h-8 w-8 text-primary" /> */}
          <span className="  font-medium text-xl">{siteConfig.siteName}</span>
        </Link>

        {/* <ul className="flex gap-6">
          {menus?.map((item, i) => (
            <li key={`main-item-${i}`} className="block font-semibold">
              <Link
                href={item.href || ""}
                className={
                  pathname === item.href
                    ? "text-primary font-semibold"
                    : "text-default-600 hover:text-primary text-base transition-colors"
                }
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul> */}

        <div className="flex items-center gap-6">
          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <ProfileInfo />
            </div>
          ) : (
            <div className="flex gap-4 items-center  ">
              <Link href="/auth/sign-in" className="">
                Sign In
              </Link>
              <Link href="/auth/sign-up" className="">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
