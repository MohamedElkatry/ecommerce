import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  async function getCategories() {
    try {
      let { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/categories");
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="container mx-auto my-6 px-4">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-4 text-center">Categories</h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-lg text-gray-700">Loading categories...</p>
        </div>
      ) : (
        <Slider {...settings}>
          {categories.map((category, index) => (
            <div key={index} className="p-2">
              <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-[200px] object-cover object-center transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-white text-center py-2">
                  {category.name}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
