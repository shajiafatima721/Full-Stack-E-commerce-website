import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', {
        params: { keyword, category, sort, page, limit: 8 },
      });
      setProducts(data.products);
      setPageInfo({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) {
      toast.error('Could not load products');
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    api.get('/products/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }
    api.get('/auth/profile').then((res) => {
      setWishlist(res.data.user.wishlist.map((p) => p._id || p));
    });
  }, [user]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'all' || !value) next.delete(key);
    else next.set(key, value);
    next.delete('page');
    setSearchParams(next);
  };

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
    <div className="container-page py-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {keyword ? `Search results for "${keyword}"` : 'All products'}
          </h1>
          <p className="text-sm text-gray-500">{pageInfo.total} products found</p>
        </div>

        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="input-field md:w-56"
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          active={category}
          onSelect={(cat) => updateParam('category', cat)}
        />
      </div>

      {loading ? (
        <Loader label="Loading products..." />
      ) : products.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-card">
          <p className="text-lg font-semibold text-ink">No products match your search</p>
          <p className="mt-1 text-sm text-gray-500">Try a different keyword or category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
          <Pagination
            page={pageInfo.page}
            pages={pageInfo.pages}
            onChange={(p) => updateParam('page', p)}
          />
        </>
      )}
    </div>
  );
};

export default Products;
