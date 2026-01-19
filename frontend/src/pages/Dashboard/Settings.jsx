import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  User,
  Globe,
  Moon,
  CreditCard,
  Save,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../services/api';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import DashboardMenu from '../../components/UI/DashboardMenu';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const schema = yup.object().shape({
    name: yup.string().required(t('dashboard.forms.errors.required')),
    email: yup
      .string()
      .email(t('auth.errors.invalidEmail'))
      .required(t('dashboard.forms.errors.required')),
    phone: yup.string(),
    bio: yup.string(),
    siteName: yup.string(), // General setting
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      siteName: 'Mon Restaurant',
      language: i18n.language,
      theme: 'light',
      notifications: {
        email: true,
        push: false,
        marketing: true,
      },
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
      setValue('bio', user.bio || '');
      // Load other settings if they were saved in backend user profile or local storage
    }
    setValue('language', i18n.language);
  }, [user, setValue, i18n.language]);

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccessMessage('');
    try {
      // Update profile info
      const profileData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
      };

      const response = await authAPI.updateProfile(profileData);
      updateUser(response.data.user);

      // Handle language change
      if (data.language !== i18n.language) {
        i18n.changeLanguage(data.language);
      }

      setSuccessMessage(t('settings.alert.saved'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings', error);
    } finally {
      setLoading(false);
    }
  };

  const currentLanguage = watch('language');
  const currentTheme = watch('theme');
  const notifications = watch('notifications');

  const tabs = [
    { id: 'general', label: t('settings.tabs.general'), icon: SettingsIcon },
    { id: 'profile', label: t('settings.tabs.profile'), icon: User },
    { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
    { id: 'security', label: t('settings.tabs.security'), icon: Lock },
    { id: 'billing', label: t('settings.tabs.billing'), icon: CreditCard },
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
            <div className="p-3 bg-gray-500/10 rounded-2xl border border-gray-500/20">
              <SettingsIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">
                {t('settings.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{t('settings.subtitle')}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <DashboardMenu />

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gold-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8"
            >
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl border border-green-100">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                {activeTab === 'general' && (
                  <>
                    <Input label={t('settings.general.siteName')} {...register('siteName')} />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('settings.general.defaultLanguage')}
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setValue('language', 'fr')}
                          className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 transition-all ${
                            currentLanguage === 'fr'
                              ? 'border-gold-500 bg-gold-50 text-gold-700 font-bold'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-xl">🇫🇷</span> {t('settings.general.french')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setValue('language', 'en')}
                          className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 transition-all ${
                            currentLanguage === 'en'
                              ? 'border-gold-500 bg-gold-50 text-gold-700 font-bold'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-xl">🇬🇧</span> {t('settings.general.english')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setValue('language', 'he')}
                          className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 transition-all ${
                            currentLanguage === 'he'
                              ? 'border-gold-500 bg-gold-50 text-gold-700 font-bold'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-xl">🇮🇱</span> {t('settings.general.hebrew')}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('settings.general.theme')}
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setValue('theme', 'light')}
                          className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 transition-all ${
                            currentTheme === 'light'
                              ? 'border-gold-500 bg-gold-50 text-gold-700 font-bold'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <SettingsIcon className="w-5 h-5" /> {t('settings.general.light')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setValue('theme', 'dark')}
                          className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 transition-all ${
                            currentTheme === 'dark'
                              ? 'border-gold-500 bg-gold-50 text-gold-700 font-bold'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <Moon className="w-5 h-5" /> {t('settings.general.dark')}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'profile' && (
                  <>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <Button type="button" variant="outline" size="sm">
                        {t('settings.profile.changeAvatar')}
                      </Button>
                    </div>
                    <Input
                      label={t('settings.profile.fullName')}
                      {...register('name')}
                      error={errors.name?.message}
                    />
                    <Input
                      label={t('settings.profile.email')}
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                    />
                    <Input label={t('dashboard.forms.phone')} {...register('phone')} />
                    <Input
                      label={t('settings.profile.bio')}
                      as="textarea"
                      rows={4}
                      {...register('bio')}
                    />
                  </>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {t('settings.notifications.email.title')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t('settings.notifications.email.desc')}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        {...register('notifications.email')}
                        className="w-5 h-5 text-gold-600 rounded focus:ring-gold-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {t('settings.notifications.marketing.title')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t('settings.notifications.marketing.desc')}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        {...register('notifications.marketing')}
                        className="w-5 h-5 text-gold-600 rounded focus:ring-gold-500"
                      />
                    </label>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    type="submit"
                    variant="primary"
                    className="shadow-lg shadow-gold-500/20"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin me-2" />
                    ) : (
                      <Save className="w-5 h-5 me-2" />
                    )}
                    {t('settings.buttons.save')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
