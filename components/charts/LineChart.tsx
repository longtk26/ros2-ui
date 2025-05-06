"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useRosContext } from "@/contexts/useRosContext";
import { useEffect, useState } from "react";

const listChartConfigByType: { [key: string]: any } = {
    x_graph: {
        xSet: {
            label: "X Set",
            color: "hsl(var(--chart-1))",
        },
        xReal: {
            label: "X Real",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig,
    y_graph: {
        ySet: {
            label: "Y Set",
            color: "hsl(var(--chart-1))",
        },
        yReal: {
            label: "Y Real",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig,
    cross_track_graph: {
        crossTrack: {
            label: "Cross Track",
            color: "hsl(var(--chart-1))",
        },
        averageCrossTrack: {
            label: "Average Cross Track",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig,
};
const mapChartDataByType: { [key: string]: string[] } = {
    x_graph: ["xSet", "xReal", "X (m)"],
    y_graph: ["ySet", "yReal", "Y (m)"],
    cross_track_graph: ["crossTrack", "averageCrossTrack", "Cross Track (m)"],
};

export function LineChartRos({
    type = "x_graph",
}: {
    type: "x_graph" | "y_graph" | "cross_track_graph";
}) {
    const { graph_listener } = useRosContext();
    const [chartDataX, setChartDataX] = useState<
        { xSet: number; xReal: number }[]
    >([]);
    const [chartDataY, setChartDataY] = useState<
        { ySet: number; yReal: number }[]
    >([]);
    const [chartCrossTrack, setChartCrossTrack] = useState<
        { crossTrack: number; averageCrossTrack: number }[]
    >([]);

    const chartConfig = listChartConfigByType[type];
    const [dataKey1, dataKey2, label] = mapChartDataByType[type];

    let chartData: any[] = [];
    switch (type) {
        case "x_graph":
            chartData = chartDataX;
            break;
        case "y_graph":
            chartData = chartDataY;
            break;
        case "cross_track_graph":
            chartData = chartCrossTrack;
            break;
        default:
            chartData = [];
    }

    useEffect(() => {
        if (!graph_listener) return;

        const callback = (message: any) => {
            const dataGraphArray = message.data.split(":");
            const isFromStandley = dataGraphArray[1] === "6";
            if (!isFromStandley) return;

            const xSet = parseFloat(dataGraphArray[2]);
            const xReal = parseFloat(dataGraphArray[3]);
            const ySet = parseFloat(dataGraphArray[4]);
            const yReal = parseFloat(dataGraphArray[5]);
            const crossTrack = parseFloat(dataGraphArray[6]);
            const averageCrossTrack = parseFloat(dataGraphArray[7]);

            setChartDataX((prev) => [...prev, { xSet, xReal }]);
            setChartDataY((prev) => [...prev, { ySet, yReal }]);
            setChartCrossTrack((prev) => {
                const newCross = prev.map((item) => ({
                    crossTrack: item.crossTrack,
                    averageCrossTrack: averageCrossTrack,
                }));

                return [...newCross, { crossTrack, averageCrossTrack }];
            });
        };

        graph_listener.subscribe(callback);

        return () => {
            graph_listener.unsubscribe(callback);
        };
    }, [graph_listener]);

    return (
        <section className="mt-2 w-full">
            <Card className="max-w-[600px] h-[250px]">
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            width={20}
                            height={10}
                            accessibilityLayer
                            data={chartData}
                            margin={{ top: 30, left: 5, bottom: 80 }}
                        >
                            <CartesianGrid />
                            <XAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                label={{
                                    value: "Time (s)",
                                    angle: 0,
                                    position: "bottom",
                                    style: { textAnchor: "middle" },
                                }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                domain={[-2, 2]}
                                allowDataOverflow={true}
                                label={{
                                    value: label,
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { textAnchor: "middle" },
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey={dataKey1}
                                type="natural"
                                stroke={`var(--color-${dataKey1})`}
                                strokeWidth={1}
                                dot={false}
                                activeDot={{
                                    r: 2,
                                }}
                            />
                            <Line
                                dataKey={dataKey2}
                                type="natural"
                                stroke={`var(--color-${dataKey2})`}
                                strokeWidth={1}
                                dot={false}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </section>
    );
}
