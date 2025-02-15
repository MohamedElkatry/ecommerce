import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { userName } = useContext(UserContext);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200 relative">
        {/* صورة البروفايل في المنتصف */}
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow mb-4 mx-auto">
          <i className="fas fa-user text-blue-600 text-5xl"></i>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{userName}</h2>

        <div className="bg-gray-100 rounded-md shadow p-6">
          <h3 className="text-xl font-medium text-gray-800 mb-3">Your Orders</h3>
          <p className="text-gray-600 mb-4">Track and manage your past orders easily.</p>
          <Link
            to="/allorders"
            className="inline-block bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}