import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (page = 1, search = keyword) => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { page, keyword: search, limit: 8 } });
      setProducts(data.products);
      setPageInfo({ page: data.page, pages: data.pages, total: data.total });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProducts(1, '');
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, keyword);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts(pageInfo.page, keyword);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete product');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-ink">Manage products</h1>
        <Link to="/admin/products/new" className="btn-primary">
          <FaPlus size={12} /> Add product
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-4 flex max-w-sm gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products..."
          className="input-field"
        />
        <button type="submit" className="btn-outline">Search</button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 text-left text-gray-500">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-50">
                  <td className="flex items-center gap-3 p-4">
                    <img
                      src={product.images?.[0] || 'https://placehold.co/50x50?text=No+Img'}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <span className="line-clamp-1 font-medium text-ink">{product.name}</span>
                  </td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4 font-medium text-ink">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={product.countInStock === 0 ? 'text-coral' : 'text-gray-600'}>
                      {product.countInStock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Link to={`/admin/products/${product._id}/edit`} className="text-teal hover:text-teal-700" aria-label="Edit">
                        <FaEdit />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id, product.name)}
                        className="text-coral hover:text-coral-700"
                        aria-label="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={pageInfo.page} pages={pageInfo.pages} onChange={(p) => fetchProducts(p, keyword)} />
    </div>
  );
};

export default ManageProducts;
