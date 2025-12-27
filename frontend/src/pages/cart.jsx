import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);

  useEffect(() => {
    let currCart = null;
    try { currCart = JSON.parse(localStorage.getItem('cart')); } catch (e) { currCart = null; }
    if (!currCart || !Array.isArray(currCart.items) || currCart.items.length === 0) { setCart({ items: [] }); return; }
    setCart(currCart);
  }, []);

  const updateCart = (newCart) => {
    try { localStorage.setItem('cart', JSON.stringify(newCart)); } catch (e) { console.error('Failed to save cart', e); }
    setCart(newCart);
  };

  const increaseQty = (itemId) => {
    const newCart = {
      ...cart,
      items: cart.items.map(it => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          quantity: (it.quantity ?? 0) + 1
        };
      })
    }
    updateCart(newCart);
  };

  const decreaseQty = (itemId) => {
    const newCart = {
      ...cart,
      items: cart.items.map(it => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          quantity: (it.quantity ?? 1) - 1
        };
      }).filter(it => it.quantity > 0)
    }
    updateCart(newCart);
  };

  const removeItem = (itemId) => {
    const newItems = cart.items.filter(it => it.id !== itemId);
    if (newItems.length === 0) { localStorage.removeItem('cart'); setCart({ items: [] }); return; }
    const newCart = { ...cart, items: newItems };
    updateCart(newCart);
  };

  const clearCart = () => {
    try { localStorage.removeItem('cart'); } catch (e) { console.error(e); }
    setCart({ items: [] });
  };

  const totalAmount = () => {
    return cart.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 0), 0).toFixed(2);
  };


  if (!cart) return null;

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-amber-200">
        <div className="bg-amber-900 p-6 text-white flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          {cart.items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sl bg-amber-800 hover:bg-red-800 px-3 py-1 rounded transition text-white"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-xl text-amber-900 mb-6 font-medium">Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-amber-900 text-white rounded hover:bg-amber-800 transition"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="p-6">
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img
                          src={`http://127.0.0.1:8000${item.image}`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-amber-100 rounded-md flex items-center justify-center text-amber-700">
                          No Img
                        </div>
                      )}
                    </div>

                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.is_veg ? 'Veg' : 'Non-Veg'}{item.is_jain ? ' • Jain' : ''}
                      </p>
                      <p className="font-semibold text-amber-900">₹{item.price}</p>
                    </div>

                    <div className="flex flex-col items-center sm:items-end gap-2">
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-amber-900 hover:bg-amber-100 rounded font-bold"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-medium text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-amber-900 hover:bg-amber-100 rounded font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-800 text-xl">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xl text-red-600 hover:text-red-800 underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t-2 border-amber-100">
                <div className="flex justify-between items-center text-2xl font-bold text-amber-900">
                  <span>Total</span>
                  <span>₹{totalAmount()}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-amber-50 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-4 py-3 border-2 border-amber-900 text-amber-900 rounded-lg hover:bg-amber-100 font-bold transition text-center"
              >
                Add More Items
              </button>
              <button
                onClick={() => navigate('/place-order')}
                className="flex-1 px-4 py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-800 font-bold shadow-md transition text-center"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;