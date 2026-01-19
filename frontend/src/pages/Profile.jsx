import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  ChefHat,
  Instagram,
  Facebook,
  Globe,
  Award,
  Utensils,
  BookOpen,
  Store,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { usersAPI, postAPI } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import ExplorePostCard from '../components/UI/ExplorePostCard';
import RecipeCard from '../components/UI/RecipeCard';
import PremiumRestaurantCard from '../components/Restaurants/PremiumRestaurantCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import SkeletonCard from '../components/UI/SkeletonCard';

const Profile = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userRestaurants, setUserRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    // If id is present, fetch that user, otherwise use current user
    const targetId = id || currentUser?._id;
    if (targetId) {
      fetchUserProfile(targetId);
    }
  }, [id, currentUser]);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);

      const [userRes, postsRes] = await Promise.all([
        usersAPI.getById(userId),
        postAPI.getAll({ author: userId }), // Assuming filter by author supported in backend
      ]);

      if (userRes.data) {
        setProfileUser(userRes.data);
        setUserPosts(postsRes.data?.posts || []);
        // Note: Real API for userRecipes and userRestaurants needs to be implemented or fetched if available
        // For now, setting them to empty to avoid mocks
        setUserRecipes([]);
        setUserRestaurants([]);
      }
    } catch (e) {
      console.error('Error fetching profile', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!profileUser) return <div className="text-center py-20">{t('profile.notFound')}</div>;

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900">
      {/* Cover Image */}
      <div className="h-[50vh] w-full overflow-hidden relative">
        <img
          src={getImageUrl(profileUser.coverImage)}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2940';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
      </div>

      <div className="container-custom relative px-4 pb-12">
        <div className="max-w-5xl mx-auto -mt-24 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 md:p-10 pb-0">
              <div className="flex flex-col md:flex-row gap-6 md:items-end">
                {/* Avatar */}
                <div className="relative -mt-20 md:-mt-24 mb-4 md:mb-0 mx-auto md:mx-0">
                  <div className="w-40 h-40 rounded-full p-1.5 bg-white dark:bg-gray-800 shadow-xl">
                    <img
                      src={getImageUrl(profileUser.avatar)}
                      alt={profileUser.name}
                      className="w-full h-full rounded-full object-cover border-4 border-gold-500"
                      onError={(e) => {
                        e.target.src =
                          'https://ui-avatars.com/api/?name=' + (profileUser.name || 'User');
                      }}
                    />
                  </div>
                  {profileUser.role === 'business' && (
                    <div className="absolute bottom-2 right-2 bg-olive-600 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-gray-800">
                      <ChefHat className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Main Info */}
                <div className="flex-1 text-center md:text-left mb-6">
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-1">
                    {profileUser.name}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mb-4">
                    {profileUser.pseudo}
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-300">
                    {profileUser.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gold-500" />
                        {profileUser.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gold-500" />
                      {t('profile.memberSince')} {profileUser.joinedDate}
                    </div>
                  </div>
                </div>

                {/* Stats / Action */}
                <div className="flex flex-col gap-4 min-w-[200px] mb-6">
                  <div className="flex justify-center md:justify-end gap-8 text-center">
                    <div>
                      <div className="font-bold text-xl text-gray-900 dark:text-white">
                        {profileUser.followers}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">
                        {t('profile.followers')}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-gray-900 dark:text-white">
                        {profileUser.following}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">
                        {t('profile.following')}
                      </div>
                    </div>
                  </div>
                  {currentUser?._id !== profileUser._id ? (
                    <button className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl shadow-lg transition-colors">
                      {t('profile.subscribe')}
                    </button>
                  ) : (
                    <Link to="/user-dashboard" className="w-full">
                      <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold rounded-xl transition-colors border border-gray-200 dark:border-gray-600">
                        {t('userDashboard.editProfile')}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Bio & Details */}
            <div className="px-6 md:px-10 py-8 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-gold-500" />
                    {t('profile.about')}
                  </h3>
                  {profileUser.bio ? (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {profileUser.bio}
                    </p>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {t('profile.noBio')}
                    </p>
                  )}

                  {profileUser.specialties && (
                    <div className="flex flex-wrap gap-2">
                      {profileUser.specialties.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-gold-500" />
                    {t('profile.links')}
                  </h3>
                  <div className="space-y-3">
                    {profileUser.socials?.instagram && (
                      <a
                        href={`https://instagram.com/${profileUser.socials.instagram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors"
                      >
                        <Instagram className="w-5 h-5" />@{profileUser.socials.instagram}
                      </a>
                    )}
                    {profileUser.socials?.website && (
                      <a
                        href={`https://${profileUser.socials.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                        {t('details.website')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-t border-gray-100 dark:border-gray-700 overflow-x-auto">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-gold-500 text-gold-500 bg-gold-50/10'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Utensils className="w-4 h-4" />
                {t('profile.tabs.creations')} ({userPosts.length})
              </button>

              {profileUser.role === 'business' && (
                <>
                  <button
                    onClick={() => setActiveTab('recipes')}
                    className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
                      activeTab === 'recipes'
                        ? 'border-gold-500 text-gold-500 bg-gold-50/10'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    {t('profile.tabs.recipes')} ({userRecipes.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('restaurants')}
                    className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
                      activeTab === 'restaurants'
                        ? 'border-gold-500 text-gold-500 bg-gold-50/10'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    {t('profile.tabs.restaurants')} ({userRestaurants.length})
                  </button>
                </>
              )}
            </div>

            {/* Content Grid */}
            <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-900/50 min-h-[400px]">
              {activeTab === 'posts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => <ExplorePostCard key={post._id} post={post} />)
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      {t('profile.empty.posts')}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recipes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.length > 0 ? (
                    userRecipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      {t('profile.empty.recipes')}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'restaurants' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userRestaurants.length > 0 ? (
                    userRestaurants.map((restaurant) => (
                      <PremiumRestaurantCard key={restaurant._id} restaurant={restaurant} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      {t('profile.empty.restaurants')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
