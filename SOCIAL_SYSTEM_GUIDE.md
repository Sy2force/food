# 📸 Guide Système Social - Flavors of Israel

## ✅ Système Social de Publication Complet

Le système social est maintenant **100% fonctionnel** avec galerie Explore, upload de posts, likes, commentaires et modal fullscreen.

---

## 🎯 Fonctionnalités Implémentées

### 📸 Système de Posts
- ✅ **Upload d'images** - Cloudinary avec preview
- ✅ **Description** - Texte court (500 caractères max)
- ✅ **Tags** - Tags personnalisés + suggestions
- ✅ **Likes** - Système de likes avec compteur
- ✅ **Commentaires** - Système de commentaires
- ✅ **Auteur** - Lien vers profil utilisateur

### 🖼️ Galerie Explore
- ✅ **Layout Masonry** - Grille responsive en colonnes
- ✅ **Filtres dynamiques** - Par tags populaires
- ✅ **Recherche** - Par description ou tags
- ✅ **Modal fullscreen** - Affichage détaillé au clic
- ✅ **Animations** - Framer Motion sur hover et scroll

### 🎨 Interface
- ✅ **Responsive** - Mobile-first design
- ✅ **Dark mode** - Support complet
- ✅ **Animations** - Transitions fluides
- ✅ **UX optimale** - Interactions intuitives

---

## 💾 Modèle Post

### Structure MongoDB
```javascript
{
  description: String (1-500 caractères, requis),
  photo: String (URL Cloudinary),
  photoPublicId: String (pour suppression),
  tags: [String] (array de tags),
  author: ObjectId (ref User, requis),
  likes: [ObjectId] (ref User),
  comments: [{
    user: ObjectId (ref User),
    content: String (max 500),
    createdAt: Date
  }],
  isPublished: Boolean (default: true),
  timestamps: true
}
```

### Indexes
```javascript
postSchema.index({ author: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });
```

---

## 🔌 API Backend

### Routes Posts (`/api/posts`)

#### Création
```javascript
POST / (auth)
Body: FormData {
  photo: File (image),
  description: String,
  tags: [String]
}
Response: { message, post }
```

#### Liste
```javascript
GET /
Query: ?page=1&limit=10&tags=Shabbat,Vegan&author=userId
Response: {
  posts: [...],
  totalPages: number,
  currentPage: number,
  total: number
}
```

#### Détail
```javascript
GET /:id
Response: { post avec author, likes, comments populés }
```

#### Modification
```javascript
PUT /:id (auth + owner/admin)
Body: FormData { photo?, description?, tags? }
Response: { message, post }
```

#### Suppression
```javascript
DELETE /:id (auth + owner/admin)
Response: { message }
// Supprime aussi l'image Cloudinary
```

#### Like
```javascript
POST /:id/like (auth)
Response: { message, likes: number }
// Toggle like/unlike
```

#### Commentaires
```javascript
POST /:id/comments (auth)
Body: { content: String }
Response: { message, comments }

DELETE /:id/comments/:commentId (auth + owner/admin)
Response: { message }
```

#### Mes Posts
```javascript
GET /my-posts (auth)
Response: [posts]
```

---

## 🎨 Frontend

### Pages Créées

#### 1. **Explore** (`/explore`)
Galerie publique avec :
- **Layout Masonry** - Colonnes responsive (1-4 selon écran)
- **Filtres par tags** - 10 tags populaires suggérés
- **Recherche** - Temps réel sur description/tags
- **Cards interactives** - Hover effects avec infos
- **Modal fullscreen** - Clic sur image pour détails
- **Animations** - Framer Motion stagger

**Fonctionnalités:**
```javascript
- Affichage en colonnes CSS (masonry)
- Filtrage dynamique par tags
- Recherche instantanée
- Like direct depuis cards
- Modal avec image HD + détails
- Lazy loading images
```

#### 2. **PostCreate** (`/explore/create`)
Formulaire de création avec :
- **Upload image** - Drag & drop + preview
- **Description** - Textarea avec compteur (500 max)
- **Tags** - Suggestions + personnalisés
- **Validation** - Temps réel
- **Upload Cloudinary** - Avec progress

**Fonctionnalités:**
```javascript
- Preview image avant upload
- Suppression image
- Tags suggérés cliquables
- Tags personnalisés
- Validation taille (5MB max)
- Compteur caractères
- Conseils d'utilisation
```

#### 3. **ImageModal** (Composant)
Modal fullscreen avec :
- **Image HD** - Affichage optimal
- **Infos post** - Description, auteur, date
- **Tags** - Affichage complet
- **Likes** - Bouton like interactif
- **Commentaires** - Liste scrollable
- **Fermeture** - Clic backdrop ou bouton X

---

## 🎯 Flux Utilisateur

### 1. Publier un Post
```
User → /explore/create
→ Sélection image (drag & drop)
→ Preview image
→ Saisie description
→ Sélection tags (suggérés + custom)
→ Validation formulaire
→ Upload Cloudinary
→ Création Post MongoDB
→ Redirection /explore
```

### 2. Explorer la Galerie
```
User → /explore
→ Affichage masonry de tous les posts
→ Filtrage par tags (optionnel)
→ Recherche (optionnel)
→ Clic sur image
→ Modal fullscreen
→ Like/commentaire (si connecté)
```

### 3. Liker un Post
```
User clique ❤️
→ POST /api/like/posts/:id
→ Toggle dans user.likes.posts
→ Toggle dans post.likes
→ Update UI (liked: true/false)
→ Update likesCount
```

### 4. Commenter un Post
```
User → Modal post
→ Saisie commentaire
→ POST /api/posts/:id/comments
→ Ajout dans post.comments
→ Update UI avec nouveau commentaire
```

---

## 🎨 Layout Masonry

### CSS Columns
```css
.masonry-grid {
  columns: 1;           /* Mobile */
  @media (min-width: 768px) {
    columns: 2;         /* Tablet */
  }
  @media (min-width: 1024px) {
    columns: 3;         /* Desktop */
  }
  @media (min-width: 1280px) {
    columns: 4;         /* Large */
  }
  gap: 1rem;
  space-y: 1rem;
}

.masonry-item {
  break-inside: avoid;  /* Évite coupure */
}
```

### Avantages
- Pas de librairie externe
- Performance optimale
- Responsive natif
- Animations fluides

---

## 🏷️ Système de Tags

### Tags Populaires Suggérés
```javascript
[
  'Shabbat', 'Vegan', 'Grill', 'Kasher', 'Dessert',
  'Traditionnel', 'Moderne', 'Fêtes', 'Pâtisserie', 
  'Street Food', 'Petit-déjeuner', 'Déjeuner', 
  'Dîner', 'Apéritif', 'Boisson'
]
```

### Filtrage
```javascript
// Backend
if (tags) query.tags = { $in: tags.split(',') };

// Frontend
const filteredPosts = posts.filter(post =>
  selectedTags.every(tag => post.tags?.includes(tag))
);
```

---

## 🔒 Sécurité

### Protection Routes
```javascript
// Création post
POST /api/posts (auth required)

// Modification
PUT /api/posts/:id (auth + owner/admin)

// Suppression
DELETE /api/posts/:id (auth + owner/admin)

// Like
POST /api/posts/:id/like (auth required)
```

### Validation
```javascript
// Backend (Joi)
postSchema = Joi.object({
  description: Joi.string().min(1).max(500).required(),
  tags: Joi.array().items(Joi.string()).max(10),
  photo: Joi.any() // Multer validation
});

// Frontend
- Taille image max 5MB
- Description 1-500 caractères
- Tags max 10
```

### Upload Sécurisé
```javascript
// Multer config
const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    // Validation type
  }
});
```

---

## 🎭 Animations Framer Motion

### Cards Stagger
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
  <PostCard />
</motion.div>
```

### Hover Effects
```javascript
// Card hover
group-hover:scale-110
group-hover:opacity-100

// Overlay gradient
opacity-0 group-hover:opacity-100
transition-opacity duration-300
```

### Modal
```javascript
<AnimatePresence>
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
  >
    <ImageModal />
  </motion.div>
</AnimatePresence>
```

---

## 📊 Composants

### ImageModal
```javascript
Props: {
  isOpen: boolean,
  onClose: () => void,
  post: Post,
  onLike: (postId) => void
}

Features:
- Fullscreen backdrop
- Image HD optimisée
- Infos post complètes
- Like interactif
- Commentaires scrollables
- Fermeture ESC/backdrop
```

### ExplorePostCard
```javascript
Props: {
  post: Post,
  onLike: (postId) => void
}

Features:
- Image responsive
- Hover overlay
- Infos auteur
- Tags (3 max + compteur)
- Like button
- Date formatée
```

---

## 🚀 Utilisation

### Backend
```bash
npm run dev
# API sur http://localhost:3000
```

### Frontend
```bash
cd frontend
npm run dev
# App sur http://localhost:3000
```

### Tester
```bash
# Créer un post
POST http://localhost:3000/api/posts
Headers: { Authorization: "Bearer <token>" }
Body: FormData {
  photo: File,
  description: "Mon plat délicieux",
  tags: ["Shabbat", "Kasher"]
}

# Liker un post
POST http://localhost:3000/api/like/posts/:id
Headers: { Authorization: "Bearer <token>" }

# Obtenir tous les posts
GET http://localhost:3000/api/posts?tags=Shabbat,Vegan
```

---

## 📱 Responsive Design

### Breakpoints
```javascript
Mobile:   < 768px  → 1 colonne
Tablet:   768px+   → 2 colonnes
Desktop:  1024px+  → 3 colonnes
Large:    1280px+  → 4 colonnes
```

### Optimisations
- Images lazy loading
- Masonry CSS natif
- Touch-friendly (mobile)
- Swipe gestures (modal)

---

## ✅ Checklist Complète

### Backend ✅
- [x] Modèle Post avec photoPublicId
- [x] Upload Cloudinary
- [x] Suppression Cloudinary
- [x] Route POST /posts
- [x] Route GET /posts avec filtres
- [x] Route GET /posts/:id
- [x] Route PUT /posts/:id
- [x] Route DELETE /posts/:id
- [x] Route POST /posts/:id/like
- [x] Route POST /posts/:id/comments
- [x] Route DELETE /posts/:id/comments/:commentId
- [x] Validation Joi
- [x] Protection routes
- [x] Gestion erreurs

### Frontend ✅
- [x] Page Explore avec masonry
- [x] Page PostCreate
- [x] Composant ImageModal
- [x] Filtres dynamiques par tags
- [x] Recherche temps réel
- [x] Upload image avec preview
- [x] Système de likes UI
- [x] Animations Framer Motion
- [x] Responsive design
- [x] Dark mode support

---

## 🎉 Résultat

Système social **complet et production-ready** avec :
- ✅ Galerie Explore en masonry responsive
- ✅ Upload de posts avec Cloudinary
- ✅ Filtrage dynamique par tags
- ✅ Recherche instantanée
- ✅ Modal fullscreen pour images
- ✅ Système de likes
- ✅ Système de commentaires
- ✅ Animations Framer Motion
- ✅ Protection routes
- ✅ Validation complète
- ✅ UI moderne et intuitive

**Le système social est prêt à l'emploi !** 🚀
