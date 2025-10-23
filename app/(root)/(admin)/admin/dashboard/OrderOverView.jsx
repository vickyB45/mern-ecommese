"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";

export const description = "A bar chart";

const months = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December",
];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#8853eb",
  },
};

export function OrderOverView() {
  const [chartData, setChartData] = useState([]);
  const { data: monthlySales, loading } = useFetch({
    url: "/api/dashboard/admin/monthly-sales",
  });

  useEffect(() => {
    if (monthlySales && monthlySales.success) {
      const getChartData = months.map((month, index) => {
        const monthData = monthlySales?.data?.find(
          (item) => item._id?.month === index + 1
        );
        return {
          month,
          amount: monthData ? monthData.totalSales : 0,
        };
      });
      setChartData(getChartData);
    }
  }, [monthlySales]);

  // ✅ Skeleton loader
  if (loading) {
    return (
      <CardContent className="p-4">
        <div className="flex items-end justify-between h-40 gap-2 animate-pulse">
          {months.map((_, i) => (
            <div
              key={i}
              className={`bg-gray-300 dark:bg-gray-600 rounded-t-md w-4`}
              style={{ height: `${Math.random() * 100 + 40}px` }}
            ></div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          {months.map((month, i) => (
            <span key={i}>{month.slice(0, 3)}</span>
          ))}
        </div>
      </CardContent>
    );
  }

  return (
    <div>
      <CardContent className="p-0">
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
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Bar dataKey="amount" fill="#8853eb" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
}
