import HeroLanding from '../components/Landing/HeroLanding';
import DishesCarousel from '../components/Landing/DishesCarousel';
import PublishSection from '../components/Landing/PublishSection';
import RecipesSection from '../components/Landing/RecipesSection';
import RestaurantsSection from '../components/Landing/RestaurantsSection';
import StatsSection from '../components/Landing/StatsSection';
import TestimonialsSection from '../components/Landing/TestimonialsSection';
import CTASection from '../components/Landing/CTASection';

const LandingPage = () => {
  return (
    <div className="overflow-x-hidden">
      <HeroLanding />
      <StatsSection />
      <DishesCarousel />
      <PublishSection />
      <RestaurantsSection />
      <TestimonialsSection />
      <RecipesSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;
