"use client";

import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            {/* Use asChild to avoid nested button error */}
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" className="cursor-pointer p-2">
                    <>
                    <IoSunnyOutline className="dark:hidden block text-lg" />
                    <IoMoonOutline className="dark:block hidden text-lg" />
                    </>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-36">
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer"  onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer"  onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ThemeSwitch;
