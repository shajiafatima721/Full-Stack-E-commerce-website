import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import { useAuth } from '../../context/AuthContext';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async (page = 1, search = keyword) => {
    setLoading(true);
    try {
      const { data } = await api.get('/users', { params: { page, keyword: search, limit: 10 } });
      setUsers(data.users);
      setPageInfo({ page: data.page, pages: data.pages, total: data.total });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchUsers(1, '');
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, keyword);
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success('Role updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update role');
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await api.put(`/users/${id}`, { isActive });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive } : u)));
      toast.success(isActive ? 'User activated' : 'User deactivated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update user');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers(pageInfo.page, keyword);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete user');
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">Manage users</h1>

      <form onSubmit={handleSearch} className="mb-4 flex max-w-sm gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name or email..."
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
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Active</th>
                <th className="p-4">Joined</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-50">
                  <td className="p-4 font-medium text-ink">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={user._id === currentUser._id}
                      className="rounded-lg border border-gray-300 px-2 py-1 text-xs capitalize focus:border-teal focus:outline-none disabled:opacity-50"
                    >
                      <option value="customer">customer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(user._id, !user.isActive)}
                      disabled={user._id === currentUser._id}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.isActive ? 'bg-teal-50 text-teal-700' : 'bg-coral-50 text-coral-700'
                      } disabled:opacity-50`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    {user.role !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(user._id, user.name)}
                        className="text-coral hover:text-coral-700"
                        aria-label="Delete user"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={pageInfo.page} pages={pageInfo.pages} onChange={(p) => fetchUsers(p, keyword)} />
    </div>
  );
};

export default ManageUsers;
