"use client";

import React, { useState } from "react";
import { navigationList } from "./navigationList.constants";
import Link from "next/link";

const Aside = () => {
    const navList = Object.keys(navigationList);
    const [activeMenu, setActiveMenu] = useState("");

    return (
        <aside className="w-[20%] h-full bg-black/30 fixed left-0 top-[60px] p-6">
            {navList.map((nav) => (
                <ul
                    key={nav}
                    className="border-b space-y-2 border-white/20 pb-4"
                >
                    {navigationList[nav].map((nav) => (
                        <li key={nav.name}>
                            <Link
                                href={nav.path}
                                className={`
                                    flex items-center px-2 py-2 rounded-lg hover:bg-blue-400
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
                                <span className="text-black text-[15px]">
                                    {nav.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ))}
        </aside>
    );
};

export default Aside;
