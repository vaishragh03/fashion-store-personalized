import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import VariantSelector from '../components/VariantSelector';
import ProductImage from '../components/ProductImage';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await API.get(`/products/${id}`);
      const data = res.data.data || res.data;
      setProduct(data);

      try {
        await API.patch('/users/track-view', {
          category: data.category,
          tags: data.tags || []
        });
      } catch {
        // guest users skip tracking
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock < 1) return;

    dispatch(
      addToCart({
        productId: product._id,
        product: product._id,
        title: product.title,
        price: product.basePrice + (selectedVariant.additionalPrice || 0),
        size: selectedVariant.size,
        color: selectedVariant.colorName,
        image: product.images[0],
        quantity: 1
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
      <div>
        <ProductImage
          src={product.images?.[0]}
          alt={product.title}
          className="rounded-xl w-full object-cover max-h-96 bg-gray-100"
        />
      </div>

      <div className="space-y-4">
        <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
          {product.category}
        </span>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-gray-500">{product.description}</p>

        <VariantSelector
          variants={product.variants}
          basePrice={product.basePrice}
          onSelectionChange={setSelectedVariant}
        />

        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock < 1}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
        >
          {added ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
