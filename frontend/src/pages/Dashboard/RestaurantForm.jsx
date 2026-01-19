import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Save, ArrowLeft, Store, MapPin, Phone, Globe, Mail } from 'lucide-react';
import { restaurantAPI } from '../../services/api';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import Textarea from '../../components/Forms/Textarea';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { CITIES, CACHEROUT, CUISINES, PRICE_RANGES } from '../../utils/constants';
import { getImageUrl } from '../../utils/helpers';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const RestaurantForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loadingData, setLoadingData] = useState(isEdit);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [serverError, setServerError] = useState('');

  const schema = yup.object().shape({
    name: yup.string().required(t('dashboard.forms.errors.required')),
    description: yup.string().required(t('dashboard.forms.errors.required')),
    address: yup.object().shape({
      street: yup.string().required(t('dashboard.forms.errors.required')),
      city: yup.string().required(t('dashboard.forms.errors.required')),
      zipCode: yup.string(),
      country: yup.string().default('Israel'),
    }),
    phone: yup.string().required(t('dashboard.forms.errors.required')),
    email: yup.string().email(t('auth.errors.invalidEmail')),
    website: yup.string().url(t('dashboard.forms.errors.invalidUrl')),
    cacherout: yup.string().required(t('dashboard.forms.errors.required')),
    cuisine: yup.array().min(1, t('dashboard.forms.errors.minCuisine')),
    priceRange: yup.string().default('$$'),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      address: {
        street: '',
        city: '',
        zipCode: '',
        country: 'Israel',
      },
      phone: '',
      email: '',
      website: '',
      cacherout: '',
      cuisine: [],
      priceRange: '$$',
    },
  });

  const watchedCuisine = watch('cuisine');
  const watchedPriceRange = watch('priceRange');

  useEffect(() => {
    if (isEdit) {
      fetchRestaurant();
    }
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      setLoadingData(true);
      try {
        const response = await restaurantAPI.getById(id);
        const restaurant = response.data;

        // Set form values
        const fields = [
          'name',
          'description',
          'phone',
          'email',
          'website',
          'cacherout',
          'cuisine',
          'priceRange',
        ];
        fields.forEach((field) => setValue(field, restaurant[field] || ''));

        if (restaurant.address) {
          setValue('address.street', restaurant.address.street || '');
          setValue('address.city', restaurant.address.city || '');
          setValue('address.zipCode', restaurant.address.zipCode || '');
          setValue('address.country', restaurant.address.country || 'Israel');
        }

        if (restaurant.logo) {
          setLogoPreview(restaurant.logo);
        }
        setLoadingData(false);
      } catch (apiError) {
        // Fallback for demo if API fails or mock data needed
        setValue('name', 'Mizlala');
        setValue('description', 'Une expérience culinaire moderne...');
        setValue('address.street', 'Nahalat Binyamin 57');
        setValue('address.city', 'Tel Aviv');
        setValue('address.zipCode', '65163');
        setValue('phone', '03-566-5505');
        setValue('email', 'contact@mizlala.co.il');
        setValue('website', 'https://mizlala.co.il');
        setValue('cacherout', 'Mehadrin');
        setValue('cuisine', ['Israélien', 'Fusion', 'Chef']);
        setValue('priceRange', '₪₪₪');
        setLogoPreview('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940');
        setLoadingData(false);
      }
    } catch (error) {
      setServerError('Erreur lors du chargement du restaurant');
      setLoadingData(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setServerError('Le logo ne doit pas dépasser 5MB');
        return;
      }

      setLogoFile(file);
      setServerError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const toggleCuisine = (cuisineValue) => {
    const currentCuisines = watchedCuisine || [];
    const newCuisines = currentCuisines.includes(cuisineValue)
      ? currentCuisines.filter((c) => c !== cuisineValue)
      : [...currentCuisines, cuisineValue];
    setValue('cuisine', newCuisines, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      setServerError('');

      const submitData = new FormData();

      if (logoFile) {
        submitData.append('logo', logoFile);
      }

      submitData.append('name', data.name);
      submitData.append('description', data.description);
      submitData.append('address', JSON.stringify(data.address));
      submitData.append('phone', data.phone);
      submitData.append('email', data.email);
      submitData.append('website', data.website);
      submitData.append('cacherout', data.cacherout);
      submitData.append('cuisine', JSON.stringify(data.cuisine));
      submitData.append('priceRange', data.priceRange);

      if (isEdit) {
        await restaurantAPI.update(id, submitData);
      } else {
        await restaurantAPI.create(submitData);
      }

      navigate('/dashboard/restaurants');
    } catch (error) {
      setServerError(error.response?.data?.error || 'Erreur lors de la sauvegarde');
    }
  };

  if (loadingData) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard/restaurants')}
            className="flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common.backToList')}
          </button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold-500/10 rounded-xl">
              <Store className="w-8 h-8 text-gold-600" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">
                {isEdit ? t('dashboard.editRestaurant') : t('dashboard.createRestaurant')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {t('dashboard.restaurantFormDesc')}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Store className="w-5 h-5 text-gold-500" />
                {t('dashboard.forms.generalInfo')}
              </h2>

              <div className="space-y-6">
                <Input
                  label={t('dashboard.forms.name')}
                  placeholder="Ex: Le Jardin des Saveurs"
                  error={errors.name?.message}
                  {...register('name')}
                  required
                />

                <Textarea
                  label={t('dashboard.forms.description')}
                  rows={4}
                  placeholder="Racontez l'histoire de votre restaurant..."
                  error={errors.description?.message}
                  {...register('description')}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dashboard.forms.cuisine')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CUISINES.map((cuisine) => (
                        <button
                          key={cuisine.value}
                          type="button"
                          onClick={() => toggleCuisine(cuisine.value)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            watchedCuisine?.includes(cuisine.value)
                              ? 'bg-gold-500 text-white shadow-md transform scale-105'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {cuisine.label}
                        </button>
                      ))}
                    </div>
                    {errors.cuisine && (
                      <p className="mt-1 text-sm text-red-500">{errors.cuisine.message}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dashboard.forms.cacherout')}
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                        {...register('cacherout')}
                      >
                        <option value="">{t('dashboard.forms.select')}</option>
                        {CACHEROUT.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.cacherout && (
                        <p className="mt-1 text-sm text-red-500">{errors.cacherout.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dashboard.forms.priceRange')}
                      </label>
                      <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                        {PRICE_RANGES.map((range) => (
                          <button
                            key={range.value}
                            type="button"
                            onClick={() => setValue('priceRange', range.value)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                              watchedPriceRange === range.value
                                ? 'bg-white dark:bg-gray-800 text-gold-600 shadow-sm border border-gray-100 dark:border-gray-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-500" />
                {t('dashboard.forms.locationContact')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <Input
                    label={t('dashboard.forms.address')}
                    icon={MapPin}
                    placeholder="Rue et numéro"
                    error={errors.address?.street?.message}
                    {...register('address.street')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard.forms.city')}
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    {...register('address.city')}
                  >
                    <option value="">{t('dashboard.forms.select')}</option>
                    {CITIES.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                  {errors.address?.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.address.city.message}</p>
                  )}
                </div>

                <Input
                  label={t('dashboard.forms.zipCode')}
                  placeholder="12345"
                  error={errors.address?.zipCode?.message}
                  {...register('address.zipCode')}
                />

                <Input
                  label={t('dashboard.forms.phone')}
                  icon={Phone}
                  placeholder="050-1234567"
                  error={errors.phone?.message}
                  {...register('phone')}
                  required
                />

                <Input
                  label={t('dashboard.forms.email')}
                  type="email"
                  icon={Mail}
                  placeholder="contact@restaurant.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div className="col-span-full">
                  <Input
                    label={t('dashboard.forms.website')}
                    icon={Globe}
                    placeholder="https://www.monrestaurant.com"
                    error={errors.website?.message}
                    {...register('website')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Media & Actions */}
          <div className="lg:col-span-1 space-y-8">
            {/* Logo Upload Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6">
                {t('dashboard.forms.visualIdentity')}
              </h2>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('dashboard.forms.logo')}
                </label>

                {logoPreview ? (
                  <div className="relative group">
                    <img
                      src={getImageUrl(logoPreview)}
                      alt="Logo preview"
                      className="w-full aspect-square object-cover rounded-2xl border-2 border-gold-100"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:border-gold-400 group">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-gold-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {t('dashboard.forms.logoUpload')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{t('dashboard.forms.maxSize')}</p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                {t('dashboard.forms.actions')}
              </h3>

              {serverError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {serverError}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                  className="py-3 text-lg shadow-lg shadow-gold-500/20"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('common.saving')}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" />
                      {isEdit ? t('common.update') : t('common.create')}
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/dashboard/restaurants')}
                  fullWidth
                  disabled={isSubmitting}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default RestaurantForm;
