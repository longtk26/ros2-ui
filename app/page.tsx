"use client";

import { Button } from "@/components/ui/button";
import useRosbridge from "@/hooks/useRosbridge";
import Image from "next/image";
import ROSLIB from "roslib";

export default function Home() {
    const {connected, detectedImage, rosPublish} = useRosbridge("ws://localhost:9090");
    const handleOnclick = () => {
        const message = new ROSLIB.Message({data: "start_follow"});
        rosPublish?.publish(message);
    };

    const srcImage = detectedImage
        ? `data:image/jpeg;base64,${detectedImage}`
        : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

    return (
        <main className="w-[80%] fixed top-[60px] h-full right-0 bg-black/10">
            <section className="flex justify-between items-center h-16 bg-black text-white">
                <h1 className="pl-6">ROS Web Client</h1>
                <p className="pr-6">{connected ? "Connected" : "Disconnected"}</p>
            </section>
            <section className="pl-6">
                <Image
                    src={srcImage}
                    alt="logo"
                    width={640}
                    height={480}
                    className="h-[480px]"
                />
                <Button className="mt-6" onClick={() => handleOnclick()}>
                    Detect and follow
                </Button>
            </section>
        </main>
    );
}
