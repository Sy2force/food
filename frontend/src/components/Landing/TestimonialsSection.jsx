import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../utils/helpers';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Cohen',
    role: 'Chef Pâtissière',
    avatar: 'https://i.pravatar.cc/150?img=1',
    text: "Flavors of Israel m'a permis de partager mes recettes familiales avec le monde entier. La communauté est incroyable !",
    rating: 5,
  },
  {
    id: 2,
    name: 'David Levi',
    role: 'Restaurateur',
    avatar: 'https://i.pravatar.cc/150?img=12',
    text: 'Grâce à cette plateforme, mon restaurant a gagné en visibilité. Les outils de gestion sont parfaits.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Rachel Mizrahi',
    role: 'Passionnée de Cuisine',
    avatar: 'https://i.pravatar.cc/150?img=5',
    text: "Je découvre chaque jour de nouvelles recettes traditionnelles. C'est une véritable mine d'or culinaire !",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-cream-100 dark:bg-gray-900 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6">
            {t('landing.testimonials.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('landing.testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 end-6 w-12 h-12 text-gold-500/20" />

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={getImageUrl(testimonial.avatar)}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-gold-500"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + testimonial.name;
                  }}
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
