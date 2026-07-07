import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, updateQty, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">Your cart is empty</h1>
        <p className="text-gray-500">Browse our products and add something you love.</p>
        <Link to="/products" className="btn-primary">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink">Your cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.product} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-card">
              <img
                src={item.image || 'https://placehold.co/100x100?text=No+Image'}
                alt={item.name}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
              </div>

              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  type="button"
                  onClick={() => updateQty(item.product, item.qty - 1)}
                  className="px-2.5 py-1.5 text-gray-500"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => updateQty(item.product, item.qty + 1)}
                  className="px-2.5 py-1.5 text-gray-500"
                >
                  +
                </button>
              </div>

              <p className="w-20 text-right font-semibold text-ink">
                ${(item.price * item.qty).toFixed(2)}
              </p>

              <button
                type="button"
                onClick={() => removeFromCart(item.product)}
                aria-label="Remove item"
                className="text-gray-400 hover:text-coral"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-card lg:col-span-1">
          <h2 className="mb-4 font-semibold text-ink">Order summary</h2>
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
          <button type="button" onClick={handleCheckout} className="btn-coral mt-6 w-full">
            Proceed to checkout
          </button>
          <Link to="/products" className="mt-3 block text-center text-sm font-medium text-teal hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
