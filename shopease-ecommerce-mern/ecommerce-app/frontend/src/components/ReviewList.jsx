import { useState } from 'react';
import Rating from './Rating';

export const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500">No reviews yet. Be the first to share your thoughts.</p>;
  }

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <div key={review._id} className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-ink">{review.name}</p>
            <span className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <Rating value={review.rating} />
          <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export const ReviewForm = ({ onSubmit, submitting }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit({ rating, comment });
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl bg-cloud p-4">
      <p className="font-semibold text-ink">Write a review</p>
      <div>
        <label htmlFor="rating" className="mb-1 block text-sm text-gray-600">
          Your rating
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="input-field"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} - {['Poor', 'Fair', 'Good', 'Very good', 'Excellent'][r - 1]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="comment" className="mb-1 block text-sm text-gray-600">
          Your review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          required
          placeholder="What did you like or dislike?"
          className="input-field"
        />
      </div>
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  );
};
