import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  UtensilsCrossed,
  BookOpen,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Search,
  Filter,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { adminAPI } from '../../services/api';

const AdminPanel = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [users, setUsers] = useState([]);
  const [pendingRestaurants, setPendingRestaurants] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'restaurants') fetchPendingRestaurants();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers({ limit: 10 });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const fetchPendingRestaurants = async () => {
    try {
      const response = await adminAPI.getPendingRestaurants();
      setPendingRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching pending restaurants', error);
    }
  };

  const handleApproveRestaurant = async (id) => {
    try {
      await adminAPI.approveRestaurant(id);
      setPendingRestaurants((prev) => prev.filter((r) => r._id !== id));
      fetchAdminData(); // Refresh stats
    } catch (error) {
      console.error('Error approving restaurant', error);
    }
  };

  const handleRejectRestaurant = async (id) => {
    try {
      await adminAPI.rejectRestaurant(id);
      setPendingRestaurants((prev) => prev.filter((r) => r._id !== id));
      fetchAdminData();
    } catch (error) {
      console.error('Error rejecting restaurant', error);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const tabs = [
    { id: 'overview', label: t('admin.tabs.overview') },
    { id: 'users', label: t('admin.tabs.users') },
    { id: 'restaurants', label: t('admin.tabs.restaurants') },
    { id: 'content', label: t('admin.tabs.content') },
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pt-32 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">
                {t('admin.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{t('admin.subtitle')}</p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tItem) => (
              <button
                key={tItem.id}
                onClick={() => handleTabChange(tItem.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tItem.id
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tItem.label}
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  +{stats.users.new}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.users.total}
              </h3>
              <p className="text-sm text-gray-500">{t('admin.stats.users')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gold-50 dark:bg-gold-900/20 text-gold-600 rounded-xl">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                {stats.restaurants.pending > 0 && (
                  <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                    {stats.restaurants.pending} {t('admin.stats.pending')}
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.restaurants.total}
              </h3>
              <p className="text-sm text-gray-500">{t('admin.stats.restaurants')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.recipes.total}
              </h3>
              <p className="text-sm text-gray-500">{t('admin.stats.recipes')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                  {t('admin.stats.actionRequired')}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.restaurants.pending + stats.recipes.pending}
              </h3>
              <p className="text-sm text-gray-500">{t('admin.stats.moderation')}</p>
            </motion.div>
          </div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                {t('admin.recentUsers')}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-500 border-b border-gray-100 dark:border-gray-700">
                      <th className="pb-3 font-medium">{t('admin.table.user')}</th>
                      <th className="pb-3 font-medium">{t('admin.table.email')}</th>
                      <th className="pb-3 font-medium">{t('admin.table.role')}</th>
                      <th className="pb-3 font-medium">{t('admin.table.date')}</th>
                      <th className="pb-3 font-medium text-end">{t('admin.table.action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {users.length > 0 ? (
                      users.map((u) => (
                        <tr
                          key={u._id}
                          className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                              {u.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {u.name}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                            {u.email}
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                u.isAdmin
                                  ? 'bg-purple-100 text-purple-600'
                                  : u.isBusiness
                                    ? 'bg-gold-100 text-gold-600'
                                    : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              {u.isAdmin ? 'Admin' : u.isBusiness ? 'Business' : 'User'}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-end">
                            <button className="text-gray-400 hover:text-gold-500 transition-colors">
                              {t('admin.actions.edit')}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'restaurants' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">
                {t('admin.pendingRestaurants')}
              </h3>
              <div className="grid gap-4">
                {pendingRestaurants.length > 0 ? (
                  pendingRestaurants.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <UtensilsCrossed className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            Soumis par {item.ownerId?.name || 'Inconnu'} •{' '}
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleRejectRestaurant(item._id)}
                        >
                          {t('admin.actions.reject')}
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          className="bg-green-500 hover:bg-green-600 text-white border-none"
                          onClick={() => handleApproveRestaurant(item._id)}
                        >
                          {t('admin.actions.approve')}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">Aucun restaurant en attente</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                {t('admin.reports')}
              </h3>
              <p className="text-gray-500 text-sm text-center py-8">Aucun signalement</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                {t('admin.validations')}
              </h3>
              <p className="text-gray-500 text-sm text-center py-8">Historique vide</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
