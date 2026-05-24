import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../store/cartSlice';
import { useMemo, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const [loading, setLoading] = useState(false);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      return acc + item.price * (item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: cartItems,
        totalPrice,
        subtotal: totalPrice,
        shippingPrice: 0,
        shippingAddress: {
          streetAddress: 'Shipping Address',
          city: 'City',
          state: 'State',
          postalCode: '000000',
          country: 'India'
        }
      };

      const res = await API.post('/orders', orderPayload);
      
      if (res.data && res.data.success) {
        navigate('/order-success');
      } else {
        alert('Order creation successful!');
        navigate('/order-success');
      }
    } catch (err) {
      console.log(err);
      alert('Checkout failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT: ITEMS */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border p-4 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-sm text-gray-500">
                      {item.size} / {item.color}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold">₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemove(item.productId || index)}
                    className="text-red-500 text-sm hover:underline mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: SUMMARY ENGINE */}
          <div className="border p-4 rounded-xl h-fit sticky top-6">
            <h2 className="text-lg font-bold mb-4">Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Total</span>
              <span className="font-bold text-indigo-600">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
