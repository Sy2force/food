import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, User, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { likeAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { getImageUrl } from '../../utils/helpers';

const ImageModal = ({ isOpen, onClose, post, onLike }) => {
  const { isAuthenticated } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLike = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await likeAPI.toggleLike('posts', post._id);
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
      onLike?.(post._id);
    } catch (error) {
      // Error like
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <button
              onClick={onClose}
              className="absolute top-4 end-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-7xl w-full max-h-[90vh] flex flex-col md:flex-row gap-4 bg-gray-900 rounded-2xl overflow-hidden"
            >
              <div className="flex-1 flex items-center justify-center bg-black">
                <img
                  src={getImageUrl(post.photo)}
                  alt={post.description}
                  className="max-w-full max-h-[90vh] object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div className="w-full md:w-96 flex flex-col bg-gray-900 text-white">
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={getImageUrl(post.author?.avatar)}
                      alt={post.author?.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          'https://ui-avatars.com/api/?name=' + (post.author?.firstName || 'User');
                      }}
                    />
                    <div>
                      <p className="font-semibold">
                        {post.author?.firstName} {post.author?.lastName}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-200 mb-4">{post.description}</p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleLike}
                      disabled={!isAuthenticated}
                      className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span className="font-semibold">{likesCount}</span>
                    </button>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MessageCircle className="w-6 h-6" />
                      <span className="font-semibold">{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <h3 className="font-semibold mb-4">Commentaires</h3>
                  {post.comments && post.comments.length > 0 ? (
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3">
                          <img
                            src={getImageUrl(comment.user?.avatar)}
                            alt={comment.user?.firstName}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                'https://ui-avatars.com/api/?name=' +
                                (comment.user?.firstName || 'User');
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {comment.user?.firstName} {comment.user?.lastName}
                            </p>
                            <p className="text-gray-300 text-sm">{comment.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Aucun commentaire pour le moment
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
