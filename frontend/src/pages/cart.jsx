import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cart,setCart] = useState(null);

  useEffect(()=>{
    const currCart=JSON.parse(localStorage.getItem('cart'));
    if(currCart.items.length === 0) { navigate(-1); return;}
    setCart(currCart);
  },[navigate]);

  const totalAmount = () => {
    return cart.items.reduce(
      (sum,item) => sum + item.price*item.quantity,0
    );
  };

  if (!cart) return null;

  return(
    <div>
      <div>
        <h1>Your Cart</h1>
        <div>
          {cart.items.map((item)=>(
            <div>
              <div>
                <h2>{item.name}</h2>
                <p>{item.price} x {item.quantity}</p>
              </div>
              <span> ₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div>
            <span>Total</span>
            <span>₹{totalAmount()}</span>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Cart;