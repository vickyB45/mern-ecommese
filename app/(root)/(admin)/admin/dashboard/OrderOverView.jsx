"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart"

const chartData = [
  { month: "January", amount: 186 },
  { month: "February", amount: 305 },
  { month: "March", amount: 237 },
  { month: "April", amount: 738 },
  { month: "May", amount: 209 },
  { month: "June", amount: 1394 },
  { month: "july", amount: 490 },
  { month: "August", amount: 190 },
  { month: "September", amount: 500 },
  { month: "October", amount: 650 },
  { month: "November", amount: 1190 },
  { month: "December", amount: 1909 },
]

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#8853eb",
  },
} 

export function OrderOverView() {
  return (
    <div>
        
    <CardContent className='p-0'>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent  />}
            />
            <Bar dataKey="amount" fill="#8853eb" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
