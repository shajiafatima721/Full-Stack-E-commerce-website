import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const emptyAddress = { fullName: '', street: '', city: '', state: '', postalCode: '', country: '', phone: '' };

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items, navigate]);

  useEffect(() => {
    api.get('/auth/profile').then(({ data }) => {
      if (data.user.address) {
        setAddress((a) => ({ ...a, ...data.user.address }));
      }
    });
  }, []);

  const shipping = subtotal > 100 ? 0 : 10;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product, qty: i.qty })),
        shippingAddress: address,
        paymentMethod,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-ink">Shipping address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.keys(emptyAddress).map((field) => (
                <div key={field} className={field === 'street' ? 'sm:col-span-2' : ''}>
                  <label className="mb-1 block text-sm font-medium capitalize text-gray-700">
                    {field === 'postalCode' ? 'Postal code' : field === 'fullName' ? 'Full name' : field}
                  </label>
                  <input
                    required={field !== 'state' && field !== 'phone'}
                    value={address[field] || ''}
                    onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-ink">Payment method</h2>
            <div className="space-y-2">
              {[
                { value: 'cod', label: 'Cash on delivery' },
                { value: 'card', label: 'Credit / debit card' },
                { value: 'paypal', label: 'PayPal' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={() => setPaymentMethod(opt.value)}
                    className="accent-teal-600"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              This is a demo project — no real payment is processed.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-card lg:col-span-1">
          <h2 className="mb-4 font-semibold text-ink">Order summary</h2>
          <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.product} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} × {item.qty}
                </span>
                <span className="font-medium text-ink">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="my-4 border-t border-gray-100" />
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="my-4 border-t border-gray-100" />
          <div className="flex justify-between font-bold text-ink">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button type="submit" disabled={placing} className="btn-coral mt-6 w-full">
            {placing ? 'Placing order...' : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
