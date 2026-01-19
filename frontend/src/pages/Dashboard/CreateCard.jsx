import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  LayoutDashboard,
  Image as ImageIcon,
  Phone,
  MapPin,
  AlignLeft,
  Type,
} from 'lucide-react';
import { cardAPI } from '../../services/api';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import Textarea from '../../components/Forms/Textarea';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import DashboardMenu from '../../components/UI/DashboardMenu';
import { getImageUrl } from '../../utils/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

const CreateCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loadingData, setLoadingData] = useState(isEdit);
  const [serverError, setServerError] = useState('');

  const schema = yup.object().shape({
    bizName: yup.string().required(t('dashboard.forms.errors.required')),
    bizDescription: yup.string().required(t('dashboard.forms.errors.required')),
    bizAddress: yup.string().required(t('dashboard.forms.errors.required')),
    bizPhone: yup.string().required(t('dashboard.forms.errors.required')),
    bizImage: yup.string().url(t('dashboard.forms.errors.invalidUrl')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      bizName: '',
      bizDescription: '',
      bizAddress: '',
      bizPhone: '',
      bizImage: '',
    },
  });

  const watchedBizImage = watch('bizImage');

  useEffect(() => {
    if (isEdit) {
      fetchCard();
    }
  }, [id]);

  const fetchCard = async () => {
    try {
      const response = await cardAPI.getById(id);
      const card = response.data;
      const fields = ['bizName', 'bizDescription', 'bizAddress', 'bizPhone', 'bizImage'];
      fields.forEach((field) => setValue(field, card[field]));
    } catch (error) {
      setServerError('Erreur lors du chargement de la carte');
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data) => {
    setServerError('');
    try {
      if (isEdit) {
        await cardAPI.update(id, data);
      } else {
        await cardAPI.create(data);
      }
      navigate('/dashboard/cards');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  if (loadingData) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pt-32 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <DashboardMenu />
          </div>

          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <button
                onClick={() => navigate('/dashboard/cards')}
                className="flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors mb-4 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('common.backToList')}
              </button>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-gold-500/10 rounded-xl">
                  <LayoutDashboard className="w-8 h-8 text-gold-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                    {isEdit ? t('dashboard.editCard') : t('dashboard.createCard')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {t('dashboard.cardFormDesc')}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8"
            >
              {serverError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Input
                    label={t('dashboard.forms.bizName')}
                    icon={Type}
                    placeholder="Ex: Le Jardin des Saveurs"
                    error={errors.bizName?.message}
                    {...register('bizName')}
                    required
                  />

                  <Textarea
                    label={t('dashboard.forms.bizDescription')}
                    rows={4}
                    icon={AlignLeft}
                    placeholder="Décrivez votre activité..."
                    error={errors.bizDescription?.message}
                    {...register('bizDescription')}
                    required
                  />

                  <Input
                    label={t('dashboard.forms.address')}
                    icon={MapPin}
                    placeholder="Rue, Ville"
                    error={errors.bizAddress?.message}
                    {...register('bizAddress')}
                    required
                  />

                  <Input
                    label={t('dashboard.forms.phone')}
                    icon={Phone}
                    placeholder="050-1234567"
                    error={errors.bizPhone?.message}
                    {...register('bizPhone')}
                    required
                  />
                </div>

                <div className="space-y-6">
                  <Input
                    label={t('dashboard.forms.imageUrl')}
                    icon={ImageIcon}
                    placeholder="https://..."
                    error={errors.bizImage?.message}
                    {...register('bizImage')}
                  />

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dashboard.forms.preview')}
                    </label>
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative group">
                      {watchedBizImage ? (
                        <img
                          src={getImageUrl(watchedBizImage)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('bg-gray-100');
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/dashboard/cards')}
                  disabled={isSubmitting}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="shadow-lg shadow-gold-500/20"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('common.saving')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {isEdit ? t('common.update') : t('common.create')}
                    </div>
                  )}
                </Button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCard;
