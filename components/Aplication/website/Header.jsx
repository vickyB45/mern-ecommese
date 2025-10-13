"use client";
import {
  USER_DASHBOARD,
  WEBSITE_HOME,
  WEBSITE_LOGIN,
} from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoIosSearch } from "react-icons/io";
import Cart from "./Cart";
import { MdAccountCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { LuMenu } from "react-icons/lu";

const Header = () => {
  const auth = useSelector((store) => store.authStore.auth);
  return (
    <div>
      <div className="bg-white border-b lg:px-22 xl:px-32 px-4 ">
        <div className="flex justify-between items-center lg:py-4  py-2">
          <Link href={WEBSITE_HOME}>
            <Image
              className="lg:w-26 w-22`"
              src="/assets/images/logo-black.png"
              width={383}
              height={146}
              alt="logo"
            />
          </Link>

          <div className="flex justify-between gap-10">
            <nav className=" flex justify-between items-center gap-10">
           
              <ul className=" hidden lg:flex items-center gap-6">
                <li>
                  <Link href={WEBSITE_HOME}>Men's Collections</Link>
                </li>
                <li>
                  <Link href={WEBSITE_HOME}>Women's Collections</Link>
                </li>
                <li>
                  <Link href={WEBSITE_HOME}>Footwares</Link>
                </li>
                <li>
                  <Link href={WEBSITE_HOME}>Accessories</Link>
                </li>
              </ul>
              <div className="flex justify-between items-center gap-6">
                <button type="button">
                  <IoIosSearch
                    className="text-zinc-500 hover:text-primary  cursor-pointer"
                    size={20}
                  />
                </button>
                <Cart />
                   <div className="flex justify-center items-center cursor-pointer hover:text-primary">
                <button className="lg:hidden" type="button">
                  <LuMenu size={25}/>
                </button>
              </div>

                {!auth ? (
                  <Link href={WEBSITE_LOGIN}>
                    <MdAccountCircle
                      className="text-zinc-500 hover:text-primary  cursor-pointer"
                      size={25}
                    />
                  </Link>
                ) : (
                  <Link href={USER_DASHBOARD}>
                    <Avatar>
                      <AvatarImage
                        src={auth?.avatar?.url || "/assets/images/user.png"}
                      />
                    </Avatar>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
