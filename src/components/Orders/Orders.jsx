import React, { useEffect, useState } from "react";
import Cart from "../Cart/Cart";
import { Link } from "react-router-dom";
import ReviewItem from "../ReviewItem/ReviewItem";
import "./Orders.css";
import { deleteShoppingCart, removeFromDb } from "../../utilities/fakedb";
import cartProductsLoader from "../../loaders/cartProductsLoader";

const Orders = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cartItems = await cartProductsLoader();
        setCart(cartItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const handleRemoveFromCart = (id) => {
    const remaining = cart.filter((product) => product._id !== id);
    setCart(remaining);
    removeFromDb(id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="review-container">
        {cart?.map((product) => (
          <ReviewItem
            key={product._id}
            product={product}
            handleRemoveFromCart={handleRemoveFromCart}
          ></ReviewItem>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/checkout">
            <button className="btn-proceed">Proceed Checkout</button>
          </Link>
        </Cart>
      </div>
    </div>
  );
};

export default Orders;
