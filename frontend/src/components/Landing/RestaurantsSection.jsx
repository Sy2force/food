import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, Award, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../utils/helpers';

const featuredRestaurants = [
  {
    id: 1,
    name: 'Mizlala',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940',
    city: 'Tel Aviv',
    kosher: 'Kasher Mehadrin',
    rating: 4.8,
    cuisine: 'Israélienne Moderne',
  },
  {
    id: 2,
    name: 'Machneyuda',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874',
    city: 'Jérusalem',
    kosher: 'Kasher Rabbanout',
    rating: 4.9,
    cuisine: 'Fusion Méditerranéenne',
  },
  {
    id: 3,
    name: 'Eucalyptus',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2940',
    city: 'Jérusalem',
    kosher: 'Kasher Mehadrin',
    rating: 4.7,
    cuisine: 'Biblique & Authentique',
  },
];

const RestaurantsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[#1a1a1a] relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            {t('landing.restaurants.title')}
          </h2>
          <p className="text-xl text-cream-200 max-w-2xl mx-auto">
            {t('landing.restaurants.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(restaurant.image)}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

                  <div className="absolute top-4 start-4">
                    <span className="px-4 py-2 bg-gold-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {restaurant.kosher}
                    </span>
                  </div>

                  <div className="absolute bottom-4 start-4 end-4">
                    <h3 className="text-3xl font-display font-bold text-white mb-2">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center justify-between text-cream-100">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {restaurant.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                        {restaurant.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-400 mb-4">{restaurant.cuisine}</p>
                  <Link to={`/restaurants/${restaurant.id}`}>
                    <button className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors">
                      {t('landing.restaurants.discover')}
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/restaurants">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-gold-500 hover:bg-gold-500 text-gold-500 hover:text-white text-lg font-semibold rounded-full transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              {t('landing.restaurants.viewAll')}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default RestaurantsSection;
