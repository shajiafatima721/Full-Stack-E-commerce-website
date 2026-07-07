import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  category: '',
  brand: '',
  countInStock: '',
  isFeatured: false,
  images: [],
};

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/${id}`).then(({ data }) => {
      setForm({ ...emptyForm, ...data.product });
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    setUploading(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, images: [...f.images, ...data.images] }));
      toast.success('Images uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (img) => {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== img) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice) || 0,
      countInStock: Number(form.countInStock),
    };

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading product..." />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">{isEdit ? 'Edit product' : 'Add new product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Product name</label>
            <input name="name" required value={form.name} onChange={handleChange} className="input-field" />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              required
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Discount price ($, optional)</label>
            <input
              type="number"
              name="discountPrice"
              min="0"
              step="0.01"
              value={form.discountPrice}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
            <input name="category" required value={form.category} onChange={handleChange} className="input-field" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} className="input-field" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Stock quantity</label>
            <input
              type="number"
              name="countInStock"
              min="0"
              required
              value={form.countInStock}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="flex items-center gap-2 pt-7">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 accent-teal-600"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
              Show on homepage as featured
            </label>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Product images</label>
          <div className="mb-3 flex flex-wrap gap-3">
            {form.images.map((img) => (
              <div key={img} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                <img src={img} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute right-0 top-0 grid h-5 w-5 place-items-center bg-coral text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          <p className="mt-1 text-xs text-gray-400">
            You can also paste direct image URLs by editing the field via the API; this uploader saves files to the server.
          </p>
        </div>

        <button type="submit" disabled={saving || uploading} className="btn-primary">
          {saving ? 'Saving...' : isEdit ? 'Update product' : 'Create product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
