import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import { ReviewList, ReviewForm } from '../components/ReviewList';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setActiveImage(0);
    } catch (err) {
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty} × ${product.name} added to cart`);
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!user) {
      toast.error('Please log in to leave a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Thanks for your review!');
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader label="Loading product..." />;
  if (!product) return null;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const images = product.images?.length ? product.images : ['https://placehold.co/600x600?text=No+Image'];

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-teal">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-teal">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-card">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={img + idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                    activeImage === idx ? 'border-teal' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-sm font-medium uppercase tracking-wide text-teal-600">
            {product.category} · {product.brand}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-ink">{product.name}</h1>
          <div className="mt-2">
            <Rating value={product.rating} text={`${product.numReviews} review(s)`} />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-3xl font-bold text-teal-700">
              ${(hasDiscount ? product.discountPrice : product.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-6">
            {product.countInStock > 0 ? (
              <p className="text-sm font-medium text-teal-700">
                ✓ In stock ({product.countInStock} available)
              </p>
            ) : (
              <p className="text-sm font-medium text-coral">Out of stock</p>
            )}
          </div>

          {product.countInStock > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-lg text-gray-500"
                >
                  −
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.countInStock, q + 1))}
                  className="px-3 py-2 text-lg text-gray-500"
                >
                  +
                </button>
              </div>
              <button type="button" onClick={handleAddToCart} className="btn-coral flex-1">
                Add to cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-bold text-ink">Customer reviews</h2>
          <ReviewList reviews={product.reviews} />
        </div>
        <div>
          {user ? (
            <ReviewForm onSubmit={handleReviewSubmit} submitting={submittingReview} />
          ) : (
            <p className="rounded-xl bg-cloud p-4 text-sm text-gray-600">
              <Link to="/login" className="font-semibold text-teal">Log in</Link> to write a review.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
