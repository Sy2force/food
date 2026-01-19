import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Upload,
  X,
  Save,
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  ChefHat,
  Plus,
  Trash2,
} from 'lucide-react';
import { recipeAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import Textarea from '../../components/Forms/Textarea';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { CATEGORIES, REGIONS, CACHEROUT } from '../../utils/constants';
import { getImageUrl } from '../../utils/helpers';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const RecipeForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loadingData, setLoadingData] = useState(isEdit);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [serverError, setServerError] = useState('');

  const schema = yup.object().shape({
    title: yup.string().required(t('dashboard.forms.errors.required')),
    description: yup.string().required(t('dashboard.forms.errors.required')),
    prepTime: yup.number().min(0).required(t('dashboard.forms.errors.required')),
    cookTime: yup.number().min(0).required(t('dashboard.forms.errors.required')),
    servings: yup.number().min(1).required(t('dashboard.forms.errors.required')),
    difficulty: yup.string().required(t('dashboard.forms.errors.required')),
    category: yup.string().required(t('dashboard.forms.errors.required')),
    region: yup.string().required(t('dashboard.forms.errors.required')),
    cacherout: yup.string().required(t('dashboard.forms.errors.required')),
    ingredients: yup
      .array()
      .of(
        yup.object().shape({
          item: yup.string().required(t('dashboard.forms.errors.required')),
          amount: yup.string().required(t('dashboard.forms.errors.required')),
          unit: yup.string(),
        })
      )
      .min(1, t('dashboard.forms.errors.minIngredients')),
    instructions: yup
      .array()
      .of(
        yup.object().shape({
          step: yup.number(),
          text: yup.string().required(t('dashboard.forms.errors.required')),
        })
      )
      .min(1, t('dashboard.forms.errors.minInstructions')),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      prepTime: '',
      cookTime: '',
      servings: '',
      difficulty: 'moyen',
      category: '',
      region: '',
      cacherout: '',
      ingredients: [{ item: '', amount: '', unit: '' }],
      instructions: [{ step: 1, text: '' }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: 'instructions',
  });

  useEffect(() => {
    if (isEdit) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoadingData(true);
      try {
        const response = await recipeAPI.getById(id);
        const recipe = response.data;

        const fields = [
          'title',
          'description',
          'prepTime',
          'cookTime',
          'servings',
          'difficulty',
          'category',
          'region',
          'cacherout',
        ];
        fields.forEach((field) => setValue(field, recipe[field]));

        setValue('ingredients', recipe.ingredients || []);
        setValue('instructions', recipe.instructions || []);

        if (recipe.image) {
          setImagePreview(recipe.image);
        }
        setLoadingData(false);
      } catch (apiError) {
        setServerError(t('dashboard.forms.errors.load'));
        setLoadingData(false);
      }
    } catch (error) {
      setServerError(t('dashboard.forms.errors.load'));
      setLoadingData(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setServerError(t('dashboard.forms.errors.imageSize'));
        return;
      }
      setImageFile(file);
      setServerError('');
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
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

      if (imageFile) submitData.append('image', imageFile);

      Object.keys(data).forEach((key) => {
        if (key === 'ingredients' || key === 'instructions') {
          submitData.append(key, JSON.stringify(data[key]));
        } else {
          submitData.append(key, data[key]);
        }
      });

      if (isEdit) {
        await recipeAPI.update(id, submitData);
      } else {
        await recipeAPI.create(submitData);
      }
      navigate('/dashboard/recipes');
    } catch (error) {
      setServerError(error.response?.data?.error || t('dashboard.forms.errors.save'));
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
            onClick={() => navigate('/dashboard/recipes')}
            className="flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common.backToList')}
          </button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold-500/10 rounded-xl">
              <BookOpen className="w-8 h-8 text-gold-600" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">
                {isEdit ? t('dashboard.editRecipe') : t('dashboard.createRecipe')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {t('dashboard.recipeFormDesc')}
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
          <div className="lg:col-span-2 space-y-8">
            {/* General Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-gold-500" />
                {t('dashboard.forms.generalInfo')}
              </h2>

              <div className="space-y-6">
                <Input
                  label={t('dashboard.forms.title')}
                  placeholder={t('dashboard.forms.titlePlaceholder')}
                  error={errors.title?.message}
                  {...register('title')}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label={t('dashboard.forms.prepTime')}
                    type="number"
                    icon={Clock}
                    error={errors.prepTime?.message}
                    {...register('prepTime')}
                    required
                  />
                  <Input
                    label={t('dashboard.forms.cookTime')}
                    type="number"
                    icon={Clock}
                    error={errors.cookTime?.message}
                    {...register('cookTime')}
                    required
                  />
                  <Input
                    label={t('dashboard.forms.servings')}
                    type="number"
                    icon={Users}
                    error={errors.servings?.message}
                    {...register('servings')}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dashboard.forms.difficulty')}
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                      {...register('difficulty')}
                    >
                      <option value="facile">{t('dashboard.forms.difficultyOptions.easy')}</option>
                      <option value="moyen">{t('dashboard.forms.difficultyOptions.medium')}</option>
                      <option value="difficile">
                        {t('dashboard.forms.difficultyOptions.hard')}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dashboard.forms.category')}
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dashboard.forms.region')}
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                      {...register('region')}
                    >
                      <option value="">{t('dashboard.forms.select')}</option>
                      {REGIONS.map((reg) => (
                        <option key={reg.value} value={reg.value}>
                          {reg.label}
                        </option>
                      ))}
                    </select>
                    {errors.region && (
                      <p className="mt-1 text-sm text-red-500">{errors.region.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dashboard.forms.cacherout')}
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                      {...register('cacherout')}
                    >
                      <option value="">{t('dashboard.forms.select')}</option>
                      {CACHEROUT.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    {errors.cacherout && (
                      <p className="mt-1 text-sm text-red-500">{errors.cacherout.message}</p>
                    )}
                  </div>
                </div>

                <Textarea
                  label={t('dashboard.forms.description')}
                  rows={4}
                  placeholder={t('dashboard.forms.descPlaceholder')}
                  error={errors.description?.message}
                  {...register('description')}
                  required
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6">
                {t('dashboard.forms.ingredients')}
              </h2>
              <div className="space-y-4">
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Input
                        placeholder="Ingrédient"
                        error={errors.ingredients?.[index]?.item?.message}
                        {...register(`ingredients.${index}.item`)}
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        placeholder={t('dashboard.forms.quantity')}
                        error={errors.ingredients?.[index]?.amount?.message}
                        {...register(`ingredients.${index}.amount`)}
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        placeholder={t('dashboard.forms.unit')}
                        {...register(`ingredients.${index}.unit`)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl mt-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendIngredient({ item: '', amount: '', unit: '' })}
                  fullWidth
                >
                  <Plus className="w-4 h-4 me-2" /> {t('dashboard.forms.addIngredient')}
                </Button>
                {errors.ingredients && (
                  <p className="text-sm text-red-500">{errors.ingredients.message}</p>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6">
                {t('dashboard.forms.instructions')}
              </h2>
              <div className="space-y-6">
                {instructionFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center font-bold flex-shrink-0 mt-2">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <Textarea
                        placeholder={`${t('dashboard.forms.step')} ${index + 1}`}
                        rows={2}
                        error={errors.instructions?.[index]?.text?.message}
                        {...register(`instructions.${index}.text`)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl mt-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendInstruction({ step: instructionFields.length + 1, text: '' })
                  }
                  fullWidth
                >
                  <Plus className="w-4 h-4 me-2" /> {t('dashboard.forms.addStep')}
                </Button>
                {errors.instructions && (
                  <p className="text-sm text-red-500">{errors.instructions.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* Image Upload */}
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
                      className="w-full aspect-square object-cover rounded-2xl border-2 border-gold-100"
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
                  <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:border-gold-400 group">
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

            {/* Actions */}
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
                      {isEdit ? t('common.update') : t('common.publish')}
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/dashboard/recipes')}
                  fullWidth
                  disabled={isSubmitting}
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

export default RecipeForm;
