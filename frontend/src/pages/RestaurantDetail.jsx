import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { restaurantAPI } from '../services/api';
import { MapPin, Phone, Globe, ArrowLeft, Star, Award, Clock } from 'lucide-react';
import PremiumDishCard from '../components/Dishes/PremiumDishCard';
import SkeletonCard from '../components/UI/SkeletonCard';
import Toast from '../components/UI/Toast';
import { getImageUrl } from '../utils/helpers';

const RestaurantDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const mockRestaurants = {
        1: {
          _id: '1',
          name: 'Mizlala',
          description:
            'Une expérience culinaire moderne par le chef Meir Adoni. Une fusion audacieuse de saveurs moyen-orientales et de techniques européennes. Le cadre est chic et décontracté, parfait pour un dîner entre amis ou un rendez-vous.',
          coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940',
          logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940',
          address: { city: 'Tel Aviv', street: 'Nahalat Binyamin 57' },
          phone: '03-566-5505',
          website: 'https://mizlala.co.il',
          cacherout: 'Mehadrin',
          rating: { average: 4.8, count: 320 },
          priceRange: '₪₪₪',
          cuisine: ['Israélien', 'Fusion', 'Chef'],
          openingHours: true,
          dishes: [
            {
              _id: '101',
              name: 'Croissant Foie Gras',
              description:
                'Croissant au beurre maison garni de foie gras poêlé et confiture de figues.',
              price: 85,
              image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2874',
              category: 'Entrée',
              cacherout: 'Mehadrin',
              isVegetarian: false,
              isGlutenFree: false,
              rating: { average: 4.9, count: 50 },
              restaurant: { name: 'Mizlala' },
            },
            {
              _id: '102',
              name: 'Tartare de Thon Épicé',
              description: "Thon rouge frais, piment, coriandre, sur un lit d'avocat crémeux.",
              price: 72,
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940',
              category: 'Entrée',
              cacherout: 'Mehadrin',
              isVegetarian: false,
              isGlutenFree: true,
              rating: { average: 4.7, count: 45 },
              restaurant: { name: 'Mizlala' },
            },
          ],
        },
        2: {
          _id: '2',
          name: 'Machneyuda',
          description:
            "L'ambiance électrique du marché Mahane Yehuda dans votre assiette. Musique, joie et cuisine créative au rendez-vous. Les chefs préparent les plats sous vos yeux dans une cuisine ouverte survoltée.",
          coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874',
          logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874',
          address: { city: 'Jérusalem', street: 'Beit Yaakov 10' },
          phone: '02-533-3442',
          website: 'https://machneyuda.co.il',
          cacherout: 'Rabbanout',
          rating: { average: 4.9, count: 450 },
          priceRange: '₪₪₪₪',
          cuisine: ['Marché', 'Méditerranéen', 'Chef'],
          openingHours: true,
          dishes: [
            {
              _id: '201',
              name: 'Polenta aux Champignons',
              description:
                'Polenta crémeuse servie dans un bocal, avec ragoût de champignons, parmesan et huile de truffe.',
              price: 68,
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2940',
              category: 'Entrée',
              cacherout: 'Rabbanout',
              isVegetarian: true,
              rating: { average: 5.0, count: 120 },
              restaurant: { name: 'Machneyuda' },
            },
          ],
        },
        3: {
          _id: '3',
          name: 'Eucalyptus',
          description:
            "Une cuisine biblique interprétée avec modernité. Le chef Moshe Basson utilise des herbes et plantes indigènes des collines de Jérusalem pour créer des plats qui racontent l'histoire de la terre d'Israël.",
          coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2940',
          logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2940',
          address: { city: 'Jérusalem', street: 'Felt 14' },
          phone: '02-624-4331',
          website: 'https://the-eucalyptus.com',
          cacherout: 'Mehadrin',
          rating: { average: 4.7, count: 210 },
          priceRange: '₪₪₪',
          cuisine: ['Biblique', 'Authentique', 'Viandes'],
          openingHours: true,
          dishes: [
            {
              _id: '301',
              name: 'Maqluba au Poulet',
              description:
                'Plat traditionnel palestinien/biblique de riz, légumes et poulet, renversé au moment de servir.',
              price: 95,
              image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=2813',
              category: 'Plat Principal',
              cacherout: 'Mehadrin',
              isVegetarian: false,
              isGlutenFree: true,
              rating: { average: 4.8, count: 85 },
              restaurant: { name: 'Eucalyptus' },
            },
          ],
        },
        4: {
          _id: '4',
          name: 'Herbert Samuel',
          description:
            "Restaurant gastronomique casher face à la mer. Poissons frais, viandes de qualité et une carte des vins exceptionnelle. Le cadre idéal pour un repas d'affaires ou une célébration spéciale.",
          coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2874',
          logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2874',
          address: { city: 'Herzliya', street: 'HaShunit 2' },
          phone: '09-955-5555',
          cacherout: 'Rabbanout',
          rating: { average: 4.6, count: 180 },
          priceRange: '₪₪₪₪',
          cuisine: ['Poisson', 'Viande', 'Gastronomique'],
          openingHours: true,
          dishes: [],
        },
        5: {
          _id: '5',
          name: 'Darya',
          description:
            "Une rencontre culinaire sur la Route de la Soie. Cuisine fusion asiatique-méditerranéenne dans un cadre époustouflant au sein de l'hôtel Hilton Tel Aviv.",
          coverImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2940',
          logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2940',
          address: { city: 'Tel Aviv', street: 'Hilton Hotel' },
          phone: '03-520-2222',
          cacherout: 'Mehadrin',
          rating: { average: 4.8, count: 150 },
          priceRange: '₪₪₪₪',
          cuisine: ['Asiatique', 'Fusion', 'Hôtel'],
          openingHours: true,
          dishes: [],
        },
        6: {
          _id: '6',
          name: '1868',
          description:
            'Haute cuisine dans un bâtiment historique en pierre de Jérusalem. Une expérience gastronomique intime et raffinée, mêlant techniques françaises et produits locaux.',
          coverImage: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2940',
          logo: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2940',
          address: { city: 'Jérusalem', street: 'King David 10' },
          phone: '02-622-2312',
          cacherout: 'Mehadrin',
          rating: { average: 4.9, count: 130 },
          priceRange: '₪₪₪₪',
          cuisine: ['Français', 'Gastronomique', 'Viandes'],
          openingHours: true,
          dishes: [],
        },
      };

      if (mockRestaurants[id]) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setRestaurant(mockRestaurants[id]);
        setDishes(mockRestaurants[id].dishes || []);
        return;
      }

      const response = await restaurantAPI.getById(id);
      setRestaurant(response.data);
      // Assuming dishes are populated or fetched separately, adjust based on API response structure
      if (response.data.dishes) {
        setDishes(response.data.dishes);
      }
    } catch (error) {
      setToast({ show: true, message: 'Erreur lors du chargement du restaurant', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
            {t('restaurantDetail.notFound')}
          </h2>
          <Link to="/restaurants" className="text-[#D4AF37] hover:underline">
            {t('restaurantDetail.back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        {restaurant.coverImage ? (
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-white/20 text-4xl font-display">Flavors of Israel</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/restaurants"
            className="inline-flex items-center text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('restaurantDetail.back')}
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8"
          >
            <div className="relative">
              <img
                src={restaurant.logo || '/default-restaurant.jpg'}
                alt={restaurant.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white/20 shadow-xl object-cover bg-white"
              />
              <div className="absolute -bottom-3 -right-3 bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                {restaurant.rating?.average ? restaurant.rating.average.toFixed(1) : 'New'}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-3 leading-tight">
                {restaurant.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-cream-100 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  {restaurant.address?.city}, {restaurant.address?.street}
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold-400" />
                  {restaurant.cacherout}
                </div>
                {restaurant.priceRange && (
                  <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-gold-400 font-semibold">
                    {restaurant.priceRange}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content - Menu */}
        <div className="lg:col-span-2">
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="w-1 h-8 bg-gold-500 rounded-full mr-3"></span>
              Noo Ce
            </h2>

            {dishes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dishes.map((dish, index) => (
                  <motion.div
                    key={dish._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PremiumDishCard dish={dish} showToast={showToast} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">{t('restaurantDetail.noDishes')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Info */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24"
          >
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">
              {t('restaurantDetail.about')}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {restaurant.description}
            </p>

            <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                <div className="w-10 h-10 rounded-full bg-cream-50 dark:bg-gray-700 flex items-center justify-center text-gold-500 dark:text-gold-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
                    {t('restaurantDetail.info.phone')}
                  </span>
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="hover:text-gold-600 transition-colors"
                  >
                    {restaurant.phone}
                  </a>
                </div>
              </div>

              {restaurant.website && (
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                  <div className="w-10 h-10 rounded-full bg-cream-50 dark:bg-gray-700 flex items-center justify-center text-gold-500 dark:text-gold-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
                      {t('restaurantDetail.info.website')}
                    </span>
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gold-600 transition-colors truncate max-w-[200px] block"
                    >
                      {t('restaurantDetail.info.visitWebsite')}
                    </a>
                  </div>
                </div>
              )}

              {restaurant.openingHours && (
                <div className="flex items-start gap-3 text-gray-700 dark:text-gray-200">
                  <div className="w-10 h-10 rounded-full bg-cream-50 dark:bg-gray-700 flex items-center justify-center text-gold-500 dark:text-gold-400 mt-1">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">
                      {t('restaurantDetail.info.hours')}
                    </span>
                    <ul className="text-sm space-y-1">
                      <li>{t('restaurantDetail.info.opening.sunThu')}</li>
                      <li>{t('restaurantDetail.info.opening.fri')}</li>
                      <li>{t('restaurantDetail.info.opening.sat')}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                {t('restaurantDetail.info.cuisines')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {restaurant.cuisine?.map((cuisine, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cream-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={hideToast} />
    </div>
  );
};

export default RestaurantDetail;
