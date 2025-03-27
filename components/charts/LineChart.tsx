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

const listChartConfigByType:{[key: string]: any} = {
    x_graph: {
        xError: {
            label: "X Set",
            color: "hsl(var(--chart-1))",
        },
        // xReal: {
        //     label: "X Real",
        //     color: "hsl(var(--chart-2))",
        // },
    } satisfies ChartConfig,
    y_graph: {
        yError: {
            label: "Y Error",
            color: "hsl(var(--chart-1))",
        },
        // yReal: {
        //     label: "Y Real",
        //     color: "hsl(var(--chart-2))",
        // },
    } satisfies ChartConfig,
}
const mapChartDataByType:{[key: string]: string[]} = {
    x_graph: ["xError", "xReal", "X (m)"],
    y_graph: ["yError", "yReal", "Y (m)"],
}

export function LineChartRos({ type="x_graph" }: { type: string }) {
    const { graph_listener } = useRosContext();
    const [chartDataX, setChartDataX] = useState<{ xError: number }[]>(
        []
    );
    const [chartDataY, setChartDataY] = useState<{ yError: number }[]>(
        []
    );

    const chartConfig = listChartConfigByType[type];
    const [dataKey1, dataKey2, label] = mapChartDataByType[type];
    const chartData = type === "x_graph" ? chartDataX : chartDataY;
    console.log(`Type chart: ${type}`);

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

            setChartDataX((prev) => [...prev, { xError: xSet - xReal }]);
            setChartDataY((prev) => [...prev, { yError: ySet - yReal }]);
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
                            {/* <Line
                                dataKey={dataKey2}
                                type="natural"
                                stroke={`var(--color-${dataKey2})`}
                                strokeWidth={1}
                                dot={false}
                                activeDot={{
                                    r: 6,
                                }}
                            /> */}
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </section>
    );
}
