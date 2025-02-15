/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Fetch wishlist
  async function getWishlist() {
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );
      console.log("Wishlist fetched:", data?.data);
      setWishlist(data?.data || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      toast.error("An error occurred while fetching the wishlist");
    }
  }

  // Add product to wishlist
  async function addToWishlist(productId) {
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { productId },
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );
      console.log("Product added to wishlist:", data);
      toast.success("Product added to wishlist ❤️");

      getWishlist(); // Refresh wishlist after adding
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      toast.error("An error occurred while adding the product to the wishlist");
    }
  }

  // Remove product from wishlist
  async function removeFromWishlist(productId) {
    try {
      const { data } = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );
      console.log("Product removed from wishlist:", data);
      toast.success("Product removed from wishlist 💔");

      getWishlist(); // Refresh wishlist after removing
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("An error occurred while removing the product from the wishlist");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      getWishlist(); // Fetch wishlist on page load
    }
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        getWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
