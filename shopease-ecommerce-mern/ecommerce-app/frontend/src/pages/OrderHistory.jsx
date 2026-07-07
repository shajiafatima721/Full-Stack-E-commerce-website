import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-marigold-50 text-marigold-600',
  delivered: 'bg-teal-50 text-teal-700',
  cancelled: 'bg-coral-50 text-coral-700',
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading your orders..." />;

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink">My orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-card">
          <p className="font-semibold text-ink">You haven&apos;t placed any orders yet</p>
          <Link to="/products" className="mt-4 inline-block btn-primary">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 text-left text-gray-500">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Paid</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50">
                  <td className="p-4 font-mono text-xs text-gray-500">{order._id.slice(-8).toUpperCase()}</td>
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-semibold text-ink">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">{order.isPaid ? '✓ Paid' : 'Unpaid'}</td>
                  <td className="p-4">
                    <Link to={`/orders/${order._id}`} className="font-semibold text-teal hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
