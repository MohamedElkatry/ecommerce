// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("userToken");

//   return token ? children : <Navigate to="/login" />;
// }


import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("userToken");

  // لو فيه توكن، هتظهر الصفحة المطلوبة
  if (token) {
    return children;
  }

  // لو مفيش توكن، هتوجه المستخدم لصفحة الـ login فقط لو حاول يدخل الـ cart أو الـ wishlist
  if (window.location.pathname.includes("cart") || window.location.pathname.includes("wishlist")) {
    return <Navigate to="/login" />;
  }

  // لو مفيش توكن وفتح الصفحة الرئيسية أو صفحات تانية، يتم عرضها مباشرة
  return children;
}
