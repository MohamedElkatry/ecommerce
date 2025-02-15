import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const [cart, setCart] = useState(null);

  // Function to fetch the cart
  async function getProductToCart() {
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/cart",
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );
      setCart(data); // Update the cart state
    } catch (err) {
      console.log(err);
    }
  }

  // Add product to cart
  async function addProductToCart(productId) {
    try {
      await axios.post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { productId },
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );
      await getProductToCart(); // Refresh cart after adding
      toast.success("Product added to cart successfully");
    } catch (err) {
      console.log(err);
      toast.error("Error adding product to cart");
    }
  }

  // Update product count in the cart
  async function updateProductCountToCart(productId, count) {
    try {
      await axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { count },
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );
      await getProductToCart(); // Refresh cart after updating
      toast.success("Product count updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Error updating product count");
    }
  }

  // Remove product from cart
  async function deleteProductCart(productId) {
    try {
      await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );
      await getProductToCart(); // Refresh cart after deleting
      toast.success("Product removed from cart successfully");
    } catch (err) {
      console.log(err);
      toast.error("Error removing product from cart");
    }
  }

  // Clear cart on logout
  function clearCart() {
    setCart(null); // Clear the cart state
  }

  // Listen for user token changes and fetch the new cart
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      getProductToCart(); // Fetch cart for the logged-in user
    } else {
      clearCart(); // Clear cart if no user is logged in
    }
  }, [localStorage.getItem("userToken")]); // Trigger when the token changes

  return (
    <CartContext.Provider
      value={{
        cart,
        addProductToCart,
        updateProductCountToCart,
        deleteProductCart,
        getProductToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
