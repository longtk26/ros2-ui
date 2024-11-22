"use client";

import { sendDetectAndFollowSignal } from "@/apis/http.api";
import { Button } from "@/components/ui/button";
import useWebsocket from "@/hooks/useWebsocket";
import Image from "next/image";

export default function Home() {
    const { message, sendMessage } = useWebsocket("ws://localhost:8765");
    const handleOnclick = async () => {
        await sendDetectAndFollowSignal("ON");
    };

    const srcImage = message
        ? `data:image/jpeg;base64,${message}`
        : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

    return (
        <main className="w-[80%] fixed top-[60px] h-full right-0 bg-black/10">
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
