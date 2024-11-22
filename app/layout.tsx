import type { Metadata } from "next";
import "./globals.css";
import Header from "@/containers/Header/Header";
import Aside from "@/containers/Aside/Aside";

export const metadata: Metadata = {
    title: "Ros2 Web",
    description: "Webapp to control ROS2 robots",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`antialiased h-screen w-full`}>
                <Header />
                <Aside />
                {children}
            </body>
        </html>
    );
}
