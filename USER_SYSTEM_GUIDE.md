# 🔐 Guide Système Utilisateur - Flavors of Israel

## ✅ Système Utilisateur Complet Implémenté

Le système utilisateur est maintenant **100% fonctionnel** avec authentification JWT, gestion des rôles, likes, favoris, et upload d'avatar.

---

## 🎯 Fonctionnalités Implémentées

### 🔐 Authentification JWT
- ✅ **Register** - Inscription avec validation Joi
- ✅ **Login** - Connexion avec génération de token JWT
- ✅ **Token Management** - Stockage sécurisé et refresh automatique
- ✅ **Auto-logout** - Redirection automatique sur 401

### 👤 Gestion des Rôles
- ✅ **user** - Utilisateur standard (accès lecture + likes/favoris)
- ✅ **business** - Propriétaire de restaurant (accès création restaurants/plats)
- ✅ **admin** - Administrateur (accès complet)

### 💾 Modèle User Amélioré
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashé avec bcrypt),
  phone: String,
  pseudo: String (3-30 caractères),
  avatar: String (URL Cloudinary),
  avatarPublicId: String (pour suppression),
  role: Enum ['user', 'business', 'admin'],
  
  favorites: {
    restaurants: [ObjectId],
    dishes: [ObjectId],
    recipes: [ObjectId],
    recipeBooks: [ObjectId]
  },
  
  likes: {
    dishes: [ObjectId],
    recipes: [ObjectId],
    recipeBooks: [ObjectId],
    posts: [ObjectId]
  },
  
  isActive: Boolean,
  timestamps: true
}
```

---

## 🔌 API Backend

### Routes Utilisateur (`/api/users`)

#### Authentification
```javascript
POST /register
Body: { firstName, lastName, email, password, phone?, role? }
Response: { user, token }

POST /login
Body: { email, password }
Response: { user, token }
```

#### Profil
```javascript
GET /profile (auth)
Response: { user avec favorites et likes populés }

PUT /profile (auth)
Body: { firstName?, lastName?, phone?, pseudo? }
Response: { message, user }
```

#### Avatar
```javascript
POST /avatar (auth)
Body: FormData avec 'avatar' (image)
Response: { message, avatar: URL }

DELETE /avatar (auth)
Response: { message }
```

#### Dashboard Stats
```javascript
GET /dashboard/stats (auth)
Response: {
  favoritesCount: { restaurants, dishes, recipes, recipeBooks, total },
  likesCount: { dishes, recipes, recipeBooks, posts, total },
  favorites: { ... objets populés },
  likes: { ... objets populés }
}
```

#### Favoris
```javascript
POST /favorites (auth)
Body: { type: 'restaurants|dishes|recipes|recipeBooks', itemId }
Response: { message, favorites }

DELETE /favorites (auth)
Body: { type, itemId }
Response: { message, favorites }
```

#### Admin
```javascript
GET / (auth + admin)
Query: ?page=1&limit=10&role=user
Response: { users, totalPages, currentPage, total }

GET /:id (auth)
Response: { user }

DELETE /:id (auth + admin)
Response: { message }
```

---

### Routes Likes (`/api/like`)

#### Like Générique
```javascript
POST /:type/:id (auth)
Params: type = 'dishes|recipes|recipeBooks|posts', id = ObjectId
Response: { message, liked: boolean, likesCount: number }

// Exemple:
POST /api/like/dishes/507f1f77bcf86cd799439011
→ Toggle like sur le plat
```

#### Vérifier Like
```javascript
GET /check/:type/:id (auth)
Response: { liked: boolean }
```

#### Obtenir Tous les Likes
```javascript
GET /user (auth)
Response: { likes: { dishes, recipes, recipeBooks, posts } }
```

---

## 🎨 Frontend

### Pages Créées

#### 1. **UserDashboard** (`/user-dashboard`)
Dashboard personnel de l'utilisateur avec :
- Avatar avec upload/suppression
- Informations profil (nom, email, téléphone, pseudo, rôle)
- Statistiques (favoris, likes)
- Modification profil (modal)
- Accès rapide aux sections

**Fonctionnalités:**
- Upload d'avatar avec preview
- Suppression d'avatar
- Édition profil (prénom, nom, pseudo, téléphone)
- Affichage des stats en temps réel
- Cards cliquables vers favoris/likes

#### 2. **UserLikes** (`/dashboard/likes`)
Page dédiée aux likes avec :
- Onglets par type (Plats, Recettes, Livres, Posts)
- Affichage en grille des contenus likés
- Compteurs par catégorie
- Unlike direct depuis les cards

#### 3. **Favorites** (`/favorites`) - Améliorée
Page favoris complète avec :
- Onglets (Restaurants, Plats, Recettes, Livres)
- Affichage en grille
- Suppression de favoris
- Compteurs par catégorie
- État vide avec message

---

## 🔒 Sécurité

### Middlewares Backend

#### `auth.js`
```javascript
// Vérifie le token JWT
// Ajoute req.user et req.token
// Redirection 401 si invalide
```

#### `isAdmin.js`
```javascript
// Vérifie role === 'admin'
// 403 si non admin
```

#### `isBusiness.js`
```javascript
// Vérifie role === 'business' || 'admin'
// 403 si non business
```

#### `isOwnerOrAdmin.js`
```javascript
// Vérifie propriétaire OU admin
// Utilisé pour édition/suppression
```

### Protection Frontend

#### ProtectedRoute Component
```javascript
<ProtectedRoute>
  <UserDashboard />
</ProtectedRoute>

<ProtectedRoute requireBusiness>
  <Dashboard />
</ProtectedRoute>

<ProtectedRoute requireAdmin>
  <AdminPanel />
</ProtectedRoute>
```

### Validation

#### Backend (Joi)
- Email format
- Mot de passe min 6 caractères
- Téléphone 10 chiffres
- Pseudo 3-30 caractères
- Tous les champs requis validés

#### Frontend
- Validation temps réel
- Messages d'erreur clairs
- Désactivation boutons si invalide

---

## 🎯 Flux Utilisateur

### 1. Inscription
```
User → /register
→ Validation Joi
→ Hash password (bcrypt)
→ Création User
→ Génération JWT
→ Response { user, token }
→ Stockage localStorage
→ Redirection /user-dashboard
```

### 2. Connexion
```
User → /login
→ Validation email/password
→ Vérification bcrypt
→ Génération JWT
→ Response { user, token }
→ Stockage localStorage
→ Redirection /user-dashboard
```

### 3. Like d'un Plat
```
User clique ❤️ sur DishCard
→ POST /api/like/dishes/:id
→ Toggle dans user.likes.dishes
→ Toggle dans dish.likes
→ Update UI (liked: true/false)
→ Update likesCount
```

### 4. Ajout aux Favoris
```
User clique ⭐ sur RestaurantCard
→ POST /api/users/favorites
→ Body: { type: 'restaurants', itemId }
→ Push dans user.favorites.restaurants
→ Update UI
```

### 5. Upload Avatar
```
User → Modal Avatar
→ Sélection fichier
→ Preview local
→ POST /api/users/avatar (FormData)
→ Upload Cloudinary
→ Suppression ancien avatar si existe
→ Update user.avatar + avatarPublicId
→ Update UI
```

---

## 📊 Dashboard Stats

### Compteurs Disponibles
```javascript
{
  favoritesCount: {
    restaurants: 5,
    dishes: 12,
    recipes: 8,
    recipeBooks: 3,
    total: 28
  },
  likesCount: {
    dishes: 15,
    recipes: 20,
    recipeBooks: 5,
    posts: 10,
    total: 50
  }
}
```

---

## 🔄 Gestion d'État (Zustand)

### authStore
```javascript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  
  login: (user, token) => void,
  logout: () => void,
  updateUser: (userData) => void,
  checkAuth: () => void
}
```

### Utilisation
```javascript
const { user, isAuthenticated, updateUser } = useAuthStore();

// Après upload avatar
updateUser({ ...user, avatar: newAvatarUrl });
```

---

## 🎨 Composants UI

### DashboardMenu
Menu latéral avec navigation :
- Vue d'ensemble
- Mes Restaurants (business)
- Mes Plats (business)
- Mes Recettes
- Statistiques
- Paramètres

### Cards avec Like/Favorite
Tous les cards incluent :
- Bouton ❤️ pour like
- Bouton ⭐ pour favori
- Animation Framer Motion
- Update temps réel

---

## 🚀 Utilisation

### Backend
```bash
# Démarrer le serveur
npm run dev

# Tester l'API
POST http://localhost:3000/api/users/register
POST http://localhost:3000/api/users/login
GET http://localhost:3000/api/users/profile
  Headers: Authorization: Bearer <token>
```

### Frontend
```bash
cd frontend
npm run dev

# Accéder aux pages
http://localhost:3000/register
http://localhost:3000/login
http://localhost:3000/user-dashboard (auth)
http://localhost:3000/favorites (auth)
http://localhost:3000/dashboard/likes (auth)
```

---

## 📝 Exemples de Requêtes

### Register
```javascript
POST /api/users/register
{
  "firstName": "David",
  "lastName": "Cohen",
  "email": "david@example.com",
  "password": "password123",
  "phone": "0501234567",
  "pseudo": "davidc"
}
```

### Like un Plat
```javascript
POST /api/like/dishes/507f1f77bcf86cd799439011
Headers: { Authorization: "Bearer <token>" }

Response:
{
  "message": "Like ajouté",
  "liked": true,
  "likesCount": 15
}
```

### Upload Avatar
```javascript
POST /api/users/avatar
Headers: { 
  Authorization: "Bearer <token>",
  Content-Type: "multipart/form-data"
}
Body: FormData { avatar: File }

Response:
{
  "message": "Avatar mis à jour",
  "avatar": "https://res.cloudinary.com/..."
}
```

### Get Dashboard Stats
```javascript
GET /api/users/dashboard/stats
Headers: { Authorization: "Bearer <token>" }

Response:
{
  "favoritesCount": { ... },
  "likesCount": { ... },
  "favorites": { restaurants: [...], dishes: [...] },
  "likes": { dishes: [...], recipes: [...] }
}
```

---

## ✅ Checklist Complète

### Backend ✅
- [x] Modèle User avec likes et favoris
- [x] Authentification JWT (register/login)
- [x] Hash password avec bcrypt
- [x] Middleware auth
- [x] Middleware isAdmin
- [x] Middleware isBusiness
- [x] Middleware isOwnerOrAdmin
- [x] Upload avatar Cloudinary
- [x] Suppression avatar
- [x] Système de likes générique
- [x] Route /api/like/:type/:id
- [x] Dashboard stats
- [x] Validation Joi complète
- [x] Gestion erreurs propre
- [x] Logs 400+

### Frontend ✅
- [x] Page UserDashboard
- [x] Page UserLikes
- [x] Page Favorites améliorée
- [x] Upload avatar avec preview
- [x] Modal édition profil
- [x] Système de likes UI
- [x] Système de favoris UI
- [x] Protected routes
- [x] Auto-redirection 401
- [x] Animations Framer Motion
- [x] Responsive design
- [x] Dark mode support

---

## 🎉 Résultat

Système utilisateur **complet et production-ready** avec :
- ✅ Authentification JWT sécurisée
- ✅ 3 rôles (user, business, admin)
- ✅ Likes génériques (4 types)
- ✅ Favoris (4 types)
- ✅ Upload/suppression avatar
- ✅ Dashboard complet
- ✅ Statistiques temps réel
- ✅ Protection routes backend/frontend
- ✅ Validation complète
- ✅ Gestion erreurs
- ✅ UI moderne et responsive

**Le système est prêt à l'emploi !** 🚀
