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
    window.scrollTo({ top: 600, behavior: 'smooth' });
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
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
        
        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Montserrat', sans-serif;
            background: #f5f7fa;
            overflow-x: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #1F386E 0%, #2a4a8a 100%);
            padding: 15px 0;
            box-shadow: 0 4px 20px rgba(31,56,110,0.15);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          
          .logo {
            color: white;
            font-weight: bold;
            font-size: 2rem;
            text-decoration: none;
            letter-spacing: -0.5px;
            transition: all 0.3s ease;
          }
          
          .logo:hover {
            color: white;
            text-decoration: none;
            transform: scale(1.05);
          }
          
          .nav-menu {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          .nav-links {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
          }
          
          .nav-links li {
            margin-left: 35px;
          }
          
          .nav-links a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            position: relative;
            padding: 8px 0;
          }
          
          .nav-links a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: white;
            transition: width 0.3s ease;
          }
          
          .nav-links a:hover::after {
            width: 100%;
          }
          
          .nav-links a:hover {
            color: #ffffff;
            text-decoration: none;
            transform: translateY(-2px);
          }
          
          .hero {
            background: linear-gradient(135deg, #1F386E 0%, #2a4a8a 50%, #1F386E 100%);
            color: white;
            padding: 180px 0 120px;
            text-align: center;
            margin-top: 80px;
            position: relative;
            overflow: hidden;
          }
          
          .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></svg>') center/100px 100px;
            animation: float 20s infinite linear;
          }
          
          @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(30px, -30px) rotate(180deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
          
          .hero-content {
            position: relative;
            z-index: 2;
          }
          
          .hero h1 {
            font-size: 4rem;
            font-weight: 700;
            margin-bottom: 25px;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
            animation: fadeInUp 1s ease;
          }
          
          .hero p {
            font-size: 1.3rem;
            margin-bottom: 30px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
            animation: fadeInUp 1s ease 0.2s both;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            color: #1F386E;
            padding: 18px 40px;
            border: none;
            border-radius: 30px;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.4s ease;
            text-decoration: none;
            display: inline-block;
            box-shadow: 0 8px 25px rgba(255,255,255,0.2);
            position: relative;
            overflow: hidden;
            animation: fadeInUp 1s ease 0.4s both;
          }
          
          .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.6s;
          }
          
          .btn-primary:hover::before {
            left: 100%;
          }
          
          .btn-primary:hover {
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            color: #1F386E;
            transform: scale(1.05) translateY(-3px);
            box-shadow: 0 12px 35px rgba(255,255,255,0.3);
          }
          
          .services {
            padding: 100px 0;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            position: relative;
          }
          
          .services::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, #1F386E, transparent);
          }
          
          .section-title {
            text-align: center;
            color: #1F386E;
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 60px;
            position: relative;
          }
          
          .section-title::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, #1F386E, #2a4a8a);
            border-radius: 2px;
          }
          
          .service-card {
            background: white;
            border-radius: 20px;
            padding: 50px 35px;
            box-shadow: 0 10px 40px rgba(31,56,110,0.08);
            text-align: center;
            transition: all 0.4s ease;
            height: 100%;
            position: relative;
            overflow: hidden;
          }
          
          .service-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #1F386E, #2a4a8a);
            transform: scaleX(0);
            transition: transform 0.4s ease;
          }
          
          .service-card:hover::before {
            transform: scaleX(1);
          }
          
          .service-card:hover {
            transform: translateY(-15px) scale(1.02);
            box-shadow: 0 20px 60px rgba(31,56,110,0.15);
          }
          
          .service-icon {
            font-size: 3.5rem;
            color: #1F386E;
            margin-bottom: 25px;
            transition: all 0.4s ease;
          }
          
          .service-card:hover .service-icon {
            transform: scale(1.1) rotate(5deg);
            color: #2a4a8a;
          }
          
          .service-card h3 {
            color: #1F386E;
            font-size: 1.6rem;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          .auth-section {
            padding: 100px 0;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          }
          
          .role-selection {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 60px;
          }
          
          .role-card {
            background: white;
            border-radius: 20px;
            padding: 50px 35px;
            box-shadow: 0 10px 40px rgba(31,56,110,0.08);
            text-align: center;
            cursor: pointer;
            transition: all 0.4s ease;
            min-width: 280px;
            position: relative;
            overflow: hidden;
          }
          
          .role-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(31,56,110,0.05), transparent);
            transform: rotate(45deg);
            transition: all 0.6s ease;
          }
          
          .role-card:hover::before {
            top: -100%;
            left: -100%;
          }
          
          .role-card:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 20px 60px rgba(31,56,110,0.15);
          }
          
          .login-form {
            max-width: 450px;
            margin: 0 auto;
            background: white;
            padding: 50px;
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(31,56,110,0.1);
            position: relative;
            overflow: hidden;
          }
          
          .login-form::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #1F386E, #2a4a8a);
          }
          
          .form-group {
            margin-bottom: 25px;
          }
          
          .form-control {
            width: 100%;
            padding: 15px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: #f8f9fa;
          }
          
          .form-control:focus {
            outline: none;
            border-color: #1F386E;
            background: white;
            box-shadow: 0 0 0 4px rgba(31,56,110,0.1);
          }
          
          .btn-block {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #1F386E 0%, #2a4a8a 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .btn-block:hover {
            background: linear-gradient(135deg, #2a4a8a 0%, #1F386E 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(31,56,110,0.3);
          }
          
          .hidden {
            display: none;
          }
          
          .footer {
            background: linear-gradient(135deg, #1F386E 0%, #2a4a8a 100%);
            color: white;
            padding: 50px 0;
            margin-top: 100px;
            position: relative;
            overflow: hidden;
          }
          
          .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          }
          
          .error {
            color: #dc3545;
            background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
            border: 1px solid #f5c6cb;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 25px;
            text-align: center;
            font-weight: 500;
          }
          
          @media (max-width: 768px) {
            .nav-links {
              display: none;
            }
            
            .hero h1 {
              font-size: 2.5rem;
            }
            
            .hero p {
              font-size: 1.1rem;
            }
            
            .role-selection {
              flex-direction: column;
              align-items: center;
              gap: 30px;
            }
            
            .section-title {
              font-size: 2.2rem;
            }
            
            .service-card, .role-card {
              padding: 35px 25px;
            }
          }
        `}</style>
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
                <h1>Bienvenue chez Capitune Pro</h1>
                <p>Votre partenaire de confiance pour l'immigration au Canada</p>
                <p>Permis d'études, permis de travail, résidence permanente - Nous vous accompagnons à chaque étape</p>
                <button onClick={showAuthSection} className="btn-primary">Commencer votre voyage</button>
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
                <i className="fas fa-graduation-cap service-icon"></i>
                <h3>Permis d'Études</h3>
                <p>Étudiez au Canada avec notre accompagnement complet pour les permis d'études et les inscriptions universitaires.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="service-card">
                <i className="fas fa-briefcase service-icon"></i>
                <h3>Permis de Travail</h3>
                <p>Opportunités professionnelles au Canada avec soutien pour les permis de travail et l'immigration économique.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="service-card">
                <i className="fas fa-home service-icon"></i>
                <h3>Résidence Permanente</h3>
                <p>Devenez résident permanent du Canada grâce à notre expertise des différents programmes d'immigration.</p>
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
                    <h3>Client</h3>
                    <p>Je cherche des services d'immigration</p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="role-card" onClick={() => selectRole('professional')}>
                    <i className="fas fa-user-tie service-icon"></i>
                    <h3>Professionnel</h3>
                    <p>Je suis un consultant en immigration</p>
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
