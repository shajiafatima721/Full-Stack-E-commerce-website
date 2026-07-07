import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
    <h1 className="font-display text-6xl font-bold text-teal">404</h1>
    <p className="text-lg font-semibold text-ink">This page wandered off the shelf</p>
    <p className="max-w-sm text-sm text-gray-500">
      The page you're looking for doesn't exist or may have been moved.
    </p>
    <Link to="/" className="btn-primary">
      Back to home
    </Link>
  </div>
);

export default NotFound;
