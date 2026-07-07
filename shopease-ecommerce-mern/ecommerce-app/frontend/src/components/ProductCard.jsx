import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaCartPlus } from 'react-icons/fa';
import Rating from './Rating';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, wishlist = [], onToggleWishlist }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const isWishlisted = wishlist.includes(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.countInStock === 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to use your wishlist');
      return;
    }
    onToggleWishlist?.(product._id);
  };

  return (
    <Link
      to={`/products/${product.slug || product._id}`}
      className="card group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-coral px-2.5 py-1 text-xs font-bold text-white">
            -{Math.round(100 - (product.discountPrice / product.price) * 100)}%
          </span>
        )}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-coral shadow-card transition hover:bg-white"
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>
        {product.countInStock === 0 && (
          <div className="absolute inset-0 grid place-items-center bg-ink/50">
            <span className="rounded-md bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-teal-600">
          {product.category}
        </span>
        <h3 className="line-clamp-2 font-display text-sm font-semibold text-ink">
          {product.name}
        </h3>
        <Rating value={product.rating} text={`(${product.numReviews})`} />

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="price-tag">
            ${(hasDiscount ? product.discountPrice : product.price).toFixed(2)}
            {hasDiscount && (
              <span className="ml-1 text-xs font-normal text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            aria-label="Add to cart"
            className="grid h-9 w-9 place-items-center rounded-full bg-teal text-white transition hover:bg-teal-700 disabled:opacity-40"
          >
            <FaCartPlus size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
