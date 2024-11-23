"use client";

import React, { use, useState } from "react";
import { navigationList } from "./navigationList.constants";
import Link from "next/link";
import { useRosContext } from "@/contexts/useRosContext";

const Aside = () => {
    const { connected } = useRosContext();

    const navList = Object.keys(navigationList);
    const [activeMenu, setActiveMenu] = useState("");

    return (
        <aside className="w-[20%] h-full bg-black/10 fixed left-0 top-[60px] p-6 border-r-black border-r">
            {navList.map((nav) => (
                <ul key={nav} className="border-b space-y-2 border-black pb-4">
                    {navigationList[nav].map((nav) => (
                        <li key={nav.name}>
                            <Link
                                href={nav.path}
                                className={`
                                    flex items-center px-2 py-2 rounded-lg hover:bg-blue-400
                                    bg-black
                                    ${
                                        nav.path === activeMenu
                                            ? "bg-blue-400 font-bold"
                                            : ""
                                    }
                                `}
                                onClick={() => {
                                    setActiveMenu(nav.path);
                                    localStorage.setItem(
                                        "activeMenu",
                                        nav.path
                                    );
                                }}
                            >
                                <span className="text-white text-[15px]">
                                    {nav.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ))}
            <p className="flex gap-4 mt-6">
                <span className="font-bold">Jetson status</span>
                <span
                    className={`${
                        connected ? "text-green-500" : "text-red-500"
                    } font-bold`}
                >
                    {connected ? "Connected" : "Disconnected"}
                </span>
            </p>
        </aside>
    );
};

export default Aside;
