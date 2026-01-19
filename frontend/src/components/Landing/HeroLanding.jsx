import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, ChefHat, ArrowRight, Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../UI/Button';
import { getImageUrl } from '../../utils/helpers';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874',
  'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=2785',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2874',
];

const HeroLanding = () => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div ref={ref} className="relative h-screen flex items-center overflow-hidden bg-black">
      {/* Background Carousel */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${getImageUrl(HERO_IMAGES[currentImageIndex])}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 px-4 md:px-16 max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <ChefHat className="w-6 h-6 text-gold-500" />
            </div>
            <span className="text-gold-400 font-display tracking-widest uppercase text-sm">
              {t('home.hero.badge')}
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 leading-none tracking-tight drop-shadow-lg">
            Flavors of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-200">
              Israel
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed font-light drop-shadow-md max-w-2xl">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link to="/restaurants">
              <Button
                variant="primary"
                size="lg"
                className="px-8 py-4 text-lg bg-white text-black hover:bg-gray-200 border-none flex items-center gap-3"
              >
                <Play className="w-6 h-6 fill-black" />
                {t('home.hero.cta')}
              </Button>
            </Link>

            <Link to="/explore">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg bg-gray-500/30 border-none text-white hover:bg-gray-500/50 backdrop-blur-sm flex items-center gap-3"
              >
                <Info className="w-6 h-6" />
                {t('home.hero.moreInfo')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-10 end-10 z-20 flex gap-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? 'w-8 bg-gold-500' : 'w-4 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroLanding;
