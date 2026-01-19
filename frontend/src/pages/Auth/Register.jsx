import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ChefHat, CheckCircle } from 'lucide-react';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import { getImageUrl } from '../../utils/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();

  const schema = yup.object().shape({
    name: yup.string().required(t('auth.errors.required')),
    email: yup.string().email(t('auth.errors.invalidEmail')).required(t('auth.errors.required')),
    password: yup.string().min(6, t('auth.errors.passwordMin')).required(t('auth.errors.required')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], t('auth.errors.passwordMatch'))
      .required(t('auth.errors.required')),
    isBusiness: yup.boolean(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      isBusiness: false,
    },
  });

  const onSubmit = async (data) => {
    const result = await registerUser(data.name, data.email, data.password, data.isBusiness);

    if (result.success) {
      if (data.isBusiness) {
        navigate('/dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } else {
      setError('root', {
        type: 'manual',
        message: result.error || "Échec de l'inscription",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900 flex flex-row-reverse pt-32">
      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-olive-900">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(
              'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2874'
            )}
            alt="Mediterranean food"
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2874';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-gold-500/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-gold-500/30 ml-auto">
              <ChefHat className="w-10 h-10 text-gold-400" />
            </div>
            <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
              Rejoignez l'Élite <br />
              <span className="text-gold-400">Gastronomique</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-lg ml-auto leading-relaxed">
              Créez votre compte pour partager vos recettes, découvrir des restaurants d'exception
              et participer à notre communauté exclusive.
            </p>

            <div className="mt-12 space-y-4">
              {[
                'Accès aux recettes exclusives',
                'Sauvegardez vos favoris',
                'Partagez vos créations',
                'Notes et avis vérifiés',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-end gap-3"
                >
                  <span className="text-gray-200 font-medium">{item}</span>
                  <CheckCircle className="w-5 h-5 text-gold-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full relative z-10"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Créer un compte
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Commencez votre voyage culinaire dès aujourd'hui
            </p>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label={t('auth.name')}
              icon={User}
              placeholder="Votre nom complet"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label={t('auth.email')}
              type="email"
              icon={Mail}
              placeholder="votre@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label={t('auth.password')}
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label={t('auth.confirmPassword')}
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                id="isBusiness"
                className="w-5 h-5 text-gold-600 rounded focus:ring-gold-500"
                {...register('isBusiness')}
              />
              <label htmlFor="isBusiness" className="flex-1 cursor-pointer">
                <span className="block font-medium text-gray-900 dark:text-white">
                  {t('auth.registerPage.businessAccount')}
                </span>
                <span className="block text-xs text-gray-500">
                  {t('auth.registerPage.businessDesc')}
                </span>
              </label>
              <ChefHat className="w-5 h-5 text-gray-400" />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSubmitting}
              className="py-4 text-lg shadow-lg shadow-gold-500/20 mt-4"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin me-2" />
                  {t('auth.registerPage.registering')}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {t('auth.submitRegister')}
                  <ArrowRight className="w-5 h-5 ms-2" />
                </div>
              )}
            </Button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            {t('auth.hasAccount')}{' '}
            <Link
              to="/login"
              className="text-gold-600 dark:text-gold-500 font-bold hover:underline"
            >
              {t('auth.login')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
