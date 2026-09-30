import { createContext, useState, useEffect, useContext } from "react";
import api, { authHeaders } from "../services/api";
import toast from "react-hot-toast";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const [cart, setCart] = useState(null);
  const { userToken } = useContext(UserContext);

  // Function to fetch the cart
  async function getProductToCart() {
    try {
      const { data } = await api.get("/cart", authHeaders());
      setCart(data); // Update the cart state
    } catch (err) {
      console.log(err);
    }
  }

  // Add product to cart
  async function addProductToCart(productId) {
    try {
      await offlinePost();
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
      await api.put(`/cart/${productId}`, { count }, authHeaders());
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
      await api.delete(`/cart/${productId}`, authHeaders());
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
    if (userToken) {
      getProductToCart();
    } else {
      clearCart();
    }
  }, [userToken]);

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
