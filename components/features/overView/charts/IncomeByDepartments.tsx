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

const data = [
  { name: "Q1", Marketing: 32000, Software: 45000 },
  { name: "Q2", Marketing: 25000, Software: 38000 },
  { name: "Q3", Marketing: 41000, Software: 52000 },
  { name: "Q4", Marketing: 80000, Software: 70000 },
];

const IncomeByDepartment = () => {
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
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barGap={8} // Space between the two bars in a group
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
              ticks={[10000, 20000, 30000, 40000, 50000, 70000, 80000]}
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

            {/* Marketing Bar - Black */}
            <Bar
              dataKey="Marketing"
              fill="#010101"
              radius={[4, 4, 0, 0]} // Rounded tops for the "tube" look
              barSize={40}
              animationDuration={5000}
              animationEasing={"linear"}
            />

            {/* Software Bar - Maroon */}
            <Bar
              dataKey="Software"
              fill="#D83333"
              radius={[4, 4, 0, 0]}
              barSize={40}
              animationDuration={5000}
              animationEasing={"linear"}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeByDepartment;
