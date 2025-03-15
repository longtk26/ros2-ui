"use client";

import { useRosContext } from "@/contexts/useRosContext";
import { LineChartRos } from "../charts/LineChart";
import { useEffect, useState } from "react";

const MapCrossTrack = () => {
    const { graph_listener } = useRosContext();
    const [distanceToClosestPoint, setDistanceToClosestPoint] = useState(0);
    const [distanceToGoal, setDistanceToGoal] = useState(0);
    const [stanleyAngle, setStanleyAngle] = useState(0);
    const [IMUAngle, setIMUAngle] = useState(0);
    const [headingRef, setHeadingRef] = useState(0);
    const [thetaD, setThetaD] = useState(0);

    useEffect(() => {
        if (!graph_listener) return;
    
        const callback = (message: any) => {
            const dataGraphArray = message.data.split(":");
            const isFromStandley = dataGraphArray[1] === "5";
            if (!isFromStandley) return;
            
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
            <LineChartRos />
            <div className="bg-white p-2 rounded-lg text-sm mr-12 h-[80%] w-[30%]">
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
            </div>
            
        </section>
    );
};

export default MapCrossTrack;
