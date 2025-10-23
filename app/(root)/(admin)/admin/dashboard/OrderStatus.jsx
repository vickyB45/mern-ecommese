"use client";

import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";

export const description = "A donut chart";

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
};

export function OrderStatus() {
  const [chartData, setChartData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const { data: orderStatus, loading } = useFetch({
    url: "/api/dashboard/admin/order-status",
  });

  useEffect(() => {
    if (orderStatus && orderStatus.success) {
      const apiData = orderStatus.data || [];

      // ✅ Normalize and merge API + config
      const normalizedData = apiData.map((item) => {
        // Handle cancelled → canceled naming difference
        const normalizedId =
          item._id === "cancelled" ? "canceled" : item._id.toLowerCase();

        // If config doesn’t have this key, give it a random color
        const color =
          chartConfig[normalizedId]?.color ||
          `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        return {
          status: normalizedId,
          count: item.count,
          fill: color,
        };
      });

      // ✅ Ensure config keys also appear (even if API didn’t send them)
      const allKeys = new Set([
        ...Object.keys(chartConfig).filter((k) => k !== "count"),
        ...normalizedData.map((d) => d.status),
      ]);

      const finalData = Array.from(allKeys).map((key) => {
        const found = normalizedData.find((d) => d.status === key);
        return (
          found || {
            status: key,
            count: 0,
            fill:
              chartConfig[key]?.color ||
              `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          }
        );
      });

      setChartData(finalData);
      setTotalCount(finalData.reduce((acc, curr) => acc + curr.count, 0));
    }
  }, [orderStatus]);

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
                        {totalCount}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total Orders
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* 🔹 Dynamic Status List */}
      <div>
        <ul className="select-none mt-4">
          {chartData.map((item) => (
            <li
              key={item.status}
              className="flex justify-between items-center mb-2 text-sm capitalize"
            >
              <span>{item.status}</span>
              <span
                className="rounded-full px-3 py-1 text-xs text-white"
                style={{ backgroundColor: item.fill }}
              >
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
