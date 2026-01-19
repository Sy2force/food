import { motion } from 'framer-motion';
import { Camera, Upload, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../utils/helpers';

const PublishSection = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Camera,
      title: t('landing.publish.steps.photo.title'),
      description: t('landing.publish.steps.photo.desc'),
    },
    {
      icon: Upload,
      title: t('landing.publish.steps.share.title'),
      description: t('landing.publish.steps.share.desc'),
    },
    {
      icon: Heart,
      title: t('landing.publish.steps.inspire.title'),
      description: t('landing.publish.steps.inspire.desc'),
    },
  ];

  return (
    <section className="py-24 bg-cream-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute top-0 end-0 w-1/3 h-full opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23D4AF37" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6">
            {t('landing.publish.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            {t('landing.publish.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-500 rounded-full mb-6 shadow-xl">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/explore/create">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-[#1a1a1a] hover:bg-gold-500 text-white text-xl font-semibold rounded-full shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <Share2 className="w-6 h-6" />
              {t('landing.publish.button')}
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 relative"
        >
          <img
            src={getImageUrl(
              'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2940'
            )}
            alt="Cuisine israélienne"
            className="w-full h-96 object-cover rounded-3xl shadow-2xl"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2940';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl flex items-end p-8">
            <p className="text-white text-2xl font-display italic">
              "{t('landing.publish.quote')}"
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PublishSection;
