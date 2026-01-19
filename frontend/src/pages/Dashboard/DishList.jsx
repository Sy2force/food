import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Heart,
  Star,
  UtensilsCrossed,
  Filter,
  Search,
} from 'lucide-react';
import { dishAPI, restaurantAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import DashboardMenu from '../../components/UI/DashboardMenu';
import { getImageUrl } from '../../utils/helpers';

const DishList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [restaurantsRes, dishesRes] = await Promise.all([
        restaurantAPI.getMyRestaurants(),
        dishAPI.getAll({ limit: 100 }),
      ]);

      const fetchedRestaurants = restaurantsRes.data?.restaurants || restaurantsRes.data || [];
      setRestaurants(fetchedRestaurants);

      // Handle different possible API response structures
      const allDishes = dishesRes.data?.dishes || dishesRes.data || [];
      const myRestaurantIds = fetchedRestaurants.map((r) => r._id);

      const myDishes = allDishes.filter((dish) =>
        myRestaurantIds.includes(dish.restaurant?._id || dish.restaurant)
      );
      setDishes(myDishes);
    } catch (error) {
      console.error('Error fetching dish data', error);
      setRestaurants([]);
      setDishes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dishId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      return;
    }

    try {
      await dishAPI.delete(dishId);
      setDishes(dishes.filter((d) => d._id !== dishId));
    } catch (error) {
      alert('Erreur lors de la suppression du plat');
    }
  };

  const filteredDishes = dishes.filter((d) => {
    const matchesRestaurant =
      selectedRestaurant === 'all' || (d.restaurant?._id || d.restaurant) === selectedRestaurant;
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRestaurant && matchesSearch;
  });

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
                <UtensilsCrossed className="w-3 h-3" />
                {t('dashboard.menuManagement')}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2">
                {t('dashboard.myDishes')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('dashboard.dishDesc')}
              </p>
            </div>

            <Link to="/dashboard/dishes/create">
              <Button variant="primary" className="shadow-lg shadow-gold-500/20">
                <Plus className="w-5 h-5 me-2" />
                {t('dashboard.createDish')}
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

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t('dashboard.forms.restaurant')}
                  </label>
                  <select
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-sm"
                  >
                    <option value="all">Tous les restaurants</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {filteredDishes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center"
              >
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UtensilsCrossed className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-2">
                  {t('dashboard.noDishes')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  {searchTerm || selectedRestaurant !== 'all'
                    ? t('dashboard.noResultsDesc')
                    : t('dashboard.noDishesAdded')}
                </p>
                <Link to="/dashboard/dishes/create">
                  <Button variant="primary" className="shadow-lg shadow-gold-500/20">
                    <Plus className="w-5 h-5 me-2" />
                    {t('dashboard.createDish')}
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDishes.map((dish, index) => (
                  <motion.div
                    key={dish._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {dish.image ? (
                        <img
                          src={getImageUrl(dish.image)}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <UtensilsCrossed className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gold-600 font-bold rounded-full shadow-sm text-sm">
                          ₪{dish.price}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-1 group-hover:text-gold-600 transition-colors">
                            {dish.name}
                          </h3>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {dish.restaurant?.name || t('dashboard.forms.restaurant')}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 h-10">
                        {dish.description}
                      </p>

                      <div className="flex items-center gap-4 mb-5 text-sm text-gray-500 dark:text-gray-400 pb-5 border-b border-gray-100 dark:border-gray-700">
                        <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {dish.rating?.average?.toFixed(1) || 0}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-red-500" />
                          <span>
                            {dish.rating?.count || 0} {t('common.likes')}
                          </span>
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/dishes/${dish._id}`)}
                          className="flex-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-none"
                        >
                          <Eye className="w-4 h-4 me-2" />
                          {t('common.viewDetails')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/dishes/${dish._id}/edit`)}
                          className="flex-1 border-gray-200 dark:border-gray-600 hover:border-gold-400 hover:text-gold-600"
                        >
                          <Edit2 className="w-4 h-4 me-2" />
                          {t('common.edit')}
                        </Button>
                        <button
                          onClick={() => handleDelete(dish._id)}
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

export default DishList;
