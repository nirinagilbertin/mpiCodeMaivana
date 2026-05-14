import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "../ui/Card";

interface IncidentsChartProps {
  data: {
    date: string;
    signalements: number;
    resolus: number;
  }[];
  loading?: boolean;
}

const mockChartData = [
  { date: "08/05", signalements: 4, resolus: 2 },
  { date: "09/05", signalements: 7, resolus: 5 },
  { date: "10/05", signalements: 5, resolus: 3 },
  { date: "11/05", signalements: 9, resolus: 6 },
  { date: "12/05", signalements: 12, resolus: 8 },
  { date: "13/05", signalements: 8, resolus: 10 },
  { date: "14/05", signalements: 10, resolus: 7 },
];

export default function IncidentsChart({
  data,
  loading = false,
}: IncidentsChartProps) {
  const chartData = data.length > 0 ? data : mockChartData;

  return (
    <Card padding="lg">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Évolution des signalements
      </h3>

      {loading ? (
        <div className="h-64 animate-pulse bg-gray-100 rounded-xl" />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              />
              <Line
                type="monotone"
                dataKey="signalements"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#3B82F6" }}
                activeDot={{ r: 6 }}
                name="Signalements"
              />
              <Line
                type="monotone"
                dataKey="resolus"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4, fill: "#10B981" }}
                activeDot={{ r: 6 }}
                name="Résolus"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}