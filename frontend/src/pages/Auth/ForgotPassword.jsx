import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import { authAPI } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      // For security reasons, we might still want to show success or a generic message,
      // but for now let's handle it gracefully.
      // If 404 (user not found), we might still want to say "If an account exists..."
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900 flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-olive-900">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(
              'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2940'
            )}
            alt="Cooking ingredients"
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2940';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-gold-500/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-gold-500/30">
              <ChefHat className="w-10 h-10 text-gold-400" />
            </div>
            <h1
              className="text-5xl font-display font-bold mb-6 leading-tight"
              dangerouslySetInnerHTML={{ __html: t('auth.forgotPasswordPage.heroTitle') }}
            />
            <p className="text-xl text-gray-200 max-w-lg leading-relaxed">
              {t('auth.forgotPasswordPage.heroDesc')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full relative z-10"
        >
          {submitted ? (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10" />
              </motion.div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                {t('auth.forgotPasswordPage.emailSent')}
              </h2>
              <p
                className="text-gray-600 dark:text-gray-300 mb-8"
                dangerouslySetInnerHTML={{
                  __html: t('auth.forgotPasswordPage.emailSentDesc', { email }),
                }}
              />
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  {t('auth.forgotPasswordPage.backToLogin')}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                  {t('auth.forgotPasswordPage.title')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('auth.forgotPasswordPage.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label={t('auth.email')}
                  type="email"
                  icon={Mail}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading || !email}
                  className="py-4 text-lg shadow-lg shadow-gold-500/20"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t('auth.forgotPasswordPage.sending')}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {t('auth.forgotPasswordPage.sendLink')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </Button>
              </form>

              <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
                {t('auth.forgotPasswordPage.rememberPassword')}{' '}
                <Link
                  to="/login"
                  className="text-gold-600 dark:text-gold-500 font-bold hover:underline"
                >
                  {t('auth.forgotPasswordPage.login')}
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
