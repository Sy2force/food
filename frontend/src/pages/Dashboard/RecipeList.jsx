import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Heart,
  BookOpen,
  Clock,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { recipeAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import DashboardMenu from '../../components/UI/DashboardMenu';
import { getImageUrl } from '../../utils/helpers';

const RecipeList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipeAPI.getMyRecipes();
      if (response.data && response.data.recipes) {
        setRecipes(response.data.recipes);
      } else if (Array.isArray(response.data)) {
        setRecipes(response.data);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching recipes', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      return;
    }

    try {
      await recipeAPI.delete(recipeId);
      setRecipes(recipes.filter((r) => r._id !== recipeId));
    } catch (error) {
      alert('Erreur lors de la suppression de la recette');
    }
  };

  const filteredRecipes = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pt-32 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 backdrop-blur-sm border border-gold-500/20 text-gold-600 rounded-full mb-4 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-3 h-3" />
                {t('dashboard.yourCreations')}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2">
                {t('dashboard.myRecipes')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('dashboard.recipeDesc')}
              </p>
            </div>

            <Link to="/dashboard/recipes/create">
              <Button variant="primary" className="shadow-lg shadow-gold-500/20">
                <Plus className="w-5 h-5 me-2" />
                {t('dashboard.createRecipe')}
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <DashboardMenu />

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-gold-500" />
                {t('dashboard.filters')}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t('dashboard.searchPlaceholder')}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('dashboard.searchPlaceholder')}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {filteredRecipes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center"
              >
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-2">
                  {t('dashboard.noRecipes')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  {searchTerm ? t('dashboard.noResultsDesc') : t('dashboard.noRecipesAdded')}
                </p>
                <Link to="/dashboard/recipes/create">
                  <Button variant="primary" className="shadow-lg shadow-gold-500/20">
                    <Plus className="w-5 h-5 mr-2" />
                    {t('dashboard.createRecipe')}
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {recipe.image ? (
                        <img
                          src={getImageUrl(recipe.image)}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 text-white text-xs font-bold rounded-full shadow-sm ${
                            recipe.difficulty === 'facile'
                              ? 'bg-green-500'
                              : recipe.difficulty === 'moyen'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                        >
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-1 group-hover:text-gold-600 transition-colors line-clamp-1">
                          {recipe.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 h-10">
                          {recipe.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 mb-5 text-sm text-gray-500 dark:text-gray-400 pb-5 border-b border-gray-100 dark:border-gray-700">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {recipe.prepTime + recipe.cookTime} {t('common.min')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          {recipe.servings} {t('common.pers')}
                        </span>
                        <span className="flex items-center gap-1.5 ms-auto">
                          <Heart className="w-4 h-4 text-red-500" />
                          {recipe.likes?.length || 0} {t('common.likes')}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/recipes/${recipe._id}`)}
                          className="flex-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-none"
                        >
                          <Eye className="w-4 h-4 me-2" />
                          {t('common.viewDetails')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/recipes/${recipe._id}/edit`)}
                          className="flex-1 border-gray-200 dark:border-gray-600 hover:border-gold-400 hover:text-gold-600"
                        >
                          <Edit2 className="w-4 h-4 me-2" />
                          {t('common.edit')}
                        </Button>
                        <button
                          onClick={() => handleDelete(recipe._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeList;
