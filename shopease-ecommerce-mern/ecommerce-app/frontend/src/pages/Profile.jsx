import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const emptyAddress = { fullName: '', street: '', city: '', state: '', postalCode: '', country: '', phone: '' };

const Profile = () => {
  const { updateUserLocally } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', password: '', confirm: '' });
  const [address, setAddress] = useState(emptyAddress);

  useEffect(() => {
    api.get('/auth/profile').then(({ data }) => {
      setForm({ name: data.user.name, password: '', confirm: '' });
      setAddress({ ...emptyAddress, ...data.user.address });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const payload = { name: form.name, address };
      if (form.password) payload.password = form.password;

      const { data } = await api.put('/auth/profile', payload);
      updateUserLocally({ name: data.user.name });
      toast.success('Profile updated');
      setForm((f) => ({ ...f, password: '', confirm: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading your profile..." />;

  return (
    <div className="container-page max-w-3xl py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink">My profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-semibold text-ink">Account details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">New password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Leave blank to keep current"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Confirm new password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-semibold text-ink">Shipping address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.keys(emptyAddress).map((field) => (
              <div key={field}>
                <label className="mb-1 block text-sm font-medium capitalize text-gray-700">
                  {field === 'postalCode' ? 'Postal code' : field === 'fullName' ? 'Full name' : field}
                </label>
                <input
                  value={address[field] || ''}
                  onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                  className="input-field"
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
