import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send, Heart } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-[#1a1a1a] to-black text-cream-100 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23D4AF37" fill-rule="evenodd"/%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-display font-bold text-gold-400 mb-4">
              Flavors of Israel
            </h3>
            <p className="text-cream-200 mb-6 leading-relaxed">{t('footer.description')}</p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gold-500/20 hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: -5 }}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gold-500/20 hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gold-500/20 hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-xl font-display font-bold text-white mb-6">
              {t('footer.explore')}
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/dishes', label: t('nav.dishes') },
                { to: '/restaurants', label: t('nav.restaurants') },
                { to: '/recipe-books', label: t('nav.recipeBooks') },
                { to: '/explore', label: t('nav.explore') },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-cream-200 hover:text-gold-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gold-500 rounded-full group-hover:w-2 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xl font-display font-bold text-white mb-6">
              {t('footer.account')}
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/register', label: t('auth.register') },
                { to: '/login', label: t('auth.login') },
                { to: '/dashboard', label: t('nav.dashboard') },
                { to: '/profile', label: t('nav.profile') },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-cream-200 hover:text-gold-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gold-500 rounded-full group-hover:w-2 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-xl font-display font-bold text-white mb-6">
              {t('footer.newsletter.title')}
            </h4>
            <p className="text-cream-200 mb-4 text-sm">{t('footer.newsletter.text')}</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletter.placeholder')}
                className="w-full px-4 py-3 bg-white/10 border border-gold-500/30 rounded-full text-white placeholder-cream-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="absolute end-1 top-1 bottom-1 px-4 bg-gold-500 hover:bg-gold-600 rounded-full transition-colors"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 text-sm mt-2"
              >
                ✓ {t('footer.newsletter.success')}
              </motion.p>
            )}

            <div className="mt-6 space-y-2 text-sm text-cream-200">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400" />
                +972 3-123-4567
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400" />
                contact@flavorsofisrael.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400" />
                Tel Aviv, Israël
              </p>
            </div>
          </motion.div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-cream-300 text-sm"
          >
            © {currentYear} Flavors of Israel. {t('footer.rights')}
          </motion.p>

          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-cream-300 hover:text-gold-400 transition-colors">
              {t('footer.links.privacy')}
            </Link>
            <Link to="/terms" className="text-cream-300 hover:text-gold-400 transition-colors">
              {t('footer.links.terms')}
            </Link>
            <Link to="/contact" className="text-cream-300 hover:text-gold-400 transition-colors">
              {t('footer.links.contact')}
            </Link>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-cream-300 text-sm flex items-center gap-2"
          >
            {t('footer.madeWith')} <Heart className="w-4 h-4 text-red-500 fill-red-500" />{' '}
            {t('footer.for')}
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
