"use client";

import React, { use, useState } from "react";
import { navigationList } from "./navigationList.constants";
import Link from "next/link";
import { useRosContext } from "@/contexts/useRosContext";
import { Button } from "@/components/ui/button";
import ROSLIB from "roslib";

const Aside = () => {
    const { connected, rosPublish } = useRosContext();

    const navList = Object.keys(navigationList);
    const [activeMenu, setActiveMenu] = useState("");
    const [onDebugIMU, setOnDebugIMU] = useState(false);

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
            <Button
                className={`mt-4 ${
                    onDebugIMU ? "bg-green-500 hover:bg-gray-400" : "bg-gray-400 hover:bg-green-500"
                }`}
                onClick={() => setOnDebugIMU((prev) => {
                    if (!prev) {
                        const message = new ROSLIB.Message({ data: "debug_imu" });
                        rosPublish?.publish(message);
                    } else {
                        const message = new ROSLIB.Message({ data: "stop_debug_imu" });
                        rosPublish?.publish(message);
                    }
                    return !prev;
                })}
            >
                Debug IMU
            </Button>
        </aside>
    );
};

export default Aside;
