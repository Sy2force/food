import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import Dishes from './pages/Dishes';
import DishDetail from './pages/DishDetail';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import RecipeBooks from './pages/RecipeBooks';
import RecipeBookDetail from './pages/RecipeBookDetail';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import UserDashboard from './pages/UserDashboard';
import UserLikes from './pages/UserLikes';
import Explore from './pages/Explore';
import PostCreate from './pages/PostCreate';
import ExploreDetail from './pages/ExploreDetail';
import BusinessDashboard from './pages/Dashboard/BusinessDashboard';
import RestaurantList from './pages/Dashboard/RestaurantList';
import RestaurantForm from './pages/Dashboard/RestaurantForm';
import DishList from './pages/Dashboard/DishList';
import DishForm from './pages/Dashboard/DishForm';
import RecipeList from './pages/Dashboard/RecipeList';
import RecipeForm from './pages/Dashboard/RecipeForm';
import Analytics from './pages/Dashboard/Analytics';
import Settings from './pages/Dashboard/Settings';
import AdminPanel from './pages/Admin/AdminPanel';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="dishes" element={<Dishes />} />
          <Route path="dishes/:id" element={<DishDetail />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="restaurants/:id" element={<RestaurantDetail />} />
          <Route path="recipe-books" element={<RecipeBooks />} />
          <Route path="recipe-books/:id" element={<RecipeBookDetail />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />
          <Route path="explore" element={<Explore />} />
          <Route path="explore/:id" element={<ExploreDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="contact" element={<Contact />} />

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="profile/:id" element={<Profile />} />

          <Route
            path="user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/likes"
            element={
              <ProtectedRoute>
                <UserLikes />
              </ProtectedRoute>
            }
          />

          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="explore/create"
            element={
              <ProtectedRoute>
                <PostCreate />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute requireBusiness>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/restaurants"
            element={
              <ProtectedRoute requireBusiness>
                <RestaurantList />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/restaurants/create"
            element={
              <ProtectedRoute requireBusiness>
                <RestaurantForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/restaurants/:id/edit"
            element={
              <ProtectedRoute requireBusiness>
                <RestaurantForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/dishes"
            element={
              <ProtectedRoute requireBusiness>
                <DishList />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/dishes/create"
            element={
              <ProtectedRoute requireBusiness>
                <DishForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/dishes/:id/edit"
            element={
              <ProtectedRoute requireBusiness>
                <DishForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/recipes"
            element={
              <ProtectedRoute requireBusiness>
                <RecipeList />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/recipes/create"
            element={
              <ProtectedRoute requireBusiness>
                <RecipeForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/recipes/:id/edit"
            element={
              <ProtectedRoute requireBusiness>
                <RecipeForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/analytics"
            element={
              <ProtectedRoute requireBusiness>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard/settings"
            element={
              <ProtectedRoute requireBusiness>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/:tab"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
