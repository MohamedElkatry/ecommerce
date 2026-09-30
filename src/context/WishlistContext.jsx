/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";
import api, { authHeaders } from "../services/api";
import toast from "react-hot-toast";
import { UserContext } from "./UserContext";

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { userToken } = useContext(UserContext);

  // Fetch wishlist
  async function getWishlist() {
    try {
      const { data } = await api.get("/wishlist", authHeaders());
      console.log("Wishlist fetched:", data?.data);
      setWishlist(data?.data || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      toast.error("An error occurred while fetching the wishlist");
    }
  }

  // Add product to wishlist
  async function addToWishlist(productOrId) {
    const productId = typeof productOrId === "object" && productOrId !== null ? productOrId.id : productOrId;
    try {
      const { data } = await api.post("/wishlist", { productId }, authHeaders());
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
      const { data } = await api.delete(`/wishlist/${productId}`, authHeaders());
      console.log("Product removed from wishlist:", data);
      toast.success("Product removed from wishlist 💔");

      getWishlist(); // Refresh wishlist after removing
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("An error occurred while removing the product from the wishlist");
    }
  }

  useEffect(() => {
    if (userToken) {
      getWishlist();
    } else {
      setWishlist([]);
    }
  }, [userToken]);

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
