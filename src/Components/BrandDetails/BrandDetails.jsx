import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { WishlistContext } from "../../context/WishlistContext";
import { CartContext } from "../../Context/CartContext";
import Loading from "../Loading/Loading";
import chickSound from "../../../public/sounds/chick.wav"

const playClickSound = () => {
  const sound = new Audio(chickSound);
  sound.play().catch((error) => console.error("Error playing sound:", error));
};

export default function BrandDetails() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addProductToCart } = useContext(CartContext);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    async function fetchBrandDetails() {
      try {
        const brandResponse = await axios.get(`https://ecommerce.routemisr.com/api/v1/brands/${id}`);
        setBrand(brandResponse.data.data);

        const productResponse = await axios.get(`https://ecommerce.routemisr.com/api/v1/products?brand=${id}`);
        setProducts(productResponse.data.data);
      } catch (error) {
        console.error("Error fetching brand or products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBrandDetails();
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

  const handleLikeClick = (product) => {
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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
        <Loading />
      </div>
    );
  }

  if (!brand) {
    return <div className="text-center text-red-500 text-lg mt-10">⚠️ Brand not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <img src={brand.image} alt={brand.name} className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-lg shadow-md" />
          <h2 className="text-4xl font-extrabold text-gray-800">{brand.name}</h2>
        </div>
      </div>

      <h3 className="text-3xl font-bold text-center mt-10 text-gray-800">{brand.name} Products 🛒</h3>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-6">❌ No products available for this brand.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
          {products.map((product) => (
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
                  onClick={() => { playClickSound(); addProductToCart(product.id); }}
                  className="w-full bg-[#1E3A8A] text-white px-4 py-2 rounded-lg hover:bg-[#12275d] transition"
                >
                  Add to Cart
                </button>
                <i
                  className={`fas fa-heart cursor-pointer text-2xl ml-3 transition ${
                    liked[product.id] ? "text-red-500" : "text-gray-500 hover:text-red-500"
                  }`}
                  onClick={() => handleLikeClick(product)}
                ></i>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
