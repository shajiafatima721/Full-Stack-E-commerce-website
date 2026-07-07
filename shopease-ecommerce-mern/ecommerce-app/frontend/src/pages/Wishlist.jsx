import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    const { data } = await api.get('/auth/profile');
    setProducts(data.user.wishlist);
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleToggleWishlist = async (productId) => {
    try {
      await api.put(`/users/wishlist/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Could not update wishlist');
    }
  };

  if (loading) return <Loader label="Loading your wishlist..." />;

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink">My wishlist</h1>

      {products.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-card">
          <p className="font-semibold text-ink">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-gray-500">Tap the heart icon on any product to save it here.</p>
          <Link to="/products" className="mt-4 inline-block btn-primary">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              wishlist={products.map((p) => p._id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
