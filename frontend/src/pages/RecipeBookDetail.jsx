import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Book, Star, ChefHat, Share2, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SkeletonCard from '../components/UI/SkeletonCard';
import { getImageUrl } from '../utils/helpers';
import { recipeBookAPI } from '../services/api';

const RecipeBookDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for fallback/dev
  const mockBooks = {
    1: {
      _id: '1',
      title: 'Les Secrets de Jérusalem',
      subtitle: 'Voyage culinaire dans la ville sainte',
      description:
        'Une plongée fascinante dans les ruelles de la vieille ville, à la découverte des saveurs millénaires qui font vibrer Jérusalem. Ce livre rassemble les recettes les plus emblématiques, des petits-déjeuners traditionnels aux festins de Shabbat, en passant par les douceurs du marché.',
      author: 'Chef Yotam Ottolenghi',
      authorImage: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
      coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2788',
      theme: 'Traditionnel',
      price: '29.99',
      rating: 4.9,
      publishedDate: '2024',
    },
    2: {
      _id: '2',
      title: 'Tel Aviv Modern',
      subtitle: 'La nouvelle cuisine israélienne',
      description:
        "Explorez la scène culinaire vibrante de Tel Aviv, où tradition et innovation se rencontrent pour créer des plats uniques. Des bars branchés aux tables gastronomiques, découvrez l'âme de la ville blanche.",
      author: 'Chef Eyal Shani',
      authorImage: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
      coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2940',
      theme: 'Moderne',
      price: '24.99',
      rating: 4.7,
      publishedDate: '2023',
    },
    3: {
      _id: '3',
      title: 'Pâtisseries du Shuk',
      subtitle: 'Douceurs et desserts',
      description:
        "Les meilleures recettes de pâtisseries inspirées des marchés d'Israël. Babka, Rugelach, Halva et autres délices sucrés à réaliser chez vous.",
      author: 'Chef Karin Goren',
      authorImage: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
      coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2889',
      theme: 'Desserts',
      price: '19.99',
      rating: 4.8,
      publishedDate: '2023',
    },
    4: {
      _id: '4',
      title: 'Vegan Israeli Kitchen',
      subtitle: 'Plats végétaux gourmands',
      description:
        "Découvrez comment la cuisine israélienne se prête merveilleusement bien à l'alimentation végétale, sans compromis sur le goût. Des recettes saines, colorées et savoureuses.",
      author: 'Chef Ori Shavit',
      authorImage: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
      coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2940',
      theme: 'Végétalien',
      price: '27.50',
      rating: 4.6,
      publishedDate: '2022',
    },
  };

  const mockRecipes = [
    {
      _id: '101',
      title: 'Hummus Royal aux Pignons',
      description:
        "La recette authentique du hummus crémeux, servi chaud avec des pignons grillés et de l'huile d'olive extra vierge.",
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=2787',
      difficulty: 'Moyen',
      prepTime: 30,
      cookTime: 60,
      servings: 6,
    },
    {
      _id: '102',
      title: 'Shakshuka Verte',
      description: 'Une variante fraîche aux épinards, herbes fraîches et fromage feta.',
      image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?q=80&w=2787',
      difficulty: 'Facile',
      prepTime: 15,
      cookTime: 20,
      servings: 4,
    },
    {
      _id: '103',
      title: 'Babka au Chocolat',
      description:
        "Une brioche torsadée moelleuse garnie d'une riche pâte à tartiner au chocolat noir.",
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2942',
      difficulty: 'Difficile',
      prepTime: 45,
      cookTime: 40,
      servings: 8,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiSuccess = false;
        try {
          const response = await recipeBookAPI.getById(id);
          if (response.data) {
            setBook(response.data.recipeBook || response.data);
            setRecipes(response.data.recipes || []);
            apiSuccess = true;
          }
        } catch (e) {
          // API error fetching recipe book, using mock
        }

        if (apiSuccess) {
          setLoading(false);
          return;
        }

        // Mock data logic fallback
        setTimeout(() => {
          if (mockBooks[id]) {
            setBook(mockBooks[id]);
            setRecipes(mockRecipes); // In a real app, recipes would be filtered by book ID
          } else {
            // Fallback to first book if not found, or handle error
            setBook(mockBooks['1']);
            setRecipes(mockRecipes);
          }
          setLoading(false);
        }, 800);
      } catch (error) {
        // Fallback to mock
        setBook(mockBooks['1']);
        setRecipes(mockRecipes);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!book)
    return (
      <div className="container-custom py-20 text-center">{t('recipeBookDetail.notFound')}</div>
    );

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900">
      {/* Immersive Header */}
      <div className="relative h-[60vh] bg-olive-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(book.coverImage)}
            alt={book.title}
            className="w-full h-full object-cover opacity-40 blur-sm scale-110"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2788';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#fcfaf7] dark:to-gray-900" />
        </div>

        <div className="container-custom relative h-full flex flex-col justify-center z-10">
          <Link
            to="/recipe-books"
            className="absolute top-28 left-4 md:left-8 z-20 inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('recipeBookDetail.back')}
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-12 mt-10">
            {/* Book Cover 3D Effect */}
            <motion.div
              initial={{ opacity: 0, rotateY: -30, x: -50 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-48 md:w-64 flex-shrink-0 perspective-1000"
            >
              <div className="relative rounded-lg shadow-2xl transform-gpu transition-transform hover:scale-105 duration-500">
                <img
                  src={getImageUrl(book.coverImage)}
                  alt={book.title}
                  className="w-full rounded-r-lg shadow-2xl border-l-4 border-white/10"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2788';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none rounded-lg" />
              </div>
            </motion.div>

            {/* Book Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center md:text-start text-white max-w-2xl"
            >
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <span className="px-4 py-1.5 bg-gold-500 text-white text-sm font-bold rounded-full shadow-lg">
                  {book.theme}
                </span>
                <span className="flex items-center gap-1 text-gold-400">
                  <Star className="w-4 h-4 fill-current" />
                  {book.rating}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
                {book.title}
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-300 font-light mb-8 italic">
                {book.subtitle}
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500">
                    <img
                      src={getImageUrl(book.authorImage || book.coverImage)}
                      alt={book.author}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          'https://ui-avatars.com/api/?name=' + (book.author || 'Author');
                      }}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-400">{t('recipeBookDetail.author')}</p>
                    <p className="font-semibold text-white">{book.author}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20 hidden md:block" />
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-400">{t('recipeBookDetail.price')}</p>
                  <p className="font-bold text-2xl text-gold-400">{book.price}€</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center md:justify-start">
                <button className="px-8 py-3 bg-white text-olive-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                  {t('recipeBookDetail.buy')}
                </button>
                <button className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content: Description & Recipes */}
          <div className="lg:col-span-8">
            <section className="mb-16">
              <h3 className="text-2xl font-display font-bold text-olive-800 dark:text-white mb-6 flex items-center gap-3">
                <Book className="w-6 h-6 text-gold-500" />
                {t('recipeBookDetail.about')}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {book.description}
              </p>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-display font-bold text-olive-800 dark:text-white flex items-center gap-3">
                  <ChefHat className="w-6 h-6 text-gold-500" />
                  {t('recipeBookDetail.recipesIncluded')} ({recipes.length})
                </h3>
              </div>

              <div className="space-y-6">
                {recipes.map((recipe, index) => (
                  <motion.div
                    key={recipe._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/recipes/${recipe._id}`} className="group block">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 border border-gray-100 dark:border-gray-700">
                        <div className="relative w-full md:w-48 h-48 md:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                          <img
                            src={getImageUrl(recipe.image)}
                            alt={recipe.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940';
                            }}
                          />
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-olive-800">
                            {recipe.difficulty}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gold-500 transition-colors">
                            {recipe.title}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {recipe.description}
                          </p>

                          <div className="flex items-center gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {recipe.prepTime + recipe.cookTime} {t('common.min')}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              {recipe.servings} {t('common.pers')}
                            </div>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center justify-center pe-4">
                          <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-gold-500 group-hover:text-white transition-all">
                            <ArrowLeft className="w-5 h-5 rotate-180 rtl:rotate-0" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                {t('recipeBookDetail.details')}
              </h4>

              <ul className="space-y-4">
                <li className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500">{t('recipeBookDetail.author')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{book.author}</span>
                </li>
                <li className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500">{t('recipeBookDetail.releaseDate')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {book.publishedDate}
                  </span>
                </li>
                <li className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500">{t('recipeBookDetail.language')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {t('recipeBookDetail.languages.fr')}
                  </span>
                </li>
                <li className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500">{t('recipeBookDetail.format')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {t('recipeBookDetail.formats.hardcover')}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeBookDetail;
