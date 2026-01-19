import { motion } from 'framer-motion';
import { TrendingUp, Clock, Award, Sparkles } from 'lucide-react';

const QuickActions = ({ onQuickFilter }) => {
  const quickFilters = [
    {
      icon: TrendingUp,
      label: 'Populaires',
      filter: { sort: 'popular' },
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Clock,
      label: 'Nouveautés',
      filter: { sort: 'recent' },
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Award,
      label: 'Mehadrin',
      filter: { cacherout: 'Mehadrin' },
      color: 'from-gold-500 to-yellow-500',
    },
    {
      icon: Sparkles,
      label: 'Végétarien',
      filter: { isVegetarian: true },
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {quickFilters.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuickFilter(item.filter)}
            className={`relative p-6 bg-gradient-to-br ${item.color} rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon className="w-8 h-8 text-white mb-2 mx-auto" />
            <p className="text-white font-semibold text-sm">{item.label}</p>
          </motion.button>
        );
      })}
    </div>
  );
};

export default QuickActions;
