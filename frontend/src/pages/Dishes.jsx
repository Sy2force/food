import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ChefHat, Flame, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { dishAPI } from '../services/api';
import PremiumDishCard from '../components/Dishes/PremiumDishCard';
import StickyFilters from '../components/Dishes/StickyFilters';
import QuickActions from '../components/Dishes/QuickActions';
import SkeletonCard from '../components/UI/SkeletonCard';
import Toast from '../components/UI/Toast';
import Button from '../components/UI/Button';
import { getImageUrl } from '../utils/helpers';

const Dishes = () => {
  const { t } = useTranslation();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [featuredDishes, setFeaturedDishes] = useState([]);

  // Mock data for development
  const mockDishes = [
    {
      _id: '1',
      name: 'Shakshuka Royale',
      description:
        'Œufs pochés dans une sauce tomate épicée aux poivrons et oignons, servis avec du pain challah frais et des herbes aromatiques.',
      price: 45,
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2787',
      restaurant: { name: 'Dr Shakshuka', _id: '7' },
      region: 'Jaffa',
      category: 'Petit-déjeuner',
      cacherout: 'Rabbanout',
      isVegetarian: true,
      rating: { average: 4.8, count: 124 },
    },
    {
      _id: '2',
      name: 'Sabich Deluxe',
      description:
        'Aubergines frites, œufs durs, pommes de terre, salade israélienne et amba dans une pita moelleuse. Une explosion de saveurs.',
      price: 38,
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2940',
      restaurant: { name: 'Sabich Frishman', _id: '8' },
      region: 'Tel Aviv',
      category: 'Street Food',
      cacherout: 'Mehadrin',
      isVegetarian: true,
      rating: { average: 4.9, count: 250 },
    },
    {
      _id: '3',
      name: 'Hummus Bassar',
      description:
        "Hummus crémeux surmonté de viande hachée épicée aux pignons de pin, huile d'olive extra vierge et persil.",
      price: 52,
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=2787',
      restaurant: { name: 'Abu Hassan', _id: '9' },
      region: 'Jaffa',
      category: 'Plat Principal',
      cacherout: 'Rabbanout',
      isVegetarian: false,
      rating: { average: 4.7, count: 310 },
    },
    {
      _id: '4',
      name: 'Falafel Doré',
      description:
        'Boulettes de pois chiches croustillantes aux herbes fraîches, servies avec tahini, sauce piquante et pickles maison.',
      price: 30,
      image: 'https://images.unsplash.com/photo-1593252719532-347b6c86f1a6?q=80&w=2787',
      restaurant: { name: 'HaKosem', _id: '10' },
      region: 'Tel Aviv',
      category: 'Street Food',
      cacherout: 'Mehadrin',
      isVegetarian: true,
      rating: { average: 4.8, count: 420 },
    },
    {
      _id: '5',
      name: "Carpaccio d'Aubergine",
      description:
        'Aubergine rôtie à la flamme, tahini brut, silan (sirop de dattes), pistaches concassées et graines de grenade.',
      price: 48,
      image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee397?q=80&w=2835',
      restaurant: { name: 'Machneyuda', _id: '2' }, // Fixed to point to Machneyuda (id 2)
      region: 'Jérusalem',
      category: 'Entrée',
      cacherout: 'Rabbanout',
      isVegetarian: true,
      rating: { average: 4.9, count: 180 },
    },
    {
      _id: '6',
      name: 'Shawarma Agneau',
      description:
        "Fines tranches d'agneau marinées et grillées à la broche, servies dans une laffa avec hummus, tehina et salade.",
      price: 55,
      image: 'https://images.unsplash.com/photo-1529193591176-1da79027d382?q=80&w=2940',
      restaurant: { name: 'Miznon', _id: '11' },
      region: 'Tel Aviv',
      category: 'Viandes',
      cacherout: 'Rabbanout',
      isVegetarian: false,
      rating: { average: 4.6, count: 215 },
    },
  ];

  useEffect(() => {
    fetchDishes(true);
    // Simulating featured dishes fetch
    setFeaturedDishes(mockDishes.slice(0, 3));
  }, [filters]);

  const fetchFeatured = async () => {
    try {
      try {
        const response = await dishAPI.getAll({ limit: 3, sort: 'popular' });
        if (response.data && response.data.dishes) {
          setFeaturedDishes(response.data.dishes);
          return;
        }
      } catch (e) {
        // Fallback to mock data
      }
      // Fallback to mock data
      setFeaturedDishes(mockDishes.slice(0, 3));
    } catch (error) {
      setFeaturedDishes(mockDishes.slice(0, 3));
    }
  };

  const fetchDishes = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      let data = [];
      let apiSuccess = false;

      // Try API call
      try {
        // Construct query params from filters
        const params = {
          limit: 12,
          page: reset ? 1 : page,
          ...filters,
        };
        const response = await dishAPI.getAll(params);
        if (response.data && response.data.dishes) {
          data = response.data.dishes;
          apiSuccess = true;
          // Note: Real API would return hasMore or total count.
          // For now assuming if we got data, we might have more.
          setHasMore(response.data.dishes.length === 12);
        }
      } catch (apiError) {
        // API error fetching dishes, using mock data
      }

      if (!apiSuccess) {
        // Simulate API call delay for mock
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Filter mock data
        let filteredData = mockDishes;

        if (filters.category) {
          filteredData = filteredData.filter((d) => d.category === filters.category);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(
            (d) =>
              d.name.toLowerCase().includes(searchLower) ||
              d.description.toLowerCase().includes(searchLower) ||
              d.restaurant.name.toLowerCase().includes(searchLower)
          );
        }
        if (filters.cacherout) {
          filteredData = filteredData.filter((d) => d.cacherout === filters.cacherout);
        }
        if (filters.isVegetarian) {
          filteredData = filteredData.filter((d) => d.isVegetarian);
        }
        if (filters.region || filters.city) {
          const regionFilter = filters.region || filters.city;
          filteredData = filteredData.filter((d) => d.region === regionFilter);
        }
        data = filteredData;
        setHasMore(false); // No pagination for mock data
      }

      if (reset) {
        // If we are showing featured dishes (no filters active), exclude them from the main list
        // to avoid duplicates (only relevant if we have mixed data, simple check here)
        const isDefaultView = Object.keys(filters).length === 0;

        if (isDefaultView && !apiSuccess) {
          // Only do this exclusion logic for mock data to match the UI expectation
          const featuredSlice = mockDishes.slice(0, 3);
          const featuredIds = new Set(featuredSlice.map((d) => d._id));
          setDishes(data.filter((d) => !featuredIds.has(d._id)));
        } else {
          setDishes(data);
        }
      } else {
        // Deduplicate items based on _id
        setDishes((prev) => {
          const existingIds = new Set(prev.map((item) => item._id));
          const newItems = data.filter((item) => !existingIds.has(item._id));
          return [...prev, ...newItems];
        });
      }
    } catch (error) {
      console.error('Erreur chargement plats:', error);
      showToast('Erreur lors du chargement des plats', 'error');
      // Fallback
      setDishes(mockDishes);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      if (!value) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleQuickFilter = (quickFilter) => {
    setFilters(quickFilter);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900">
      {/* Hero Section Immersive */}
      <div className="relative pt-32 pb-24 bg-gradient-to-r from-[#2c1810] via-[#1a1a1a] to-[#2c1810] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2940')] bg-cover bg-center bg-fixed opacity-30 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#fcfaf7] dark:to-gray-900"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white rounded-full mb-6 shadow-lg shadow-gold-500/20">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold tracking-wide text-sm uppercase">
                {t('dishesPage.hero.badge')}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {t('dishesPage.hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4E4BC] to-[#D4AF37]">
                {t('dishesPage.hero.subtitle')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#e8e0d5] max-w-3xl mx-auto font-light leading-relaxed">
              {t('dishesPage.hero.description')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        {/* Section Chef's Choice */}
        {!loading && featuredDishes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#922B21] rounded-full text-white shadow-lg">
                <ChefHat className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                {t('dishesPage.chefsChoice')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredDishes.map((dish) => (
                <motion.div
                  key={`featured-${dish._id}`}
                  whileHover={{ y: -5 }}
                  className="relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer bg-white dark:bg-gray-800"
                >
                  <div className="absolute top-0 right-0 z-10 p-3">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#922B21] flex items-center gap-1 shadow-sm">
                      <Flame className="w-3 h-3" /> {t('dishesPage.trending')}
                    </div>
                  </div>
                  <div className="h-48 overflow-hidden">
                    <img
                      src={getImageUrl(dish.image)}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940';
                      }}
                    />
                  </div>
                  <div className="p-4 border-b-4 border-[#D4AF37]">
                    <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">
                      {dish.name}
                    </h3>
                    <p className="text-[#7A8450] text-sm font-medium flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> {dish.category}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <QuickActions onQuickFilter={handleQuickFilter} />

        <StickyFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          activeCount={activeFilterCount}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : dishes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-[#e8e0d5]"
          >
            <div className="bg-[#fcfaf7] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
              {t('dishesPage.noResults')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              {t('dishesPage.noResultsDesc')}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {dishes.map((dish, index) => (
                <motion.div
                  key={dish._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PremiumDishCard
                    dish={dish}
                    onLike={() => {}}
                    onFavorite={() => {}}
                    onShare={() => {}}
                    showToast={showToast}
                  />
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center pb-20">
                <Button
                  variant="outline"
                  onClick={() => fetchDishes(false)}
                  disabled={loadingMore}
                  className="px-10 py-4 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300 uppercase tracking-widest font-semibold text-sm"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('dishesPage.loadMore')
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={hideToast} />
    </div>
  );
};

export default Dishes;
