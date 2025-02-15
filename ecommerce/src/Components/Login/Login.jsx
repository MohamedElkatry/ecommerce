// eslint-disable-next-line
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function Login() {
  const [apiErrr, setApiErrr] = useState(null);
  const [loading, setLoading] = useState(false);

  let { setUserToken, setUserName } = useContext(UserContext);
  let navigate = useNavigate();

  async function login(values) {
    try {
      setLoading(true);
      let { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        values
      );
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userName", data.user.name);
      setUserToken(data.token);
      setUserName(data.user.name);
      navigate("/home");
    } catch (err) {
      setApiErrr(err.response.data.message);
      setLoading(false);
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^[A-Z]\w{4,15}$/,
        "Password must start with an uppercase letter and be 4-15 characters long"
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: login,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-6">
          Login
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#FFD700] outline-none"
              placeholder="Enter your email"
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#FFD700] outline-none"
              placeholder="Enter your password"
            />
            {formik.errors.password && formik.touched.password && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#1E3A8A] hover:bg-[#142c64] text-white font-bold rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          {apiErrr && (
            <p className="text-red-500 text-center mt-4">{apiErrr}</p>
          )}
        </form>
        <div className="mt-4 text-center">
          <Link to="/forgotpassword" className="text-[#1E3A8A] hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
