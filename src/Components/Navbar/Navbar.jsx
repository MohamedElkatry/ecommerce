import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/Logo.png";
import { UserContext } from "../../Context/UserContext";
import { CartContext } from "../../Context/CartContext";
import chickSound from "../../../public/sounds/chick.wav";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userToken, setUserToken } = useContext(UserContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  // تشغيل الصوت
  const playClickSound = () => {
    const sound = new Audio(chickSound);
    sound.play().catch((error) => console.error("Error playing sound:", error));
  };

  function logOut() {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("userToken");
      setUserToken(null);
      navigate("/login");
    }
  }
  

  function handleNavLinkClick() {
    setIsOpen(false);
    playClickSound();
  }

  return (
    <header className="bg-gray-200 fixed inset-x-0 top-0 z-50 shadow-md">
      <nav className="flex items-center justify-between px-6 py-3 lg:px-8" aria-label="Global">
        {/* Logo */}
        <Link to="/home" className="lg:pe-4" onClick={playClickSound}>
          <img src={logo} width={120} alt="FreshCart Logo" />
        </Link>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={() => { setIsOpen(true); playClickSound(); }} className="p-2.5 rounded-md text-gray-700 bg-transparent hover:bg-gray-100">
            <svg className="size-6" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Navbar Links - Desktop */}
        {userToken && (
          <div className="hidden lg:flex lg:gap-x-4 capitalize font-medium">
            {["home", "brands", "categories", "products"].map((item) => (
              <NavLink key={item} to={item} className="text-gray-900 hover:text-blue-900 transition duration-200" onClick={playClickSound}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </NavLink>
            ))}
          </div>
        )}

        {/* Navbar Icons - Desktop */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-6 items-center">
          {userToken ? (
            <div className="flex items-center gap-6">
              <NavLink to="cart" className="relative text-blue-900" onClick={playClickSound}>
                <i className="fas fa-cart-shopping fa-2xl"></i>
                {cart && cart.numOfCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cart.numOfCartItems}
                  </span>
                )}
              </NavLink>

              <NavLink to="wishlist" className="text-blue-900" onClick={playClickSound}>
                <i className="fas fa-heart fa-2xl"></i>
              </NavLink>

              <NavLink to="profile" className="text-blue-900" onClick={playClickSound}>
                <i className="fas fa-user fa-2xl"></i>
              </NavLink>

              <button onClick={() => { logOut(); playClickSound(); }} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition duration-200">
              <i className="fas fa-sign-out-alt mr-2"></i>
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <NavLink to="/login" className="text-blue-900 font-semibold py-2 px-4 rounded-md hover:text-blue-700 transition duration-200" onClick={playClickSound}>
              <i className="fas fa-sign-in-alt mr-2"></i> 
                Login
              </NavLink>
              <NavLink to="/register" className="bg-blue-900 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-800 hover:text-white transition duration-200" onClick={playClickSound}>
              <i className="fas fa-user-plus mr-2"></i> 
                Register
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu (Sidebar) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-5 flex flex-col">
            {/* Close Button */}
            <button onClick={() => setIsOpen(false)} className="self-end p-0 m-0 bg-transparent text-black ">
             <i className="fas fa-times fa-lg"></i>
            </button>


            {userToken ? (
              <>
                {["home", "brands", "categories", "products","cart", "wishlist", "profile"].map((item) => (
                  <NavLink key={item} to={item} className="text-gray-900 py-2" onClick={handleNavLinkClick}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </NavLink>
                ))}

                <button onClick={() => { logOut(); handleNavLinkClick(); }} className="bg-red-600 text-white py-3 px-6 rounded-lg mt-4 font-semibold text-lg shadow-md hover:bg-red-700 transition duration-200">
                <i className="fas fa-sign-out-alt mr-2"></i> 
                Log Out
                </button>

              </>
            ) : (
              <>
                <NavLink to="/login" className="text-blue-900 font-semibold py-2 px-4 rounded-md hover:text-blue-700 transition duration-200" onClick={handleNavLinkClick}> 
                <i className="fas fa-sign-in-alt mr-2"></i> 
                Login
                </NavLink>

                <NavLink to="/register" className="bg-blue-900 text-white font-semibold py-2 px-4 rounded-md mt-4 hover:bg-blue-800 hover:text-white transition duration-200 flex items-center justify-center" onClick={handleNavLinkClick}>
                <i className="fas fa-user-plus mr-2"></i> 
                Register
                </NavLink>

              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
