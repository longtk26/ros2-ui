"use client";

import { useRosContext } from "@/contexts/useRosContext";
import { LineChartRos } from "../charts/LineChart";
import { useEffect, useState } from "react";

const MapCrossTrack = () => {
    const { dataSTM32 } = useRosContext();
    const [distanceToClosestPoint, setDistanceToClosestPoint] = useState(0);
    const [distanceToGoal, setDistanceToGoal] = useState(0);
    const [stanleyAngle, setStanleyAngle] = useState(0);
    const [IMUAngle, setIMUAngle] = useState(0);
    const [headingRef, setHeadingRef] = useState(0);
    const [thetaD, setThetaD] = useState(0);


    useEffect(() => {
        if (dataSTM32) {
            const dataSTM32array = dataSTM32.split(":");
            console.log(`dataSTM32array::::: ${dataSTM32array}`);
            const isFromStandley = dataSTM32array[1] === "5";
            if (!isFromStandley) return;
            
            setThetaD(parseFloat(dataSTM32array[7]));
            setHeadingRef(parseFloat(dataSTM32array[6]));
            setIMUAngle(parseFloat(dataSTM32array[5]));
            setDistanceToClosestPoint(parseFloat(dataSTM32array[4]));
            setDistanceToGoal(parseFloat(dataSTM32array[3]));
            setStanleyAngle(parseFloat(dataSTM32array[2]));
        }
    }, [dataSTM32]);

    return (
        <section className="flex justify-between items-center">
            <LineChartRos />
            <div className="bg-white p-2 rounded-lg text-sm mr-12 h-[80%]">
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
