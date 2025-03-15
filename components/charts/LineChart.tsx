"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useRosContext } from "@/contexts/useRosContext";
import { useEffect, useState } from "react";

const chartConfig = {
    set: {
        label: "Set",
        color: "hsl(var(--chart-1))",
    },
    real: {
        label: "Real",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function LineChartRos() {
    const { graph_listener } = useRosContext();
    const [chartData, setChartData] = useState<{ set: number; real: number }[]>([]);

    useEffect(() => {
        if (!graph_listener) return;
    
        const callback = (message: any) => {
            const dataGraphArray = message.data.split(":");
            const isFromStandley = dataGraphArray[1] === "6";
            if (!isFromStandley) return;
            
            const set = parseFloat(dataGraphArray[2]);  
            const real = parseFloat(dataGraphArray[3]);

            setChartData((prev) => [...prev, { set, real }]);
        };
    
        graph_listener.subscribe(callback);
    
        return () => {
            graph_listener.unsubscribe(callback);
        };
    }, [graph_listener]);


    return (
        <section className="mt-2 w-full">
            <Card className="max-w-[700px] h-[250px]">
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            width={20}
                            height={10}
                            accessibilityLayer
                            data={chartData}
                            margin={{ top: 30, left: 5, bottom: 150 }}
                        >
                            <CartesianGrid />
                            <XAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                label={{ 
                                    value: 'Time (s)', 
                                    angle: 0, 
                                    position: 'bottom', 
                                    style: { textAnchor: 'middle' } 
                                }}
                            />
                            <YAxis 
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                domain={[-4, 4]}
                                allowDataOverflow={true}
                                label={{ 
                                    value: 'Steering angle (rad)', 
                                    angle: -90, 
                                    position: 'insideLeft', 
                                    style: { textAnchor: 'middle' } 
                                }} 
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey="set"
                                type="natural"
                                stroke="var(--color-set)"
                                strokeWidth={1}
                                dot={false}
                                activeDot={{
                                    r: 2,
                                }}
                            />
                            <Line
                                dataKey="real"
                                type="natural"
                                stroke="var(--color-real)"
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
