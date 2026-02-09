import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { Loader2, AlertCircle } from "lucide-react";
import ChartCard from "./ChartCard";

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/analytics")
      .then((res: { data: any }) => setData(res.data))
      .catch(() => console.error("Analytics fetch failed"))
      .finally(() => setLoading(false));
  }, []);

  const tooltipStyle = useMemo(() => ({
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    color: "#fff"
  }), []);

  const COLORS = useMemo(
    () => ['#10B981', '#EF4444', '#3B82F6', '#F59E0B'],
    []
  );

  const monthlyStats = useMemo(() => data?.monthlyStats ?? [], [data]);
  const hotelStats = useMemo(() => data?.hotelStats ?? [], [data]);
  const userGrowth = useMemo(() => data?.userGrowth ?? [], [data]);
  const cancellationStats = useMemo(() => data?.cancellationStats ?? [], [data]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-emerald-400" size={40} />
      </div>
    );
  }

  if (!data) return <p className="text-center text-white">No data available</p>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold text-white">
          Business <span className="text-emerald-400">Analytics</span> 2026
        </h1>
        <p className="text-slate-400">
          Real-time insights into bookings, revenue, and growth.
        </p>
      </header>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="💰 Revenue Overview" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" aspect={3}>
            <AreaChart data={monthlyStats}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <RechartsTooltip contentStyle={tooltipStyle} />
              <Area
                dataKey="revenue"
                stroke="#10B981"
                fill="#10B981"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="📊 Booking Trends" subtitle="Monthly bookings">
          <ResponsiveContainer width="100%" aspect={3}>
            <BarChart data={monthlyStats}>
              <XAxis dataKey="name" stroke="#64748b" />
              <RechartsTooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="bookings"
                fill="#3B82F6"
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChartCard title="🏨 Top Hotels" subtitle="Most booked">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={hotelStats} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={140} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="bookings"
                  fill="#8B5CF6"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="❌ Cancellations" subtitle="Risk analysis">
          <ResponsiveContainer width="100%" aspect={1}>
            <PieChart>
              <Pie
                data={cancellationStats}
                dataKey="value"
                innerRadius={50}
                outerRadius={70}
                isAnimationActive={false}
              >
                {cancellationStats.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <RechartsTooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AlertCircle className="opacity-20" size={48} />
          </div>
        </ChartCard>
      </div>

      {/* Row 3 */}
      <ChartCard title="👥 User Growth" subtitle="New registrations">
        <ResponsiveContainer width="100%" aspect={4}>
          <LineChart data={userGrowth}>
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip contentStyle={tooltipStyle} />
            <Line
              dataKey="users"
              stroke="#F59E0B"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default AdminDashboard;
