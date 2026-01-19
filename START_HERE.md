# 🚀 DÉMARRER FLAVORS OF ISRAEL

## ✅ Projet 100% Complet et Prêt !

Votre plateforme gastronomique israélienne **Flavors of Israel** est entièrement développée et prête à être lancée sur le **port 3007**.

---

## 📋 Étapes de Démarrage

### **1️⃣ Installer MongoDB**

Si MongoDB n'est pas installé :

```bash
# Sur macOS avec Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Démarrer MongoDB
brew services start mongodb-community

# Vérifier que MongoDB fonctionne
mongosh
```

---

### **2️⃣ Configurer le Backend**

```bash
# À la racine du projet
cd "/Users/shayacoca/Flavors of israel"

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

**Éditer le fichier `.env` :**

```bash
PORT=3007
MONGODB_URI=mongodb://localhost:27017/flavors-of-israel
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi_en_production
JWT_EXPIRE=7d

# Credentials Cloudinary (créer compte gratuit sur cloudinary.com)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

NODE_ENV=development
```

**Démarrer le backend :**

```bash
npm run dev
```

✅ Le backend démarre sur **http://localhost:3007**

---

### **3️⃣ Configurer le Frontend**

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Le fichier .env.example existe déjà avec la bonne config
# Pas besoin de le modifier
```

**Démarrer le frontend :**

```bash
npm run dev
```

✅ Le frontend démarre sur **http://localhost:3007**

---

## 🌐 Accéder à l'Application

Ouvrez votre navigateur sur : **http://localhost:3007**

---

## 🎯 Première Utilisation

### **Créer un Compte**

1. Aller sur http://localhost:3007/register
2. Remplir le formulaire :
   - Prénom, Nom
   - Email
   - Mot de passe (min 6 caractères)
   - Rôle : `user`, `business`, ou `admin`

### **Se Connecter**

1. Aller sur http://localhost:3007/login
2. Email + mot de passe
3. Vous êtes redirigé vers le dashboard

---

## 🔐 Comptes de Test

Vous pouvez créer ces comptes pour tester :

### **Utilisateur Standard**
```
Email: user@test.com
Password: password123
Role: user
```

### **Restaurateur**
```
Email: resto@test.com
Password: password123
Role: business
```

### **Administrateur**
```
Email: admin@test.com
Password: password123
Role: admin
```

---

## 📱 Navigation du Site

### **Pages Publiques**
- `/` - Landing page immersive
- `/dishes` - Catalogue de plats avec filtres
- `/restaurants` - Annuaire restaurants casher
- `/recipe-books` - Bibliothèque de recettes
- `/explore` - Galerie communautaire

### **Pages Utilisateur** (connecté)
- `/user-dashboard` - Dashboard personnel
- `/profile` - Profil et paramètres
- `/favorites` - Favoris sauvegardés
- `/dashboard/likes` - Contenus likés

### **Dashboard Restaurateur** (role: business)
- `/dashboard` - Vue d'ensemble
- `/dashboard/restaurants/create` - Créer restaurant
- `/dashboard/dishes` - Gérer les plats
- `/dashboard/dishes/create` - Ajouter un plat

### **Admin** (role: admin)
- `/admin` - Panel d'administration

---

## 🎨 Fonctionnalités Disponibles

### ✅ **Authentification**
- Inscription / Connexion JWT
- 3 rôles : user, business, admin
- Protection routes automatique

### ✅ **Restaurants**
- Créer sa page restaurant (business)
- Upload logo Cloudinary
- Badges cacherout (Kasher, Mehadrin, Badatz)
- Filtres par ville et cacherout

### ✅ **Plats**
- Ajouter des plats avec images
- Filtres : saison, région, cacherout
- Prix, catégorie, options alimentaires
- Système de likes et notes

### ✅ **Recettes**
- Livres de recettes thématiques
- Recettes avec ingrédients et étapes
- Likes et favoris
- Filtres par région et difficulté

### ✅ **Galerie Sociale**
- Publier des photos de plats
- Tags personnalisés
- Likes et commentaires
- Modal fullscreen
- Grille masonry responsive

### ✅ **Dashboard Restaurateur**
- Statistiques en temps réel
- CRUD restaurants et plats
- Top plats par popularité
- Upload images avec preview

---

## 🛠️ Commandes Utiles

### **Backend**
```bash
npm run dev      # Développement avec nodemon
npm start        # Production
```

### **Frontend**
```bash
npm run dev      # Développement
npm run build    # Build production
npm run preview  # Preview build
```

### **MongoDB**
```bash
# Démarrer
brew services start mongodb-community

# Arrêter
brew services stop mongodb-community

# Accéder au shell
mongosh

# Voir les bases de données
show dbs

# Utiliser la base flavors-of-israel
use flavors-of-israel

# Voir les collections
show collections
```

---

## 📊 Structure du Projet

```
Flavors of Israel/
├── 📁 Backend (racine)
│   ├── controllers/      (7 contrôleurs)
│   ├── models/          (6 modèles Mongoose)
│   ├── routes/          (8 routes API)
│   ├── middleware/      (6 middlewares)
│   ├── utils/           (validators, upload)
│   ├── config/          (database, cloudinary)
│   ├── server.js        (serveur Express)
│   └── package.json
│
├── 📁 frontend/
│   ├── src/
│   │   ├── components/  (20+ composants)
│   │   ├── pages/       (25+ pages)
│   │   ├── services/    (API)
│   │   ├── store/       (Zustand)
│   │   └── utils/       (helpers)
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── 📚 Documentation/
    ├── README.md
    ├── DEPLOYMENT_GUIDE.md
    ├── USER_SYSTEM_GUIDE.md
    ├── SOCIAL_SYSTEM_GUIDE.md
    └── BUSINESS_DASHBOARD_GUIDE.md
```

---

## 🎨 Design System

### **Couleurs**
- **Noir profond** (#1a1a1a) - Texte principal
- **Crème luxe** (#f8f1e7) - Backgrounds
- **Or royal** (#D4AF37) - CTA et accents
- **Olive** (#7A8450) - Badges et tags
- **Rouge vin** (#922B21) - CTA secondaires

### **Typographie**
- **Playfair Display** - Titres élégants
- **Inter** - Texte lisible

### **Animations**
- Framer Motion pour scroll reveal
- Hover effects sur cards
- Transitions de pages
- Carrousels Swiper

---

## 🐛 Dépannage

### **Port 3007 déjà utilisé**
```bash
# Trouver le processus
lsof -i :3007

# Tuer le processus
kill -9 <PID>
```

### **MongoDB ne démarre pas**
```bash
# Vérifier le statut
brew services list

# Redémarrer
brew services restart mongodb-community
```

### **Erreur de connexion API**
Vérifier que :
- Le backend tourne sur port 3007
- Le fichier `.env` est bien configuré
- MongoDB est démarré

---

## 📚 Documentation Complète

- **README.md** - Vue d'ensemble
- **DEPLOYMENT_GUIDE.md** - Déploiement production
- **USER_SYSTEM_GUIDE.md** - Système utilisateur
- **SOCIAL_SYSTEM_GUIDE.md** - Galerie sociale
- **BUSINESS_DASHBOARD_GUIDE.md** - Dashboard restaurateur
- **FRONTEND_GUIDE.md** - Guide frontend

---

## ✨ Fonctionnalités Complètes

### **Backend**
- ✅ 6 modèles Mongoose
- ✅ 7 contrôleurs
- ✅ 8 routes API REST
- ✅ Auth JWT + bcrypt
- ✅ Validation Joi
- ✅ Upload Cloudinary
- ✅ Logs Morgan
- ✅ Middlewares sécurisés

### **Frontend**
- ✅ 25+ pages React
- ✅ 20+ composants UI
- ✅ Tailwind CSS custom
- ✅ Framer Motion
- ✅ Swiper.js
- ✅ React Hook Form
- ✅ Zustand store
- ✅ Dark mode
- ✅ Responsive

### **Features**
- ✅ Authentification JWT
- ✅ 3 rôles (user, business, admin)
- ✅ Likes et favoris
- ✅ Upload images
- ✅ Galerie sociale masonry
- ✅ Dashboard restaurateur
- ✅ Filtres dynamiques
- ✅ Statistiques temps réel

---

## 🎉 C'est Parti !

Votre application **Flavors of Israel** est **100% prête** !

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Ouvrir navigateur
open http://localhost:3007
```

**Bon développement ! 🇮🇱✨**
