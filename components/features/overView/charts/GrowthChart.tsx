import { GrowthTrendItem } from "@/types/analytics";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
type GrowthChartPoint = {
  index: number;
  year: string;
  value: number;
  __dummy?: boolean; // 👈 optional
};
interface Props {
  GrowttChartItems: GrowthTrendItem[] | undefined;
}
// export const growthSeedData = [
//   { year: 2021, value: 4200 },
//   { year: 2022, value: 6800 },

//   // Present
//   { year: 2023, value: 9100 },
//   { year: 2024, value: 12300 },

//   // Future projection
//   { year: 2025, value: 16800 },
//   { year: 2026, value: 22400 },
//   { year: 2027, value: 30100 },
//   { year: 2027, value: 30100 },
//   { year: 2028, value: 30100 },
//   { year: 2029, value: 30100 },
//   { year: 2030, value: 30100 },
//   { year: 2027, value: 30100 },
// ];

const GrowthChart = ({ GrowttChartItems }: Props) => {
  // --- Data Refinement: Grouping and Summing by Year ---
  const chartData: GrowthChartPoint[] = GrowttChartItems
    ? Object.values(
        GrowttChartItems.reduce(
          (acc, item) => {
            const year = item.year.toString();
            if (!acc[year]) {
              acc[year] = { year, value: 0 };
            }
            acc[year].value += item.value;
            return acc;
          },
          {} as Record<string, { year: string; value: number }>,
        ),
      )
        .sort((a, b) => Number(a.year) - Number(b.year))
        .map((item, index) => ({
          ...item,
          index,
        }))
    : [];

  const finalChartData: GrowthChartPoint[] =
    chartData.length === 1
      ? [
          chartData[0],
          {
            ...chartData[0],
            index: chartData[0].index + 1,
            __dummy: true,
          },
        ]
      : chartData;

  return (
    <div
      style={{
        width: "100%",
        height: 200,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <p className="font-poppins font-medium">Growth</p>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={finalChartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DE4646" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#DE4646" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eee"
            />

            <XAxis
              dataKey="index"
              type="number"
              domain={[0, finalChartData.length - 1]}
              ticks={finalChartData.map((d) => d.index)}
              tickFormatter={(value) => {
                const item = finalChartData.find((d) => d.index === value);

                if (!item || item.__dummy) {
                  return ""; // ✅ MUST return a string
                }

                return item.year;
              }}
              axisLine={false}
              tickLine={false}
              dy={10}
              tick={{ fill: "#999", fontSize: 12, fontWeight: 400 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
              }
              tick={{ fill: "#999", fontSize: 12, fontWeight: 400 }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "#010101", fontWeight: "bold" }}
              formatter={(value: number | undefined) => [
                `$${value?.toLocaleString()}`,
                "Total Value",
              ]}
            />

            <Area
              type="linear"
              dataKey="value"
              stroke="#DE4646"
              strokeWidth={4}
              strokeDasharray="1 9"
              strokeLinecap="square"
              animationDuration={5000}
              fillOpacity={0.6}
              fill="url(#colorValue)"
              dot={false}
              activeDot={{
                r: 6,
                fill: "#DE4646",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;
