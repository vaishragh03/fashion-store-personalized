import { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  const categories = ['Men', 'Women', 'Footwear', 'Accessories'];

  useEffect(() => {
    fetchProducts();
  }, [search, category, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products';
      const params = [];
      
      if (category) params.push(`category=${category}`);
      if (search) params.push(`search=${search}`);
      if (sortBy) params.push(`sort=${sortBy}`);
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      const res = await API.get(url);
      setProducts(res.data.data || []);
    } catch (err) {
      console.log('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Trending Fashion Picks</h1>

      {/* FILTERS */}
      <div className="mb-6 space-y-4">
        {/* SEARCH */}
        <div>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* CATEGORY & SORT */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setCategory('')}
            className={`p-2 rounded-lg text-sm font-semibold ${
              category === '' 
                ? 'bg-indigo-600 text-white' 
                : 'border border-gray-300 hover:border-indigo-600'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`p-2 rounded-lg text-sm font-semibold ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'border border-gray-300 hover:border-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SORT */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value="">Sort by...</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* PRODUCTS GRID */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No products found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
