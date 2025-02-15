// eslint-disable-next-line
import React, { useContext, useCallback } from "react";
import { CartContext } from "../../Context/CartContext";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";
import chickSound from "../../../public/sounds/chick.wav"

const playClickSound = () => {
  const sound = new Audio(chickSound);
  sound.play().catch((error) => console.error("Error playing sound:", error));
};

export default function Cart() {
  let { cart, updateProductCountToCart, deleteProductCart } = useContext(CartContext);

  

  return (
    <>
      {cart ? (
        <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center">
            Your Shopping Cart
          </h2>

          {/* جدول المنتجات */}
          <div className="relative overflow-hidden shadow-md sm:rounded-lg">
            <div className="hidden sm:block">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-white uppercase bg-[#1E3A8A]">
                  <tr>
                    <th scope="col" className="px-6 py-3">Image</th>
                    <th scope="col" className="px-6 py-3">Product</th>
                    <th scope="col" className="px-6 py-3">Qty</th>
                    <th scope="col" className="px-6 py-3">Price</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.data.products.map((item, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-100">
                      <td className="p-4">
                        <img src={item.product.imageCover} className="w-16 md:w-32 max-w-full max-h-full rounded-md" alt={item.product.title} />
                      </td>
                      <td className="px-6 py-4 font-semibold text-black">{item.product.title}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => {
                              playClickSound();
                              item.count > 1
                                ? updateProductCountToCart(item.product.id, item.count - 1)
                                : deleteProductCart(item.product.id);
                            }}
                            className="bg-[#1E3A8A] text-white px-3 py-1 rounded-lg hover:bg-[#162D69] transition"
                          >
                            -
                          </button>
                          <span className="text-lg font-bold mx-4">{item.count}</span>
                          <button
                            onClick={() => {
                              playClickSound();
                              updateProductCountToCart(item.product.id, item.count + 1);
                            }}
                            className="bg-[#1E3A8A] text-white px-3 py-1 rounded-lg hover:bg-[#162D69] transition"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-black">{item.price * item.count} EGP</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            playClickSound();
                            deleteProductCart(item.product.id);
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* تصميم الموبايل - قائمة المنتجات */}
            <div className="sm:hidden grid gap-4">
              {cart.data.products.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                  <img src={item.product.imageCover} className="w-24 rounded-lg mb-2" alt={item.product.title} />
                  <h3 className="text-lg font-semibold text-black text-center">{item.product.title}</h3>
                  <p className="text-gray-600">{item.price} EGP</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => {
                        playClickSound();
                        item.count > 1
                          ? updateProductCountToCart(item.product.id, item.count - 1)
                          : deleteProductCart(item.product.id);
                      }}
                      className="bg-[#1E3A8A] text-white px-3 py-1 rounded-lg hover:bg-[#162D69] transition"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold mx-4">{item.count}</span>
                    <button
                      onClick={() => {
                        playClickSound();
                        updateProductCountToCart(item.product.id, item.count + 1);
                      }}
                      className="bg-[#1E3A8A] text-white px-3 py-1 rounded-lg hover:bg-[#162D69] transition"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      playClickSound();
                      deleteProductCart(item.product.id);
                    }}
                    className="bg-red-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* إجمالي السعر وزر الدفع */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 px-4">
            <h3 className="text-xl sm:text-2xl font-bold text-black">Total: {cart.data.totalCartPrice} EGP</h3>
            <Link to={"/checkout"}>
              <button
                onClick={playClickSound}
                className="bg-[#1E3A8A] text-white px-6 py-2 rounded-lg text-md font-bold hover:bg-[#162D69] transition mt-4 sm:mt-0"
              >
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
