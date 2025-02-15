import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetCode() {
  let navigate = useNavigate();
  let [error, setError] = useState(null);

  async function sendCode(values) {
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        values
      );
      if (data.status === "Success") {
        navigate("/ResetPassword");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  const schema = yup.object({
    resetCode: yup
      .string()
      .required("You can't change your password without a reset code"),
  });

  let formik = useFormik({
    initialValues: {
      resetCode: "",
    },
    validationSchema: schema,
    onSubmit: sendCode,
  });

  return (
    <>
      <h2>
        <title>Reset Code</title>
      </h2>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Enter Reset Code
          </h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Please check your email for the reset code and enter it below to verify.
          </p>

          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="resetCode"
                className="block text-sm font-medium text-gray-700"
              >
                Reset Code
              </label>
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded-md text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formik.errors.resetCode && formik.touched.resetCode
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="text"
                id="resetCode"
                placeholder="Enter reset code"
                value={formik.values.resetCode}
              />
              {formik.errors.resetCode && formik.touched.resetCode && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.resetCode}
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
              Verify Reset Code
            </button>
          </form>
        </div>
      </div>
    </>
  );
}