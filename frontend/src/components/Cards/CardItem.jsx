import { motion } from 'framer-motion';
import { MapPin, Phone, Trash2, Edit2, Heart, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import { getImageUrl } from '../../utils/helpers';

const CardItem = ({ card, onLike, onDelete, isOwner }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(card.bizImage)}
          alt={card.bizName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940';
          }}
        />
        <div className="absolute top-4 end-4 flex gap-2">
          {onLike && (
            <button
              onClick={() => onLike(card._id)}
              className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg text-red-500 hover:scale-110 transition-transform"
            >
              <Heart className={`w-5 h-5 ${card.likes?.includes('me') ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white line-clamp-1">
            {card.bizName}
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-1">
          {card.bizDescription}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
            <span className="truncate">{card.bizAddress}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Phone className="w-4 h-4 text-gold-500 shrink-0" />
            <span>{card.bizPhone}</span>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
            <Link to={`/dashboard/cards/${card._id}/edit`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="border-gray-200 hover:border-gold-500 hover:text-gold-500"
              >
                <Edit2 className="w-4 h-4 me-2" />
                Modifier
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(card._id)}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CardItem;
