import React, { useContext, useEffect, useState } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContext"; // استدعاء الـ CartContext
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addProductToCart } = useContext(CartContext); // استخدام دالة الإضافة
  const [wishlistItems, setWishlistItems] = useState([]);

  // تحديث قائمة الأمنيات عند تحميل الصفحة
  useEffect(() => {
    setWishlistItems([...wishlist]);
  }, [wishlist]);

  const playClickSound = () => {
    const sound = new Audio("/sounds/chick.wav");
    sound.play().catch((error) => console.error("Error playing sound:", error));
  };

  const handleRemove = (id) => {
    playClickSound();
    removeFromWishlist(id);
    setWishlistItems(wishlistItems.filter((product) => product.id !== id));

    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
    delete savedWishlist[id];
    localStorage.setItem("wishlist", JSON.stringify(savedWishlist));
    window.dispatchEvent(new Event("storage"));
  };

  const handleAddToCart = async (id) => {
    playClickSound();
    await addProductToCart(id); // إضافة المنتج للعربة
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#1E3A8A] mb-8">
          Your Wishlist ❤️
        </h2>
        {wishlistItems.length === 0 ? (
          <p className="text-gray-500 text-center">No products in your wishlist yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
                <Link to={`/productdetails/${product.id}`} className="w-full" onClick={playClickSound}>
                  <img
                    src={product.imageCover}
                    className="w-full rounded-lg mb-4"
                    alt={product.title}
                  />
                  <h3 className="text-lg font-semibold text-[#1E3A8A] text-center">
                    {product.title?.split(" ", 2).join(" ") || "Unnamed Product"}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {product.category?.name || "Uncategorized"}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[#1E3A8A] font-bold">
                      {product.price ? `${product.price} EGP` : "Not Available"}
                    </span>
                    <span className="text-yellow-500">
                      <i className="fas fa-star"></i> {product.ratingsAverage || "N/A"}
                    </span>
                  </div>
                </Link>

                {/* زر Add to Cart */}
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="w-full mt-3 py-2 bg-[#1E3A8A] text-white font-semibold rounded-lg shadow-md hover:bg-[#162c70] transition duration-300"
                >
                  Add to Cart 🛒
                </button>

                {/* زر Remove from Wishlist */}
                <button
                  onClick={() => handleRemove(product.id)}
                  className="w-full mt-3 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                >
                  Remove from Wishlist 💔
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
