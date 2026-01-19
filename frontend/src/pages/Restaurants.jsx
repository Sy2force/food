import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { restaurantAPI } from '../services/api';
import PremiumRestaurantCard from '../components/Restaurants/PremiumRestaurantCard';
import StickyFilters from '../components/Dishes/StickyFilters';
import SkeletonCard from '../components/UI/SkeletonCard';
import Toast from '../components/UI/Toast';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';

// Mock data for development
const mockRestaurants = [
  {
    _id: '1',
    name: 'Mizlala',
    description:
      'Une expérience culinaire moderne par le chef Meir Adoni. Une fusion audacieuse de saveurs moyen-orientales et de techniques européennes.',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940',
    address: { city: 'Tel Aviv', street: 'Nahalat Binyamin 57' },
    phone: '03-566-5505',
    cacherout: 'Mehadrin',
    rating: { average: 4.8, count: 320 },
    cuisine: ['Israélien', 'Fusion', 'Chef'],
    tags: ['Ambiance', 'Cocktails', 'Terrasse'],
  },
  {
    _id: '2',
    name: 'Machneyuda',
    description:
      "L'ambiance électrique du marché Mahane Yehuda dans votre assiette. Musique, joie et cuisine créative au rendez-vous.",
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874',
    address: { city: 'Jérusalem', street: 'Beit Yaakov 10' },
    phone: '02-533-3442',
    cacherout: 'Rabbanout',
    rating: { average: 4.9, count: 450 },
    cuisine: ['Marché', 'Méditerranéen', 'Chef'],
    tags: ['Musique', 'Vivant', 'Iconique'],
  },
  {
    _id: '3',
    name: 'Eucalyptus',
    description:
      'Une cuisine biblique interprétée avec modernité. Le chef Moshe Basson utilise des herbes et plantes indigènes des collines de Jérusalem.',
    logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2940',
    address: { city: 'Jérusalem', street: 'Felt 14' },
    phone: '02-624-4331',
    cacherout: 'Mehadrin',
    rating: { average: 4.7, count: 210 },
    cuisine: ['Biblique', 'Authentique', 'Viandes'],
    tags: ['Historique', 'Romantique', 'Vue'],
  },
  {
    _id: '4',
    name: 'Herbert Samuel',
    description:
      'Restaurant gastronomique casher face à la mer. Poissons frais, viandes de qualité et une carte des vins exceptionnelle.',
    logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2874',
    address: { city: 'Herzliya', street: 'HaShunit 2' },
    phone: '09-955-5555',
    cacherout: 'Rabbanout',
    rating: { average: 4.6, count: 180 },
    cuisine: ['Poisson', 'Viande', 'Gastronomique'],
    tags: ['Vue Mer', 'Luxe', 'Vins'],
  },
  {
    _id: '5',
    name: 'Darya',
    description:
      'Une rencontre culinaire sur la Route de la Soie. Cuisine fusion asiatique-méditerranéenne dans un cadre époustouflant.',
    logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2940',
    address: { city: 'Tel Aviv', street: 'Hilton Hotel' },
    phone: '03-520-2222',
    cacherout: 'Mehadrin',
    rating: { average: 4.8, count: 150 },
    cuisine: ['Asiatique', 'Fusion', 'Hôtel'],
    tags: ['Élégant', 'Business', 'Luxe'],
  },
  {
    _id: '6',
    name: '1868',
    description:
      'Haute cuisine dans un bâtiment historique en pierre de Jérusalem. Une expérience gastronomique intime et raffinée.',
    logo: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2940',
    address: { city: 'Jérusalem', street: 'King David 10' },
    phone: '02-622-2312',
    cacherout: 'Mehadrin',
    rating: { average: 4.9, count: 130 },
    cuisine: ['Français', 'Gastronomique', 'Viandes'],
    tags: ['Intime', 'Historique', 'Cave à vin'],
  },
  {
    _id: '7',
    name: 'Dr Shakshuka',
    description:
      "Le spécialiste incontesté de la Shakshuka à Jaffa. Une cuisine authentique tripolitaine servie dans un cadre rustique rempli d'antiquités.",
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874',
    address: { city: 'Jaffa', street: 'Beit Eshel 3' },
    phone: '03-682-2842',
    cacherout: 'Rabbanout',
    rating: { average: 4.5, count: 520 },
    cuisine: ['Tripolitain', 'Street Food', 'Authentique'],
    tags: ['Iconique', 'Rustique', 'Jaffa'],
  },
  {
    _id: '8',
    name: 'Sabich Frishman',
    description:
      "Une échoppe légendaire au cœur de Tel Aviv, connue pour servir le meilleur Sabich de la ville. Une file d'attente qui en vaut la peine.",
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940',
    address: { city: 'Tel Aviv', street: 'Frishman 42' },
    phone: '03-522-2222',
    cacherout: 'Mehadrin',
    rating: { average: 4.8, count: 680 },
    cuisine: ['Street Food', 'Végétarien', 'Irakien'],
    tags: ['Street Food', 'Populaire', 'Rapide'],
  },
  {
    _id: '9',
    name: 'Abu Hassan',
    description:
      'Le temple du hummus à Jaffa. Une institution familiale qui sert probablement le meilleur hummus du monde depuis plus de 40 ans.',
    logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2940',
    address: { city: 'Jaffa', street: 'Ha-Dolfin 1' },
    phone: '03-682-0888',
    cacherout: 'Rabbanout',
    rating: { average: 4.9, count: 850 },
    cuisine: ['Hummus', 'Authentique', 'Arabe'],
    tags: ['Légendaire', 'Hummus', 'Pas cher'],
  },
  {
    _id: '10',
    name: 'HaKosem',
    description:
      'Le "Magicien" du falafel. Une adresse moderne et vibrante qui a élevé le falafel au rang d\'art culinaire. Service rapide et souriant.',
    logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2874',
    address: { city: 'Tel Aviv', street: 'Shlomo HaMelech 1' },
    phone: '03-525-2033',
    cacherout: 'Mehadrin',
    rating: { average: 4.8, count: 920 },
    cuisine: ['Falafel', 'Shawarma', 'Street Food'],
    tags: ['Vibrant', 'Moderne', 'Incontournable'],
  },
  {
    _id: '11',
    name: 'Miznon',
    description:
      'La street food revisitée par le chef Eyal Shani. Tout est servi dans une pita, avec une ambiance survoltée et de la musique forte.',
    logo: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2940',
    address: { city: 'Tel Aviv', street: 'King George 30' },
    phone: '03-522-2222',
    cacherout: 'Rabbanout',
    rating: { average: 4.7, count: 750 },
    cuisine: ['Chef', 'Pita', 'Créatif'],
    tags: ['Eyal Shani', 'Branché', 'Festif'],
  },
];

const Restaurants = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const fetchRestaurants = useCallback(async (reset = false) => {
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
        const params = {
          limit: 12,
          page: reset ? 1 : page,
          ...filters,
        };
        const response = await restaurantAPI.getAll(params);
        if (response.data && Array.isArray(response.data)) {
          data = response.data;
          apiSuccess = true;
          setHasMore(response.data.length === 12);
        } else if (response.data && response.data.restaurants) {
          data = response.data.restaurants;
          apiSuccess = true;
          setHasMore(response.data.restaurants.length === 12);
        }
      } catch (apiError) {
        // API error fetching restaurants, using mock data
      }

      if (!apiSuccess) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Filter mock data
        let filteredData = mockRestaurants;

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(
            (r) =>
              r.name.toLowerCase().includes(searchLower) ||
              r.description.toLowerCase().includes(searchLower)
          );
        }
        if (filters.cacherout) {
          filteredData = filteredData.filter((r) => r.cacherout === filters.cacherout);
        }
        if (filters.city) {
          // sticky filters might send 'region' or 'city'
          filteredData = filteredData.filter(
            (r) => r.address.city === filters.city || r.address.city === filters.region
          );
        }

        data = filteredData;
        setHasMore(false); // No pagination for mock
      }

      if (reset) {
        setRestaurants(data);
      } else {
        setRestaurants((prev) => {
          const existingIds = new Set(prev.map((item) => item._id));
          const newItems = data.filter((item) => !existingIds.has(item._id));
          return [...prev, ...newItems];
        });
      }
    } catch (error) {
      setRestaurants(mockRestaurants);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, page]); // Add dependencies

  useEffect(() => {
    fetchRestaurants(true);
  }, [fetchRestaurants]);

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

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900">
      <div className="relative pt-32 pb-24 bg-gradient-to-r from-[#2c1810] via-[#1a1a1a] to-[#2c1810] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940')] bg-cover bg-center bg-fixed opacity-30 mix-blend-overlay"></div>
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
              <Store className="w-4 h-4" />
              <span className="font-semibold tracking-wide text-sm uppercase">
                {t('restaurantsPage.hero.badge')}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {t('restaurantsPage.hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4E4BC] to-[#D4AF37]">
                {t('restaurantsPage.hero.subtitle')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#e8e0d5] max-w-3xl mx-auto font-light leading-relaxed">
              {t('restaurantsPage.hero.description')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
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
        ) : restaurants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-[#e8e0d5]"
          >
            <div className="bg-[#fcfaf7] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
              {t('restaurantsPage.noResults')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              {t('restaurantsPage.noResultsDesc')}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {restaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PremiumRestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center pb-20">
                <Button
                  variant="outline"
                  onClick={() => fetchRestaurants(false)}
                  disabled={loadingMore}
                  className="px-10 py-4 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300 uppercase tracking-widest font-semibold text-sm"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('restaurantsPage.loadMore')
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

export default Restaurants;
