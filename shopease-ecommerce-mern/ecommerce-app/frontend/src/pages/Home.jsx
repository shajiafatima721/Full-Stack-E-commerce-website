import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBolt, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const perks = [
  { icon: <FaTruck />, title: 'Free shipping', text: 'On all orders over $100' },
  { icon: <FaUndo />, title: '30-day returns', text: 'No questions asked' },
  { icon: <FaShieldAlt />, title: 'Secure checkout', text: 'Your data stays protected' },
  { icon: <FaBolt />, title: 'Fast dispatch', text: 'Orders ship within 24h' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredRes, catRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/categories'),
        ]);
        setFeatured(featuredRes.data.products);
        setCategories(catRes.data.categories);

        if (user) {
          const profileRes = await api.get('/auth/profile');
          setWishlist(profileRes.data.user.wishlist.map((p) => p._id || p));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleToggleWishlist = async (productId) => {
    try {
      const { data } = await api.put(`/users/wishlist/${productId}`);
      setWishlist(data.wishlist.map((p) => p._id || p));
      toast.success('Wishlist updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update wishlist');
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-teal-900 text-white">
        <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-marigold">
              NEW SEASON ARRIVALS
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
              Shop smarter, <span className="text-coral">live better</span>.
            </h1>
            <p className="mt-4 max-w-md text-teal-100">
              Discover curated electronics, fashion, home essentials and more — all backed by
              fast shipping and easy returns.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/products" className="btn-coral">
                Shop now
              </Link>
              <Link to="/products?sort=rating" className="rounded-lg border border-white/30 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10">
                Top rated
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
              alt="Shopping bags with new arrivals"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-cardHover"
            />
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="container-page -mt-8 mb-12">
        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-card md:grid-cols-4">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-50 text-teal">
                {perk.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{perk.title}</p>
                <p className="text-xs text-gray-500">{perk.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-page mb-14">
          <h2 className="mb-5 text-2xl font-bold text-ink">Shop by category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="card flex flex-col items-center justify-center gap-2 p-6 text-center"
              >
                <span className="font-semibold text-ink">{cat}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="container-page mb-20">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Featured products</h2>
          <Link to="/products" className="text-sm font-semibold text-teal hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading featured products..." />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
