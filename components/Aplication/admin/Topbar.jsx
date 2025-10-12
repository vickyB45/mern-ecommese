"use client";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";
import AdminSearch from "./AdminSearch";
import Image from "next/image";
import AdminMobileSearch from "./AdminMobileSearch";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="sticky z-50 px-3 border-b h-14 w-full top-0 left-0 flex justify-between items-center bg-white dark:bg-card">
      <div className="md:hidden flex items-center">
        <Image
          src="/assets/images/logo-black.png"
          height={50}
          width={60}
          className="block dark:hidden h-[50px] w-auto"
          alt="logo-dark"
        />
        <Image
          src="/assets/images/logo-white.png"
          height={50}
          width={60}
          className="hidden dark:block h-[50px] w-auto"
          alt="logo-dark"
        />
      </div>

      <div className="md:block hidden">
        <AdminSearch />
      </div>
      <div className="flex justify-center items-center gap-2">
        <AdminMobileSearch />
        <ThemeSwitch />
        <UserDropdown />
        <Button
          onClick={toggleSidebar}
          type="button"
          size="icon"
          className="ms-2 cursor-pointer md:hidden  "
        >
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
