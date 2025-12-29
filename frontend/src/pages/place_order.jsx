import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

const PlaceOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      loadCart();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await API.get(`api/orders/${orderId}/`);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to fetch order", err);
      setError("Failed to load order details.");
    }
    setLoading(false);
  };

  const loadCart = () => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cart'));
      if (storedCart && storedCart.items && storedCart.items.length > 0) {
        setCart(storedCart);
      } else {
        setCart(null);
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  };

  const handlePlaceOrder = async () => {
    console.log("Confirm Order clicked");
    console.log("Cart state:", cart);

    if (!cart) {
      console.error("Cart is null");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      table: cart.tableId,
      ordered_items: cart.items.map(item => ({
        item_id: item.id,
        qty: item.quantity
      }))
    };

    try {
      console.log("Placing order to:", `api/restaurants/${cart.restaurantId}/orders/`);
      console.log("Payload:", payload);
      const res = await API.post(`api/restaurants/${cart.restaurantId}/orders/`, payload);
      localStorage.removeItem('cart');
      navigate(`/place-order/${res.data.id}`);
    } catch (err) {
      console.error("Failed to place order", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
        setError(`Failed to place order: ${JSON.stringify(err.response.data)}`);
      } else {
        setError("Failed to place order. Please try again.");
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-2xl text-amber-900">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
        <p className="text-2xl text-red-800 mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-amber-900 text-white rounded hover:bg-amber-800">
          Go Home
        </button>
      </div>
    );
  }

  if (orderId && order) {
    return (
      <div className="min-h-screen bg-amber-50 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-amber-200">
          <div className="bg-amber-900 p-6 text-white text-center">
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="mt-2 text-amber-100">Order #{order.id}</p>
            <div className="mt-4 inline-block px-4 py-1 bg-amber-800 rounded-full text-sm font-semibold uppercase tracking-wide">
              Status: {order.status}
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-amber-900 mb-4 border-b border-amber-100 pb-2">Order Details</h2>
            <div className="space-y-4">
              {order.ordered_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 w-8 h-8 flex items-center justify-center rounded-full text-amber-800 font-bold text-sm">
                      {item.qty}x
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.item.price}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">₹{(item.item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-amber-200">
              <div className="flex justify-between items-center text-2xl font-bold text-amber-900">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-6 text-center">
            <p className="text-amber-800 mb-4">Thank you for dining with us!</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition shadow-md font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (!orderId) {
    if (!cart) {
      return (
        <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
          <p className="text-2xl text-amber-900 mb-6">Your cart is empty.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-amber-900 text-white rounded hover:bg-amber-800">
            Browse Menu
          </button>
        </div>
      );
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 0), 0).toFixed(2);

    return (
      <div className="min-h-screen bg-amber-50 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-amber-200">
          <div className="bg-amber-900 p-6 text-white">
            <h1 className="text-3xl font-bold text-center">Review Order</h1>
          </div>

          <div className="p-6">
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-amber-900">{item.quantity}x</span>
                    <span className="text-gray-800">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-2xl font-bold text-amber-900 pt-4 border-t-2 border-amber-100">
              <span>Total to Pay</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <div className="p-6 bg-amber-50 flex gap-4">
            <button
              onClick={() => navigate('/cart')}
              className="flex-1 px-4 py-3 border-2 border-amber-900 text-amber-900 rounded-lg hover:bg-amber-100 font-semibold transition"
            >
              Edit Cart
            </button>
            <button
              onClick={handlePlaceOrder}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-md transition"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PlaceOrder;


