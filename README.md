# Capitune Pro - Plateforme de Services d'Immigration Canada

Capitune est une plateforme complète pour les services d'immigration au Canada, offrant des solutions pour les clients et les professionnels de l'immigration.

## 🚀 Fonctionnalités

### Pour les Clients
- **Tableau de Bord Personnel**: Suivi des projets d'immigration
- **Gestion de Projets**: Permis d'études, permis de travail, résidence permanente
- **Gestion Documentaire**: Téléchargement et suivi des documents requis
- **Communauté**: Partage d'expériences et interaction avec d'autres utilisateurs
- **AI Assistant**: Chatbot intégré pour des conseils instantanés
- **Profil Personnalisé**: Informations personnelles et préférences

### Pour les Professionnels
- **Tableau de Bord Professionnel**: Gestion des clients et projets
- **Suivi de Clients**: Vue d'ensemble des dossiers clients
- **Calendrier Intégré**: Gestion des rendez-vous et consultations
- **Communauté Professionnelle**: Partage d'expertise et réseautage
- **Validation de Statut**: Badges de vérification pour les consultants
- **Analytics**: Statistiques de performance et taux de succès

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, Bootstrap 3, JavaScript
- **Authentification**: Firebase Auth (Google, Microsoft)
- **Base de Données**: Firebase Firestore
- **Déploiement**: Vercel
- **Design**: Mobile-first avec navigation responsive

## 📁 Structure du Projet

```
capitunepro/
├── index.html                 # Page d'accueil et connexion
├── dashboard-client.html      # Tableau de bord client
├── dashboard-pro.html         # Tableau de bord professionnel
├── templatemo_468_onetel/    # Template de base
│   ├── css/                  # Feuilles de style
│   ├── js/                   # Scripts JavaScript
│   ├── images/               # Images du template
│   └── fonts/                # Polices de caractères
├── package.json              # Configuration Node.js
├── vercel.json              # Configuration Vercel
└── README.md                # Documentation
```

## 🔧 Installation et Configuration

### Prérequis
- Node.js 14.0.0 ou supérieur
- Compte Firebase
- Compte Vercel

### Étapes d'Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/ndom2504/capitunepro.git
   cd capitunepro
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer Firebase**
   - Créer un projet sur [Firebase Console](https://console.firebase.google.com/)
   - Activer Authentication (Email/Password, Google, Microsoft)
   - Activer Firestore Database
   - Copier la configuration Firebase dans les fichiers HTML

4. **Démarrer le serveur de développement**
   ```bash
   npm start
   ```

5. **Accéder à l'application**
   - Ouvrir `http://localhost:8080` dans votre navigateur

## 🚀 Déploiement sur Vercel

1. **Installer Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Se connecter à Vercel**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   vercel --prod
   ```

4. **Configurer les variables d'environnement**
   - Ajouter les clés Firebase dans le dashboard Vercel
   - Configurer les domaines personnalisés si nécessaire

## 🔐 Configuration Firebase

### Variables d'environnement requises:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

### Structure Firestore:
```
users/
  {userId}/
    email: string
    role: 'client' | 'professional'
    createdAt: timestamp
    lastLogin: timestamp

professionals/
  {userId}/
    email: string
    verified: boolean
    specialization: string
    rating: number
    totalClients: number

projects/
  {projectId}/
    clientId: string
    professionalId: string
    type: 'study' | 'work' | 'permanent'
    status: string
    progress: number
    createdAt: timestamp
```

## 🎨 Personnalisation

### Couleurs et Thème
- Primaire: `#003366` (Bleu marine)
- Secondaire: `#0066cc` (Bleu vif)
- Accent: `#28a745` (Vert pour succès)

### Images et Logos
- Remplacer les placeholders par vos propres images
- Logo Capitune: `150x40px` format PNG/SVG
- Images héros: `1920x1080px` format JPG

## 📱 Responsive Design

L'application est conçue avec une approche mobile-first:
- Navigation adaptative avec menu hamburger
- Tableaux de bord optimisés pour mobile
- Navigation inférieure pour les appareils mobiles

## 🤖 AI Assistant

Un chatbot intégré propulsé par DeepSeek pour:
- Répondre aux questions sur l'immigration
- Fournir des conseils personnalisés
- Aider à la navigation dans la plateforme

## 📊 Analytics et Monitoring

- Suivi des interactions utilisateur
- Analytics des performances des projets
- Statistiques de succès pour les professionnels

## 🔧 Maintenance

### Mises à jour régulières:
- Dépendances npm
- Configuration Firebase
- Contenu et documentation

### Support technique:
- Documentation complète
- Logs d'erreurs détaillés
- Support par email: info@capitune.ca

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails

## 🤝 Contribution

1. Fork le projet
2. Créer une branche de fonctionnalité
3. Commit les changements
4. Push vers la branche
5. Créer une Pull Request

## 📞 Contact

- **Email**: info@capitune.ca
- **Téléphone**: +1 514-000-0000
- **Site Web**: www.capitune.ca
- **GitHub**: https://github.com/ndom2504/capitunepro

---

© 2024 Capitune - Tous droits réservés
