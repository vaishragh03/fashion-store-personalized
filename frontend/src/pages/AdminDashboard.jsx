import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AdminDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: '',
    category: 'Men',
    tags: '',
    images: ''
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const [productsRes, lowStockRes] = await Promise.all([
        API.get('/products'),
        API.get('/products/admin/low-stock')
      ]);
      setProducts(productsRes.data.data || []);
      setLowStock(lowStockRes.data.data || []);
    } catch (err) {
      console.log('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        tags: formData.tags.split(',').map(t => t.trim()),
        images: [formData.images || `https://picsum.photos/seed/${Date.now()}/400/500`],
        variants: [
          {
            size: 'M',
            colorName: 'Black',
            colorHex: '#000000',
            stock: 10,
            additionalPrice: 0
          }
        ]
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
      } else {
        await API.post('/products', payload);
      }

      setFormData({ title: '', description: '', basePrice: '', category: 'Men', tags: '', images: '' });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
      alert('Product saved successfully!');
    } catch (err) {
      alert('Failed to save product: ' + err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
        alert('Product deleted!');
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="p-6">Access Denied. Admin only.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Active Listings</p>
          <p className="text-3xl font-bold text-green-600">{products.length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Low Stock Alert</p>
          <p className="text-3xl font-bold text-yellow-600">{lowStock.length}</p>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <h2 className="font-semibold text-yellow-800 mb-2">Low Inventory Items</h2>
          <ul className="text-sm space-y-1">
            {lowStock.map((item, i) => (
              <li key={i}>
                {item.title} — {item.color} / {item.size}: <strong>{item.stock} left</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ACTIONS */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({ title: '', description: '', basePrice: '', category: 'Men', tags: '', images: '' });
        }}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 mb-6"
      >
        {showForm ? '✕ Close' : '+ Add Product'}
      </button>

      {/* PRODUCT FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl mb-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border p-2 rounded"
            rows="3"
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Base Price"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
              className="border p-2 rounded"
              step="0.01"
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="border p-2 rounded"
            />
          </div>

          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Save Product
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Product</th>
              <th className="p-3 text-left text-sm font-semibold">Category</th>
              <th className="p-3 text-left text-sm font-semibold">Price</th>
              <th className="p-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-3 text-center">Loading...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">No products</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm">{product.title}</td>
                  <td className="p-3 text-sm">{product.category}</td>
                  <td className="p-3 text-sm">₹{product.basePrice}</td>
                  <td className="p-3 text-sm space-x-2">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
