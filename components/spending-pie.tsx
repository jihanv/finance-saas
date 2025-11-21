
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSearch, PieChart, Radar, Target } from "lucide-react";
import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import PieVariant from "./pie-variant";


type Props = {
    data?: {
        name: string;
        value: number;
    }[]
}

type ChartType = "pie" | "radar" | "radial"
export default function SpendingPie({ data = [] }: Props) {
    const [chartType, setChartType] = useState<ChartType>("pie")

    const onTypeChange = (type: ChartType) => {
        // Todo Add paywall
        setChartType(type)
    }

    return (
        <>
            <Card className="border-none drop-shadow-sm" >
                <CardHeader className="flex space-y-2 lg:space-y-2 lg:flex-row lg:items-center justify-between">
                    <CardTitle className="text-xl line-clamp-1" >Categories</CardTitle>
                    <Select
                        defaultValue={chartType}
                        onValueChange={onTypeChange}
                    >
                        <SelectTrigger className="lg:w-auto h-9 rounded-md px-3" >
                            <SelectValue placeholder="Chart Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pie">
                                <div className="flex items-center">
                                    <PieChart className="size-4 mr-2 shrink-0" />
                                    <p className="line-clamp-1">Pie Chart</p>
                                </div>
                            </SelectItem>
                            <SelectItem value="radar">
                                <div className="flex items-center">
                                    <Radar className="size-4 mr-2 shrink-0" />
                                    <p className="line-clamp-1">Radar Chart</p>
                                </div>
                            </SelectItem>
                            <SelectItem value="radial">
                                <div className="flex items-center">
                                    <Target className="size-4 mr-2 shrink-0" />
                                    <p className="line-clamp-1">Radial Chart</p>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                {/* to do add select */}
                <CardContent className="" >
                    {data.length === 0
                        ? (<div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full" >
                            <FileSearch className="size-6 text-muted-foreground" />
                            <p className="text-muted-foreground text-sm">No data for this period</p>
                        </div>)
                        : (
                            <>
                                {chartType === "pie" && <PieVariant data={data} />}
                                {/* {chartType === "radar" && <AreaVariant data={data} />}
                                {chartType === "radial" && <BarVariant data={data} />} */}
                            </>
                        )}
                </CardContent>
            </Card>
        </>
    )
}
