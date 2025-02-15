import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading/Loading";
import chickSound from "../../../public/sounds/chick.wav"

const playClickSound = () => {
  const sound = new Audio(chickSound);
  sound.play().catch((error) => console.error("Error playing sound:", error));
};


const fetchCategories = async () => {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/categories"
  );
  return data.data;
};

export default function Categories() {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });



  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">An error occurred while loading categories.</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-[#1E3A8A] mb-10">
          Explore Different Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              to={`/category/${category._id}`}
              key={category._id}
              className="group relative block overflow-hidden rounded-2xl shadow-md bg-white transition-transform transform hover:scale-105 hover:shadow-xl border border-gray-200"
              onClick={playClickSound}
            >
              <div className="relative h-48 sm:h-56 flex items-center justify-center bg-gray-100 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-black group-hover:text-[#1E3A8A]">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
