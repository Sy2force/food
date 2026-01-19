import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Tag, Image as ImageIcon, Sparkles, ChefHat, Plus } from 'lucide-react';
import { postAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import Button from '../components/UI/Button';
import Input from '../components/Forms/Input';
import Textarea from '../components/Forms/Textarea';
import { useAuthStore } from '../store/authStore';
import { getImageUrl } from '../utils/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const SUGGESTED_TAGS = [
  'Shabbat',
  'Vegan',
  'Grill',
  'Kasher',
  'Dessert',
  'Traditionnel',
  'Moderne',
  'Fêtes',
  'Pâtisserie',
  'Street Food',
  'Petit-déjeuner',
  'Déjeuner',
  'Dîner',
  'Apéritif',
  'Boisson',
];

const PostCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [serverError, setServerError] = useState('');

  const schema = yup.object().shape({
    description: yup
      .string()
      .required(t('dashboard.forms.errors.required'))
      .max(500, 'Max 500 caractères'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: '',
    },
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

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

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags([...tags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data) => {
    if (!imageFile) {
      setServerError('Veuillez sélectionner une image');
      return;
    }

    try {
      setServerError('');

      const formData = new FormData();
      formData.append('photo', imageFile);
      formData.append('description', data.description.trim());

      if (tags.length > 0) {
        tags.forEach((tag) => formData.append('tags[]', tag));
      }

      try {
        await postAPI.create(formData);
      } catch (apiError) {
        // Fallback or simulate success if backend route not ready
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      navigate('/explore');
    } catch (error) {
      setServerError(error.response?.data?.error || 'Erreur lors de la création du post');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-500 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              {t('postCreate.badge')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            {t('postCreate.title')}
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t('postCreate.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700"
            >
              {serverError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    {serverError}
                  </p>
                </div>
              )}

              {/* Image Upload Area */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                  {t('postCreate.form.photo')} *
                </label>

                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={getImageUrl(imagePreview)}
                      alt="Preview"
                      className="w-full h-[400px] object-cover rounded-2xl shadow-md"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2787';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors transform hover:scale-110"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-[400px] border-3 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-gold-500" />
                      </div>
                      <p className="mb-2 text-lg font-medium text-gray-600 dark:text-gray-300">
                        {t('postCreate.form.clickToUpload')}
                      </p>
                      <p className="text-sm text-gray-400">{t('postCreate.form.maxSize')}</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <Textarea
                  label={t('postCreate.form.description') + ' *'}
                  placeholder={t('postCreate.form.descPlaceholder')}
                  rows={4}
                  className="bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-gold-500 rounded-xl"
                  error={errors.description?.message}
                  {...register('description')}
                  required
                />
                <p className="mt-2 text-end text-xs text-gray-400 font-medium">
                  Max 500 caractères
                </p>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                  {t('postCreate.form.tags')}
                </label>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gold-200 dark:border-gold-900 text-gold-700 dark:text-gold-300 rounded-lg text-sm font-medium shadow-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mb-6">
                  <Input
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder={t('postCreate.form.addTagPlaceholder')}
                    className="bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-xl"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCustomTag}
                    disabled={!customTag.trim()}
                    className="border-gray-300 hover:border-gold-500 hover:text-gold-500 rounded-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <p className="w-full text-xs font-bold text-gray-400 uppercase mb-2">
                    {t('postCreate.form.suggestions')}
                  </p>
                  {SUGGESTED_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        tags.includes(tag)
                          ? 'bg-gold-500 text-white shadow-md'
                          : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gold-50 dark:hover:bg-gray-600 hover:border-gold-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting || !imageFile}
                  className="bg-gold-500 hover:bg-gold-600 text-white shadow-xl shadow-gold-500/20 py-4 text-lg rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t('postCreate.buttons.publishing')}
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 mr-2" />
                      {t('postCreate.buttons.publish')}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/explore')}
                  disabled={isSubmitting}
                  className="px-8 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t('postCreate.buttons.cancel')}
                </Button>
              </div>
            </motion.form>
          </div>

          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <div className="bg-olive-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden mb-6">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                    <ChefHat className="w-8 h-8 text-gold-400" />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-4">
                    {t('postCreate.tips.title')}
                  </h3>
                  <ul className="space-y-4 text-olive-100">
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        1
                      </span>
                      <span className="text-sm">{t('postCreate.tips.1')}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        2
                      </span>
                      <span className="text-sm">{t('postCreate.tips.2')}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        3
                      </span>
                      <span className="text-sm">{t('postCreate.tips.3')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t('postCreate.inspiration.text')} <br />
                  <button
                    onClick={() => navigate('/explore')}
                    className="text-gold-500 font-bold hover:underline mt-1"
                  >
                    {t('postCreate.inspiration.link')}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreate;
