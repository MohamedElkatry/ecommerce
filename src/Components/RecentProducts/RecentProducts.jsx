import React, { useContext, useState, useEffect } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom"; // إضافة useNavigate
import Loading from "../Loading/Loading";
import { WishlistContext } from "../../context/WishlistContext";
import { useQuery } from "@tanstack/react-query";
import { CartContext } from "../../Context/CartContext";
import chickSound from "../../../public/sounds/chick.wav";

const playClickSound = () => {
  const sound = new Audio(chickSound);
  sound.play().catch((error) => console.error("Error playing sound:", error));
};

export default function RecentProducts() {
  const { addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addProductToCart } = useContext(CartContext);
  const [liked, setLiked] = useState({});
  const navigate = useNavigate(); // إنشاء الـ navigate

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
    setLiked(savedWishlist);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedWishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
      setLiked(updatedWishlist);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  function getProducts() {
    return api.get("/products");
  }

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const handleLikeClick = (product) => {
    // إذا لم يكن المستخدم مسجل دخول، يتم توجيههم إلى صفحة الـ login
    const isAuthenticated = localStorage.getItem("userToken");
    if (!isAuthenticated) {
      return navigate("/login"); // التوجيه إلى صفحة الـ login
    }

    playClickSound();
    setLiked((prevState) => {
      const isLiked = !!prevState[product.id];
      const updatedLiked = { ...prevState, [product.id]: !isLiked };
      localStorage.setItem("wishlist", JSON.stringify(updatedLiked));
      if (isLiked) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
      window.dispatchEvent(new Event("storage"));
      return updatedLiked;
    });
  };

  const handleAddToCart = (product) => {
    const isAuthenticated = localStorage.getItem("userToken");
    if (!isAuthenticated) {
      return navigate("/login"); // التوجيه إلى صفحة الـ login
    }
    playClickSound();
    addProductToCart(product.id);
  };

  return (
    <div className="container mx-auto p-6">
      {isLoading ? (
        <Loading />
      ) : !data?.data?.data?.length ? (
        <p className="text-center text-gray-600 text-lg">No products to show.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {data.data.data.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105"
            >
              <Link to={`/productdetails/${product.id}`} className="w-full text-center">
                <img
                  src={product.imageCover}
                  className="w-full h-48 object-contain rounded-md mb-3"
                  alt={product.title}
                />
                <h3 className="text-[#1E3A8A] font-semibold">{product.category.name}</h3>
                <h3 className="text-lg font-bold text-black mt-1">
                  {product.title.split(" ", 2).join(" ")}
                </h3>
                <div className="flex justify-between items-center w-full mt-2">
                  <span className="text-[#FFD700] font-bold">{product.price} EGP</span>
                  <span className="text-gray-600 flex items-center">
                    <i className="fas fa-star text-yellow-500 mr-1"></i> {product.ratingsAverage}
                  </span>
                </div>
              </Link>
              <div className="flex items-center justify-between w-full mt-3">
                <button
                  onClick={() => handleAddToCart(product)} // استخدام handleAddToCart
                  className="w-full bg-[#1E3A8A] text-white px-4 py-2 rounded-lg hover:bg-[#12275d] transition"
                >
                  Add to Cart
                </button>
                <i
                  className={`fas fa-heart cursor-pointer text-2xl ml-3 transition ${
                    liked[product.id] ? "text-red-500" : "text-gray-500 hover:text-red-500"
                  }`}
                  onClick={() => handleLikeClick(product)} // استخدام handleLikeClick
                ></i>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
