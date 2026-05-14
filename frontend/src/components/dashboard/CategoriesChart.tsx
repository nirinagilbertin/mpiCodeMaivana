import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import Card from "../ui/Card";

interface CategoriesChartProps {
    data: {
        categoryName: string;
        count: number;
        color?: string;
    }[];
    loading?: boolean;
}

const COLORS = [
    "#3B82F6",
    "#10B981",
    "#EF4444",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
];

const mockPieData = [
    { categoryName: "Eau", count: 3, color: "#3B82F6" },
    { categoryName: "Déchets", count: 2, color: "#10B981" },
    { categoryName: "Sécurité", count: 2, color: "#EF4444" },
    { categoryName: "Transport", count: 2, color: "#F59E0B" },
    { categoryName: "Éclairage", count: 1, color: "#8B5CF6" },
    { categoryName: "Routes", count: 1, color: "#EC4899" },
];

export default function CategoriesChart({
    data,
    loading = false,
}: CategoriesChartProps) {
    const pieData = data.length > 0 ? data : mockPieData;

    return (
        <Card padding="lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Répartition par catégorie
            </h3>

            {loading ? (
                <div className="h-64 animate-pulse bg-gray-100 rounded-xl" />
            ) : (
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="count"
                                nameKey="categoryName"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color || COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "1px solid #E5E7EB",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    fontSize: "13px",
                                }}
                                formatter={(value, name) => [
                                    `${Number(value)} signalement${Number(value) > 1 ? "s" : ""}`,
                                    String(name),
                                ]}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                                iconType="circle"
                                iconSize={8}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    );
}