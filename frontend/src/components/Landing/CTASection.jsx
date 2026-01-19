import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Camera, ChefHat, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CTASection = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="py-24 bg-gradient-to-br from-[#1a1a1a] via-gray-900 to-[#1a1a1a] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23D4AF37" fill-rule="evenodd"/%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-cream-200 max-w-3xl mx-auto">{t('landing.cta.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl p-8 shadow-2xl"
          >
            <Camera className="w-12 h-12 text-white mb-4" />
            <h3 className="text-3xl font-display font-bold text-white mb-4">
              {t('landing.cta.share.title')}
            </h3>
            <p className="text-white/90 mb-6">{t('landing.cta.share.desc')}</p>
            <Link to={isAuthenticated ? '/explore/create' : '/register'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-white text-gold-600 font-bold rounded-full hover:bg-cream-100 transition-colors flex items-center justify-center gap-2"
              >
                {isAuthenticated
                  ? t('landing.cta.share.buttonAuth')
                  : t('landing.cta.share.buttonGuest')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-olive-600 to-olive-700 rounded-2xl p-8 shadow-2xl"
          >
            <ChefHat className="w-12 h-12 text-white mb-4" />
            <h3 className="text-3xl font-display font-bold text-white mb-4">
              {t('landing.cta.restaurant.title')}
            </h3>
            <p className="text-white/90 mb-6">{t('landing.cta.restaurant.desc')}</p>
            <Link to={isAuthenticated ? '/dashboard' : '/register'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-white text-olive-700 font-bold rounded-full hover:bg-cream-100 transition-colors flex items-center justify-center gap-2"
              >
                {isAuthenticated
                  ? t('landing.cta.restaurant.buttonAuth')
                  : t('landing.cta.restaurant.buttonGuest')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
