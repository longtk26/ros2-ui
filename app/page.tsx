"use client";

import { Button } from "@/components/ui/button";
import { useRosContext } from "@/contexts/useRosContext";
import Image from "next/image";
import ROSLIB from "roslib";

export default function Home() {
    const { detectedImage, rosPublish, dataSTM32 } = useRosContext();
    const handleOnclick = () => {
        const message = new ROSLIB.Message({ data: "start_follow" });
        rosPublish?.publish(message);
    };

    const srcImage = detectedImage
        ? `data:image/jpeg;base64,${detectedImage}`
        : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

    return (
        <main className="w-[80%] fixed top-[60px] h-full right-0 bg-black/10">
            
            <section className="pl-6 mt-6">
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
            <section className="mt-6">
                <h1 className="text-2xl font-bold">Data from STM32:</h1>
                <p>{dataSTM32}</p>
            </section>
        </main>
    );
}
