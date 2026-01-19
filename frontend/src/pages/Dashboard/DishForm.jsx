import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Upload,
  X,
  Save,
  ArrowLeft,
  UtensilsCrossed,
  Euro,
  Tag,
  MapPin,
  Leaf,
  AlertCircle,
} from 'lucide-react';
import { dishAPI, restaurantAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import Textarea from '../../components/Forms/Textarea';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { getImageUrl } from '../../utils/helpers';
import { CATEGORIES, REGIONS, SEASONS, CACHEROUT } from '../../utils/constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const DishForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loadingData, setLoadingData] = useState(isEdit);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [serverError, setServerError] = useState('');

  const schema = yup.object().shape({
    name: yup.string().required(t('dashboard.forms.errors.required')),
    description: yup.string().required(t('dashboard.forms.errors.required')),
    price: yup
      .number()
      .typeError(t('dashboard.forms.errors.invalidPrice'))
      .min(0)
      .required(t('dashboard.forms.errors.required')),
    category: yup.string().required(t('dashboard.forms.errors.required')),
    season: yup.string().default("toute l'année"),
    region: yup.string().required(t('dashboard.forms.errors.required')),
    cacherout: yup.string().required(t('dashboard.forms.errors.required')),
    restaurant: yup.string().required(t('dashboard.forms.errors.required')),
    isVegetarian: yup.boolean(),
    isVegan: yup.boolean(),
    isGlutenFree: yup.boolean(),
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
      name: '',
      description: '',
      price: '',
      category: '',
      season: "toute l'année",
      region: '',
      cacherout: '',
      restaurant: '',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
    },
  });

  const watchedIsVegetarian = watch('isVegetarian');
  const watchedIsVegan = watch('isVegan');
  const watchedIsGlutenFree = watch('isGlutenFree');

  useEffect(() => {
    fetchRestaurants();
    if (isEdit) {
      fetchDish();
    }
  }, [id]);

  const fetchRestaurants = async () => {
    try {
      try {
        const response = await restaurantAPI.getMyRestaurants();
        if (response.data && Array.isArray(response.data)) {
          setRestaurants(response.data);
          // Auto-select if only one restaurant
          if (response.data.length === 1) {
            setValue('restaurant', response.data[0]._id);
          }
        }
      } catch (e) {
        // Fallback or empty
      }
    } catch (error) {
      // Error loading restaurants
    }
  };

  const fetchDish = async () => {
    try {
      setLoadingData(true);
      try {
        const response = await dishAPI.getById(id);
        const dish = response.data;

        const fields = [
          'name',
          'description',
          'price',
          'category',
          'season',
          'region',
          'cacherout',
          'isVegetarian',
          'isVegan',
          'isGlutenFree',
        ];
        fields.forEach((field) => setValue(field, dish[field]));

        setValue('restaurant', dish.restaurant?._id || dish.restaurant || '');

        if (dish.image) {
          setImagePreview(dish.image);
        }
      } catch (apiError) {
        setServerError('Erreur lors du chargement du plat');
      }
    } catch (error) {
      setServerError('Erreur lors du chargement du plat');
    } finally {
      setLoadingData(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setServerError("L'image ne doit pas dépasser 5MB");
        return;
      }

      setImageFile(file);
      setServerError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    try {
      setServerError('');

      const submitData = new FormData();

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      submitData.append('name', data.name);
      submitData.append('description', data.description);
      submitData.append('price', data.price);
      submitData.append('category', data.category);
      submitData.append('season', data.season);
      submitData.append('region', data.region);
      submitData.append('cacherout', data.cacherout);
      submitData.append('restaurant', data.restaurant);
      submitData.append('isVegetarian', data.isVegetarian);
      submitData.append('isVegan', data.isVegan);
      submitData.append('isGlutenFree', data.isGlutenFree);

      if (isEdit) {
        await dishAPI.update(id, submitData);
      } else {
        await dishAPI.create(submitData);
      }

      navigate('/dashboard/dishes');
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
            onClick={() => navigate('/dashboard/dishes')}
            className="flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common.backToList')}
          </button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold-500/10 rounded-xl">
              <UtensilsCrossed className="w-8 h-8 text-gold-600" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">
                {isEdit ? t('dashboard.editDish') : t('dashboard.createDish')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {isEdit ? t('dashboard.dishFormEditDesc') : t('dashboard.dishFormDesc')}
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
                <Tag className="w-5 h-5 text-gold-500" />
                {t('dashboard.forms.generalInfo')}
              </h2>

              <div className="space-y-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard.forms.restaurant')} *
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    {...register('restaurant')}
                  >
                    <option value="">{t('dashboard.forms.select')}</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                  {errors.restaurant && (
                    <p className="mt-1 text-sm text-red-500">{errors.restaurant.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label={t('dashboard.forms.name')}
                    placeholder="Ex: Shakshuka Royale"
                    error={errors.name?.message}
                    {...register('name')}
                    required
                  />
                  <Input
                    label={t('dashboard.forms.price') + ' (₪)'}
                    type="number"
                    min="0"
                    step="0.01"
                    icon={Euro}
                    placeholder="45"
                    error={errors.price?.message}
                    {...register('price')}
                    required
                  />
                </div>

                <Textarea
                  label={t('dashboard.forms.description')}
                  rows={4}
                  placeholder="Décrivez les saveurs et les ingrédients..."
                  error={errors.description?.message}
                  {...register('description')}
                  required
                />
              </div>
            </div>

            {/* Categorization Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-500" />
                {t('dashboard.forms.categorization')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard.forms.category')} *
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    {...register('category')}
                  >
                    <option value="">{t('dashboard.forms.select')}</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard.forms.region')} *
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    {...register('region')}
                  >
                    <option value="">{t('dashboard.forms.select')}</option>
                    {REGIONS.map((region) => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="mt-1 text-sm text-red-500">{errors.region.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard.forms.season')}
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    {...register('season')}
                  >
                    <option value="">{t('dashboard.forms.select')}</option>
                    {SEASONS.map((season) => (
                      <option key={season.value} value={season.value}>
                        {season.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard.forms.cacherout')} *
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    {...register('cacherout')}
                  >
                    <option value="">{t('dashboard.forms.select')}</option>
                    {CACHEROUT.filter((c) => !['kasher-mehadrin'].includes(c.value)).map(
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                  {errors.cacherout && (
                    <p className="mt-1 text-sm text-red-500">{errors.cacherout.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  {t('dashboard.forms.dietary')}
                </label>
                <div className="flex flex-wrap gap-4">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      watchedIsVegetarian
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      {...register('isVegetarian')}
                    />
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      <span className="font-medium">{t('dashboard.forms.vegetarian')}</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      watchedIsVegan
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      {...register('isVegan')}
                    />
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      <span className="font-medium">{t('dashboard.forms.vegan')}</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      watchedIsGlutenFree
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                      {...register('isGlutenFree')}
                    />
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">{t('dashboard.forms.glutenFree')}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Media & Actions */}
          <div className="lg:col-span-1 space-y-8">
            {/* Image Upload Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6">
                {t('dashboard.forms.image')}
              </h2>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('dashboard.forms.image')}
                </label>

                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={getImageUrl(imagePreview)}
                      alt="Preview"
                      className="w-full aspect-[4/3] object-cover rounded-2xl border-2 border-gold-100"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:border-gold-400 group">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-gold-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {t('dashboard.forms.upload')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Max 5MB (PNG, JPG)</p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
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
                      {isEdit ? t('common.save') : t('dashboard.createDish')}
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/dashboard/dishes')}
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

export default DishForm;
