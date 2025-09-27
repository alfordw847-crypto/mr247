"use client";
import { siteConfig, socials } from "@/config/site";
import footerImage from "@/public/images/footer.jpg";

import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative bg-primary-100 dark:bg-default-50">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={footerImage}
          alt="Footer background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-20 dark:opacity-10"
        />
        <div className="absolute inset-0 bg-primary-900/10 dark:bg-default-100/90"></div>
      </div>

      {/* Content */}
      <div className="container pt-16   relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo and social links */}
          <div className="w-full max-w-xl mx-auto flex flex-col items-start text-default-600">
            <span className="text-primary-500 font-medium text-xl">
              {siteConfig?.siteName}
            </span>

            <p className="text-base text-default-600 mt-3">
              Effortlessly schedule your medical appointments with Doccure.
              Connect with healthcare professionals, manage appointments &
              prioritize your well being
            </p>

            <div className="my-8 flex items-center justify-center flex-wrap gap-5">
              {socials.map((item, index) => (
                <Link
                  href={item.href}
                  key={`social-link-${index}`}
                  target="_blank"
                >
                  <Image
                    src={item.icon}
                    alt="social"
                    width={30}
                    height={30}
                    priority={true}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* For Patients */}
          <div className="w-full max-w-xl mx-auto flex flex-col text-default-600 dark:text-default-600 space-y-2">
            <h1 className="text-lg font-bold">Important Links</h1>
            <ul className="space-y-2">
              {/* <li className="text-md w-full group transition duration-300 ease-out hover:translate-x-2 cursor-pointer">
                <Link href="/privacy-policy">Privacy policy</Link>
              </li>
              <li className="text-md w-full group transition duration-300 ease-out hover:translate-x-2 cursor-pointer">
                <Link href="/terms-condition">Terms & Conditions</Link>
              </li> */}
              <li className="text-md w-full group transition duration-300 ease-out hover:translate-x-2 cursor-pointer">
                <Link href="/about">About Us</Link>
              </li>
              <li className="text-md w-full group transition duration-300 ease-out hover:translate-x-2 cursor-pointer">
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full max-w-xl mx-auto flex flex-col text-default-600 dark:text-default-600 space-y-2">
            <h1 className="text-lg font-bold">Contact Us</h1>
            <ul>
              <li className="text-md w-full group transition duration-300 ease-out hover:translate-x-2 cursor-pointer">
                {siteConfig?.contact?.phone}
              </li>
              <li className="text-md w-full group transition duration-300 ease-out hover:translate-x-2 cursor-pointer">
                {siteConfig?.contact?.email}
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
      </div>
      <div className="relative bg-primary-900 dark:bg-default-50 py-6  ">
        <div className="container flex flex-col text-center md:text-start md:flex-row gap-2">
          <p className="text-default-200 flex-1 text-base font-medium">
            COPYRIGHT &copy; {siteConfig?.siteName} All rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
