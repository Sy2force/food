import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Eye, Heart, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import DashboardMenu from '../../components/UI/DashboardMenu';
import { authAPI } from '../../services/api';

const Analytics = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getDashboardStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  // Derived or Mocked Data for display
  const overview = stats?.overview || {};
  const totalLikes = overview.totalLikes || 0;

  // Mocking views/visitors/revenue as they are not yet in backend
  const displayStats = [
    {
      label: t('analytics.stats.totalViews'),
      value: '12.5k', // Mock
      change: '+15%',
      icon: Eye,
      color: 'blue',
    },
    {
      label: t('analytics.stats.likes'),
      value: totalLikes.toString(),
      change: '+8%',
      icon: Heart,
      color: 'red',
    },
    {
      label: t('analytics.stats.uniqueVisitors'),
      value: '3.2k', // Mock
      change: '+12%',
      icon: Users,
      color: 'green',
    },
    {
      label: t('analytics.stats.revenue'),
      value: '₪15.4k', // Mock
      change: '+22%',
      icon: TrendingUp,
      color: 'gold',
    },
  ];

  // Mock data for charts
  const viewsData = [45, 52, 38, 65, 42, 58, 71];
  const maxView = Math.max(...viewsData);

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
                <BarChart3 className="w-3 h-3" />
                {t('analytics.badge')}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2">
                {t('analytics.title')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('analytics.subtitle')}
              </p>
            </div>

            <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-gold-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {t(`analytics.timeRanges.${range}`)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <DashboardMenu />

            <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 end-0 -mt-4 -me-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
              <h3 className="text-lg font-bold font-display mb-2 relative z-10">
                {t('analytics.proTip.title')}
              </h3>
              <p className="text-gold-50 text-sm mb-4 relative z-10">
                {t('analytics.proTip.text')}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayStats.map((stat, index) => {
                const Icon = stat.icon;
                const colors = {
                  blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
                  red: 'text-red-500 bg-red-50 dark:bg-red-900/20',
                  green: 'text-green-500 bg-green-50 dark:bg-green-900/20',
                  gold: 'text-gold-500 bg-gold-50 dark:bg-gold-900/20',
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-xl ${colors[stat.color]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Main Chart Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                  {t('analytics.charts.visits')}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{t('analytics.charts.last7days')}</span>
                </div>
              </div>

              <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
                {viewsData.map((value, index) => (
                  <div key={index} className="w-full flex flex-col items-center gap-2 group">
                    <div className="relative w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden h-full">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(value / maxView) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="absolute bottom-0 w-full bg-gold-500 group-hover:bg-gold-400 transition-colors rounded-t-lg"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Top Performing Dishes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
              >
                <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white mb-6">
                  {t('analytics.popular')}
                </h3>
                <div className="space-y-4">
                  {stats?.topDishes && stats.topDishes.length > 0 ? (
                    stats.topDishes.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm font-medium mb-2">
                          <span className="text-gray-900 dark:text-white">{item.name}</span>
                          <span className="text-gray-500">{item.rating?.count} likes</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(item.rating?.count * 5, 100)}%` }} // Rough percentage mock
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className="h-full bg-gold-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Pas assez de données</p>
                  )}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
              >
                <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white mb-6">
                  {t('analytics.recentActivity')}
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      user: 'Sarah L.',
                      action: t('analytics.activities.like'),
                      time: 'Il y a 5 min',
                      icon: Heart,
                      color: 'bg-red-100 text-red-500',
                    },
                    {
                      user: 'David C.',
                      action: t('analytics.activities.comment'),
                      time: 'Il y a 2 h',
                      icon: Eye,
                      color: 'bg-blue-100 text-blue-500',
                    },
                    {
                      user: 'Micheline',
                      action: t('analytics.activities.share'),
                      time: 'Il y a 1 j',
                      icon: Users,
                      color: 'bg-green-100 text-green-500',
                    },
                  ].map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${activity.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            <span className="font-bold">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
