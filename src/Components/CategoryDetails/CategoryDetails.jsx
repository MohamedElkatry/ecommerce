// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CategoryDetails() {
  const { id } = useParams(); // ✅ Fetch ID from URL
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  // ✅ Fetch category data on component mount
  useEffect(() => {
    async function fetchCategoryData() {
      try {
        // ✅ Fetch category details
        const categoryResponse = await axios.get(`https://ecommerce.routemisr.com/api/v1/categories/${id}`);
        setCategory(categoryResponse.data.data);

        // ✅ Fetch all subcategories for this category
        const subcategoriesResponse = await axios.get(
          `https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`
        );
        setSubcategories(subcategoriesResponse.data.data);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }

    fetchCategoryData();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      {category ? (
        <div>
          <h2 className="text-blue-500 text-3xl font-bold text-main">{category.name}</h2>
          <img src={category.image} alt={category.name} className="w-48 h-48 object-cover mt-4" />
          <h3 className="text-blue-500 text-xl font-semibold mt-6">Subcategories:</h3>
          <ul className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subcategories.map((sub) => (
              <li key={sub._id} className="bg-gray-100 p-4 rounded-lg shadow">
                {sub.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-blue-500">Loading data...</p>
      )}
    </div>
  );
}
