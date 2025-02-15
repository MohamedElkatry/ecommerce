import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaHome,
  FaBox,
  FaTruck,
  FaCreditCard,
  FaPhone,
  FaCity,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaSort,
} from "react-icons/fa";

export default function AllOrders() {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc"); // الافتراضي الأحدث أولًا
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("userToken");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      const { id } = decodedToken;
      const { data } = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${id}`
      );
      const sortedOrders = [...data].sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
      setUserOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setUserOrders((prevOrders) =>
      [...prevOrders].reverse() // عكس الترتيب بدل إعادة الفتش
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-4xl font-bold text-blue-900 flex items-center justify-center">
            <FaBox className="mr-3" /> Your Orders
          </h2>
          <button
            onClick={toggleSortOrder}
            className="bg-blue-600 text-white font-semibold py-1 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300 flex items-center mt-3 text-sm"
          >
            <FaSort className="mr-2" /> {sortOrder === "desc" ? "Oldest First" : "Newest First"}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[600px]">
            <FaSpinner className="animate-spin text-4xl text-blue-700" />
            <p className="text-lg font-semibold text-blue-700 ml-3">
              Loading...
            </p>
          </div>
        ) : userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[600px]">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              You have no orders yet.
            </h2>
            <button
              onClick={() => navigate("/home")}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center"
            >
              <FaHome className="mr-2" /> Go to Home
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {userOrders.map((order, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-blue-900 flex items-center">
                      <FaBox className="mr-2" /> Order ID: {order.id}
                    </p>
                    <p className="text-lg text-blue-700 flex items-center">
                      <FaCreditCard className="mr-2" /> Total Cost:{" "}
                      {order.totalOrderPrice} EGP
                    </p>
                    {order.createdAt && (
                      <p className="text-md text-gray-600 flex items-center">
                        📅 Order Date:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-white font-bold mt-4 sm:mt-0 flex items-center ${
                      order.isDelivered ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {order.isDelivered ? (
                      <FaCheckCircle className="mr-2" />
                    ) : (
                      <FaClock className="mr-2" />
                    )}
                    {order.isDelivered ? "Delivered" : "Pending"}
                  </div>
                </div>

                <div className="border-t border-blue-100 pt-6">
                  <p className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                    <FaCreditCard className="mr-2" /> Payment Method:{" "}
                    {order.paymentMethodType}
                  </p>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-blue-800 flex items-center">
                      <FaTruck className="mr-2" /> Shipping Info:
                    </p>
                    <p className="text-blue-700 flex items-center">
                      <FaPhone className="mr-2" /> Phone:{" "}
                      {order.shippingAddress?.phone || "N/A"}
                    </p>
                    <p className="text-blue-700 flex items-center">
                      <FaCity className="mr-2" /> City:{" "}
                      {order.shippingAddress?.city || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    <FaBox className="mr-2" /> Products
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {order.cartItems?.map((item, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <p className="text-lg font-bold text-blue-900">
                          {item?.product?.title}
                        </p>
                        <p className="text-blue-700">Count: {item?.count}</p>
                        <p className="text-blue-900 font-bold mt-2">
                          Price: {item?.price} EGP
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
