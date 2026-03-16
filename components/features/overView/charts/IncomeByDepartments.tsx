import { IncomeDeptItem } from "@/types/analytics";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Props = {
  data: IncomeDeptItem[] | undefined;
};

const COLORS = ["#010101", "#D83333", "#4A90D9", "#F5A623", "#7ED321"];

const IncomeByDepartment = ({ data }: Props) => {
  // Extract dynamic bar keys (everything except "quarter")
  const barKeys = data?.length
    ? Object.keys(data[0])?.filter((key) => key !== "quarter")
    : [];

  // Refine: rename "quarter" → "name" for recharts dataKey
  const refined = data?.map(({ quarter, ...rest }) => ({
    name: quarter,
    ...rest,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: 250,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <p className="font-poppins font-medium">Income By Department</p>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={refined}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eee"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 13 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => val.toLocaleString()}
              tick={{ fill: "#666", fontSize: 12 }}
            />

            <Tooltip
              cursor={{ fill: "#f5f5f5" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: "20px" }}
            />

            {barKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0]}
                barSize={40}
                animationDuration={5000}
                animationEasing="linear"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeByDepartment;
