import { useEffect, useState } from 'react';
import { FaBoxOpen, FaUsers, FaClipboardList, FaDollarSign } from 'react-icons/fa';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const StatCard = ({ icon, label, value, accent }) => (
  <div className="card flex items-center gap-4 p-5">
    <div className={`grid h-12 w-12 place-items-center rounded-full text-lg ${accent}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-ink">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          api.get('/products', { params: { limit: 1 } }),
          api.get('/users', { params: { limit: 1 } }),
          api.get('/orders', { params: { limit: 5 } }),
        ]);

        const revenue = ordersRes.data.orders.reduce((acc, o) => acc + o.totalPrice, 0);

        setStats({
          products: productsRes.data.total,
          users: usersRes.data.total,
          orders: ordersRes.data.total,
          revenue,
        });
        setRecentOrders(ordersRes.data.orders);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<FaBoxOpen />} label="Total products" value={stats.products} accent="bg-teal-50 text-teal" />
        <StatCard icon={<FaUsers />} label="Total users" value={stats.users} accent="bg-marigold-50 text-marigold" />
        <StatCard icon={<FaClipboardList />} label="Total orders" value={stats.orders} accent="bg-coral-50 text-coral" />
        <StatCard
          icon={<FaDollarSign />}
          label="Recent revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          accent="bg-teal-50 text-teal"
        />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-card">
        <h2 className="mb-4 font-semibold text-ink">Recent orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 text-left text-gray-500">
              <tr>
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50">
                  <td className="py-2 font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                  <td className="py-2">{order.user?.name}</td>
                  <td className="py-2 font-medium">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-2 capitalize">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
