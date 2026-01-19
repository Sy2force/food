import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Clock, Users, ChefHat } from 'lucide-react';
import { useState } from 'react';

import { getImageUrl } from '../../utils/helpers';

const RecipeCard = ({ recipe, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(recipe.likes?.length || 0);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike?.(recipe._id);
  };

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/recipes/${recipe._id}`} className="block group">
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-48 overflow-hidden">
            <img
              src={getImageUrl(recipe.image)}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940'; // Fallback recipe image
              }}
            />
            <button
              onClick={handleLike}
              className="absolute top-3 end-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'
                }`}
              />
            </button>
            <div className="absolute top-3 start-3">
              <span
                className={`px-3 py-1 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg ${
                  recipe.difficulty?.toLowerCase() === 'facile'
                    ? 'bg-olive-600'
                    : recipe.difficulty?.toLowerCase() === 'moyen'
                      ? 'bg-gold-500'
                      : 'bg-red-600'
                }`}
              >
                {recipe.difficulty}
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors mb-2">
              {recipe.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {recipe.description}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{totalTime} min</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} pers.</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <ChefHat className="w-4 h-4" />
                <span>{recipe.region}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-cream-200 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300">
                  {recipe.category}
                </span>
                <span className="px-2 py-1 bg-olive-100 dark:bg-olive-800 text-xs rounded-full text-olive-700 dark:text-olive-200">
                  {recipe.cacherout}
                </span>
              </div>

              {likesCount > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                  <Heart className="w-4 h-4" />
                  <span>{likesCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
