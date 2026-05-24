import React, { useEffect, useState } from "react";
import API from '../api/axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    label: 'Home'
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await API.get('/auth/me');
      const userData = res.data.user || res.data;
      setUser(userData);
      setAddresses(userData.addresses || []);
    } catch (err) {
      console.log('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/addresses', formData);
      setAddresses(res.data.addresses || [...addresses, formData]);
      setFormData({ streetAddress: '', city: '', state: '', postalCode: '', label: 'Home' });
      setShowAddForm(false);
      alert('Address added successfully!');
    } catch (err) {
      alert('Failed to add address');
    }
  };

  const handleDeleteAddress = async (index) => {
    if (window.confirm('Are you sure?')) {
      try {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);
        alert('Address deleted!');
      } catch (err) {
        alert('Failed to delete address');
      }
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* USER CARD */}
      {user && (
        <div className="bg-white p-5 rounded-xl shadow space-y-2 mb-6">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-gray-500">{user.email}</p>
          {user.role && <p className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded w-fit">{user.role.toUpperCase()}</p>}
        </div>
      )}

      {/* ADDRESS SECTION */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Saved Addresses</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
          >
            {showAddForm ? 'Cancel' : '+ Add Address'}
          </button>
        </div>

        {/* ADD ADDRESS FORM */}
        {showAddForm && (
          <form onSubmit={handleAddAddress} className="bg-gray-50 p-4 rounded-xl mb-4 space-y-3">
            <select
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              placeholder="Street Address"
              value={formData.streetAddress}
              onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="border p-2 rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Save Address
            </button>
          </form>
        )}

        {/* ADDRESSES LIST */}
        <div className="space-y-2">
          {addresses.length === 0 ? (
            <p className="text-gray-400 text-sm">No saved addresses</p>
          ) : (
            addresses.map((addr, i) => (
              <div key={i} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-indigo-600">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{addr.label || 'Address'}</p>
                    <p className="text-sm text-gray-600">{addr.streetAddress}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(i)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ORDER HISTORY LINK */}
      <div className="mt-8 p-4 bg-indigo-50 rounded-xl">
        <p className="text-sm text-gray-600">
          <a href="/order-history" className="text-indigo-600 hover:underline font-semibold">
            View Order History →
          </a>
        </p>
      </div>
    </div>
  );
};

export default Profile;
