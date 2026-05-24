import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import API from '../api/axios';
import ProductImage from '../components/ProductImage';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { token } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0),
    [cartItems]
  );

  const shippingPrice = subtotal > 999 ? 0 : subtotal > 0 ? 49 : 0;
  const discountRate =
    appliedCoupon === 'FASHION10' ? 0.1 : appliedCoupon === 'WELCOME20' ? 0.2 : 0;
  const discount = Math.round(subtotal * discountRate);
  const totalPrice = subtotal + shippingPrice - discount;

  const applyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (code === 'FASHION10' || code === 'WELCOME20') {
      setAppliedCoupon(code);
      setError('');
    } else {
      setError('Invalid coupon. Try FASHION10 or WELCOME20');
    }
  };

  const handleCheckout = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) return;

    setCheckoutLoading(true);
    setError('');

    try {
      let shippingAddress = {
        streetAddress: '123 Demo Street',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600001'
      };

      try {
        const profileRes = await API.get('/users/profile');
        const addresses = profileRes.data.user?.addresses || [];
        if (addresses.length > 0) {
          const a = addresses[0];
          shippingAddress = {
            streetAddress: a.streetAddress,
            city: a.city,
            state: a.state,
            postalCode: a.postalCode,
            country: a.country
          };
        }
      } catch {
        // use default address
      }

      await API.post('/orders', {
        items: cartItems.map((item) => ({
          product: item.productId,
          title: item.title,
          quantity: item.quantity || 1,
          size: item.size,
          color: item.color,
          price: item.price
        })),
        shippingAddress,
        couponCode: appliedCoupon || undefined,
        subtotal,
        shippingPrice,
        totalPrice
      });

      dispatch(clearCart());
      navigate('/order-success');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Cart is empty. <a href="/" className="text-indigo-600">Shop now</a></p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex items-center justify-between border p-4 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <ProductImage
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                  />
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-sm text-gray-500">{item.size} / {item.color}</p>
                    <p className="text-sm font-bold text-indigo-600">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ index, quantity: (item.quantity || 1) - 1 }))
                    }
                    className="w-8 h-8 border rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ index, quantity: (item.quantity || 1) + 1 }))
                    }
                    className="w-8 h-8 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart(index))}
                    className="text-red-500 text-sm ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border p-4 rounded-xl h-fit space-y-3">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 border p-2 rounded text-sm"
              />
              <button
                onClick={applyCoupon}
                className="bg-gray-800 text-white px-3 py-2 rounded text-sm"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-green-600 text-sm">Coupon {appliedCoupon} applied!</p>
            )}

            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span className="text-indigo-600">₹{totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
            >
              {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            <p className="text-xs text-gray-400 text-center">Coupons: FASHION10 (10%), WELCOME20 (20%)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
