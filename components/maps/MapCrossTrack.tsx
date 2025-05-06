"use client";

import { useRosContext } from "@/contexts/useRosContext";
import { LineChartRos } from "../charts/LineChart";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const ListTabs = [
    {
        id: "x_graph",
        name: "Tab1",
    },
    {
        id: "y_graph",
        name: "Tab2",
    },
    {
        id: "cross_track_graph",
        name: "Tab3",
    },
];

const MapCrossTrack = () => {
    const { graph_listener } = useRosContext();
    const [distanceToClosestPoint, setDistanceToClosestPoint] = useState(0);
    const [distanceToGoal, setDistanceToGoal] = useState(0);
    const [stanleyAngle, setStanleyAngle] = useState(0);
    const [IMUAngle, setIMUAngle] = useState(0);
    const [headingRef, setHeadingRef] = useState(0);
    const [thetaD, setThetaD] = useState(0);
    const [closestX, setClosestX] = useState(0);
    const [closestY, setClosestY] = useState(0);

    const [activeTab, setActiveTab] = useState("x_graph");

    useEffect(() => {
        if (!graph_listener) return;

        const callback = (message: any) => {
            const dataGraphArray = message.data.split(":");
            const isFromStandley = dataGraphArray[1] === "5";
            if (!isFromStandley) return;

            setClosestY(parseFloat(dataGraphArray[9]));
            setClosestX(parseFloat(dataGraphArray[8]));
            setThetaD(parseFloat(dataGraphArray[7]));
            setHeadingRef(parseFloat(dataGraphArray[6]));
            setIMUAngle(parseFloat(dataGraphArray[5]));
            setDistanceToClosestPoint(parseFloat(dataGraphArray[4]));
            setDistanceToGoal(parseFloat(dataGraphArray[3]));
            setStanleyAngle(parseFloat(dataGraphArray[2]));
        };

        graph_listener.subscribe(callback);

        return () => {
            graph_listener.unsubscribe(callback);
        };
    }, [graph_listener]);

    return (
        <section className="flex justify-between items-center">
            <div className="w-full relative">
                <div className="flex flex-col items-center gap-2 absolute right-[100px] text-[12px] top-[50%] transform translate-y-[-50%]">
                    {ListTabs.map((tab) => (
                        <Button
                            key={tab.id}
                            className={`text-[12px] p-2 bg-white text-gray-400 hover:bg-black/10 hover:text-white ${
                                activeTab === tab.id
                                    ? "bg-black/10 text-black"
                                    : ""
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.name}
                        </Button>
                    ))}
                </div>
                <LineChartRos
                    type={
                        activeTab as "x_graph" | "y_graph" | "cross_track_graph"
                    }
                />
            </div>
            <div className="bg-white p-2 rounded-lg text-sm mr-12 h-[80%] w-[48%]">
                <p className="font-bold">
                    Distance to closest point:
                    <span className="font-normal">
                        {" "}
                        {distanceToClosestPoint} {"(m)"}
                    </span>
                </p>
                <p className="font-bold">
                    Distance to goal:
                    <span className="font-normal">
                        {" "}
                        {distanceToGoal} {"(m)"}
                    </span>
                </p>
                <p className="font-bold">
                    Stanley angle:
                    <span className="font-normal">
                        {" "}
                        {stanleyAngle} {"(rad)"}
                    </span>
                </p>
                <p className="font-bold">
                    IMU angle:
                    <span className="font-normal">
                        {" "}
                        {IMUAngle} {"(rad)"}
                    </span>
                </p>
                <p className="font-bold">
                    Heading ref:
                    <span className="font-normal">
                        {" "}
                        {headingRef} {"(rad)"}
                    </span>
                </p>
                <p className="font-bold">
                    ThetaD:
                    <span className="font-normal">
                        {" "}
                        {thetaD} {"(rad)"}
                    </span>
                </p>
                <p className="font-bold">
                    ClosestX:
                    <span className="font-normal">
                        {" "}
                        {closestX} {"(m)"}
                    </span>
                </p>
                <p className="font-bold">
                    ClosestY:
                    <span className="font-normal">
                        {" "}
                        {closestY} {"(m)"}
                    </span>
                </p>
            </div>
        </section>
    );
};

export default MapCrossTrack;
