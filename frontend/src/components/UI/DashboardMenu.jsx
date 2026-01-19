import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Store,
  BookOpen,
  Settings,
  BarChart3,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DashboardMenu = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('dashboardMenu.overview') },
    { path: '/dashboard/cards', icon: Store, label: 'Mes Cartes' },
    {
      path: '/dashboard/restaurants',
      icon: UtensilsCrossed,
      label: t('dashboardMenu.restaurants'),
    },
    { path: '/dashboard/dishes', icon: UtensilsCrossed, label: t('dashboardMenu.dishes') },
    { path: '/dashboard/recipes', icon: BookOpen, label: t('dashboardMenu.recipes') },
    { path: '/dashboard/analytics', icon: BarChart3, label: t('dashboardMenu.analytics') },
    { path: '/dashboard/settings', icon: Settings, label: t('dashboardMenu.settings') },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} className="relative block">
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gold-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardMenu;
