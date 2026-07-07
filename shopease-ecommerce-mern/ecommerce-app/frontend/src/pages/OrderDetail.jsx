import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loader from '../components/Loader';

const steps = ['pending', 'processing', 'shipped', 'delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => toast.error('Could not load this order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading order..." />;
  if (!order) return null;

  const currentStep = order.status === 'cancelled' ? -1 : steps.indexOf(order.status);

  return (
    <div className="container-page max-w-4xl py-10">
      <h1 className="mb-1 text-2xl font-bold text-ink">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="mb-6 text-sm text-gray-500">
        Placed on {new Date(order.createdAt).toLocaleString()}
      </p>

      {order.status === 'cancelled' ? (
        <div className="mb-8 rounded-xl bg-coral-50 p-4 text-sm font-medium text-coral-700">
          This order was cancelled.
        </div>
      ) : (
        <div className="mb-10 flex items-center">
          {steps.map((step, idx) => (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                    idx <= currentStep ? 'bg-teal text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="text-xs font-medium capitalize text-gray-600">{step}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 ${idx < currentStep ? 'bg-teal' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-ink">Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.product} className="flex items-center gap-4">
                  <img
                    src={item.image || 'https://placehold.co/80x80?text=No+Image'}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-card">
            <h2 className="mb-2 font-semibold text-ink">Shipping address</h2>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}, {order.shippingAddress.city}
              {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}<br />
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-card lg:col-span-1">
          <h2 className="mb-4 font-semibold text-ink">Payment</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Method</span>
              <span className="uppercase">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span>{order.isPaid ? 'Paid' : 'Unpaid'}</span>
            </div>
            <div className="flex justify-between">
              <span>Items</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="my-4 border-t border-gray-100" />
          <div className="flex justify-between font-bold text-ink">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
