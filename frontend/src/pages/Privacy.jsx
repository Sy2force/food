import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 rounded-full mb-6 text-gold-600">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">{t('privacy.subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12 space-y-8"
        >
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">
                {t('privacy.sections.1.title')}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('privacy.sections.1.text')}
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">
                {t('privacy.sections.2.title')}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacy.sections.2.text')}
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">
                {t('privacy.sections.3.title')}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('privacy.sections.3.text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-4">
              {t('privacy.sections.4.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('privacy.sections.4.text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-4">
              {t('privacy.sections.5.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('privacy.sections.5.text')}
            </p>
          </section>

          <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 text-center">{t('privacy.update')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
