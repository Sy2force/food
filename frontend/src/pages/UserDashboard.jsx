import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Star,
  BookOpen,
  UtensilsCrossed,
  Upload,
  Edit2,
  LogOut,
  Settings,
  ChefHat,
  MessageCircle,
} from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input from '../components/Forms/Input';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/helpers';

const UserDashboard = () => {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    pseudo: '',
    phone: '',
  });

  useEffect(() => {
    fetchDashboardStats();
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        pseudo: user.pseudo || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getDashboardStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data.user);
      setIsEditModalOpen(false);
    } catch (error) {
      // Error updating profile
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await authAPI.uploadAvatar(formData);
      updateUser({ ...user, avatar: response.data.avatar });
      setIsAvatarModalOpen(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      // Error uploading avatar
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const statCards = [
    {
      icon: Heart,
      label: t('userDashboard.stats.favorites'),
      count: stats?.favoritesCount?.total || 0,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      link: '/favorites',
    },
    {
      icon: Star,
      label: t('userDashboard.stats.likesReceived'),
      count: stats?.likesCount?.total || 0,
      color: 'text-gold-500',
      bgColor: 'bg-gold-50 dark:bg-gold-900/20',
      link: '/dashboard/likes',
    },
    {
      icon: BookOpen,
      label: t('userDashboard.stats.recipes'), // Recipes Favorited
      count: stats?.favoritesCount?.recipes || 0,
      color: 'text-olive-500',
      bgColor: 'bg-olive-50 dark:bg-olive-900/20',
    },
    {
      icon: UtensilsCrossed,
      label: t('userDashboard.stats.dishes'), // Dishes Favorited
      count: stats?.favoritesCount?.dishes || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pt-32 pb-12">
      {/* Header Image */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-olive-900 overflow-hidden z-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2940')] bg-cover bg-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fcfaf7] dark:to-gray-900" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="relative group mx-auto md:mx-0">
                <div className="w-32 h-32 rounded-full p-1 border-2 border-gold-500 border-dashed">
                  <img
                    src={getImageUrl(user?.avatar)}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        'https://ui-avatars.com/api/?name=' + (user?.firstName || 'User');
                    }}
                  />
                </div>
                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-0 right-0 p-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full transition-all shadow-lg transform group-hover:scale-110"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                  <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  {user?.role === 'business' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-olive-100 dark:bg-olive-900 text-olive-700 dark:text-olive-300 rounded-full text-xs font-bold uppercase tracking-wider">
                      <ChefHat className="w-3 h-3" />
                      {t('userDashboard.pro')}
                    </span>
                  )}
                </div>

                {user?.pseudo && <p className="text-gold-500 font-medium mb-4">@{user.pseudo}</p>}

                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <span>{user?.email}</span>
                  {user?.phone && (
                    <>
                      <span className="hidden md:inline">•</span>
                      <span>{user.phone}</span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                    className="border-gray-300 hover:border-gold-500 hover:text-gold-500"
                  >
                    <Edit2 className="w-4 h-4 me-2" />
                    {t('userDashboard.editProfile')}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:border-red-500 hover:text-red-500"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 me-2" />
                    {t('auth.logout')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Column */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-gold-500" />
                  {t('userDashboard.statsTitle')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <Link to={stat.link || '#'} key={index}>
                        <div
                          className={`group ${stat.bgColor} rounded-2xl p-6 transition-all hover:shadow-md border border-transparent hover:border-current`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium opacity-70 mb-1">{stat.label}</p>
                              <p className="text-3xl font-bold">{stat.count}</p>
                            </div>
                            <div
                              className={`w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center ${stat.color}`}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gold-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold mb-2">
                      {t('userDashboard.becomeChef')}
                    </h3>
                    <p className="text-gold-100 max-w-md">{t('userDashboard.becomeChefDesc')}</p>
                  </div>
                  <Link to="/explore/create">
                    <button className="px-8 py-3 bg-white text-gold-600 font-bold rounded-full shadow-lg hover:bg-gold-50 transition-colors">
                      {t('userDashboard.publishNow')}
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 sticky top-24"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-400" />
                  {t('userDashboard.quickAccess')}
                </h3>

                <div className="space-y-3">
                  <Link to="/favorites" className="block">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-600 transition-colors group">
                      <span className="flex items-center gap-3 font-medium">
                        <Heart className="w-5 h-5 text-gray-400 group-hover:text-gold-500" />
                        {t('userDashboard.myFavorites')}
                      </span>
                      <span className="bg-white dark:bg-gray-600 px-2 py-1 rounded text-xs font-bold">
                        {stats?.favoritesCount?.total || 0}
                      </span>
                    </button>
                  </Link>

                  <Link to="/explore" className="block">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-600 transition-colors group">
                      <span className="flex items-center gap-3 font-medium">
                        <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-gold-500" />
                        {t('userDashboard.explore')}
                      </span>
                    </button>
                  </Link>

                  <Link to="/profile" className="block">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-600 transition-colors group">
                      <span className="flex items-center gap-3 font-medium">
                        <ChefHat className="w-5 h-5 text-gray-400 group-hover:text-gold-500" />
                        {t('userDashboard.publicProfile')}
                      </span>
                    </button>
                  </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-center text-gray-400">
                    {t('userDashboard.memberSince')} {new Date().getFullYear()}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={t('userDashboard.editModal.title')}
        >
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('userDashboard.editModal.firstName')}
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <Input
                label={t('userDashboard.editModal.lastName')}
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <Input
              label={t('userDashboard.editModal.pseudo')}
              value={formData.pseudo}
              onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
              placeholder="@votrepseudo"
            />
            <Input
              label={t('userDashboard.editModal.phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0612345678"
            />
            <div className="flex gap-2 pt-4">
              <Button type="submit" variant="primary" fullWidth>
                {t('common.save')}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Avatar Upload Modal */}
        <Modal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          title={t('userDashboard.avatarModal.title')}
        >
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full p-1 border-4 border-gold-500 border-dashed">
                <img
                  src={avatarPreview || getImageUrl(user?.avatar)}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://ui-avatars.com/api/?name=' + (user?.firstName || 'User');
                  }}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl font-medium transition-colors">
                <span>{t('userDashboard.avatarModal.choose')}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                fullWidth
                onClick={handleUploadAvatar}
                disabled={!avatarFile}
              >
                {t('userDashboard.avatarModal.upload')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAvatarModalOpen(false);
                  setAvatarFile(null);
                  setAvatarPreview(null);
                }}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserDashboard;
