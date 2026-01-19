import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, Award, Phone, ExternalLink, UtensilsCrossed } from 'lucide-react';
import { getImageUrl } from '../../utils/helpers';

const PremiumRestaurantCard = ({ restaurant }) => {
  const openMaps = (e) => {
    e.preventDefault();
    const address = `${restaurant.address?.street}, ${restaurant.address?.city}, Israel`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      '_blank'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link to={`/restaurants/${restaurant._id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-gold-500/30">
          <div className="relative h-72 overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.7 }}
              src={getImageUrl(restaurant.logo)}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940'; // Fallback
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="absolute top-4 start-4">
              <span className="px-4 py-2 bg-gold-500 text-white text-sm font-bold rounded-full shadow-xl flex items-center gap-2">
                <Award className="w-4 h-4" />
                {restaurant.cacherout}
              </span>
            </div>

            {restaurant.rating?.average > 0 && (
              <div className="absolute top-4 end-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                <span className="font-bold text-gray-900">
                  {restaurant.rating.average.toFixed(1)}
                </span>
              </div>
            )}

            <div className="absolute bottom-0 start-0 end-0 p-6">
              <h3 className="text-3xl font-display font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                {restaurant.name}
              </h3>
              <button
                onClick={openMaps}
                className="flex items-center gap-2 text-cream-100 hover:text-gold-400 transition-colors text-sm"
              >
                <MapPin className="w-4 h-4" />
                {restaurant.address?.city}, {restaurant.address?.street}
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-white to-cream-50 dark:from-gray-800 dark:to-gray-900">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {restaurant.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {restaurant.cuisine?.slice(0, 3).map((cuisine, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-olive-100 dark:bg-olive-900 text-olive-700 dark:text-olive-200 text-xs rounded-full font-medium"
                >
                  {cuisine}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <Phone className="w-4 h-4" />
              <span>{restaurant.phone}</span>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold rounded-full shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UtensilsCrossed className="w-4 h-4" />
                Voir les Plats
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PremiumRestaurantCard;
