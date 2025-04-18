'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"

const chartConfig = {
  total_amount: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  }
}

const dateFormatter = date => {
  return format(date, "dd MMM");
}

export function ExpenseChart({ data }) {
  data = data.map(d => ({ ...d, date: new Date(d.date)}))
  
  const today = new Date()
  const startDate = new Date(new Date().setDate(new Date().getDate() - 30))

  for (let currentDate = new Date(startDate); currentDate <= today; currentDate.setDate(currentDate.getDate() + 1)) {
    if (!data.find(d => (d.date.getDate().toString() + d.date.getMonth().toString() + d.date.getYear().toString()) === (currentDate.getDate().toString() + currentDate.getMonth().toString() + currentDate.getYear().toString()))) {
      console.log("Data Found", data.find(d => d.date.getDate() === currentDate.getDate()))
      data.push({
        date: new Date(currentDate),
        total_amount: 0
      })
    }
  }
  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  console.log("Expense Chart Data", data)

  return (
    <div className="m-6">
      <ChartContainer config={chartConfig}>
        <LineChart
          width={100}
          height={20}
          data={data}
        >
          <CartesianGrid />
          <XAxis
            dataKey="date"
            tickLine={true}
            axisLine={true}
            tickMargin={10}
            tickFormatter={dateFormatter}
          />
          <YAxis
            dataKey="total_amount"
            tickFormatter={formatCurrency}
            axisLine={false}
            tickLine={false}
            tickMargin={-10}
            padding={{ left: 2, right: 20 }}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="total_amount"
            type="linear"
            stroke="var(--color-total_amount)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-total_amount)",
            }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}