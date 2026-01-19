import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ChefHat } from 'lucide-react';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import { getImageUrl } from '../../utils/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const schema = yup.object().shape({
    email: yup.string().email(t('auth.errors.invalidEmail')).required(t('auth.errors.required')),
    password: yup.string().required(t('auth.errors.required')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);

    if (result.success) {
      const user = useAuthStore.getState().user;
      if (user?.isAdmin || user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.isBusiness || user?.role === 'business') {
        navigate('/dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } else {
      setError('root', {
        type: 'manual',
        message: result.error || t('auth.loginPage.loginFailed'),
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900 flex pt-32">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-olive-900">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(
              'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2940'
            )}
            alt="Chef cooking"
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
              dangerouslySetInnerHTML={{ __html: t('auth.loginPage.heroTitle') }}
            />
            <p className="text-xl text-gray-200 max-w-lg leading-relaxed">
              {t('auth.loginPage.heroDesc')}
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
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              {t('auth.loginPage.welcomeBack')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{t('auth.loginPage.accessAccount')}</p>
          </div>

          {errors.root && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
            >
              {errors.root.message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label={t('auth.email')}
              type="email"
              icon={Mail}
              placeholder="votre@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-1">
              <Input
                label={t('auth.password')}
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gold-600 hover:text-gold-700 font-medium"
                >
                  {t('auth.loginPage.forgotPassword')}
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSubmitting}
              className="py-4 text-lg shadow-lg shadow-gold-500/20"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin me-2" />
                  {t('auth.loginPage.loggingIn')}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {t('auth.submit')}
                  <ArrowRight className="w-5 h-5 ms-2" />
                </div>
              )}
            </Button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              className="text-gold-600 dark:text-gold-500 font-bold hover:underline"
            >
              {t('auth.register')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
