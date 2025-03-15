import { useEffect, useState, useMemo } from "react";
import ROSLIB, { Message, Ros, Topic } from "roslib";

const useRosbridge = (url: string) => {
    const [connected, setConnected] = useState<boolean>(false);
    const [rosPublish, setRosPublish] = useState<Topic<Message>>();

    // Listeners
    const [image_listener, setImageListener] = useState<Topic<Message>>();
    const [stm32_listener, setStm32Listener] = useState<Topic<Message>>();
    const [graph_listener, setGraphListener] = useState<Topic<Message>>();

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

        const graph_listener = new ROSLIB.Topic({
            ros: ros,
            name: "/standley_output",
            messageType: "std_msgs/String",
        });

        const publisher = new ROSLIB.Topic({
            ros: ros,
            name: "/ui_control",
            messageType: "std_msgs/String",
        });

        setRosPublish(publisher);
        setImageListener(image_listener);
        setStm32Listener(stm32_listener);
        setGraphListener(graph_listener);

        return () => {
            ros.close();
            stm32_listener.unsubscribe();
            image_listener.unsubscribe();
            graph_listener.unsubscribe();
        };
    }, [ros]);


    return { connected, rosPublish, image_listener, stm32_listener, graph_listener };
};

export default useRosbridge;
