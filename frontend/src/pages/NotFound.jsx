import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 flex items-center justify-center p-4 pt-24">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="text-9xl font-display font-bold text-gold-500/20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <UtensilsCrossed className="w-24 h-24 text-gold-500 rotate-45" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            {t('notFound.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">{t('notFound.text')}</p>

          <Link to="/">
            <button className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-full transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-xl">
              <Home className="w-5 h-5" />
              {t('notFound.button')}
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
