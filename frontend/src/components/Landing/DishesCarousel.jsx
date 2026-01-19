import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { motion } from 'framer-motion';
import { MapPin, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/helpers';

const featuredDishes = [
  {
    id: 1,
    name: 'Shakshuka Traditionnelle',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2787',
    chef: 'Chef David Cohen',
    city: 'Tel Aviv',
    mongoId: '1', // Mapped to mock ID
  },
  {
    id: 2,
    name: 'Hummus Maison',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=2787',
    chef: 'Chef Sarah Levi',
    city: 'Jérusalem',
    mongoId: '3',
  },
  {
    id: 3,
    name: 'Falafel Croustillant',
    image: 'https://images.unsplash.com/photo-1593252719532-347b6c86f1a6?q=80&w=2787',
    chef: 'Chef Michael Azoulay',
    city: 'Haïfa',
    mongoId: '4',
  },
  {
    id: 4,
    name: 'Sabich Authentique',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2940',
    chef: 'Chef Rachel Ben-David',
    city: 'Tel Aviv',
    mongoId: '2',
  },
  {
    id: 5,
    name: 'Shawarma Agneau',
    image: 'https://images.unsplash.com/photo-1529193591176-1da79027d382?q=80&w=2940',
    chef: 'Chef Eyal Shani',
    city: 'Tel Aviv',
    mongoId: '6',
  },
];

const DishesCarousel = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-[#1a1a1a] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            {t('landing.dishesCarousel.title')}
          </h2>
          <p className="text-xl text-cream-200 max-w-2xl mx-auto">
            {t('landing.dishesCarousel.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            className="dishes-carousel"
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {featuredDishes.map((dish) => (
              <SwiperSlide key={dish.id} className="!w-96">
                <Link to={`/dishes/${dish.mongoId || dish.id}`}>
                  <div className="relative group cursor-pointer">
                    <div className="relative h-[500px] rounded-2xl overflow-hidden">
                      <img
                        src={getImageUrl(dish.image)}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      <div className="absolute bottom-0 start-0 end-0 p-8 text-white">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h3 className="text-3xl font-display font-bold mb-3">{dish.name}</h3>
                          <div className="flex items-center gap-4 text-cream-200">
                            <span className="flex items-center gap-2">
                              <ChefHat className="w-5 h-5" />
                              {dish.chef}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="w-5 h-5" />
                              {dish.city}
                            </span>
                          </div>
                        </motion.div>
                      </div>

                      <div className="absolute top-4 end-4">
                        <span className="px-4 py-2 bg-gold-500 text-white text-sm font-semibold rounded-full shadow-lg">
                          {t('landing.dishesCarousel.kosher')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      <style jsx>{`
        .dishes-carousel .swiper-button-next,
        .dishes-carousel .swiper-button-prev {
          color: #d4af37;
        }
        .dishes-carousel .swiper-pagination-bullet-active {
          background: #d4af37;
        }
      `}</style>
    </section>
  );
};

export default DishesCarousel;
