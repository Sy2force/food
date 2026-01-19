import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Eye, User } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../utils/helpers';

const PremiumBookCard = ({ book }) => {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      className="perspective-1000"
    >
      <Link to={`/recipe-books/${book._id}`}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className="relative preserve-3d"
          onHoverStart={() => setIsFlipped(true)}
          onHoverEnd={() => setIsFlipped(false)}
        >
          <div className="backface-hidden">
            <div className="bg-gradient-to-br from-cream-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-gold-500/20 hover:border-gold-500/50 transition-all duration-500">
              <div className="relative h-96 overflow-hidden">
                <img
                  src={getImageUrl(book.coverImage)}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2898';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute top-4 end-4 px-3 py-1 bg-gold-500 text-white text-xs font-bold rounded-full">
                  {book.theme}
                </div>

                <div className="absolute bottom-0 start-0 end-0 p-6">
                  <h3 className="text-3xl font-display font-bold text-white mb-2">{book.title}</h3>
                  <p className="text-cream-100 text-sm mb-3 line-clamp-2">{book.description}</p>
                  <div className="flex items-center gap-4 text-cream-200 text-sm">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {book.recipes?.length || 0} {t('common.recipes')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {book.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {book.views || 0}
                    </span>
                  </div>
                </div>
              </div>

              {book.author && (
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {book.author.firstName} {book.author.lastName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default PremiumBookCard;
