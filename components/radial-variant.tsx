import { RadialBar, Legend, RadialBarChart, ResponsiveContainer } from "recharts"

import { formatCurrency } from "@/lib/utils"

type Props = {
    data: {
        name: string;
        value: number;
    }[]
}


const COLORS = ["#0062FF", "#12C6FF", "#FF647F", "#FF9354"]

export default function RadialVariant({ data }: Props) {

    return (
        <>
            <ResponsiveContainer width="100%" height={350}>
                <RadialBarChart
                    cx="50%"
                    cy="30%"
                    barSize={10}
                    innerRadius="90%"
                    outerRadius="40%"
                    data={
                        data.map((item, index) => ({
                            ...item,
                            fill: COLORS[index % COLORS.length]
                        }))
                    }
                >
                    <RadialBar
                        label={{
                            position: "insideStart",
                            fill: "#fff",
                            fontSize: "12px"
                        }}
                        background
                        dataKey="value"
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="right"
                        iconType="circle"
                        content={({ payload }: any) => {
                            const total = payload.reduce(
                                (sum: number, entry: any) => sum + Number(entry.payload.value || 0),
                                0
                            )

                            console.log(total)
                            return (

                                <ul className="flex flex-col space-y-2">
                                    {payload.map((entry: any, index: number) => {
                                        return (
                                            <li
                                                key={`item-${index}`}
                                                className="flex items-center space-x-2">
                                                <span
                                                    className="size-2 rounded-full"
                                                    style={{ backgroundColor: entry.color }} />
                                                <div className="space-x-1">

                                                    <span className="text-sm text-muted-foreground">
                                                        {entry.value}
                                                    </span>

                                                    <span>{formatCurrency(entry.payload.value)}</span>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )
                        }}
                    />
                </RadialBarChart>
            </ResponsiveContainer>
        </>
    )
}
