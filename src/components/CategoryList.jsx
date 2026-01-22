import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../redux/categorySlice";

const CategoryList = ({ onSelectCategory }) => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.category
  );

  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fallback categories (clearly marked as demo)
  const sampleCategories = [
    {
      _id: "507f1f77bcf86cd799439011",
      name: "Photography",
      image: "/assets/categories/photography.png",
      color: "bg-blue-50"
    },
    {
      _id: "507f1f77bcf86cd799439012",
      name: "Catering",
      image: "/assets/categories/catering.png",
      color: "bg-red-50"
    },
    {
      _id: "507f1f77bcf86cd799439013",
      name: "Venue",
      image: "/assets/categories/venue.png",
      color: "bg-purple-50"
    },
    {
      _id: "507f1f77bcf86cd799439014",
      name: "Makeup",
      image: "/assets/categories/makeup.png",
      color: "bg-pink-50"
    },
  ];

  const isFallback = categories.length === 0;
  const displayCategories = isFallback ? sampleCategories : categories;

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (<div className="text-red-500 text-sm">Failed to load categories.</div>);
  }

  return (
    <div className="space-y-4">
      {isFallback && (
        <p className="text-xs text-gray-400 italic text-right px-2">
          Demo Mode
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {displayCategories.map((category) => {
          const isActive = activeId === category._id;

          return (
            <button
              key={category._id}
              onClick={() => {
                setActiveId(category._id);
                onSelectCategory(category._id);
              }}
              className={`
                group relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300 border
                ${isActive
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-xl scale-105 border-transparent"
                  : "bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:shadow-lg border-gray-100 dark:border-gray-700"
                }
              `}
            >
              {/* Icon Container */}
              <div className={`
                    w-16 h-16 mb-3 rounded-2xl flex items-center justify-center overflow-hidden
                    ${isActive ? 'bg-white/10 dark:bg-black/10' : (category.color || 'bg-gray-50 dark:bg-slate-800')}
                    transition-transform group-hover:scale-110 duration-500
                `}>
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">✨</span>
                )}
              </div>

              <span className={`font-semibold text-sm tracking-wide ${isActive ? 'text-white dark:text-black' : 'text-gray-800 dark:text-gray-200'}`}>
                {category.name}
              </span>

              {isActive && (
                <div className="absolute -bottom-2 w-1.5 h-1.5 bg-black dark:bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
