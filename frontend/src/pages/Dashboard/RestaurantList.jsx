import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, MapPin, Star, Heart, Store, Search, Filter } from 'lucide-react';
import { restaurantAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import DashboardMenu from '../../components/UI/DashboardMenu';
import { getImageUrl } from '../../utils/helpers';

const RestaurantList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getMyRestaurants();
      if (response.data && response.data.restaurants) {
        setRestaurants(response.data.restaurants);
      } else if (Array.isArray(response.data)) {
        setRestaurants(response.data);
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error('Error fetching restaurants', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (restaurantId) => {
    if (
      !window.confirm(
        'Êtes-vous sûr de vouloir supprimer ce restaurant ? Cela supprimera également tous les plats associés.'
      )
    ) {
      return;
    }

    try {
      await restaurantAPI.delete(restaurantId);
      setRestaurants(restaurants.filter((r) => r._id !== restaurantId));
    } catch (error) {
      alert('Erreur lors de la suppression du restaurant');
    }
  };

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pt-32 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 backdrop-blur-sm border border-gold-500/20 text-gold-600 rounded-full mb-4 text-xs font-bold uppercase tracking-wider">
                <Store className="w-3 h-3" />
                {t('dashboard.yourEstablishments')}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2">
                {t('dashboard.myRestaurants')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('dashboard.restaurantDesc')}
              </p>
            </div>

            <Link to="/dashboard/restaurants/create">
              <Button variant="primary" className="shadow-lg shadow-gold-500/20">
                <Plus className="w-5 h-5 me-2" />
                {t('dashboard.createRestaurant')}
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <DashboardMenu />

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-gold-500" />
                {t('dashboard.filters')}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t('dashboard.searchPlaceholder')}
                  </label>
                  <div className="relative">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('dashboard.searchPlaceholder')}
                      className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {filteredRestaurants.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center"
              >
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-2">
                  {t('dashboard.noRestaurants')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  {searchTerm ? t('dashboard.noResults') : t('dashboard.noRestaurantsAdded')}
                </p>
                <Link to="/dashboard/restaurants/create">
                  <Button variant="primary" className="shadow-lg shadow-gold-500/20">
                    <Plus className="w-5 h-5 mr-2" />
                    {t('dashboard.createRestaurant')}
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {restaurant.logo ? (
                        <img
                          src={getImageUrl(restaurant.logo)}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Store className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-gray-100">
                        {restaurant.cuisine?.[0] || t('dashboard.cuisine')}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-1 group-hover:text-gold-600 transition-colors">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            <span className="truncate">{restaurant.address?.city}</span>
                          </div>
                        </div>
                        {restaurant.rating?.average && (
                          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {restaurant.rating.average}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                          className="flex-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-none"
                        >
                          <Eye className="w-4 h-4 me-2" />
                          {t('common.viewDetails')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/restaurants/${restaurant._id}/edit`)}
                          className="flex-1 border-gray-200 dark:border-gray-600 hover:border-gold-400 hover:text-gold-600"
                        >
                          <Edit2 className="w-4 h-4 me-2" />
                          {t('common.edit')}
                        </Button>
                        <button
                          onClick={() => handleDelete(restaurant._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
