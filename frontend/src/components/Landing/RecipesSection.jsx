import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../utils/helpers';

const popularRecipes = [
  {
    id: 1,
    title: 'Challah du Shabbat',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2942',
    time: '2h30',
    servings: 8,
    difficulty: 'medium',
  },
  {
    id: 2,
    title: 'Couscous Israélien',
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=2864',
    time: '45min',
    servings: 4,
    difficulty: 'easy',
  },
  {
    id: 3,
    title: 'Baklava Maison',
    image: 'https://images.unsplash.com/photo-1598110750624-207050c4f28c?q=80&w=2940',
    time: '1h30',
    servings: 12,
    difficulty: 'hard',
  },
];

const RecipesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6">
            {t('landing.recipes.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('landing.recipes.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {popularRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-cream-50 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={getImageUrl(recipe.image)}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 end-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
                        recipe.difficulty === 'easy'
                          ? 'bg-olive-600'
                          : recipe.difficulty === 'medium'
                            ? 'bg-gold-500'
                            : 'bg-red-600'
                      } text-white`}
                    >
                      {t(`landing.recipes.difficulty.${recipe.difficulty}`)}
                    </span>
                  </div>

                  <div className="absolute bottom-0 start-0 end-0 p-6">
                    <h3 className="text-2xl font-display font-bold text-white mb-3">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-4 text-cream-100 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipe.servings} pers.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <Link to={`/recipes/${recipe.id}`}>
                    <button className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      {t('landing.recipes.viewRecipe')}
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/recipe-books">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-gray-900 dark:border-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 text-gray-900 dark:text-white text-lg font-semibold rounded-full transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              {t('landing.recipes.viewAll')}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default RecipesSection;
