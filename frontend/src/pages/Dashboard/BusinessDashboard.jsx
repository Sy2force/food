import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Store,
  UtensilsCrossed,
  Heart,
  Star,
  TrendingUp,
  Plus,
  BarChart3,
  ArrowRight,
  Edit2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Button from '../../components/UI/Button';
import DashboardMenu from '../../components/UI/DashboardMenu';
import { getImageUrl } from '../../utils/helpers';

const BusinessDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await authAPI.getDashboardStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (e) {
      console.error('Error fetching dashboard stats', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const statCards = [
    {
      icon: Store,
      label: t('businessDashboard.stats.restaurants'),
      value: stats?.overview?.totalRestaurants || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      link: '/dashboard/restaurants',
    },
    {
      icon: UtensilsCrossed,
      label: t('businessDashboard.stats.dishes'),
      value: stats?.overview?.totalDishes || 0,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      link: '/dashboard/dishes',
    },
    {
      icon: Heart,
      label: t('businessDashboard.stats.totalLikes'),
      value: stats?.overview?.totalLikes || 0,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      icon: Star,
      label: t('businessDashboard.stats.averageRating'),
      value: stats?.overview?.averageRating || 0,
      color: 'text-gold-500',
      bgColor: 'bg-gold-50 dark:bg-gold-900/20',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pt-32 pb-12">
      {/* Header with Background */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-olive-900 overflow-hidden z-0">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fcfaf7] dark:to-gray-900"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 backdrop-blur-sm border border-gold-500/20 text-gold-600 rounded-full mb-4 text-xs font-bold uppercase tracking-wider">
                <BarChart3 className="w-3 h-3" />
                {t('businessDashboard.space')}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2">
                {t('businessDashboard.title')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('businessDashboard.subtitle')}
              </p>
            </div>

            <div className="flex gap-3">
              <Link to="/dashboard/restaurants/create">
                <Button variant="primary" className="shadow-lg shadow-gold-500/20">
                  <Plus className="w-5 h-5 me-2" />
                  {t('businessDashboard.newRestaurant')}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <DashboardMenu />

            <div className="bg-gradient-to-br from-olive-800 to-olive-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-lg font-bold font-display mb-2 relative z-10">
                {t('businessDashboard.needHelp')}
              </h3>
              <p className="text-olive-100 text-sm mb-4 relative z-10">
                {t('businessDashboard.contactSupport')}
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors border border-white/20 relative z-10">
                {t('businessDashboard.supportBtn')}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={stat.link || '#'}>
                      <div
                        className={`group h-full ${stat.bgColor} rounded-2xl p-5 border border-transparent hover:border-current transition-all hover:shadow-md relative overflow-hidden`}
                      >
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div
                              className={`p-2 bg-white/60 dark:bg-gray-800/60 rounded-xl ${stat.color}`}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            {stat.link && (
                              <ArrowRight
                                className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${stat.color}`}
                              />
                            )}
                          </div>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {stat.value}
                          </p>
                          <p className="text-sm font-medium opacity-70">{stat.label}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Restaurants List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                    {t('businessDashboard.yourRestaurants')}
                  </h3>
                  <Link
                    to="/dashboard/restaurants"
                    className="text-sm font-medium text-gold-600 hover:text-gold-700"
                  >
                    {t('common.viewDetails')}
                  </Link>
                </div>
                <div className="p-4 space-y-3">
                  {stats?.restaurants && stats.restaurants.length > 0 ? (
                    stats.restaurants.map((restaurant) => (
                      <Link
                        key={restaurant._id}
                        to={`/dashboard/restaurants/${restaurant._id}/edit`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <img
                          src={getImageUrl(restaurant.logo)}
                          alt={restaurant.name}
                          className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:shadow transition-shadow"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-gold-600 transition-colors">
                            {restaurant.name}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="truncate">{restaurant.address?.city}</span>
                          </div>
                        </div>
                        <div className="p-2 text-gray-400 group-hover:text-gold-500 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        {t('businessDashboard.noRestaurants')}
                      </p>
                    </div>
                  )}
                  <Link to="/dashboard/restaurants/create">
                    <button className="w-full py-3 mt-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 hover:border-gold-400 hover:text-gold-600 hover:bg-gold-50/50 transition-all font-medium text-sm flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      {t('businessDashboard.addRestaurant')}
                    </button>
                  </Link>
                </div>
              </motion.div>

              {/* Top Dishes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gold-500" />
                    <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                      {t('businessDashboard.topDishes')}
                    </h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {stats?.topDishes && stats.topDishes.length > 0 ? (
                    stats.topDishes.map((dish, index) => (
                      <div
                        key={dish._id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30"
                      >
                        <div className="w-8 h-8 flex items-center justify-center font-display font-bold text-lg text-gold-500">
                          #{index + 1}
                        </div>
                        <img
                          src={getImageUrl(dish.image)}
                          alt={dish.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-white truncate">
                            {dish.name}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                              {dish.rating?.average}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {dish.rating?.count} likes
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">{t('businessDashboard.noTopDishes')}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Quick Actions Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-olive-50 dark:bg-olive-900/20 rounded-2xl p-6 border border-olive-100 dark:border-olive-800"
            >
              <h3 className="text-lg font-bold text-olive-900 dark:text-olive-100 mb-4">
                {t('businessDashboard.quickActions')}
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard/dishes/create">
                  <button className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-sm font-medium hover:bg-gold-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors border border-transparent hover:border-gold-200">
                    + {t('businessDashboard.newDish')}
                  </button>
                </Link>
                <Link to="/dashboard/restaurants/create">
                  <button className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-sm font-medium hover:bg-gold-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors border border-transparent hover:border-gold-200">
                    + {t('businessDashboard.newRestaurant')}
                  </button>
                </Link>
                <Link to="/profile">
                  <button className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-sm font-medium hover:bg-gold-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors border border-transparent hover:border-gold-200">
                    {t('businessDashboard.viewProfile')}
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
