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
const chartDataActual = [
    { x: 4, y: 186 },
    { x: 3, y: 200 },
    { x: 5, y: 237 },
    { x: 6, y: 73 },
    { x: 7, y: 209 },
    { x: 8, y: 214 },
];

const chartDataCurrent = [
    {actual: 3, current: 186},
];

const chartConfig = {
    actual: {
        label: "Actual",
        color: "hsl(var(--chart-1))",
    },
    current: {
        label: "Current",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function LineChartRos() {
    return (
        <section className="w-[300px] mt-2">
            <Card>
                <CardHeader>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={chartDataActual}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="x"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis 
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey="actual"
                                type="natural"
                                stroke="var(--color-actual)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--color-actual)",
                                }}
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
