import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

type Summary = {
  totalMembers: number;
  activePlans: number;
  revenueThisMonth: number;
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<Summary>({ totalMembers: 0, activePlans: 0, revenueThisMonth: 0 });
  const [monthlyRevenue, setMonthlyRevenue] = useState<Array<{ month: string; revenue: number }>>([]);
  const [packageDist, setPackageDist] = useState<Array<{ name: string; value: number }>>([]);
  const [attendanceTrend, setAttendanceTrend] = useState<Array<{ date: string; checkins: number }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, paymentsRes, packagesRes, attendanceRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/payments'),
          api.get('/api/packages'),
          api.get('/api/attendance')
        ]);

        const users = usersRes.data.items ?? usersRes.data.users ?? [];
        const payments = paymentsRes.data ?? [];
        const packages = packagesRes.data ?? [];
        const attendance = attendanceRes.data ?? [];

        const totalMembers = users.filter((u: any) => u.role === 'customer').length;
        const activePlans = packages.filter((p: any) => p.isActive !== false).length;
        const thisMonth = new Date().getMonth();
        const revenueThisMonth = payments
          .filter((p: any) => p.status === 'completed' && new Date(p.paidAt).getMonth() === thisMonth)
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

        setSummary({ totalMembers, activePlans, revenueThisMonth });

        // Monthly revenue (last 6 months)
        const months = Array.from({ length: 6 }).map((_, idx) => {
          const d = new Date();
          d.setMonth(d.getMonth() - (5 - idx));
          return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString('default', { month: 'short' }) };
        });
        const rev = months.map((m) => {
          const revenue = payments
            .filter((p: any) => p.status === 'completed' && `${new Date(p.paidAt).getFullYear()}-${new Date(p.paidAt).getMonth()}` === m.key)
            .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
          return { month: m.label, revenue };
        });
        setMonthlyRevenue(rev);

        // Package distribution
        const monthlyCount = packages.filter((p: any) => p.type === 'monthly').length;
        const yearlyCount = packages.filter((p: any) => p.type === 'yearly').length;
        const customCount = packages.filter((p: any) => p.type === 'custom').length;
        setPackageDist([
          { name: 'Monthly', value: monthlyCount },
          { name: 'Yearly', value: yearlyCount },
          { name: 'Custom', value: customCount }
        ]);

        // Attendance trend (last 14 days)
        const days = Array.from({ length: 14 }).map((_, idx) => {
          const d = new Date();
          d.setDate(d.getDate() - (13 - idx));
          return d.toISOString().slice(0, 10);
        });
        const trend = days.map((day) => ({
          date: day,
          checkins: attendance.filter((a: any) => (a.checkInAt || '').slice(0, 10) === day).length
        }));
        setAttendanceTrend(trend);
      } catch (e) {
        // noop for demo
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Live metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Members">
          <div className="text-3xl font-semibold">{summary.totalMembers}</div>
        </Card>
        <Card title="Active Packages">
          <div className="text-3xl font-semibold">{summary.activePlans}</div>
        </Card>
        <Card title="Revenue (This Month)">
          <div className="text-3xl font-semibold">${summary.revenueThisMonth.toFixed(2)}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card title="Monthly Revenue" className="xl:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Package Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={packageDist} dataKey="value" nameKey="name" outerRadius={90} label>
                  {packageDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card title="Attendance (Last 14 days)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="checkins" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;


