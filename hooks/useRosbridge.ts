import { useEffect, useState, useMemo } from "react";
import ROSLIB, { Message, Ros, Topic } from "roslib";

const useRosbridge = (url: string) => {
    const [connected, setConnected] = useState<boolean>(false);
    const [detectedImage, setDetectedImage] = useState<string>("");
    const [dataSTM32, setDataSTMM32] = useState<string>("");
    const [rosPublish, setRosPublish] = useState<Topic<Message>>();

    const ros = useMemo(() => new Ros({ url }), [url]);

    useEffect(() => {
        ros.on("connection", () => {
            console.log("Connected to ROS");
            setConnected(true);
        });

        ros.on("error", (error: any) => {
            console.error("Error connecting to ROS:", error);
            setConnected(false);
        });

        ros.on("close", () => {
            console.log("Disconnected from ROS");
            setConnected(false);
        });

        return () => {
            ros.close();
        };
    }, [ros]);

    useEffect(() => {
        const image_listener = new ROSLIB.Topic({
            ros: ros,
            name: "/detection_image",
            messageType: "sensor_msgs/CompressedImage",
        });

        const stm32_listener = new ROSLIB.Topic({
            ros: ros,
            name: "/stm32_topic",
            messageType: "std_msgs/String",
        });

        const publisher = new ROSLIB.Topic({
            ros: ros,
            name: "/ui_control",
            messageType: "std_msgs/String",
        });

        setRosPublish(publisher);
        

        image_listener.subscribe((message: any) => {
            // Change the detected image to base64
            setDetectedImage(message.data);
        });

        stm32_listener.subscribe((message: any) => {
            setDataSTMM32(message.data);
        });

        return () => {
            image_listener.unsubscribe();
            stm32_listener.unsubscribe();
        };
    }, [ros]);

    return { connected, detectedImage, dataSTM32, rosPublish };
};

export default useRosbridge;
