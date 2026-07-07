import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => (
  <footer className="mt-16 bg-ink text-gray-300">
    <div className="container-page grid gap-10 py-12 md:grid-cols-4">
      <div>
        <h3 className="font-display text-xl font-bold text-white">
          Shop<span className="text-coral">Ease</span>
        </h3>
        <p className="mt-3 text-sm text-gray-400">
          Everything you need, all in one cart — electronics, fashion, home and more.
        </p>
        <div className="mt-4 flex gap-3 text-lg">
          <a href="#" aria-label="Facebook" className="hover:text-coral">
            <FaFacebook />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-coral">
            <FaInstagram />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-coral">
            <FaTwitter />
          </a>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-semibold text-white">Shop</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/products" className="hover:text-coral">All products</Link></li>
          <li><Link to="/products?category=Electronics" className="hover:text-coral">Electronics</Link></li>
          <li><Link to="/products?category=Fashion" className="hover:text-coral">Fashion</Link></li>
          <li><Link to="/products?category=Home%20%26%20Kitchen" className="hover:text-coral">Home &amp; Kitchen</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-3 font-semibold text-white">Account</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/profile" className="hover:text-coral">My profile</Link></li>
          <li><Link to="/orders" className="hover:text-coral">Order history</Link></li>
          <li><Link to="/wishlist" className="hover:text-coral">Wishlist</Link></li>
          <li><Link to="/cart" className="hover:text-coral">Cart</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-3 font-semibold text-white">Stay in the loop</h4>
        <p className="text-sm text-gray-400">Get deals and new arrivals straight to your inbox.</p>
        <form className="mt-3 flex" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-l-lg border-0 px-3 py-2 text-sm text-ink focus:outline-none"
          />
          <button type="submit" className="rounded-r-lg bg-coral px-4 text-sm font-semibold text-white hover:bg-coral-700">
            Join
          </button>
        </form>
      </div>
    </div>

    <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
      © {new Date().getFullYear()} ShopEase. Built for educational purposes — full stack MERN demo project.
    </div>
  </footer>
);

export default Footer;
