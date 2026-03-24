import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtZBLZ75lmo0d5q36CRYOxrKmH0QvIifQ",
  authDomain: "capitunepro.firebaseapp.com",
  projectId: "capitunepro",
  storageBucket: "capitunepro.firebasestorage.app",
  messagingSenderId: "909748011105",
  appId: "1:909748011105:web:451aee1fe48867fc55aa20",
  measurementId: "G-VTV29B3CGG"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

export default function Home() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Check authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User is signed in:', user.email);
      } else {
        console.log('User is signed out');
      }
    });

    return () => unsubscribe();
  }, []);

  // Show auth section
  const showAuthSection = () => {
    setShowAuth(true);
    setTimeout(() => {
      const authSection = document.getElementById('auth-section');
      if (authSection) {
        authSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Select role
  const selectRole = (role) => {
    setSelectedRole(role);
    setError('');
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      await handleSuccessfulAuth(result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Erreur de connexion avec Google');
    }
  };

  // Sign in with Microsoft
  const signInWithMicrosoft = async () => {
    try {
      const provider = new firebase.auth.OAuthProvider('microsoft.com');
      const result = await auth.signInWithPopup(provider);
      await handleSuccessfulAuth(result.user);
    } catch (error) {
      console.error('Error signing in with Microsoft:', error);
      setError('Erreur de connexion avec Microsoft');
    }
  };

  // Handle successful authentication
  const handleSuccessfulAuth = async (user) => {
    try {
      // Save user role in Firestore
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        role: selectedRole,
        createdAt: new Date(),
        lastLogin: new Date()
      }, { merge: true });

      // Redirect to appropriate dashboard
      if (selectedRole === 'client') {
        router.push('/dashboard-client');
      } else if (selectedRole === 'professional') {
        router.push('/dashboard-pro');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      setError('Erreur lors de la sauvegarde des données utilisateur');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      await handleSuccessfulAuth(result.user);
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Erreur de connexion: ' + error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Capitune Pro - Services d'Immigration Canada</title>
        <meta name="keywords" content="immigration canada, permis etude, permis travail, residence permanente" />
        <meta name="description" content="Capitune Pro - Votre plateforme complète pour les services d'immigration au Canada" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Bootstrap CSS */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        {/* Font Awesome */}
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </Head>

      {/* Header */}
      <header className="header">
        <nav className="nav-menu">
          <a href="#" className="logo">CAPITUNE PRO</a>
          <ul className="nav-links">
            <li><a href="#home">ACCUEIL</a></li>
            <li><a href="#services">SERVICES</a></li>
            <li><a href="#about">À PROPOS</a></li>
            <li><a onClick={showAuthSection}>CONNEXION</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="hero-content">
                <h1>Votre projet Canada, simplifié et accompagné</h1>
                <p>Capitune est une plateforme de suivi et d’accompagnement qui vous connecte à des professionnels agréés et vous guide à chaque étape de votre parcours vers le Canada.</p>
                <button onClick={showAuthSection} className="btn-primary">Commencer mon projet</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="section-title">Nos Services</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="service-card">
                <i className="fas fa-users service-icon"></i>
                <h3>Communauté (Inside)</h3>
                <p>Partage d'expériences entre utilisateurs<br/>
                Questions / réponses<br/>
                Accès à des conseils pratiques</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="service-card">
                <i className="fas fa-robot service-icon"></i>
                <h3>Assistant intelligent (IA)</h3>
                <p>Orientation sur les options possibles<br/>
                Réponses rapides à vos questions<br/>
                Aide à la compréhension des démarches<br/>
                Recommandations personnalisées (selon profil)</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="service-card">
                <i className="fas fa-route service-icon"></i>
                <h3>Parcours guidé (mode autonome)</h3>
                <p>Orientation sans professionnel<br/>
                Suggestions adaptées à votre profil<br/>
                Aide à la structuration du projet</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="service-card">
                <i className="fas fa-tasks service-icon"></i>
                <h3>Gestion de projet Canada</h3>
                <p>Création et suivi de votre projet (études, travail, résidence, etc.)<br/>
                Visualisation des étapes à accomplir<br/>
                Suivi de progression en temps réel</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="service-card">
                <i className="fas fa-folder-shield service-icon"></i>
                <h3>Gestion documentaire sécurisée</h3>
                <p>Téléversement et organisation des documents<br/>
                Suivi des documents requis<br/>
                Statut des documents (validé, à corriger, manquant)<br/>
                Accès centralisé à tous vos fichiers</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="service-card">
                <i className="fas fa-user-tie service-icon"></i>
                <h3>Professionnels agréés</h3>
                <p>Accès à des consultants et experts certifiés<br/>
                Consultation de profils vérifiés<br/>
                Choix du professionnel selon votre projet<br/>
                Demande d'accompagnement personnalisé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      {showAuth && (
        <section className="auth-section" id="auth-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h2 className="section-title">Rejoignez Capitune Pro</h2>
                <p style={{ textAlign: 'center', marginBottom: '40px' }}>Choisissez votre profil pour commencer</p>
              </div>
            </div>
            
            {/* Role Selection */}
            {!selectedRole && (
              <div id="role-selection" className="row">
                <div className="col-lg-6">
                  <div className="role-card" onClick={() => selectRole('client')}>
                    <i className="fas fa-user service-icon"></i>
                    <h3>Candidat</h3>
                    <p>Je souhaite concrétiser mon projet de vie au Canada</p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="role-card" onClick={() => selectRole('professional')}>
                    <i className="fas fa-user-tie service-icon"></i>
                    <h3>Professionnel agréé</h3>
                    <p>Je suis consultant et je veux accompagner des candidats</p>
                  </div>
                </div>
              </div>
            )}

            {/* Login Form */}
            {selectedRole && (
              <div id="login-form" className="row">
                <div className="col-lg-6 offset-lg-3">
                  <div className="login-form">
                    <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#1F386E' }}>Connexion</h3>
                    
                    {error && <div className="error">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Email:</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Mot de passe:</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          id="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                        />
                      </div>
                      <button type="submit" className="btn-block">Se connecter</button>
                    </form>
                    
                    <div style={{ textAlign: 'center', margin: '30px 0' }}>
                      <p>OU</p>
                    </div>
                    
                    <div className="text-center">
                      <button type="button" className="btn-block mb-2" style={{ background: '#db4437' }} onClick={signInWithGoogle}>
                        <i className="fab fa-google"></i> Connexion avec Google
                      </button>
                      <button type="button" className="btn-block" style={{ background: '#0078d4' }} onClick={signInWithMicrosoft}>
                        <i className="fab fa-microsoft"></i> Connexion avec Microsoft
                      </button>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <p>Pas encore de compte? <a href="#" onClick={() => alert('Inscription à venir')} style={{ color: '#1F386E' }}>S'inscrire</a></p>
                      <button onClick={() => setSelectedRole(null)} className="btn" style={{ background: 'none', border: '1px solid #1F386E', color: '#1F386E' }}>Retour</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <p>&copy; 2024 Capitune Pro - Tous droits réservés</p>
              <p>
                <a href="#" style={{ color: 'white', margin: '0 10px' }}><i className="fab fa-facebook"></i></a>
                <a href="#" style={{ color: 'white', margin: '0 10px' }}><i className="fab fa-linkedin"></i></a>
                <a href="#" style={{ color: 'white', margin: '0 10px' }}><i className="fab fa-twitter"></i></a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
