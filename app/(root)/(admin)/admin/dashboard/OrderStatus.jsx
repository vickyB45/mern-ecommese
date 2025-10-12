"use client"

import { Label, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo } from "react"

export const description = "A donut chart"





const chartData = [
  { status: "pending", count: 275, fill: "var(--color-pending)" },
  { status: "processing", count: 200, fill: "var(--color-processing)" },
  { status: "shipped", count: 187, fill: "var(--color-shipped)" },
  { status: "delivered", count: 173, fill: "var(--color-delivered)" },
  { status: "canceled", count: 90, fill: "var(--color-canceled)" },
  { status: "unverified", count: 90, fill: "var(--color-unverified)" },
]


const chartConfig = {
  count: {
    label: "Count",
  },
  pending: {
    label: "Pending",
    color: "#3b82f6",
  },
  processing: {
    label: "Processing",
    color: "#eab308",
  },
  shipped: {
    label: "Shipped",
    color: "#06b6b4",
  },
  delivered: {
    label: "Delivered",
    color: "#22c55e",
  },
  canceled: {
    label: "Canceled",
    color: "#ef4444",
  },
  unverified: {
    label: "Unverified",
    color: "#f97316",
  },
} 

export function OrderStatus() {
    
  return (
    <div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          1143
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                        Total Orders
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div>
            <ul className="select-none">
                <li className="flex justify-between items-center mb-2 text-sm">
                    <span>Pending</span>
                    <span className="rounded-full px-3  dark:text-white text-black py-1 text-xs bg-[#3b82f6]">275</span>
                </li>
                <li className="flex justify-between items-center mb-2 text-sm">
                    <span>processing</span>
                    <span className="rounded-full px-3  dark:text-white text-black py-1 text-xs bg-[#eab308]">275</span>
                </li>
                <li className="flex justify-between items-center mb-2 text-sm">
                    <span>shipped</span>
                    <span className="rounded-full px-3 dark:text-white text-black py-1 text-xs bg-[#06b6b4]">275</span>
                </li>
                <li className="flex justify-between items-center mb-2 text-sm">
                    <span>delivered</span>
                    <span className="rounded-full px-3 dark:text-white text-black py-1 text-xs bg-[#22c55e]">275</span>
                </li>
                <li className="flex justify-between items-center mb-2 text-sm">
                    <span>canceled</span>
                    <span className="rounded-full px-3 dark:text-white text-black py-1 text-xs bg-[#ef4444]">275</span>
                </li>
                <li className="flex justify-between items-center mb-2 text-sm">
                    <span>unverified</span>
                    <span className="rounded-full px-3 dark:text-white text-black py-1 text-xs bg-[#f97316]">275</span>
                </li>
            </ul>
        </div>
    </div>
  )
}
