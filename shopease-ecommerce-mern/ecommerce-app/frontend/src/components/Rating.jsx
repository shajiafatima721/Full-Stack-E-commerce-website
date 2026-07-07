import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

/**
 * Renders a 5-star rating display.
 * @param {{ value: number, text?: string, size?: string }} props
 */
const Rating = ({ value = 0, text, size = 'text-sm' }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`flex items-center gap-1 ${size}`}>
      <div className="flex text-marigold">
        {stars.map((star) => {
          if (value >= star) return <FaStar key={star} />;
          if (value >= star - 0.5) return <FaStarHalfAlt key={star} />;
          return <FaRegStar key={star} />;
        })}
      </div>
      {text && <span className="text-gray-500">{text}</span>}
    </div>
  );
};

export default Rating;
