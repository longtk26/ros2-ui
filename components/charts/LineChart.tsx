"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useRosContext } from "@/contexts/useRosContext";
import { useEffect, useState } from "react";

ChartJS.register(
    CategoryScale,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const LineChart = () => {
    // frame data stm32: s:1:2:<angle_value>:<velocity_value>:e
    const { dataSTM32 } = useRosContext();
    const dataSplitFromSTM32 = dataSTM32.split(":");
    const [velocityValues, setVelocityValues] = useState(new Array(1000).fill(0));
    const [timeLabels, setTimeLabels] = useState(
        Array.from({ length: 1000 }, () => new Date().toLocaleTimeString()) // Initialize with current time
    );

    useEffect(() => {
        if (dataSplitFromSTM32.length === 5) {
            const newVelocity = parseFloat(dataSplitFromSTM32[4]); // Extract velocity
            const tempVelocity = velocityValues.slice(1); // Shift out the first value
            const tempTime = timeLabels.slice(1); // Shift out the first time label

            tempVelocity.push(newVelocity); // Add new velocity
            tempTime.push(new Date().toLocaleTimeString()); // Add current time

            setVelocityValues([...tempVelocity]);
            setTimeLabels([...tempTime]);
        }
    }, [dataSTM32]);

    const data = {
        labels: timeLabels, // Use real-time labels
        datasets: [
            {
                label: "Velocity (m/s)",
                data: velocityValues,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Velocity (m/s)",
                },
                min: 0,
                max: 4,
            },
            x: {
                title: {
                    display: true,
                    text: "Time (HH:MM:SS)", // Updated to show real-time format
                },
            },
        },
    };

    return (
        <div className="right-8 top-20 fixed" style={{ width: "1000px", margin: "0 auto" }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;
