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
    color: "#fff",
    borderRadius: "8px"
  }), []);

  // Defined specific hex codes for consistent branding
  const CHART_COLORS = useMemo(() => ({
    green: '#10B981', // Emerald 500
    red: '#EF4444',   // Red 500
    blue: '#3B82F6',  // Blue 500
    purple: '#8B5CF6',// Purple 500
    amber: '#F59E0B'  // Amber 500
  }), []);

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

      {/* Row 1: Revenue & Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="💰 Revenue Overview" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" aspect={3}>
            <AreaChart data={monthlyStats}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <RechartsTooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.green}
                fill={CHART_COLORS.green}
                fillOpacity={0.2}
                isAnimationActive={true}
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
                fill={CHART_COLORS.blue}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Top Hotels & Cancellations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChartCard title="🏨 Top Hotels" subtitle="Most booked">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={hotelStats} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={140} stroke="#cbd5e1" />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="bookings"
                  fill={CHART_COLORS.purple}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="❌ Cancellations" subtitle="Risk analysis">
          <div className="h-[260px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cancellationStats}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {cancellationStats.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name.toLowerCase().includes('cancel') ? CHART_COLORS.red : CHART_COLORS.green} 
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36}/>
                <RechartsTooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-8">
              <AlertCircle className="text-slate-700 opacity-30" size={32} />
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Row 3: User Growth */}
      <ChartCard title="👥 User Growth" subtitle="New registrations">
        <ResponsiveContainer width="100%" aspect={4}>
          <LineChart data={userGrowth}>
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <RechartsTooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="users"
              stroke={CHART_COLORS.amber}
              strokeWidth={3}
              dot={{ r: 4, fill: CHART_COLORS.amber }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default AdminDashboard;