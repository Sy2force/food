import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Share2, MapPin, Star, Award } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getImageUrl } from '../../utils/helpers';

const PremiumDishCard = ({ dish, onLike, onFavorite, onShare, showToast }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(dish.rating?.count || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await likeAPI.toggleLike('dishes', dish._id);
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
      onLike?.(dish._id);
      showToast?.(response.data.liked ? 'Plat liké ❤️' : 'Like retiré', 'success');
    } catch (error) {
      showToast?.('Erreur lors du like', 'error');
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorited) {
        await authAPI.removeFromFavorites('dishes', dish._id);
        setIsFavorited(false);
        showToast?.('Retiré des favoris', 'info');
      } else {
        await authAPI.addToFavorites('dishes', dish._id);
        setIsFavorited(true);
        showToast?.('Ajouté aux favoris ✅', 'success');
      }
      onFavorite?.(dish._id);
    } catch (error) {
      showToast?.("Erreur lors de l'ajout aux favoris", 'error');
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/dishes/${dish._id}`;
    navigator.clipboard.writeText(url);
    showToast?.('Lien copié ! 📋', 'success');
    onShare?.(dish._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/dishes/${dish._id}`}>
        <div className="bg-cream-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-gold-500/30">
          <div className="relative h-64 overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              src={getImageUrl(dish.image)}
              alt={dish.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940'; // Fallback
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-3 start-3 flex gap-2">
              <span className="px-3 py-1 bg-gold-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                <Award className="w-3 h-3" />
                {dish.cacherout}
              </span>
              {dish.isVegetarian && (
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full shadow-md">
                  Végétarien
                </span>
              )}
            </div>

            <div className="absolute top-3 end-3 flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'
                  }`}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavorite}
                className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    isFavorited ? 'fill-gold-500 text-gold-500' : 'text-gray-600 dark:text-gray-300'
                  }`}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-gold-400 transition-colors">
                {dish.name}
              </h3>
              <p className="text-cream-100 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {dish.restaurant?.name || 'Restaurant'} • {dish.region}
              </p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-white to-cream-50 dark:from-gray-800 dark:to-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {dish.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gold-600 dark:text-gold-400">
                ₪{dish.price}
              </span>
              {dish.rating?.average > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-gold-500 text-gold-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">
                    {dish.rating.average.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Heart className="w-4 h-4" />
                <span>{likesCount} likes</span>
              </div>
              <span className="px-3 py-1 bg-olive-100 dark:bg-olive-900 text-olive-700 dark:text-olive-200 text-xs rounded-full font-medium">
                {dish.category}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold rounded-full shadow-md transition-all"
            >
              Voir le Plat
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PremiumDishCard;
