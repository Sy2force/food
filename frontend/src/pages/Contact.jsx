import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/UI/Button';
import Input from '../components/Forms/Input';
import Textarea from '../components/Forms/Textarea';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-8">
                {t('contact.info.title')}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-50 dark:bg-gold-900/20 rounded-xl text-gold-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {t('contact.info.email')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">contact@flavorsofisrael.com</p>
                    <p className="text-sm text-gray-500 mt-1">{t('contact.info.responseDelay')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-50 dark:bg-gold-900/20 rounded-xl text-gold-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {t('contact.info.phone')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">+972 3-123-4567</p>
                    <p className="text-sm text-gray-500 mt-1">{t('contact.info.openHours')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-50 dark:bg-gold-900/20 rounded-xl text-gold-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {t('contact.info.offices')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('contact.info.addressLine1')}
                      <br />
                      {t('contact.info.addressLine2')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-olive-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gold-400" />
                  {t('contact.info.chat.title')}
                </h3>
                <p className="text-olive-100 mb-6">{t('contact.info.chat.desc')}</p>
                <button className="w-full py-3 bg-white text-olive-900 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                  {t('contact.info.chat.button')}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
              {t('contact.form.title')}
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('contact.form.success.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{t('contact.form.success.desc')}</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-gold-600 font-medium hover:text-gold-700"
                >
                  {t('contact.form.success.new')}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label={t('contact.form.name')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.form.name')}
                  />
                  <Input
                    label={t('contact.form.email')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>

                <Input
                  label={t('contact.form.subject')}
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder={t('contact.form.subject')}
                />

                <Textarea
                  label={t('contact.form.message')}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder={t('contact.form.message')}
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  className="py-4 text-lg shadow-lg shadow-gold-500/20"
                >
                  {t('contact.form.submit')}
                  <Send className="w-5 h-5 ms-2" />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
