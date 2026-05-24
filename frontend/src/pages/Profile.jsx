import { useEffect, useState } from 'react';
import API from '../api/axios';

const emptyAddress = {
  label: 'Home',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India'
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [message, setMessage] = useState('');

  const fetchProfile = async () => {
    const res = await API.get('/users/profile');
    setUser(res.data.user);
    setName(res.data.user.name);
    setEmail(res.data.user.email);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put('/users/profile', { name, email });
      setMessage('Profile updated!');
      fetchProfile();
    } catch {
      setMessage('Failed to update profile');
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/addresses', addressForm);
      setAddressForm(emptyAddress);
      setShowAddressForm(false);
      setMessage('Address added!');
      fetchProfile();
    } catch {
      setMessage('Failed to add address');
    }
  };

  const deleteAddress = async (index) => {
    try {
      await API.delete(`/users/addresses/${index}`);
      fetchProfile();
    } catch {
      setMessage('Failed to delete address');
    }
  };

  if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>
      )}

      <form onSubmit={saveProfile} className="bg-white p-5 rounded-xl shadow space-y-4 mb-8">
        <h2 className="font-semibold">Personal Information</h2>
        <input
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          className="w-full border p-2 rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Save Profile
        </button>
      </form>

      <div className="bg-white p-5 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Saved Addresses</h2>
          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="text-indigo-600 text-sm font-medium"
          >
            {showAddressForm ? 'Cancel' : '+ Add Address'}
          </button>
        </div>

        {showAddressForm && (
          <form onSubmit={addAddress} className="space-y-2 mb-4 border-t pt-4">
            <input
              className="w-full border p-2 rounded text-sm"
              placeholder="Street Address"
              value={addressForm.streetAddress}
              onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="border p-2 rounded text-sm"
                placeholder="City"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                required
              />
              <input
                className="border p-2 rounded text-sm"
                placeholder="State"
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                required
              />
            </div>
            <input
              className="w-full border p-2 rounded text-sm"
              placeholder="Postal Code"
              value={addressForm.postalCode}
              onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
              required
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">
              Save Address
            </button>
          </form>
        )}

        <div className="space-y-2">
          {(user.addresses || []).length === 0 ? (
            <p className="text-gray-500 text-sm">No addresses saved yet.</p>
          ) : (
            user.addresses.map((addr, i) => (
              <div key={i} className="flex justify-between items-start bg-gray-50 p-3 rounded-lg">
                <div className="text-sm">
                  <p className="font-medium">{addr.label || 'Home'}</p>
                  <p>{addr.streetAddress}, {addr.city}, {addr.state} - {addr.postalCode}</p>
                </div>
                <button
                  onClick={() => deleteAddress(i)}
                  className="text-red-500 text-xs"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
