import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading/Loading";
import chickSound from "../../../public/sounds/chick.wav"

const playClickSound = () => {
  const sound = new Audio(chickSound);
  sound.play().catch((error) => console.error("Error playing sound:", error));
};

const fetchBrands = async () => {
  const response = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/brands"
  );
  return response.data.data;
};

export default function Brands() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

 

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading brands</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-10">
          Discover Top Brands
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {data.map((brand) => (
            <Link
              to={`/brands/${brand._id}`}
              key={brand._id}
              className="group bg-white rounded-lg shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl"
              onClick={playClickSound}
            >
              <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-semibold text-black mt-3 group-hover:text-blue-900">
                {brand.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
