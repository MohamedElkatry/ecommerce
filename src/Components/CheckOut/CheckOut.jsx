// eslint-disable-next-line
import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import { CartContext } from "../../Context/CartContext";
import { FaCity, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function CheckOut() {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  let { cart } = useContext(CartContext);

  async function handleCheckOut(values) {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");

      if (!token) {
        toast.error("You must be logged in!");
        return;
      }

      let shippingData = {
        city: values.city,
        phone: values.phone,
        details: values.details,
      };

      let { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cart.cartId}?url=http://localhost:5173`,
        { shippingAddress: shippingData }, // تأكدنا إنه بيبعت بيانات الشحن
        { headers: { token } }
      );

      toast.success("Redirecting to payment...");
      window.open(data.session.url, "_self");
    } catch (err) {
      setApiError(err.response?.data?.message || "Something went wrong!");
      toast.error("Checkout failed!");
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      city: "",
      details: "",
      phone: "",
    },
    onSubmit: handleCheckOut,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-[#1E3A8A] text-center mb-6">
          Checkout
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* City Input */}
          <div className="relative">
            <FaCity className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              name="city"
              id="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none"
              placeholder="Enter your city"
              required
            />
          </div>

          {/* Phone Input */}
          <div className="relative">
            <FaPhone className="absolute left-3 top-3 text-gray-500" />
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none"
              placeholder="Enter your phone"
              required
            />
          </div>

          {/* Address Input */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              name="details"
              id="details"
              value={formik.values.details}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none"
              placeholder="Enter your address details"
              required
            />
          </div>

          {/* API Error Message */}
          {apiError && (
            <p className="text-red-500 text-sm font-medium text-center">
              {apiError}
            </p>
          )}

          {/* Checkout Button */}
          <button
            type="submit"
            className="w-full py-3 text-white bg-[#1E3A8A] rounded-lg font-bold text-lg hover:bg-[#162D69] transition flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </form>
      </div>
    </div>
  );
}
