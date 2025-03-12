"use client";

import { useRosContext } from "@/contexts/useRosContext";
import { LineChartRos } from "../charts/LineChart";
import { useEffect, useState } from "react";

const MapCrossTrack = () => {
    const { dataSTM32 } = useRosContext();
    const [distanceToClosestPoint, setDistanceToClosestPoint] = useState(0);
    const [distanceToGoal, setDistanceToGoal] = useState(0);
    const [stanleyAngle, setStanleyAngle] = useState(0);

    useEffect(() => {
        if (dataSTM32) {
            const dataSTM32array = dataSTM32.split(":");
            const isFromStandley = dataSTM32array[1] === "4";
            if (!isFromStandley) return;
            
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
            </div>
        </section>
    );
};

export default MapCrossTrack;
