# 🚀 Guide de Déploiement - Flavors of Israel

## 📋 Prérequis

- Node.js 18+ installé
- MongoDB installé localement ou compte MongoDB Atlas
- Compte Cloudinary (gratuit)
- Git installé

---

## 🏃 Démarrage Local (Port 3007)

### 1. **Installation Backend**

```bash
cd "/Users/shayacoca/Flavors of israel"
npm install
```

### 2. **Configuration Environnement**

Créer un fichier `.env` à la racine :

```bash
cp .env.example .env
```

Remplir les variables :

```bash
PORT=3007
MONGODB_URI=mongodb://localhost:27017/flavors-of-israel
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

NODE_ENV=development
```

### 3. **Démarrer MongoDB**

```bash
# Sur macOS avec Homebrew
brew services start mongodb-community

# Ou manuellement
mongod --dbpath /usr/local/var/mongodb
```

### 4. **Démarrer le Backend**

```bash
npm run dev
```

Le serveur démarre sur **http://localhost:3007**

### 5. **Installation Frontend**

```bash
cd frontend
npm install
```

### 6. **Configuration Frontend**

Créer `.env` dans le dossier frontend :

```bash
cp .env.example .env
```

Contenu :

```bash
VITE_API_URL=http://localhost:3007/api
```

### 7. **Démarrer le Frontend**

```bash
npm run dev
```

Le frontend démarre sur **http://localhost:3007**

---

## 🌐 Accès à l'Application

- **Frontend** : http://localhost:3007
- **Backend API** : http://localhost:3007/api
- **MongoDB** : mongodb://localhost:27017/flavors-of-israel

---

## 🔐 Créer un Compte Admin

### Via MongoDB Compass ou Shell

```javascript
use flavors-of-israel

db.users.insertOne({
  firstName: "Admin",
  lastName: "Flavors",
  email: "admin@flavorsofisrael.com",
  password: "$2a$10$...", // Hash bcrypt de "admin123"
  role: "admin",
  isActive: true,
  favorites: { restaurants: [], dishes: [], recipes: [], recipeBooks: [] },
  likes: { dishes: [], recipes: [], recipeBooks: [], posts: [] },
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Ou utiliser la route `/api/users/register` avec `role: "admin"` (à sécuriser en production).

---

## 📦 Build Production

### Backend

```bash
# À la racine
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

---

## ☁️ Déploiement Cloud

### **Option 1 : Vercel (Frontend) + Render (Backend)**

#### **Backend sur Render**

1. Créer compte sur [Render.com](https://render.com)
2. New → Web Service
3. Connecter repo GitHub
4. Configuration :
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Environment** : Node
   - **Variables d'environnement** : Ajouter toutes les variables du `.env`

#### **Frontend sur Vercel**

1. Créer compte sur [Vercel.com](https://vercel.com)
2. Import Project
3. Sélectionner le dossier `frontend`
4. Configuration :
   - **Framework** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Environment Variables** :
     ```
     VITE_API_URL=https://votre-backend.onrender.com/api
     ```

#### **Fichier vercel.json** (frontend)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### **Option 2 : MongoDB Atlas (Database Cloud)**

1. Créer compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Database Access → Add User
4. Network Access → Add IP (0.0.0.0/0 pour dev)
5. Copier la connection string
6. Mettre à jour `.env` :

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flavors-of-israel?retryWrites=true&w=majority
```

---

### **Option 3 : Cloudinary (Images)**

1. Créer compte sur [Cloudinary.com](https://cloudinary.com)
2. Dashboard → Account Details
3. Copier : Cloud Name, API Key, API Secret
4. Mettre à jour `.env`

---

## 🔧 Scripts Disponibles

### Backend

```bash
npm run dev      # Développement avec nodemon
npm start        # Production
```

### Frontend

```bash
npm run dev      # Développement
npm run build    # Build production
npm run preview  # Preview build
```

---

## 🐛 Dépannage

### Port déjà utilisé

```bash
# Trouver le processus sur le port 3007
lsof -i :3007

# Tuer le processus
kill -9 <PID>
```

### MongoDB ne démarre pas

```bash
# Vérifier le statut
brew services list

# Redémarrer
brew services restart mongodb-community
```

### Erreur CORS

Vérifier que le backend a bien `cors()` activé dans `server.js`.

### Images ne s'uploadent pas

Vérifier les credentials Cloudinary dans `.env`.

---

## 📊 Monitoring Production

### Logs Backend (Render)

- Dashboard Render → Logs

### Logs Frontend (Vercel)

- Dashboard Vercel → Deployments → Logs

### MongoDB Atlas

- Dashboard → Metrics

---

## 🔒 Sécurité Production

### ✅ Checklist

- [ ] Changer `JWT_SECRET` par une clé forte
- [ ] Utiliser MongoDB Atlas (pas localhost)
- [ ] Activer HTTPS (automatique sur Vercel/Render)
- [ ] Limiter CORS aux domaines autorisés
- [ ] Variables d'environnement sécurisées
- [ ] Rate limiting sur les routes sensibles
- [ ] Validation Joi sur tous les inputs
- [ ] Logs d'erreurs configurés

---

## 📝 URLs de Production

Une fois déployé :

- **Frontend** : https://flavors-of-israel.vercel.app
- **Backend** : https://flavors-of-israel-api.onrender.com
- **API Docs** : https://flavors-of-israel-api.onrender.com/api

---

## 🎉 Résultat

Votre application **Flavors of Israel** est maintenant :

- ✅ Accessible sur **http://localhost:3007**
- ✅ Prête pour le développement
- ✅ Prête pour le déploiement production
- ✅ Sécurisée et optimisée
- ✅ Documentée complètement

**Bon développement ! 🚀**
