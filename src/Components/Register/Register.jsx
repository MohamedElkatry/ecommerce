// eslint-disable-next-line
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../Context/UserContext';

export default function Register() {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  let { setUserToken, setUserName } = useContext(UserContext);
  let navigate = useNavigate();

  async function register(values) {
    try {
      setLoading(true);
      let { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        values
      );

      localStorage.setItem("userToken", data.token);
      localStorage.setItem('userName', data.user.name);
     
      setUserToken(data.token);
      setUserName(data.user.name);
      
      navigate("/home");
    } catch (err) {
      setApiError(err.response.data.message);
      setLoading(false);
    }
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(3).max(15),
    email: Yup.string().required("Email is required").email("Invalid email format"),
    password: Yup.string()
      .required("Password is required")
      .matches(/^[A-Z]\w{4,15}$/, "Must start with uppercase and be 4-15 chars long"),
    rePassword: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
    phone: Yup.string().required("Phone is required").matches(/^01[0125][0-9]{8}$/, "Invalid phone number"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", rePassword: "", phone: "" },
    validationSchema,
    onSubmit: register,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-6">Create Account</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Input Fields */}
          {["name", "email", "password", "rePassword", "phone"].map((field, index) => (
            <div key={index} className="relative">
              <input
                type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                name={field}
                id={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#FFD700] outline-none"
                placeholder={field === "rePassword" ? "Confirm Password" : `Enter your ${field}`}
              />
              {formik.errors[field] && formik.touched[field] && (
                <p className="text-sm text-red-500 mt-1">{formik.errors[field]}</p>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#1E3A8A] hover:bg-[#142c64] text-white font-bold rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>

          {/* API Error Message */}
          {apiError && <p className="text-red-500 text-center mt-4">{apiError}</p>}
        </form>
      </div>
    </div>
  );
}
