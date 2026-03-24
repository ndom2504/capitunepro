import { useState, useEffect, useRef } from 'react';
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
  const [showAuth, setShowAuth] = useState(true); // Commence avec true pour afficher l'auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState(null); // null, 'email', 'google', 'microsoft', 'signup'
  const authLockRef = useRef(false);
  const router = useRouter();

  const beginAuthAction = (actionType) => {
    if (authLockRef.current) return false;
    authLockRef.current = true;
    setLoadingAction(actionType);
    return true;
  };

  const endAuthAction = () => {
    authLockRef.current = false;
    setLoadingAction(null);
  };

  // Check if email exists and get its role
  const checkEmailExistence = async (emailToCheck) => {
    try {
      const usersSnapshot = await db.collection('users')
        .where('email', '==', emailToCheck)
        .get();
      
      if (!usersSnapshot.empty) {
        const existingUser = usersSnapshot.docs[0].data();
        return existingUser.role;
      }
      return null;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return null;
    }
  };

  // Check authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User is signed in:', user.email);
        
        // Récupérer le rôle depuis Firestore
        const doc = await db.collection('users').doc(user.uid).get();
        
        if (doc.exists) {
          const role = doc.data().role;
          console.log('User role from Firestore:', role);
          
          // Rediriger selon le rôle récupéré
          if (role === 'client') {
            console.log('Redirecting to dashboard-client');
            router.push('/dashboard-client');
          } else if (role === 'professional') {
            console.log('Redirecting to dashboard-pro');
            router.push('/dashboard-pro');
          }
        }
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

  // Auto-scroll to auth section on mount
  useEffect(() => {
    if (showAuth) {
      setTimeout(() => {
        const authSection = document.getElementById('auth-section');
        if (authSection) {
          authSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [showAuth]);

  // Select role
  const selectRole = (role) => {
    setSelectedRole(role);
    setError('');
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!beginAuthAction('google')) return;
    
    if (!selectedRole) {
      endAuthAction();
      setError('Veuillez d\'abord sélectionner un profil');
      return;
    }
    
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await auth.signInWithPopup(provider);
      
      // Vérifier si l'utilisateur existe dans Firestore
      const userDoc = await db.collection('users').doc(result.user.uid).get();
      
      if (userDoc.exists) {
        // Utilisateur existe, vérifier si le rôle correspond
        const existingRole = userDoc.data().role;
        console.log('Existing user role:', existingRole);
        
        if (existingRole !== selectedRole) {
          // Rôle différent - rejeter la connexion
          await auth.signOut();
          endAuthAction();
          setError(`Ce compte existe déjà comme ${existingRole === 'client' ? 'Candidat' : 'Professionnel agréé'}. Veuillez sélectionner le bon profil.`);
          return;
        }
        
        setSelectedRole(existingRole);
        await handleSuccessfulAuth(result.user);
      } else {
        // Nouvel utilisateur, vérifier si l'email existe avec un rôle différent
        const existingRole = await checkEmailExistence(result.user.email);
        if (existingRole) {
          await auth.signOut();
          endAuthAction();
          setError(`Ce compte existe déjà comme ${existingRole === 'client' ? 'Candidat' : 'Professionnel agréé'}. Veuillez sélectionner le bon profil.`);
          return;
        }
        
        setSelectedRole(selectedRole);
        await handleSuccessfulAuth(result.user);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        return; // Ignorer si l'utilisateur ferme la popup
      }
      setError('Erreur de connexion avec Google: ' + error.message);
    } finally {
      endAuthAction();
    }
  };

  // Sign in with Microsoft
  const signInWithMicrosoft = async () => {
    if (!beginAuthAction('microsoft')) return;
    
    if (!selectedRole) {
      endAuthAction();
      setError('Veuillez d\'abord sélectionner un profil');
      return;
    }
    
    try {
      const provider = new firebase.auth.OAuthProvider('microsoft.com');
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await auth.signInWithPopup(provider);
      
      // Vérifier si l'utilisateur existe dans Firestore
      const userDoc = await db.collection('users').doc(result.user.uid).get();
      
      if (userDoc.exists) {
        // Utilisateur existe, vérifier si le rôle correspond
        const existingRole = userDoc.data().role;
        console.log('Existing user role:', existingRole);
        
        if (existingRole !== selectedRole) {
          // Rôle différent - rejeter la connexion
          await auth.signOut();
          endAuthAction();
          setError(`Ce compte existe déjà comme ${existingRole === 'client' ? 'Candidat' : 'Professionnel agréé'}. Veuillez sélectionner le bon profil.`);
          return;
        }
        
        setSelectedRole(existingRole);
        await handleSuccessfulAuth(result.user);
      } else {
        // Nouvel utilisateur, vérifier si l'email existe avec un rôle différent
        const existingRole = await checkEmailExistence(result.user.email);
        if (existingRole) {
          await auth.signOut();
          endAuthAction();
          setError(`Ce compte existe déjà comme ${existingRole === 'client' ? 'Candidat' : 'Professionnel agréé'}. Veuillez sélectionner le bon profil.`);
          return;
        }
        
        setSelectedRole(selectedRole);
        await handleSuccessfulAuth(result.user);
      }
    } catch (error) {
      console.error('Error signing in with Microsoft:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        return; // Ignorer si l'utilisateur ferme la popup
      }
      setError('Erreur de connexion avec Microsoft: ' + error.message);
    } finally {
      endAuthAction();
    }
  };

  // Handle successful authentication
  const handleSuccessfulAuth = async (user) => {
    try {
      // Sauvegarder le rôle dans Firestore seulement si sélectionné
      if (selectedRole) {
        await db.collection('users').doc(user.uid).set({
          email: user.email,
          role: selectedRole,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
          lastLogin: firebase.firestore.Timestamp.fromDate(new Date())
        }, { merge: true });
      }

      // Rediriger selon le rôle (priorité à selectedRole, fallback Firestore)
      const role = selectedRole || 'client'; // par défaut
      
      console.log('Redirecting to dashboard for role:', role);
      
      if (role === 'client') {
        console.log('Redirecting to dashboard-client');
        router.push('/dashboard-client');
      } else if (role === 'professional') {
        console.log('Redirecting to dashboard-pro');
        router.push('/dashboard-pro');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      setError('Erreur lors de la sauvegarde des données utilisateur');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Veuillez d\'abord sélectionner un profil');
      return;
    }

    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    if (!password) {
      setError('Veuillez entrer votre mot de passe');
      return;
    }

    if (!beginAuthAction('email')) return;
    
    try {
      // Vérifier si l'email existe avec un rôle différent
      const existingRole = await checkEmailExistence(email);
      if (existingRole && existingRole !== selectedRole) {
        endAuthAction();
        setError(`Ce compte existe déjà comme ${existingRole === 'client' ? 'Candidat' : 'Professionnel agréé'}. Veuillez sélectionner le bon profil.`);
        return;
      }

      const result = await auth.signInWithEmailAndPassword(email, password);
      await handleSuccessfulAuth(result.user);
    } catch (error) {
      console.error('Error signing in:', error);
      if (error.code === 'auth/user-not-found') {
        setError('Email non trouvé. Veuillez créer un compte.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect.');
      } else {
        setError('Erreur de connexion: ' + error.message);
      }
    } finally {
      endAuthAction();
    }
  };

  // Handle signup
  const handleSignup = async () => {
    setError('');
    
    if (!selectedRole) {
      setError('Veuillez d\'abord sélectionner un profil');
      return;
    }

    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    if (!password) {
      setError('Veuillez entrer votre mot de passe');
      return;
    }

    if (!beginAuthAction('signup')) return;
    
    try {
      // Vérifier si l'email existe avec un rôle différent
      const existingRole = await checkEmailExistence(email);
      if (existingRole) {
        endAuthAction();
        if (existingRole !== selectedRole) {
          setError(`Ce compte existe déjà comme ${existingRole === 'client' ? 'Candidat' : 'Professionnel agréé'}. Veuillez sélectionner le bon profil.`);
        } else {
          setError('Cet email existe déjà. Veuillez vous connecter avec votre mot de passe ou utiliser Google/Microsoft.');
        }
        return;
      }

      const result = await auth.createUserWithEmailAndPassword(email, password);
      await handleSuccessfulAuth(result.user);
    } catch (error) {
      console.error('Error creating account:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Cet email existe déjà. Veuillez vous connecter avec votre mot de passe ou utiliser Google/Microsoft.');
      } else if (error.code === 'auth/weak-password') {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Veuillez entrer une adresse email valide.');
      } else {
        setError('Erreur de création de compte: ' + error.message);
      }
    } finally {
      endAuthAction();
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
                    
                    {/* Email/Password Login */}
                    <div>
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
                      <button 
                        type="button" 
                        className="btn-block" 
                        style={{ background: '#1F386E', cursor: loadingAction ? 'not-allowed' : 'pointer' }} 
                        disabled={loadingAction !== null}
                        onClick={handleSubmit}
                      >
                        {loadingAction === 'email' ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Connexion en cours...
                          </>
                        ) : (
                          <>
                            Se connecter
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div style={{ textAlign: 'center', margin: '30px 0' }}>
                      <p>OU</p>
                    </div>
                    
                    {/* Google Login */}
                    <div style={{ marginBottom: '15px' }}>
                      <button 
                        type="button" 
                        className="btn-block" 
                        style={{ background: '#db4437', cursor: loadingAction ? 'not-allowed' : 'pointer' }} 
                        disabled={loadingAction !== null}
                        onClick={signInWithGoogle}
                      >
                        {loadingAction === 'google' ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Connexion en cours...
                          </>
                        ) : (
                          <>
                            <i className="fab fa-google"></i> Connexion avec Google
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* Microsoft Login */}
                    <div style={{ marginBottom: '15px' }}>
                      <button 
                        type="button" 
                        className="btn-block" 
                        style={{ background: '#0078d4', cursor: loadingAction ? 'not-allowed' : 'pointer' }} 
                        disabled={loadingAction !== null}
                        onClick={signInWithMicrosoft}
                      >
                        {loadingAction === 'microsoft' ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Connexion en cours...
                          </>
                        ) : (
                          <>
                            <i className="fab fa-microsoft"></i> Connexion avec Microsoft
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* Signup */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <button 
                        type="button" 
                        className="btn" 
                        style={{ background: '#28a745', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', fontSize: '1rem', cursor: loadingAction ? 'not-allowed' : 'pointer' }} 
                        disabled={loadingAction !== null}
                        onClick={handleSignup}
                      >
                        {loadingAction === 'signup' ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Création en cours...
                          </>
                        ) : (
                          <>
                            Créer un compte
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setSelectedRole(null)} 
                        className="btn" 
                        style={{ background: 'none', border: '1px solid #1F386E', color: '#1F386E' }}
                        disabled={loadingAction !== null}
                      >
                        Retour
                      </button>
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
