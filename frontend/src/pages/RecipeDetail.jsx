import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  Users,
  ChefHat,
  Heart,
  Share2,
  Printer,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { recipeAPI } from '../services/api';
import Toast from '../components/UI/Toast';
import SkeletonCard from '../components/UI/SkeletonCard';
import { getImageUrl } from '../utils/helpers';

const RecipeDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [servings, setServings] = useState(4); // Default servings

  // Mock data for development
  const mockRecipe = {
    _id: '1',
    title: 'Shakshuka Royale au Safran',
    description:
      "Une version raffinée du classique israélien, infusée au safran et garnie de fromage de chèvre frais et d'herbes aromatiques.",
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?q=80&w=2787',
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: 'Moyen',
    author: {
      name: 'Chef Yotam Ottolenghi',
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
    },
    ingredients: [
      { item: 'Oeufs frais', amount: '4-6', unit: 'pièces' },
      { item: 'Tomates mûres', amount: '800', unit: 'g' },
      { item: 'Poivrons rouges', amount: '2', unit: 'pièces' },
      { item: 'Oignon', amount: '1', unit: 'grand' },
      { item: 'Ail', amount: '3', unit: 'gousses' },
      { item: 'Safran', amount: '1', unit: 'pincée' },
      { item: 'Fromage de chèvre', amount: '150', unit: 'g' },
      { item: "Huile d'olive", amount: '3', unit: 'c.à.s' },
    ],
    instructions: [
      {
        step: 1,
        text: "Chauffer l'huile d'olive dans une grande poêle en fonte sur feu moyen. Ajouter les oignons et les poivrons coupés en dés. Faire revenir pendant 10 minutes jusqu'à ce qu'ils soient tendres.",
      },
      {
        step: 2,
        text: "Ajouter l'ail et les épices (cumin, paprika, safran). Faire revenir 1 minute jusqu'à ce que les arômes se libèrent.",
      },
      {
        step: 3,
        text: "Incorporer les tomates concassées. Laisser mijoter à feu doux pendant 15-20 minutes jusqu'à épaississement de la sauce.",
      },
      {
        step: 4,
        text: "Former des petits puits dans la sauce et y casser délicatement les oeufs. Couvrir et laisser cuire 5-7 minutes jusqu'à ce que les blancs soient pris mais les jaunes encore coulants.",
      },
      {
        step: 5,
        text: "Parsemer de fromage de chèvre émietté et d'herbes fraîches avant de servir avec du pain chaud.",
      },
    ],
    tags: ['Petit-déjeuner', 'Végétarien', 'Épicé', 'Sans Gluten'],
  };

  const [moreRecipes, setMoreRecipes] = useState([]);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (recipe) {
      // Mock more recipes from same author
      const mockMore = [
        {
          _id: '201',
          title: 'Salade de Grenades',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2940',
          prepTime: 15,
          cookTime: 0,
          difficulty: 'Facile',
          category: 'Entrée',
          cacherout: 'Pareve',
          region: 'Galilée',
        },
        {
          _id: '202',
          title: 'Aubergines Brûlées',
          image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee397?q=80&w=2835',
          prepTime: 20,
          cookTime: 40,
          difficulty: 'Moyen',
          category: 'Plat Principal',
          cacherout: 'Pareve',
          region: 'Tel Aviv',
        },
        {
          _id: '203',
          title: 'Riz aux Lentilles',
          image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=2787',
          prepTime: 10,
          cookTime: 30,
          difficulty: 'Facile',
          category: 'Accompagnement',
          cacherout: 'Pareve',
          region: 'Jérusalem',
        },
      ];
      setMoreRecipes(mockMore.filter((r) => r._id !== recipe._id));
    }
  }, [recipe]);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      let apiSuccess = false;
      try {
        const response = await recipeAPI.getById(id);
        if (response.data) {
          setRecipe(response.data);
          setServings(response.data.servings || 4);
          apiSuccess = true;
        }
      } catch (e) {
        // API error fetching recipe, using mock
      }

      if (apiSuccess) {
        setLoading(false);
        return;
      }

      const mockRecipes = {
        1: {
          _id: '1',
          title: 'Challah du Shabbat',
          description:
            "Le pain tressé traditionnel du Shabbat, moelleux à l'intérieur et doré à l'extérieur. Une recette familiale transmise de génération en génération.",
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2942',
          prepTime: 45,
          cookTime: 35,
          servings: 2, // 2 pains
          difficulty: 'Moyen',
          author: {
            name: 'Chef Miriam Cohen',
            image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
          },
          ingredients: [
            { item: 'Farine T55', amount: '1', unit: 'kg' },
            { item: 'Levure boulangère sèche', amount: '2', unit: 'c.à.s' },
            { item: 'Sucre', amount: '100', unit: 'g' },
            { item: 'Eau tiède', amount: '350', unit: 'ml' },
            { item: 'Oeufs', amount: '2', unit: 'pièces' },
            { item: 'Huile végétale', amount: '120', unit: 'ml' },
            { item: 'Sel', amount: '1', unit: 'c.à.s' },
            { item: 'Graines de sésame', amount: '2', unit: 'c.à.s' },
          ],
          instructions: [
            {
              step: 1,
              text: "Dans un grand bol, mélanger la levure, une cuillère de sucre et l'eau tiède. Laisser reposer 10 minutes jusqu'à ce que le mélange mousse.",
            },
            {
              step: 2,
              text: "Ajouter le reste du sucre, le sel, l'huile et les œufs (garder un jaune pour la dorure). Mélanger bien.",
            },
            {
              step: 3,
              text: "Incorporer la farine petit à petit en pétrissant jusqu'à obtenir une pâte souple et non collante (environ 10 minutes).",
            },
            {
              step: 4,
              text: "Couvrir d'un linge humide et laisser lever 1h30 à 2h dans un endroit chaud jusqu'à ce que la pâte double de volume.",
            },
            {
              step: 5,
              text: 'Dégazer la pâte, la diviser en 6 boudins et tresser deux pains (3 brins chacun).',
            },
            {
              step: 6,
              text: "Laisser lever encore 45 minutes. Badigeonner de jaune d'œuf et saupoudrer de sésame. Enfourner à 180°C pendant 30-35 minutes.",
            },
          ],
          tags: ['Boulangerie', 'Shabbat', 'Traditionnel', 'Parve'],
        },
        2: {
          _id: '2',
          title: 'Couscous Israélien',
          description:
            'Aussi appelé Ptitim, ce couscous perlé est sauté avec des oignons caramélisés, des légumes frais et des herbes pour un accompagnement savoureux.',
          image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=2864',
          prepTime: 10,
          cookTime: 15,
          servings: 4,
          difficulty: 'Facile',
          author: {
            name: 'Chef Ronen',
            image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2777',
          },
          ingredients: [
            { item: 'Couscous israélien (Ptitim)', amount: '250', unit: 'g' },
            { item: 'Oignon', amount: '1', unit: 'pièce' },
            { item: 'Bouillon de légumes', amount: '500', unit: 'ml' },
            { item: 'Courgette', amount: '1', unit: 'pièce' },
            { item: 'Carotte', amount: '1', unit: 'pièce' },
            { item: 'Persil frais', amount: '1', unit: 'botte' },
            { item: "Huile d'olive", amount: '2', unit: 'c.à.s' },
          ],
          instructions: [
            {
              step: 1,
              text: "Faire revenir l'oignon émincé dans l'huile d'olive jusqu'à ce qu'il soit doré.",
            },
            {
              step: 2,
              text: 'Ajouter le couscous israélien et faire griller 2-3 minutes en remuant constamment.',
            },
            { step: 3, text: 'Ajouter les légumes coupés en petits dés et le bouillon chaud.' },
            {
              step: 4,
              text: "Couvrir et laisser mijoter à feu doux pendant 8-10 minutes jusqu'à absorption du liquide.",
            },
            {
              step: 5,
              text: 'Éteindre le feu, ajouter le persil ciselé, mélanger et servir chaud.',
            },
          ],
          tags: ['Accompagnement', 'Rapide', 'Enfants', 'Végétalien'],
        },
        3: {
          _id: '3',
          title: 'Baklava Maison',
          description:
            "De fines couches de pâte phyllo croustillantes, garnies de noix et pistaches concassées, le tout arrosé d'un sirop parfumé à l'eau de rose.",
          image: 'https://images.unsplash.com/photo-1598110750624-207050c4f28c?q=80&w=2940',
          prepTime: 40,
          cookTime: 45,
          servings: 12,
          difficulty: 'Difficile',
          author: {
            name: 'Chef Sarah Levi',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2776',
          },
          ingredients: [
            { item: 'Pâte phyllo', amount: '1', unit: 'paquet' },
            { item: 'Beurre clarifié', amount: '200', unit: 'g' },
            { item: 'Pistaches', amount: '200', unit: 'g' },
            { item: 'Noix', amount: '200', unit: 'g' },
            { item: 'Cannelle', amount: '1', unit: 'c.à.c' },
            { item: 'Sucre', amount: '300', unit: 'g' },
            { item: 'Eau', amount: '300', unit: 'ml' },
            { item: 'Eau de rose', amount: '1', unit: 'c.à.s' },
          ],
          instructions: [
            {
              step: 1,
              text: "Préparer le sirop : porter l'eau et le sucre à ébullition. Laisser mijoter 10 min. Ajouter l'eau de rose et laisser refroidir.",
            },
            { step: 2, text: 'Mixer grossièrement les pistaches et les noix avec la cannelle.' },
            {
              step: 3,
              text: 'Beurrer un plat rectangulaire. Superposer 8 feuilles de phyllo en beurrant chacune.',
            },
            {
              step: 4,
              text: 'Étaler le mélange de noix. Recouvrir de 8 autres feuilles beurrées.',
            },
            {
              step: 5,
              text: "Couper en losanges avant la cuisson. Enfourner à 170°C pour 45 min jusqu'à ce que ce soit doré.",
            },
            {
              step: 6,
              text: 'Verser le sirop froid sur le baklava chaud dès la sortie du four. Laisser reposer 4h avant de servir.',
            },
          ],
          tags: ['Dessert', 'Festif', 'Sucré', 'Moyen-Orient'],
        },
        101: {
          _id: '101',
          title: 'Hummus Royal aux Pignons',
          description:
            "La recette authentique du hummus crémeux, servi chaud avec des pignons grillés et de l'huile d'olive extra vierge. Un classique incontournable.",
          image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=2787',
          prepTime: 30,
          cookTime: 60,
          servings: 6,
          difficulty: 'Moyen',
          author: {
            name: 'Chef Yotam Ottolenghi',
            image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
          },
          ingredients: [
            { item: 'Pois chiches secs', amount: '250', unit: 'g' },
            { item: 'Tahini', amount: '200', unit: 'g' },
            { item: 'Jus de citron', amount: '4', unit: 'c.à.s' },
            { item: 'Ail', amount: '2', unit: 'gousses' },
            { item: 'Bicarbonate de soude', amount: '1', unit: 'c.à.c' },
            { item: 'Eau glacée', amount: '100', unit: 'ml' },
            { item: 'Pignons de pin', amount: '50', unit: 'g' },
            { item: "Huile d'olive", amount: '4', unit: 'c.à.s' },
          ],
          instructions: [
            { step: 1, text: "Faire tremper les pois chiches la veille dans beaucoup d'eau." },
            {
              step: 2,
              text: "Égoutter, mélanger avec le bicarbonate et cuire à feu vif 3 min. Ajouter l'eau et cuire 30-40 min jusqu'à tendreté.",
            },
            { step: 3, text: 'Mixer les pois chiches chauds en purée lisse.' },
            {
              step: 4,
              text: "Ajouter le tahini, le citron, l'ail et le sel. Mixer en ajoutant l'eau glacée petit à petit pour émulsionner.",
            },
            { step: 5, text: "Servir tiède, arrosé d'huile d'olive et garni de pignons grillés." },
          ],
          tags: ['Classique', 'Végétarien', 'Sans Gluten', 'Entrée'],
        },
        102: {
          _id: '102',
          title: 'Shakshuka Verte',
          description:
            'Une variante fraîche et herbacée de la shakshuka classique, avec des épinards, des blettes, de la crème et du fromage feta.',
          image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?q=80&w=2787',
          prepTime: 15,
          cookTime: 20,
          servings: 4,
          difficulty: 'Facile',
          author: {
            name: 'Chef Yotam Ottolenghi',
            image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
          },
          ingredients: [
            { item: 'Épinards frais', amount: '300', unit: 'g' },
            { item: 'Blettes', amount: '200', unit: 'g' },
            { item: 'Oignons nouveaux', amount: '4', unit: 'pièces' },
            { item: 'Ail', amount: '2', unit: 'gousses' },
            { item: 'Oeufs', amount: '4', unit: 'pièces' },
            { item: 'Feta', amount: '100', unit: 'g' },
            { item: 'Crème fraîche', amount: '2', unit: 'c.à.s' },
          ],
          instructions: [
            {
              step: 1,
              text: "Faire revenir les oignons et l'ail. Ajouter les blettes et cuire 5 min.",
            },
            { step: 2, text: 'Ajouter les épinards et laisser tomber. Incorporer la crème.' },
            { step: 3, text: 'Former des trous et casser les oeufs dedans.' },
            {
              step: 4,
              text: "Parsemer de feta et cuire à couvert jusqu'à ce que les blancs soient pris.",
            },
          ],
          tags: ['Petit-déjeuner', 'Végétarien', 'Healthy'],
        },
        103: {
          _id: '103',
          title: 'Babka au Chocolat',
          description:
            "Une brioche torsadée moelleuse garnie d'une riche pâte à tartiner au chocolat noir et noisettes. Le summum de la gourmandise.",
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2942',
          prepTime: 45,
          cookTime: 40,
          servings: 8,
          difficulty: 'Difficile',
          author: {
            name: 'Chef Yotam Ottolenghi',
            image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
          },
          ingredients: [
            { item: 'Farine', amount: '500', unit: 'g' },
            { item: 'Sucre', amount: '100', unit: 'g' },
            { item: 'Beurre', amount: '150', unit: 'g' },
            { item: 'Chocolat noir', amount: '200', unit: 'g' },
            { item: 'Noisettes', amount: '100', unit: 'g' },
          ],
          instructions: [
            { step: 1, text: 'Préparer la pâte à brioche et laisser lever 2h.' },
            {
              step: 2,
              text: 'Étaler la pâte, tartiner de chocolat fondu et parsemer de noisettes.',
            },
            { step: 3, text: 'Rouler, couper en deux dans la longueur et torsader.' },
            { step: 4, text: 'Laisser lever 1h puis cuire 40 min à 180°C.' },
          ],
          tags: ['Dessert', 'Chocolat', 'Boulangerie'],
        },
        201: {
          _id: '201',
          title: 'Salade de Grenades',
          description:
            "Une salade fraîche et croquante, parfaite pour l'été, mêlant la douceur de la grenade à l'amertume des herbes.",
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2940',
          prepTime: 15,
          cookTime: 0,
          servings: 4,
          difficulty: 'Facile',
          author: {
            name: 'Chef Yotam Ottolenghi',
            image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
          },
          ingredients: [
            { item: 'Grenade', amount: '1', unit: 'pièce' },
            { item: 'Concombre', amount: '2', unit: 'pièces' },
            { item: 'Tomates cerises', amount: '200', unit: 'g' },
            { item: 'Menthe fraîche', amount: '1', unit: 'botte' },
          ],
          instructions: [
            { step: 1, text: 'Égrainer la grenade.' },
            { step: 2, text: 'Couper les légumes en dés.' },
            { step: 3, text: "Mélanger le tout avec de l'huile d'olive et du jus de citron." },
          ],
          tags: ['Salade', 'Frais', 'Végétarien'],
        },
        202: {
          _id: '202',
          title: 'Aubergines Brûlées',
          description:
            "Aubergines entières brûlées à la flamme, servies avec du tahini, de l'ail et du citron.",
          image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee397?q=80&w=2835',
          prepTime: 20,
          cookTime: 40,
          servings: 4,
          difficulty: 'Moyen',
          author: {
            name: 'Chef Yotam Ottolenghi',
            image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
          },
          ingredients: [
            { item: 'Aubergines', amount: '2', unit: 'grandes' },
            { item: 'Tahini', amount: '100', unit: 'g' },
            { item: 'Ail', amount: '2', unit: 'gousses' },
          ],
          instructions: [
            { step: 1, text: 'Brûler les aubergines sur le feu.' },
            { step: 2, text: 'Récupérer la chair et mélanger avec les autres ingrédients.' },
          ],
          tags: ['Entrée', 'Végétarien', 'Sans Gluten'],
        },
        203: {
          _id: '203',
          title: 'Riz aux Lentilles',
          description:
            "Un plat réconfortant de riz et lentilles (Mujadara), garni d'oignons frits croustillants.",
          image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=2787',
          prepTime: 10,
          cookTime: 30,
          servings: 4,
          difficulty: 'Facile',
          author: {
            name: 'Chef Yotam Ottolenghi',
            image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2800',
          },
          ingredients: [
            { item: 'Riz basmati', amount: '200', unit: 'g' },
            { item: 'Lentilles vertes', amount: '200', unit: 'g' },
            { item: 'Oignons', amount: '3', unit: 'grands' },
          ],
          instructions: [
            { step: 1, text: 'Cuire les lentilles.' },
            { step: 2, text: 'Cuire le riz.' },
            { step: 3, text: 'Faire frire les oignons.' },
            { step: 4, text: 'Mélanger le tout.' },
          ],
          tags: ['Plat Principal', 'Végétalien', 'Économique'],
        },
      };

      if (mockRecipes[id]) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setRecipe(mockRecipes[id]);
        setServings(mockRecipes[id].servings);
        return;
      }

      // If no mock ID matches, or assuming it's an API call
      // const response = await recipesAPI.getById(id);
      // setRecipe(response.data);
      // Fallback to first mock recipe for demo
      setRecipe(mockRecipes['1']);
      setServings(mockRecipes['1'].servings);
    } catch (error) {
      setToast({ show: true, message: t('recipeDetail.loadError'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const adjustServings = (newServings) => {
    if (newServings < 1) return;
    setServings(newServings);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!recipe) return <div>{t('recipeDetail.notFound')}</div>;

  const scalingFactor = servings / recipe.servings;

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900">
      {/* Back Button */}
      <div className="absolute top-24 left-4 z-20 md:left-8">
        <Link
          to="/explore"
          className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg text-gray-700 dark:text-gray-200 hover:bg-gold-500 hover:text-white transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('common.back')}
        </Link>
      </div>

      {/* Hero Banner for Dish */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={getImageUrl(recipe.image)}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-gold-500 text-white text-sm font-bold rounded-full shadow-lg"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              {recipe.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-gold-400" />
                <span className="font-medium">{recipe.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-gold-400" />
                <span>
                  {recipe.prepTime + recipe.cookTime} {t('common.min')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-gold-400" />
                <span>
                  {recipe.servings} {t('details.servings')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Ingredients & Tools */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                {t('details.ingredients')}
              </h3>
              <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => adjustServings(servings - 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm transition-all"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold">{servings}</span>
                <button
                  onClick={() => adjustServings(servings + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm transition-all"
                >
                  +
                </button>
              </div>
            </div>

            <ul className="space-y-4">
              {recipe.ingredients.map((ing, index) => (
                <li
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                    checkedIngredients[index]
                      ? 'bg-green-50 dark:bg-green-900/20 opacity-70'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => toggleIngredient(index)}
                >
                  <div
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      checkedIngredients[index]
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {checkedIngredients[index] && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`font-bold ${checkedIngredients[index] ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}
                    >
                      {ing.amount
                        ? (parseFloat(ing.amount) * scalingFactor).toFixed(
                            ing.amount.includes('.') ? 1 : 0
                          )
                        : ''}{' '}
                      {ing.unit}
                    </span>
                    <span
                      className={`block text-sm ${checkedIngredients[index] ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                      {ing.item}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex gap-2">
              <button className="flex-1 py-3 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors">
                <Printer className="w-4 h-4" />
                {t('common.print')}
              </button>
              <button className="flex-1 py-3 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors">
                <Share2 className="w-4 h-4" />
                {t('common.share')}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Instructions */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700 mb-10">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">
                {t('details.instructions')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed italic border-l-4 border-gold-500 pl-6">
                "{recipe.description}"
              </p>

              <div className="space-y-8">
                {recipe.instructions.map((step, index) => (
                  <div
                    key={index}
                    className={`relative pl-8 md:pl-12 transition-all duration-500 ${
                      activeStep === index ? 'opacity-100 scale-100' : 'opacity-80'
                    }`}
                    onMouseEnter={() => setActiveStep(index)}
                  >
                    {/* Step Number Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
                    <div
                      className={`absolute left-[-12px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        activeStep === index
                          ? 'bg-gold-500 text-white scale-125 shadow-lg'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      {step.step}
                    </div>

                    <div
                      className={`p-6 rounded-2xl transition-all duration-300 ${
                        activeStep === index
                          ? 'bg-[#fcfaf7] dark:bg-gray-700/50 shadow-md translate-x-2'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {t('details.step')} {step.step}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chef's Note or Tips could go here */}
            {recipe.chefNote && (
              <div className="bg-olive-800 rounded-3xl p-8 md:p-12 text-white shadow-xl overflow-hidden relative">
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold-500">
                    <img
                      src={getImageUrl(recipe.author.image)}
                      alt={recipe.author.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          'https://ui-avatars.com/api/?name=' + (recipe.author.name || 'Chef');
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold mb-2">
                      {t('details.chefsNote')}
                    </h3>
                    <p className="text-olive-100 italic">"{recipe.chefNote}"</p>
                  </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 text-white/5">
                  <ChefHat className="w-64 h-64" />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* More from Author Section */}
      {moreRecipes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8"
          >
            {t('details.moreFromAuthor', { author: recipe.author.name })}
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {moreRecipes.map((moreRecipe, index) => (
              <motion.div
                key={moreRecipe._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(moreRecipe.image)}
                      alt={moreRecipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940';
                      }}
                    />
                    <Link
                      to="/recipes"
                      className="absolute top-28 left-4 md:left-8 z-20 inline-flex items-center text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow-sm text-olive-700">
                      {moreRecipe.difficulty}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {moreRecipe.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {moreRecipe.prepTime + moreRecipe.cookTime} {t('common.min')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default RecipeDetail;
