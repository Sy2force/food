import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import {
  Heart,
  MessageCircle,
  Eye,
  ArrowLeft,
  Trash2,
  Send,
  Share2,
  MoreVertical,
  Flag,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SkeletonCard from '../components/UI/SkeletonCard';
import Toast from '../components/UI/Toast';
import { getImageUrl } from '../utils/helpers';

const ExploreDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showMenu, setShowMenu] = useState(false);

  // Mock data fallback
  const mockPost = {
    _id: id,
    title: "Mon Chef d'Oeuvre du Dimanche",
    description:
      "J'ai passé tout l'après-midi à préparer ce festin pour la famille. Des saveurs authentiques qui me rappellent mon enfance à Tel Aviv. Le mélange d'épices est secret mais je peux vous dire qu'il y a beaucoup d'amour (et de cumin) !",
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2787',
    userId: {
      _id: 'user1',
      name: 'Sarah Cohen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256',
    },
    likes: ['1', '2', '3', '4', '5'],
    views: 1250,
    tags: ['FaitMaison', 'Famille', 'TelAviv', 'Épices'],
    dishType: 'Plat Principal',
    isKosher: true,
    isVegetarian: false,
    isVegan: false,
    createdAt: new Date().toISOString(),
    comments: [
      {
        _id: 'c1',
        userId: {
          name: 'David Levi',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256',
        },
        text: "Ça a l'air incroyable ! Tu partagerais la recette ?",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        _id: 'c2',
        userId: {
          name: 'Noa Ben-Ari',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256',
        },
        text: 'Magnifique présentation 😍',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      // Mock data matching Explore.jsx
      const mockPosts = {
        1: {
          _id: '1',
          title: 'Délicieux pain Challah fait maison',
          description:
            'Une recette de ma grand-mère transmise de génération en génération. Ce pain est le cœur de notre table de Shabbat. Le secret réside dans le temps de levée et le tressage à 6 brins.',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2942',
          userId: {
            _id: 'user1',
            name: 'Sarah Cohen',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256',
          },
          likes: ['1', '2', '3'],
          views: 1250,
          tags: ['Shabbat', 'Traditionnel', 'Pain'],
          dishType: 'Boulangerie',
          isKosher: true,
          isVegetarian: true,
          isVegan: false,
          createdAt: new Date().toISOString(),
          comments: [
            {
              _id: 'c1',
              userId: {
                name: 'David Levi',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256',
              },
              text: 'Magnifique tressage ! Tu utilises quelle farine ?',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ],
        },
        2: {
          _id: '2',
          title: 'Shakshuka épicée du matin',
          description:
            "Le petit-déjeuner des champions ! Shakshuka avec des poivrons rôtis, beaucoup d'ail et des épices fraiches. N'oubliez pas le pain pour saucer !",
          image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?q=80&w=2787',
          userId: {
            _id: 'user2',
            name: 'David Levi',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256',
          },
          likes: ['1', '2'],
          views: 850,
          tags: ['PetitDejeuner', 'Oeufs', 'Tomates'],
          dishType: 'Petit-déjeuner',
          isKosher: true,
          isVegetarian: true,
          isVegan: false,
          createdAt: new Date().toISOString(),
          comments: [],
        },
        3: {
          _id: '3',
          title: 'Falafels maison & Tahini',
          description:
            "Rien de tel que des falafels faits maison, croustillants à l'extérieur et verts et moelleux à l'intérieur. Servis avec une sauce tahini citronnée.",
          image: 'https://images.unsplash.com/photo-1593252719532-347b6c86f1a6?q=80&w=2787',
          userId: {
            _id: 'user3',
            name: 'Noa Ben-Ari',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256',
          },
          likes: ['1', '2', '3', '4', '5'],
          views: 2100,
          tags: ['Vegan', 'StreetFood', 'Falafel'],
          dishType: 'Plat Principal',
          isKosher: true,
          isVegetarian: true,
          isVegan: true,
          createdAt: new Date().toISOString(),
          comments: [
            {
              _id: 'c2',
              userId: {
                name: 'Sarah Cohen',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256',
              },
              text: "Ils ont l'air parfaits !",
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
          ],
        },
      };

      if (mockPosts[id]) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setPost(mockPosts[id]);
        return;
      }

      try {
        const response = await postAPI.getById(id);
        if (response.data && response.data.post) {
          setPost(response.data.post);
        } else {
          // If API returns success but no post, or custom structure
          throw new Error('Post not found in API response');
        }
      } catch (apiError) {
        // Fallback to mock
        setPost(mockPost);
      }
    } catch (error) {
      // Fallback to mock
      setPost(mockPost);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      setToast({ show: true, message: t('exploreDetail.loginToLike'), type: 'info' });
      return;
    }
    try {
      await postAPI.like(id);
      // Optimistic update or fetch
      setPost((prev) => ({
        ...prev,
        likes: prev.likes.includes(user._id)
          ? prev.likes.filter((uid) => uid !== user._id)
          : [...prev.likes, user._id],
      }));
      setToast({
        show: true,
        message: isLiked ? t('exploreDetail.likeRemoved') : t('exploreDetail.likeAdded'),
        type: 'success',
      });
    } catch (error) {
      // Error liking post
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t('exploreDetail.confirmDelete'))) return;
    try {
      await postAPI.delete(id);
      setToast({ show: true, message: t('exploreDetail.deleteSuccess'), type: 'success' });
      setTimeout(() => navigate('/explore'), 1500);
    } catch (error) {
      setToast({ show: true, message: t('exploreDetail.deleteError'), type: 'error' });
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await postAPI.addComment(id, commentText);
      setCommentText('');
      setToast({ show: true, message: t('exploreDetail.commentAdded'), type: 'success' });
      fetchPost();
    } catch (error) {
      setToast({ show: true, message: t('exploreDetail.commentError'), type: 'error' });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm(t('exploreDetail.confirmDeleteComment'))) return;
    try {
      await postAPI.deleteComment(id, commentId);
      fetchPost();
      setToast({ show: true, message: t('exploreDetail.commentDeleted'), type: 'success' });
    } catch (error) {
      // Error deleting comment
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setToast({ show: true, message: t('exploreDetail.shareSuccess'), type: 'success' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t('exploreDetail.notFound')}
      </div>
    );
  }

  const isOwner = user?._id === post.userId._id;
  const isLiked =
    post.likes?.includes(user?._id) || post.likes?.some((like) => like._id === user?._id);

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 pb-20 pt-28">
      {/* Navbar Placeholder / Back Button */}
      <div className="sticky top-20 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="container-custom py-4">
          <Link
            to="/explore"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gold-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('exploreDetail.back')}
          </Link>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content: Image & Description */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700"
            >
              {/* Image Header */}
              <div className="relative h-[500px]">
                <img
                  src={getImageUrl(post.image || post.photo)}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2787';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badges Overlay */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  {post.isKosher && (
                    <span className="bg-gold-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                      Casher
                    </span>
                  )}
                  {post.isVegan && (
                    <span className="bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                      Vegan
                    </span>
                  )}
                  {post.dishType && (
                    <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                      {post.dishType}
                    </span>
                  )}
                </div>
              </div>

              {/* Interaction Bar */}
              <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 text-lg font-medium transition-all ${
                      isLiked
                        ? 'text-red-500'
                        : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes?.length || 0}</span>
                  </button>

                  <div className="flex items-center gap-2 text-lg font-medium text-gray-600 dark:text-gray-400">
                    <MessageCircle className="w-7 h-7" />
                    <span>{post.comments?.length || 0}</span>
                  </div>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gold-500 transition-colors"
                  >
                    <Share2 className="w-7 h-7" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Eye className="w-5 h-5" />
                  <span>
                    {post.views || 0} {t('exploreDetail.views')}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                    {post.title}
                  </h1>
                  {isOwner && (
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                      {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20">
                          <button
                            onClick={handleDelete}
                            className="w-full px-4 py-3 text-start text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t('exploreDetail.delete')}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  {post.description}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-cream-100 dark:bg-gray-700 text-olive-800 dark:text-olive-200 rounded-lg text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8"
            >
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-8">
                {t('exploreDetail.commentsTitle')}
              </h3>

              {isAuthenticated ? (
                <form onSubmit={handleAddComment} className="mb-10 flex gap-4">
                  <img
                    src={getImageUrl(user?.avatar)}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                    onError={(e) => {
                      e.target.src = 'https://ui-avatars.com/api/?name=' + (user?.name || 'User');
                    }}
                  />
                  <div className="flex-1 relative">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={t('exploreDetail.commentPlaceholder')}
                      rows={1}
                      className="w-full px-6 py-4 pr-12 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border-none focus:ring-2 focus:ring-gold-500 text-gray-900 dark:text-white placeholder-gray-400 resize-none min-h-[60px]"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim() || submittingComment}
                      className="absolute right-3 bottom-3 p-2 bg-gold-500 text-white rounded-xl hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center text-blue-600 dark:text-blue-300">
                  <Link to="/login" className="underline font-bold">
                    {t('auth.login')}
                  </Link>{' '}
                  {t('exploreDetail.loginToComment')}
                </div>
              )}

              <div className="space-y-8">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 group">
                      <img
                        src={getImageUrl(comment.userId?.avatar)}
                        alt={comment.userId?.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700 flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            'https://ui-avatars.com/api/?name=' + (comment.userId?.name || 'User');
                        }}
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 rounded-2xl rounded-tl-none">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-bold text-gray-900 dark:text-white mr-2">
                                {comment.userId?.name}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {(user?._id === comment.userId?._id || user?.isAdmin) && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>{t('exploreDetail.noComments')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar: Author Profile */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-24 space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
                <div className="w-24 h-24 mx-auto mb-4 p-1 rounded-full border-2 border-gold-500 border-dashed">
                  <img
                    src={getImageUrl(post.userId.avatar)}
                    alt={post.userId.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        'https://ui-avatars.com/api/?name=' + (post.userId.name || 'User');
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {post.userId.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {t('exploreDetail.memberSince')} {new Date(post.createdAt).getFullYear()}
                </p>

                <Link to={`/profile/${post.userId._id}`} className="block w-full">
                  <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
                    {t('exploreDetail.viewProfile')}
                  </button>
                </Link>
              </div>

              {/* Advertisement / Promo (Optional) */}
              <div className="bg-gold-500 rounded-3xl p-8 text-white text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="relative z-10">
                  <h4 className="font-display font-bold text-2xl mb-2">
                    {t('exploreDetail.contest.title')}
                  </h4>
                  <p className="text-gold-100 mb-4 text-sm">{t('exploreDetail.contest.text')}</p>
                  <button className="px-6 py-2 bg-white text-gold-600 font-bold rounded-full text-sm hover:bg-gold-50 transition-colors">
                    {t('exploreDetail.contest.button')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default ExploreDetail;
