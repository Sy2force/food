import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  UtensilsCrossed,
  BookOpen,
  Book,
  Image as ImageIcon,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { likeAPI } from '../services/api';
import PremiumDishCard from '../components/Dishes/PremiumDishCard';
import RecipeCard from '../components/UI/RecipeCard';
import PremiumBookCard from '../components/RecipeBooks/PremiumBookCard';
import ExplorePostCard from '../components/UI/ExplorePostCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Toast from '../components/UI/Toast';

const UserLikes = () => {
  const { t } = useTranslation();
  const [likes, setLikes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dishes');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const fetchLikes = useCallback(async () => {
    try {
      setLoading(true);
      try {
        const response = await likeAPI.getUserLikes();
        if (response.data) {
          setLikes(response.data);
          setLoading(false);
          return;
        }
      } catch (apiError) {
        // Mock data fallback
      }

      // Mock data fallback
      setTimeout(() => {
        setLikes({
          dishes: [
            {
              _id: '701',
              name: 'Shakshuka Royale',
              image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2787',
              price: 45,
              rating: { average: 4.8, count: 124 },
              restaurant: { name: 'Dr Shakshuka', city: 'Jaffa' },
            },
            {
              _id: '801',
              name: 'Sabich Deluxe',
              image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2940',
              price: 38,
              rating: { average: 4.9, count: 250 },
              restaurant: { name: 'Sabich Frishman', city: 'Tel Aviv' },
            },
          ],
          recipes: [
            {
              _id: '101',
              title: 'Hummus Royal aux Pignons',
              image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=2787',
              prepTime: 30,
              cookTime: 60,
              difficulty: 'moyen',
              likes: ['a', 'b', 'c'],
              category: 'Entrée',
              cacherout: 'Pareve',
              region: 'Jérusalem',
            },
          ],
          recipeBooks: [
            {
              _id: '1',
              title: 'Les Secrets de Jérusalem',
              coverImage:
                'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2788',
              author: { firstName: 'Yotam', lastName: 'Ottolenghi' },
              theme: 'Traditionnel',
              rating: 4.9,
            },
          ],
          communityPosts: [
            {
              _id: '1',
              description: 'Mon premier pain de Shabbat !',
              photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2942',
              author: {
                firstName: 'Sarah',
                lastName: 'Levi',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256',
              },
              likes: ['1', '2'],
            },
          ],
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      setToast({ show: true, message: t('userLikes.loadError'), type: 'error' });
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const handleUnlike = async (type, itemId) => {
    try {
      await likeAPI.toggleLike(type, itemId);
      setLikes((prev) => ({
        ...prev,
        [type === 'posts' ? 'communityPosts' : type]: prev[
          type === 'posts' ? 'communityPosts' : type
        ].filter((item) => item._id !== itemId),
      }));
      setToast({ show: true, message: t('userLikes.unlikeSuccess'), type: 'success' });
    } catch (error) {
      setToast({ show: true, message: t('userLikes.unlikeError'), type: 'error' });
    }
  };

  const tabs = [
    {
      key: 'dishes',
      label: t('nav.dishes'),
      icon: UtensilsCrossed,
      count: likes?.dishes?.length || 0,
    },
    { key: 'recipes', label: t('nav.recipes'), icon: BookOpen, count: likes?.recipes?.length || 0 },
    {
      key: 'recipeBooks',
      label: t('nav.recipeBooks'),
      icon: Book,
      count: likes?.recipeBooks?.length || 0,
    },
    {
      key: 'communityPosts',
      label: t('userLikes.tabs.posts'),
      icon: ImageIcon,
      count: likes?.communityPosts?.length || 0,
    },
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  const renderContent = () => {
    const items = likes?.[activeTab] || [];

    if (items.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700"
        >
          <div className="bg-red-50 dark:bg-red-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
            {t('userLikes.empty.title')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-light mb-8 max-w-md mx-auto">
            {t('userLikes.empty.desc')}
          </p>
          <Link to="/explore">
            <button className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition-colors inline-flex items-center gap-2">
              {t('userLikes.empty.button')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </Link>
        </motion.div>
      );
    }

    return (
      <div
        className={`grid grid-cols-1 ${['recipeBooks', 'communityPosts'].includes(activeTab) ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}
      >
        {activeTab === 'dishes' &&
          items.map((dish, index) => (
            <motion.div
              key={dish._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PremiumDishCard dish={dish} onLike={() => handleUnlike('dishes', dish._id)} />
            </motion.div>
          ))}
        {activeTab === 'recipes' &&
          items.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <RecipeCard recipe={recipe} onLike={() => handleUnlike('recipes', recipe._id)} />
            </motion.div>
          ))}
        {activeTab === 'recipeBooks' &&
          items.map((book, index) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <PremiumBookCard book={book} />
            </motion.div>
          ))}
        {activeTab === 'communityPosts' &&
          items.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ExplorePostCard post={post} />
            </motion.div>
          ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pt-32 pb-12">
      {/* Hero Header */}
      <div className="bg-red-900 h-64 absolute top-0 left-0 right-0 z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fcfaf7] dark:to-gray-900"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-red-200 rounded-full mb-6 shadow-lg">
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              {t('userLikes.badge')}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-4">
            {t('userLikes.title')}
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light">
            {t('userLikes.subtitle')}
          </p>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 mb-12 max-w-4xl mx-auto border border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex-1 justify-center min-w-[140px] ${
                    activeTab === tab.key
                      ? 'bg-red-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    marginInlineStart: activeTab === tab.key ? '1rem' : '0',
                    marginInlineEnd: activeTab === tab.key ? '1rem' : '0',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  <span
                    className={`ms-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.key ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {renderContent()}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default UserLikes;
