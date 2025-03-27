"use client";

import { Button } from "@/components/ui/button";
import { useRosContext } from "@/contexts/useRosContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import ROSLIB from "roslib";

export default function Home() {
    const { image_listener, rosPublish, stm32_listener } = useRosContext();
    const [detectedImage, setDetectedImage] = useState<string | null>(null);
    const handleOnclick = () => {
        const message = new ROSLIB.Message({ data: "start_follow" });
        rosPublish?.publish(message);
    };
    const handleStop = () => {
        const message = new ROSLIB.Message({ data: "stop_follow" });
        rosPublish?.publish(message);
    };

    useEffect(() => {
        if (!stm32_listener || !image_listener) return;

        // stm32_listener?.subscribe((message: any) => {
        //     setDetectedImage(message.data);
        // });

        image_listener?.subscribe((message: any) => {
            setDetectedImage(message.data);
        });

        return () => {
            stm32_listener?.unsubscribe();
            image_listener?.unsubscribe();
        };

    }, [stm32_listener, image_listener]);

    const srcImage = detectedImage
        ? `data:image/jpeg;base64,${detectedImage}`
        : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

    return (
        <main className="w-[80%] fixed top-[60px] h-full right-0 bg-black/10">
            <section className="pl-6 mt-6">
                <div className="flex">
                    <Image
                        src={srcImage}
                        alt="logo"
                        width={640}
                        height={480}
                        className="h-[480px]"
                    />
                    <div className="w-40 h-40"></div>
                </div>
                <Button className="mt-6 mr-6" onClick={() => handleOnclick()}>
                    Detect and follow
                </Button>
                <Button className="mt-6" onClick={() => handleStop()}>
                    STOP
                </Button>
            </section>
        </main>
    );
}
