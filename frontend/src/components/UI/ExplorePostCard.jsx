import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../utils/helpers';

const ExplorePostCard = ({ post, onLike, onClick }) => {
  const { t, i18n } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike?.(post._id);
  };

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(post);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/explore/${post._id}`} className="block group" onClick={handleClick}>
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          {post.photo && (
            <div className="relative h-64 overflow-hidden">
              <img
                src={getImageUrl(post.photo)}
                alt="Post"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none'; // Hide if fails
                }}
              />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={getImageUrl(post.author?.avatar)}
                alt={post.author?.firstName}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src =
                    'https://ui-avatars.com/api/?name=' + (post.author?.firstName || 'User');
                }}
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {post.author?.firstName} {post.author?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString(
                    i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'he' ? 'he-IL' : 'en-US'
                  )}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
              {post.content || post.description}
            </p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-cream-200 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="text-sm">{likesCount}</span>
              </button>

              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ExplorePostCard;
