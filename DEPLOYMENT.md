# Guide de Déploiement Capitune

## 🚀 Étape 1: Installation de Git (Windows)

### Option 1: Télécharger Git
1. Allez sur https://git-scm.com/download/win
2. Téléchargez et installez Git for Windows
3. Redémarrez votre terminal PowerShell

### Option 2: Via Chocolatey
```powershell
# Installer Chocolatey si non installé
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Installer Git
choco install git
```

## 🔧 Étape 2: Configuration Firebase

### 2.1 Activer Authentication
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez le projet `capitunepro`
3. Allez dans `Authentication` > `Sign-in method`
4. Activez:
   - **Email/Password**
   - **Google** (configurez l'OAuth consent screen)
   - **Microsoft** (configurez l'application Azure)

### 2.2 Configurer Firestore
1. Allez dans `Firestore Database`
2. Créez une nouvelle base de données
3. Choisissez `Start in test mode` (pour débuter)
4. Appliquez les règles de sécurité depuis `firebase-firestore-rules.txt`

### 2.3 Configurer Storage (Optionnel)
1. Allez dans `Storage`
2. Commencez en mode test
3. Configurez les règles de sécurité depuis `firebase-rules.json`

## 📦 Étape 3: Initialisation Git et Push

```bash
# Initialiser le repository
git init

# Configurer Git (première fois seulement)
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Capitune platform with Firebase integration"

# Ajouter le remote
git remote add origin https://github.com/ndom2504/capitunepro.git

# Push vers GitHub
git push -u origin main
```

## 🌐 Étape 4: Déploiement sur Vercel

### 4.1 Installation Vercel CLI
```bash
npm install -g vercel
```

### 4.2 Connexion et Déploiement
```bash
# Se connecter à Vercel
vercel login

# Déployer en production
vercel --prod

# Suivre les instructions pour:
# - Lier le projet à votre équipe Vercel
# - Configurer les variables d'environnement
# - Définir le domaine personnalisé (optionnel)
```

### 4.3 Variables d'Environnement Vercel
Dans le dashboard Vercel, ajoutez ces variables:
- `FIREBASE_API_KEY`: `AIzaSyDtZBLZ75lmo0d5q36CRYOxrKmH0QvIifQ`
- `FIREBASE_AUTH_DOMAIN`: `capitunepro.firebaseapp.com`
- `FIREBASE_PROJECT_ID`: `capitunepro`
- `FIREBASE_STORAGE_BUCKET`: `capitunepro.firebasestorage.app`
- `FIREBASE_MESSAGING_SENDER_ID`: `909748011105`
- `FIREBASE_APP_ID`: `1:909748011105:web:451aee1fe48867fc55aa20`
- `FIREBASE_MEASUREMENT_ID`: `G-VTV29B3CGG`

## 🧪 Étape 5: Test Local

### 5.1 Démarrer le serveur local
```bash
npm start
```

### 5.2 Tester l'application
1. Ouvrez `http://localhost:8080`
2. Testez l'inscription avec Email/Password
3. Testez la connexion avec Google
4. Testez la connexion avec Microsoft
5. Vérifiez la redirection vers les tableaux de bord

## 🔍 Étape 6: Débogage

### Problèmes courants:
1. **Erreur Firebase**: Vérifiez que les clés sont correctes
2. **Erreur CORS**: Configurez les domaines autorisés dans Firebase
3. **Erreur Auth**: Vérifiez que les providers sont activés
4. **Erreur Firestore**: Vérifiez les règles de sécurité

### Logs et Monitoring:
- Firebase Console > Authentication > Users
- Firebase Console > Firestore Database > Data
- Vercel Dashboard > Functions > Logs

## 📱 Étape 7: Test Mobile

### Test sur mobile:
1. Ouvrez l'URL de production sur mobile
2. Testez la navigation responsive
3. Vérifiez l'authentification mobile
4. Testez les tableaux de bord sur petit écran

## 🔄 Étape 8: Mises à Jour

### Pour déployer des mises à jour:
```bash
# Ajouter les changements
git add .
git commit -m "Description des changements"
git push

# Déployer automatiquement via Vercel
# Ou manuellement:
vercel --prod
```

## 🎯 Étape 9: Monitoring

### Analytics Firebase:
1. Allez dans Firebase Console > Analytics
2. Configurez les événements personnalisés
3. Suivez les métriques d'utilisation

### Monitoring Vercel:
1. Allez dans Vercel Dashboard
2. Surveillez les performances
3. Configurez les alertes d'erreur

## 📞 Support

### En cas de problème:
1. Vérifiez les logs Firebase
2. Vérifiez les logs Vercel
3. Consultez la documentation Firebase
4. Contactez le support technique: info@capitune.ca

---

🎉 **Votre plateforme Capitune est maintenant en production !**
