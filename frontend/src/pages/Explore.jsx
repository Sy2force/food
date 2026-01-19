import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  X,
  Grid,
  Heart,
  Camera,
  Compass,
  Layers,
  CreditCard,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { postAPI, likeAPI, cardAPI } from '../services/api';
import ExplorePostCard from '../components/UI/ExplorePostCard';
import CardItem from '../components/Cards/CardItem';
import ImageModal from '../components/UI/ImageModal';
import SkeletonCard from '../components/UI/SkeletonCard';
import Button from '../components/UI/Button';
import PageWrapper from '../components/Layout/PageWrapper';

const POPULAR_TAGS = [
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
];

const Explore = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'cards'

  useEffect(() => {
    fetchContent();
  }, [selectedTags, activeTab]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'posts') {
        const params = {
          limit: 50,
          ...(selectedTags.length > 0 && { tags: selectedTags.join(',') }),
        };
        try {
          const response = await postAPI.getAll(params);
          setPosts(
            response.data.posts && response.data.posts.length > 0 ? response.data.posts : mockPosts
          );
        } catch (apiError) {
          setPosts(mockPosts);
        }
      } else {
        try {
          const response = await cardAPI.getAll();
          setCards(response.data || []);
        } catch (apiError) {
          setCards([]);
        }
      }
    } catch (error) {
      // Error loading content
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleLike = async (id, type = 'post') => {
    if (!isAuthenticated) return;

    try {
      if (type === 'post') {
        await likeAPI.toggleLike('posts', id);
        setPosts(
          posts.map((post) =>
            post._id === id
              ? {
                  ...post,
                  likes: post.likes.includes(id)
                    ? post.likes.filter((lid) => lid !== id)
                    : [...post.likes, id],
                }
              : post
          )
        );
      } else {
        await cardAPI.like(id);
        // Refresh cards or optimistic update
        setCards(
          cards.map((card) =>
            card._id === id
              ? {
                  ...card,
                  likes: card.likes?.includes('me')
                    ? card.likes.filter((l) => l !== 'me')
                    : [...(card.likes || []), 'me'],
                }
              : card
          )
        );
      }
    } catch (error) {
      // Error like
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery('');
  };

  const filteredPosts = posts.filter(
    (post) =>
      searchQuery === '' ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCards = cards.filter(
    (card) =>
      searchQuery === '' ||
      card.bizName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.bizDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageWrapper className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900">
      {/* Hero Header */}
      <div className="relative pt-32 pb-20 bg-olive-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=2832')] bg-cover bg-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#fcfaf7] dark:to-gray-900" />

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-full mb-6 border border-gold-500/30 backdrop-blur-sm">
              <Compass className="w-4 h-4" />
              <span className="font-semibold tracking-wide text-sm uppercase">
                {t('explore.hero.badge')}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
              {t('explore.hero.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-light">
              {t('explore.hero.subtitle')}
            </p>

            {isAuthenticated && (
              <Link to="/explore/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gold-500 text-white font-bold rounded-full shadow-lg hover:bg-gold-600 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Camera className="w-5 h-5" />
                  {t('explore.hero.share')}
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container-custom -mt-10 relative z-20 pb-20">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-lg inline-flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'posts'
                  ? 'bg-gold-500 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Layers className="w-5 h-5" />
              Publications
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'cards'
                  ? 'bg-gold-500 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Cartes de Visite
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 mb-10 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('explore.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-gold-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
              />
            </div>
            {activeTab === 'posts' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  showFilters || selectedTags.length > 0
                    ? 'bg-olive-100 text-olive-800 dark:bg-olive-900 dark:text-olive-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5" />
                {t('explore.filters')}
                {selectedTags.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-gold-500 text-white rounded-full text-xs">
                    {selectedTags.length}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {activeTab === 'posts' && (
            <motion.div
              initial={false}
              animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    {t('explore.popularTags')}
                  </h3>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gold-500 hover:text-gold-600 flex items-center gap-1 font-medium"
                    >
                      <X className="w-4 h-4" />
                      {t('explore.clearFilters')}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-gold-500 text-white shadow-md transform scale-105'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'posts' &&
              (filteredPosts.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <Grid className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                    {t('explore.noPosts')}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8">
                    {t('explore.noPostsDesc')}
                  </p>
                  {isAuthenticated && (
                    <Link to="/explore/create">
                      <Button variant="primary">{t('explore.createPost')}</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="break-inside-avoid"
                    >
                      <ExplorePostCard
                        post={post}
                        onLike={() => handleLike(post._id, 'post')}
                        onClick={handlePostClick}
                      />
                    </motion.div>
                  ))}
                </div>
              ))}

            {activeTab === 'cards' &&
              (filteredCards.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <CreditCard className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                    Aucune carte trouvée
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Soyez le premier à créer votre carte de visite !
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCards.map((card, index) => (
                    <motion.div
                      key={card._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CardItem
                        card={card}
                        onLike={() => handleLike(card._id, 'card')}
                        isOwner={false}
                      />
                    </motion.div>
                  ))}
                </div>
              ))}
          </>
        )}
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
        onLike={(id) => handleLike(id, 'post')}
      />
    </PageWrapper>
  );
};

export default Explore;
