import API from '../api/api';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Menu = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [restaurantData, setRestaurantData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Extract QR token from localStorage (set on home page)
  const qrtoken = localStorage.getItem('qrtoken');

  // Fetch restaurant details
  useEffect(() => {
    if (!qrtoken) return;
    const fetchDetails = async () => {
      try {
        const res = await API.get(`api/restaurants/by-qr/${qrtoken}/`);
        setRestaurantData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [qrtoken]);

  // Fetch menu items for the selected category
  useEffect(() => {
    if (!restaurantData || !category) return;

    const fetchMenu = async () => {
      setLoading(true);
      try {
        const restaurantId = restaurantData.restaurant_id || restaurantData.id;
        const res = await API.get(`api/restaurants/${restaurantId}/menu/`);
        const filtered = res.data.filter(
          (item) => item.meal_type.toLowerCase() === category.toLowerCase()
        );
        setMenuItems(filtered);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchMenu();
  }, [restaurantData, category]);

  const getCategoryLabel = (cat) => {
    const categories = {
      starters: 'Starters',
      main_course: 'Main Course',
      desserts: 'Desserts',
      drinks: 'Drinks',
      specials: 'Specials',
    };
    return categories[cat] || cat;
  };

  return (
    <div
      className="min-h-screen flex flex-col py-6 px-4"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-red-950 text-5xl text-center font-extrabold mb-4"
      >
        <h1>{restaurantData ? restaurantData.restaurant_name : 'Restaurant'}</h1>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex items-center gap-4 mb-6 mt-6"
      >
        <button
          onClick={() => navigate('/')}
          className="bg-stone-950 text-white px-4 py-2 ml-3 text-3xl rounded-2xl hover:bg-stone-800 transition"
        >
          ← Back
        </button>
        <h2 className="bg-yellow-200 text-slate-800 text-3xl font-bold px-4 py-2 rounded-2xl">
          {getCategoryLabel(category)}
        </h2>
      </motion.div>

      {loading ? (
        <p className="text-center text-gray-800 text-xl">Loading menu items...</p>
      ) : menuItems.length === 0 ? (
        <p className="text-center text-gray-800 text-xl">No items found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {item.image && (
                <img
                  src={`http://127.0.0.1:8000${item.image}`}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <h4 className="text-xl font-semibold text-green-600">₹{item.price}</h4>
                  <div className="flex gap-2 text-sm">
                    {item.is_veg && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Veg</span>
                    )}
                    {item.is_jain && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">Jain</span>
                    )}
                    {item.is_chefs_special && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Chef's Pick</span>
                    )}
                  </div>
                </div>
                <button className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-semibold">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
