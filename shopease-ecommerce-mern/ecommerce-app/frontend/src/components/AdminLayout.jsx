import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaUsers, FaClipboardList } from 'react-icons/fa';

const links = [
  { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, end: true },
  { to: '/admin/products', label: 'Products', icon: <FaBoxOpen /> },
  { to: '/admin/orders', label: 'Orders', icon: <FaClipboardList /> },
  { to: '/admin/users', label: 'Users', icon: <FaUsers /> },
];

const AdminLayout = () => (
  <div className="container-page grid gap-6 py-10 md:grid-cols-[220px_1fr]">
    <aside className="md:sticky md:top-24 md:self-start">
      <div className="rounded-xl bg-white p-3 shadow-card">
        <p className="mb-2 px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Admin panel
        </p>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-cloud'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>

    <main>
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
