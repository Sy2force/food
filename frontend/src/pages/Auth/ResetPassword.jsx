import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import { authAPI } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!token) {
      setError('Jeton de réinitialisation manquant ou invalide');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token, formData.password);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe');
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
            <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
              Nouveau <br />
              <span className="text-gold-400">Départ</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-lg leading-relaxed">
              Sécurisez votre compte avec un nouveau mot de passe et retrouvez vos recettes
              préférées.
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
                Mot de passe modifié !
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la
                page de connexion.
              </p>
              <Button variant="primary" fullWidth onClick={() => navigate('/login')}>
                Se connecter maintenant
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                  Réinitialiser le mot de passe
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Choisissez un mot de passe fort pour votre compte
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Nouveau mot de passe"
                  type="password"
                  icon={Lock}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />

                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  icon={Lock}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading || !formData.password || !formData.confirmPassword}
                  className="py-4 text-lg shadow-lg shadow-gold-500/20"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Mise à jour...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Réinitialiser
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
