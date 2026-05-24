import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="p-10 text-center space-y-4 max-w-lg mx-auto">
      <div className="text-6xl">🎉</div>
      <h1 className="text-3xl font-bold text-green-600">Order Placed Successfully!</h1>
      <p className="text-gray-500">
        A confirmation email has been sent to your inbox. You can download your invoice from order history.
      </p>
      <div className="flex gap-4 justify-center pt-4">
        <Link to="/order-history" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
          View Orders
        </Link>
        <Link to="/" className="border px-4 py-2 rounded-lg">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
