import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  let navigate = useNavigate();
  let [error, setError] = useState(null);

  async function changePassword(values) {
    try {
      const { data } = await axios.put(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        values
      );
      if (data.token) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  const schema = yup.object({
    email: yup
      .string()
      .email("Email is not valid")
      .required("Email is required"),
    newPassword: yup
      .string()
      .matches(/[A-Z][a-z0-9]{4,20}$/, "Password must start with a capital letter and be 5-20 characters long")
      .required("Password is required"),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
    },
    validationSchema: schema,
    onSubmit: changePassword,
  });

  return (
    <>
      <h2>
        <title>Reset Password</title>
      </h2>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Reset Your Password
          </h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Enter your email address and a new password to reset your account password.
          </p>

          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded-md text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formik.errors.email && formik.touched.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="email"
                id="email"
                placeholder="you@example.com"
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded-md text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formik.errors.newPassword && formik.touched.newPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="password"
                id="newPassword"
                placeholder="Enter a new password"
                value={formik.values.newPassword}
              />
              {formik.errors.newPassword && formik.touched.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.newPassword}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 p-2 rounded text-sm">
                {error}
              </div>
            )}

            <button
              disabled={!(formik.isValid && formik.dirty)}
              type="submit"
              className={`w-full py-2 text-white rounded-md shadow ${
                formik.isValid && formik.dirty
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-indigo-300 cursor-not-allowed"
              }`}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}