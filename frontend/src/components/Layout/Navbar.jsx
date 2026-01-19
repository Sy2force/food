import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import {
  Menu,
  X,
  User,
  LogOut,
  Heart,
  LayoutDashboard,
  Shield,
  Globe,
  ChefHat,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../UI/Button';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr';
    setUserMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/dishes', label: t('nav.dishes') },
    { to: '/restaurants', label: t('nav.restaurants') },
    { to: '/recipe-books', label: t('nav.recipeBooks') },
    { to: '/explore', label: 'Explorer' },
  ];

  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 start-0 end-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled || !isHome ? 'bg-black/80 backdrop-blur-md shadow-2xl py-2' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-xl group-hover:bg-gold-500/30 transition-all duration-500" />
              <div className="relative w-10 h-10 border-2 border-gold-500 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm group-hover:scale-105 transition-transform duration-500">
                <ChefHat className="w-6 h-6 text-gold-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-display font-bold text-white tracking-wide">
                FLAVORS
                <span className="text-gold-500">.</span>
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-gold-400 font-medium">
                Of Israel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                  location.pathname === link.to ? 'text-gold-500' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 start-0 end-0 h-0.5 bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Language Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(userMenuOpen === 'lang' ? false : 'lang')}
                className="text-gray-300 hover:text-gold-500 transition-colors"
              >
                <Globe className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {userMenuOpen === 'lang' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute end-0 top-full mt-4 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden"
                  >
                    {[
                      { code: 'fr', label: 'Français' },
                      { code: 'en', label: 'English' },
                      { code: 'he', label: 'עברית' },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`block w-full text-start px-4 py-2 text-sm transition-colors ${
                          i18n.language === lang.code
                            ? 'bg-gold-500/10 text-gold-500'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(userMenuOpen === 'user' ? false : 'user')}
                  className="flex items-center gap-3 ps-4 border-s border-white/10 group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-[1px] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img
                          src={getImageUrl(user.avatar)}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : (
                        <User className="w-4 h-4 text-gold-500" />
                      )}
                      <User className="w-4 h-4 text-gold-500 hidden" />
                    </div>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {user?.name}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute end-0 top-full mt-4 w-60 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      <div className="space-y-1">
                        {/* Admin Menu */}
                        {user?.isAdmin && (
                          <>
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Shield className="w-4 h-4 text-gold-500" />
                              Admin panel
                            </Link>
                            <Link
                              to="/admin/users"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <User className="w-4 h-4 text-gold-500" />
                              Users management
                            </Link>
                            <div className="px-4 py-2 text-sm text-gray-400 flex items-center gap-3">
                              <LayoutDashboard className="w-4 h-4 text-gold-500" />
                              Stats
                            </div>
                          </>
                        )}

                        {/* Business Menu */}
                        {user?.isBusiness && !user?.isAdmin && (
                          <>
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-gold-500" />
                              Dashboard
                            </Link>
                            <Link
                              to="/dashboard/cards"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Heart className="w-4 h-4 text-gold-500" />
                              My Cards
                            </Link>
                            <Link
                              to="/dashboard/cards/create"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-gold-500" />
                              Create Card
                            </Link>
                          </>
                        )}

                        {/* User Menu (Standard) */}
                        {!user?.isBusiness && !user?.isAdmin && (
                          <>
                            <Link
                              to="/explore"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Globe className="w-4 h-4 text-gold-500" />
                              Explore
                            </Link>
                            <Link
                              to="/favorites"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Heart className="w-4 h-4 text-gold-500" />
                              My Cards / Favorites
                            </Link>
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <User className="w-4 h-4 text-gold-500" />
                              Profile
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="mt-2 pt-2 border-t border-white/5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('nav.logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4 ps-4 border-s border-white/10">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1a1a1a] border-t border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-gray-300 hover:text-gold-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-gray-300 hover:text-white"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="primary" fullWidth>
                      {t('nav.register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
