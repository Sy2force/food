# Flavors of Israel - Frontend 🇮🇱

Frontend moderne pour la plateforme gastronomique israélienne.

## 🚀 Technologies

- **React 18** - Framework UI
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling avec thème personnalisé
- **Framer Motion** - Animations fluides
- **Swiper.js** - Carrousels
- **React Hook Form** - Gestion des formulaires
- **Zustand** - State management
- **Axios** - Requêtes HTTP
- **Lucide React** - Icônes

## 🎨 Design System

### Couleurs
- **Or** (`gold`) - Accents et CTA
- **Noir** - Texte principal
- **Crème** (`cream`) - Backgrounds doux
- **Olive** (`olive`) - Accents secondaires

### Typographie
- **Inter** - Police sans-serif principale
- **Playfair Display** - Police display pour les titres

## 📁 Structure

```
src/
├── components/
│   ├── UI/              # Composants réutilisables
│   │   ├── DishCard.jsx
│   │   ├── RestaurantCard.jsx
│   │   ├── RecipeCard.jsx
│   │   ├── RecipeBookCard.jsx
│   │   ├── ExplorePostCard.jsx
│   │   ├── Filters.jsx
│   │   ├── SearchBar.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── DashboardMenu.jsx
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── HeroSection.jsx
│   │   └── Carousel.jsx
│   ├── Forms/           # Composants de formulaire
│   │   ├── Input.jsx
│   │   ├── Textarea.jsx
│   │   └── FileUpload.jsx
│   ├── Layout/          # Layout components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   └── Auth/            # Authentification
│       └── ProtectedRoute.jsx
├── pages/               # Pages de l'application
│   ├── Home.jsx
│   ├── Dishes.jsx
│   ├── DishDetail.jsx
│   ├── Restaurants.jsx
│   ├── RestaurantDetail.jsx
│   ├── RecipeBooks.jsx
│   ├── RecipeBookDetail.jsx
│   ├── RecipeDetail.jsx
│   ├── Explore.jsx
│   ├── ExploreCreate.jsx
│   ├── ExploreDetail.jsx
│   ├── Favorites.jsx
│   ├── Profile.jsx
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Dashboard/
│   │   └── Dashboard.jsx
│   └── Admin/
│       └── AdminPanel.jsx
├── services/            # Services API
│   └── api.js
├── store/               # State management
│   └── authStore.js
└── utils/               # Utilitaires
    ├── constants.js
    └── helpers.js
```

## 🔧 Installation

```bash
npm install
```

## 🏃 Développement

```bash
npm run dev
```

Le frontend démarre sur `http://localhost:3000`

## 🏗️ Build

```bash
npm run build
```

## ✨ Fonctionnalités

### Pages Publiques
- **Landing** (`/`) - Page d'accueil immersive avec hero et sections scroll
- **Plats** (`/dishes`) - Catalogue avec filtres (saison, région, cacherout)
- **Restaurants** (`/restaurants`) - Annuaire avec recherche et filtres
- **Livres de Recettes** (`/recipe-books`) - Collection de livres thématiques
- **Recettes** (`/recipes/:id`) - Détails des recettes avec ingrédients et étapes
- **Explore** (`/explore`) - Galerie communautaire de posts

### Pages Authentifiées
- **Profil** (`/profile`) - Gestion du profil utilisateur
- **Favoris** (`/favorites`) - Liste des favoris (restaurants, plats, recettes)
- **Dashboard** (`/dashboard`) - Espace restaurateur
- **Admin** (`/admin`) - Panel d'administration

### Composants UI
- **Cards** - DishCard, RestaurantCard, RecipeCard, RecipeBookCard, ExplorePostCard
- **Filters** - Système de filtres dynamiques
- **SearchBar** - Barre de recherche avec suggestions
- **Modal** - Modales animées
- **Carousel** - Carrousels Swiper
- **HeroSection** - Sections hero immersives
- **Forms** - Input, Textarea, FileUpload avec validation

### Animations
- **Framer Motion** - Transitions de page, hover effects, scroll animations
- **Tailwind Animations** - fade-in, slide-up, scale-in

### Features
- 🌓 **Dark Mode** - Support du mode sombre
- 📱 **Responsive** - Mobile-first design
- 🔐 **Protected Routes** - Routes protégées par authentification
- 🎨 **Animations** - Animations fluides et modernes
- 🔍 **Search & Filters** - Recherche et filtres avancés
- ❤️ **Favorites** - Système de favoris
- 📸 **Image Upload** - Upload d'images avec preview
- 🎯 **Form Validation** - Validation en temps réel

## 🔌 API Integration

Le frontend communique avec le backend via Axios. Configuration dans `src/services/api.js`.

**Base URL:** `http://localhost:3000/api`

Les tokens JWT sont automatiquement ajoutés aux requêtes authentifiées.

## 🎨 Personnalisation

### Tailwind Config
Modifiez `tailwind.config.js` pour personnaliser les couleurs, polices et animations.

### Variables d'environnement
Créez un fichier `.env` :
```
VITE_API_URL=http://localhost:3000/api
```

## 📝 Licence

MIT

---

Créé avec ❤️ pour la gastronomie israélienne
