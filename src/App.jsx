import "./App.css";
import { RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Components/Home/Home.jsx";
import Cart from "./Components/Cart/Cart.jsx";
import Categories from "./Components/Categories/Categories.jsx";
import Brands from "./Components/Brands/Brands.jsx";
import Products from "./Components/Products/Products.jsx";
import Login from "./Components/Login/Login.jsx";
import Register from "./Components/Register/Register.jsx";
import NotFound from "./Components/NotFound/NotFound.jsx";
import UserContextProvider from "./Context/UserContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";
import ProductDetails from "./Components/ProductDetails/ProductDetails.jsx";
import CartContextProvider from "./Context/CartContext";
import WishlistContextProvider from "./context/WishlistContext.jsx"; // ✅ إضافة WishlistContextProvider
import { Toaster } from "react-hot-toast";
import CheckOut from "./Components/CheckOut/CheckOut.jsx";
import AllOrders from "./Components/AllOrders/AllOrders.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import Wishlist from "./Components/Wishlist/Wishlist.jsx";
import CategoryDetails from "./Components/CategoryDetails/CategoryDetails.jsx";
import BrandDetails from "./Components/BrandDetails/BrandDetails.jsx";
import ForgetPass from "./Components/ForgetPassword/ForgetPassword.jsx";
import ResetCode from "./Components/ResetCode/ResetCode.jsx";
import ResetPassword from "./Components/ResetPassword/ResetPassword.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import { createHashRouter } from "react-router-dom";

const query = new QueryClient();

// ✅ استخدمي createBrowserRouter

let routers = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "home", element: (<ProtectedRoute> <Home /> </ProtectedRoute>) },
      { path: "checkout", element: (<ProtectedRoute> <CheckOut /> </ProtectedRoute>) },
      { path: "cart", element: (<ProtectedRoute> <Cart /> </ProtectedRoute>) },
      { path: "allorders", element: (<ProtectedRoute> <AllOrders /> </ProtectedRoute>) },
      { path: "brands", element: (<ProtectedRoute> <Brands /> </ProtectedRoute>) },
      { path: "categories", element: (<ProtectedRoute> <Categories /> </ProtectedRoute>) },
      { path: "products", element: (<ProtectedRoute> <Products /> </ProtectedRoute>) },
      { path: "category/:id", element: (<ProtectedRoute> <CategoryDetails /> </ProtectedRoute>) },      
      { path: "wishlist", element: (<ProtectedRoute> <Wishlist /> </ProtectedRoute>) },
      { path: "productdetails/:id", element: (<ProtectedRoute> <ProductDetails /> </ProtectedRoute>) },
      { path: "brands/:id", element: <ProtectedRoute><BrandDetails /></ProtectedRoute> },
      { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "forgotpassword", element: <ForgetPass /> },
      { path: "ResetCode", element: <ResetCode /> },
      { path: "ResetPassword", element: <ResetPassword /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

 // ✅ تعريف query هنا

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={query}>
        <CartContextProvider>
          <UserContextProvider>
            <WishlistContextProvider>
              <RouterProvider router={routers} />
              <ReactQueryDevtools />
              <Toaster />
            </WishlistContextProvider>
          </UserContextProvider>
        </CartContextProvider>
      </QueryClientProvider>
    </Provider>
  );
}



export default App;
