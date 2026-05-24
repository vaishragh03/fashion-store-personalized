import { useNavigate } from 'react-router-dom';
import ProductImage from './ProductImage';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
    >
      <ProductImage
        src={product.images?.[0]}
        alt={product.title}
        className="h-48 w-full object-cover rounded-lg bg-gray-100"
      />

      <h2 className="mt-2 font-semibold">{product.title}</h2>
      <p className="text-sm text-gray-500">{product.category}</p>

      <p className="mt-1 font-bold text-indigo-600">
        ₹{product.basePrice}
      </p>
    </div>
  );
};

export default ProductCard;