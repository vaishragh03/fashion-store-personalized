import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Men', 'Women', 'Footwear', 'Accessories'];

const Home = () => {
  const { token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const url = category === 'All' ? '/products' : `/products?category=${category}`;
        const res = await API.get(url);
        setProducts(res.data.data || []);

        if (token) {
          try {
            const rec = await API.get('/recommendations');
            setRecommendations(rec.data.data || []);
          } catch {
            setRecommendations([]);
          }
        } else {
          setRecommendations([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, token]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Fashion Boutique</h1>
      <p className="text-gray-500 mb-6">Personalized fashion for every style</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              category === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {token && recommendations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.slice(0, 4).map((p) => (
              <ProductCard key={`rec-${p._id}`} product={p} />
            ))}
          </div>
        </section>
      )}

      <h2 className="text-xl font-bold mb-4">
        {category === 'All' ? 'All Products' : `${category} Collection`}
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
