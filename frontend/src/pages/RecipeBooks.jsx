import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Book } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { recipeBookAPI } from '../services/api';
import PremiumBookCard from '../components/RecipeBooks/PremiumBookCard';
import SkeletonCard from '../components/UI/SkeletonCard';

const RecipeBooks = () => {
  const { t } = useTranslation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for development if API fails or is empty
  const mockBooks = [
    {
      _id: '1',
      title: 'Les Secrets de Jérusalem',
      subtitle: 'Voyage culinaire dans la ville sainte',
      description:
        'Une plongée fascinante dans les ruelles de la vieille ville, à la découverte des saveurs millénaires qui font vibrer Jérusalem.',
      author: { firstName: 'Yotam', lastName: 'Ottolenghi' },
      coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2788',
      theme: 'Traditionnel',
      recipeCount: 120,
      rating: 4.9,
      price: '29.99',
      likes: ['a', 'b'],
      views: 1250,
    },
    {
      _id: '2',
      title: 'Tel Aviv Modern',
      subtitle: 'La nouvelle cuisine israélienne',
      description:
        'Explorez la scène culinaire vibrante de Tel Aviv, où tradition et innovation se rencontrent pour créer des plats uniques.',
      author: { firstName: 'Eyal', lastName: 'Shani' },
      coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2940',
      theme: 'Moderne',
      recipeCount: 85,
      rating: 4.7,
      price: '24.99',
      likes: ['c'],
      views: 980,
    },
    {
      _id: '3',
      title: 'Pâtisseries du Shuk',
      subtitle: 'Douceurs et desserts',
      description:
        "Les meilleures recettes de pâtisseries inspirées des marchés d'Israël. Babka, Rugelach et autres délices sucrés.",
      author: { firstName: 'Karin', lastName: 'Goren' },
      coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2889',
      theme: 'Desserts',
      recipeCount: 60,
      rating: 4.8,
      price: '19.99',
      likes: ['d', 'e', 'f'],
      views: 1500,
    },
    {
      _id: '4',
      title: 'Vegan Israeli Kitchen',
      subtitle: 'Plats végétaux gourmands',
      description:
        "Découvrez comment la cuisine israélienne se prête merveilleusement bien à l'alimentation végétale, sans compromis sur le goût.",
      author: { firstName: 'Ori', lastName: 'Shavit' },
      coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2940',
      theme: 'Végétalien',
      recipeCount: 90,
      rating: 4.6,
      price: '27.50',
      likes: ['g'],
      views: 850,
    },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Try API
        try {
          const response = await recipeBookAPI.getAll();
          if (response.data) {
            setBooks(response.data);
            setLoading(false);
            return;
          }
        } catch (e) {
          // API error fetching recipe books, using mock
        }

        // Mock data fallback
        setTimeout(() => {
          setBooks(mockBooks);
          setLoading(false);
        }, 1000);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesFilter = filter === 'all' || book.theme.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author?.firstName + ' ' + book.author?.lastName)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['All', 'Traditionnel', 'Moderne', 'Desserts', 'Végétalien'];

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900">
      {/* Header Section */}
      <div className="relative bg-olive-700 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
              backgroundRepeat: 'repeat',
            }}
          />
        </div>
        <div className="container-custom relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-full mb-6 border border-gold-500/30 backdrop-blur-sm">
              <Book className="w-4 h-4" />
              <span className="font-semibold tracking-wide text-sm uppercase">
                {t('recipeBooksPage.hero.badge')}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              {t('recipeBooksPage.hero.title')}
            </h1>
            <p className="text-xl text-olive-100 max-w-2xl mx-auto mb-10">
              {t('recipeBooksPage.hero.description')}
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('recipeBooksPage.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat.toLowerCase())}
                    className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                      filter === cat.toLowerCase()
                        ? 'bg-gold-500 text-white shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="container-custom py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PremiumBookCard book={book} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Book className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
              {t('recipeBooksPage.noResults')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{t('recipeBooksPage.noResultsDesc')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecipeBooks;
