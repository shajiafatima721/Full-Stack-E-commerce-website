import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchBar = ({ className = '' }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [keyword, setKeyword] = useState(params.get('keyword') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex w-full ${className}`}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search for products, brands and categories..."
        className="w-full rounded-l-lg border border-gray-300 px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
      />
      <button
        type="submit"
        aria-label="Search"
        className="grid place-items-center rounded-r-lg bg-teal px-4 text-white transition hover:bg-teal-700"
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
