import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes, FaHeart } from 'react-icons/fa';
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-teal ${isActive ? 'text-teal' : 'text-ink'}`;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="bg-ink py-1.5 text-center text-xs text-white">
        Free shipping on orders over $100 · Easy 30-day returns
      </div>

      <div className="container-page flex items-center gap-4 py-3">
        <Link to="/" className="font-display text-2xl font-bold text-teal shrink-0">
          Shop<span className="text-coral">Ease</span>
        </Link>

        <SearchBar className="hidden md:flex max-w-xl" />

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Shop
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="ml-2 flex items-center gap-4">
          {user && (
            <Link to="/wishlist" className="relative text-ink hover:text-coral" aria-label="Wishlist">
              <FaHeart size={20} />
            </Link>
          )}

          <Link to="/cart" className="relative text-ink hover:text-teal" aria-label="Cart">
            <FaShoppingCart size={20} />
            {itemsCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-coral text-[10px] font-bold text-white">
                {itemsCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="group relative hidden md:block">
              <button type="button" className="flex items-center gap-1.5 text-ink">
                <FaUserCircle size={20} />
                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
              </button>
              <div className="invisible absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white py-1 shadow-cardHover opacity-0 transition group-hover:visible group-hover:opacity-100">
                <Link to="/profile" className="block px-4 py-2 text-sm text-ink hover:bg-cloud">
                  My profile
                </Link>
                <Link to="/orders" className="block px-4 py-2 text-sm text-ink hover:bg-cloud">
                  My orders
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 text-sm text-ink hover:bg-cloud">
                    Admin dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-coral hover:bg-coral-50"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block btn-primary !px-4 !py-2 text-sm">
              Sign in
            </Link>
          )}

          <button
            type="button"
            className="text-ink lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      <div className="container-page pb-3 md:hidden">
        <SearchBar />
      </div>

      {open && (
        <div className="container-page flex flex-col gap-3 border-t border-gray-100 py-4 lg:hidden">
          <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)} className={navLinkClass}>
            Shop
          </NavLink>
          {user && (
            <NavLink to="/profile" onClick={() => setOpen(false)} className={navLinkClass}>
              My profile
            </NavLink>
          )}
          {user && (
            <NavLink to="/orders" onClick={() => setOpen(false)} className={navLinkClass}>
              My orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setOpen(false)} className={navLinkClass}>
              Admin dashboard
            </NavLink>
          )}
          {user ? (
            <button type="button" onClick={handleLogout} className="text-left text-sm font-medium text-coral">
              Log out
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-teal">
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
