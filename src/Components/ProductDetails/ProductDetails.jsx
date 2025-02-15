import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import { CartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import chickSound from "../../../public/sounds/chick.wav"

const playClickSound = () => {
  const sound = new Audio(chickSound);
  sound.play().catch((error) => console.error("Error playing sound:", error));
};

export default function ProductDetails() {
  const { addProductToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});

  let { id } = useParams();

  useEffect(() => {
    async function getProduct(productId) {
      try {
        let { data } = await axios.get(
          `https://ecommerce.routemisr.com/api/v1/products/${productId}`
        );
        setProduct(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }
    getProduct(id);
  }, [id]);

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

 

  const handleLikeClick = () => {
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

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <p className="text-white text-lg">Loading product details...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg p-6 gap-8">
            {/* Product Image Slider */}
            <div className="w-full md:w-1/2">
              <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1} autoplay={true} autoplaySpeed={2500}>
                {product.images.map((image, index) => (
                  <img key={index} src={image} className="w-full rounded-lg shadow-md" alt={product.title} />
                ))}
              </Slider>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2 p-4 text-gray-900">
              <h2 className="text-3xl font-extrabold text-[#1E3A8A] mb-4">{product.title}</h2>
              <p className="text-lg text-gray-600 mb-4">{product.description}</p>
              <p className="text-md font-semibold text-gray-700">Category: {product.category.name}</p>

              {/* Price and Ratings */}
              <div className="flex justify-between items-center my-4">
                <span className="text-2xl font-bold text-[#1E3A8A]">{product.price} EGP</span>
                <span className="text-lg text-gray-700 flex items-center">
                  <FaStar className="text-yellow-400 mr-1" /> {product.ratingsAverage}
                </span>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => {
                    playClickSound();
                    addProductToCart(product.id);
                  }}
                  className="w-full py-3 bg-[#1E3A8A] text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-[#12275d] transition duration-300"
                >
                  <FaShoppingCart className="text-lg" /> Add to Cart
                </button>
                <button
                  onClick={handleLikeClick}
                  className={`w-16 h-12 flex items-center justify-center rounded-lg shadow-md transition ${
                    liked[product.id] ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <FaHeart className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
