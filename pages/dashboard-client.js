import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtZBLZ75lmo0d5q36CRYOxrKmH0QvIifQ",
  authDomain: "capitunepro.firebaseapp.com",
  projectId: "capitunepro",
  storageBucket: "capitunepro.firebasestorage.app",
  messagingSenderId: "909748011105",
  appId: "1:909748011105:web:451aee1fe48867fc55aa20",
  measurementId: "G-VTV29B3CGG"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

const TAB_TITLES = {
  'projets': 'Mes Projets',
  'documents': 'Mes Documents',
  'inside': 'Communauté Inside',
  'messagerie': 'Messagerie',
  'profil': 'Mon Profil'
};

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState('projets');
  const [user, setUser] = useState(null);
  const [showInsideOptions, setShowInsideOptions] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, []);

  // Redirection vers "/inside" quand activeTab === 'inside'
  useEffect(() => {
    if (activeTab === 'inside') {
      setTimeout(() => {
        router.push('/inside');
      }, 300);
    }
  }, [activeTab, router]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSettings = () => {
    setActiveTab('profil');
  };

  if (!user) {
    return <div className="dashboard-container">Chargement...</div>;
  }

  return (
    <>
      <Head>
        <title>Dashboard Candidat - Capitune Pro</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="dashboard-header-left">
              <img src="/asset/icon.svg" alt="Capitune Pro" title="Accueil" />
            </div>
            
            <div className="dashboard-search-bar">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Rechercher..." />
            </div>
            
            <div className="dashboard-header-center">
              <h1>{TAB_TITLES[activeTab]}</h1>
            </div>
            <div className="dashboard-header-right">
              <button className="settings-btn" onClick={handleSettings} title="Paramètres">
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-inner">
            {activeTab === 'projets' && (
              <div className="dashboard-section">
                <div className="section-title">
                  <i className="fas fa-folder-open"></i>
                  Mes Projets
                </div>
                <div className="projects-grid">
                  <div className="project-card">
                    <div className="project-header">
                      <h3>Permis d'études</h3>
                      <span className="project-status">En cours</span>
                    </div>
                    <p className="project-description">Université de Toronto - Computer Science</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '65%' }}></div>
                    </div>
                    <p className="progress-text">65% complété</p>
                  </div>

                  <div className="project-card">
                    <div className="project-header">
                      <h3>Résidence Permanente</h3>
                      <span className="project-status pending">En attente</span>
                    </div>
                    <p className="project-description">Catégorie fédérale des travailleurs qualifiés</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '30%' }}></div>
                    </div>
                    <p className="progress-text">30% complété</p>
                  </div>

                  <button className="btn-new-project">
                    <i className="fas fa-plus"></i> Nouveau Projet
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'inside' && (
              <div className="dashboard-section redirect-message">
                <div className="redirect-content">
                  <i className="fas fa-arrow-right"></i>
                  <h2>Accès à Inside</h2>
                  <p>Vous allez être redirigé vers la page Inside complète...</p>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="dashboard-section">
                <div className="section-title">
                  <i className="fas fa-folder-shield"></i>
                  Gestion Documentaire
                </div>
                <div className="documents-container">
                  <div className="doc-card">
                    <div className="doc-header">
                      <i className="fas fa-file-pdf"></i>
                      <h3>Passeport</h3>
                    </div>
                    <p className="doc-status valid">✓ Validé</p>
                  </div>

                  <div className="doc-card">
                    <div className="doc-header">
                      <i className="fas fa-file-pdf"></i>
                      <h3>Certificat d'études</h3>
                    </div>
                    <p className="doc-status pending">⏱ À corriger</p>
                  </div>

                  <div className="doc-card empty">
                    <div className="doc-header">
                      <i className="fas fa-file-pdf"></i>
                      <h3>Lettre d'acceptation</h3>
                    </div>
                    <p className="doc-status missing">✕ Manquant</p>
                  </div>

                  <button className="btn-upload">
                    <i className="fas fa-cloud-upload-alt"></i> Télécharger Document
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'messagerie' && (
              <div className="dashboard-section">
                <div className="section-title">
                  <i className="fas fa-envelope"></i>
                  Messagerie
                </div>
                <div className="messaging-container">
                  <div className="message-card">
                    <div className="message-header">
                      <h3>Votre Professionnel Agréé</h3>
                    </div>
                    <p className="message-preview">Pierre Dubois vous a envoyé un message...</p>
                    <p className="message-time">Aujourd'hui à 14:30</p>
                  </div>

                  <div className="message-card">
                    <div className="message-header">
                      <h3>Support Capitune</h3>
                    </div>
                    <p className="message-preview">Merci d'avoir choisi Capitune Pro...</p>
                    <p className="message-time">Hier à 10:15</p>
                  </div>

                  <button className="btn-message">
                    <i className="fas fa-edit"></i> Nouveau Message
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'profil' && (
              <div className="dashboard-section">
                <div className="section-title">
                  <i className="fas fa-user-circle"></i>
                  Mon Profil
                </div>
                <div className="profile-container">
                  <div className="profile-card">
                    <div className="profile-header">
                      <i className="fas fa-user-circle fa-5x"></i>
                      <div className="profile-info">
                        <h2>{user.email}</h2>
                        <p>Candidat</p>
                      </div>
                    </div>

                    <div className="profile-section">
                      <h4>Informations Personnelles</h4>
                      <button className="btn-edit">
                        <i className="fas fa-edit"></i> Modifier
                      </button>
                    </div>

                    <div className="profile-section">
                      <h4>Paramètres de Sécurité</h4>
                      <button className="btn-edit">
                        <i className="fas fa-lock"></i> Changer mot de passe
                      </button>
                    </div>

                    <div className="profile-section">
                      <h4>Compte</h4>
                      <button className="btn-logout" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="bottom-nav">
          <button
            className={`nav-bubble ${activeTab === 'projets' ? 'active' : ''}`}
            onClick={() => setActiveTab('projets')}
            title="Mes Projets"
          >
            <i className="fas fa-folder-open"></i>
            <span>Projets</span>
          </button>

          <button
            className={`nav-bubble ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
            title="Documents"
          >
            <i className="fas fa-file-alt"></i>
            <span>Documents</span>
          </button>

          <button
            className={`nav-bubble inside-btn ${activeTab === 'inside' ? 'active' : ''}`}
            onClick={() => {
              setShowInsideOptions(!showInsideOptions);
              setActiveTab('inside');
            }}
            title="Inside"
          >
            <i className="fas fa-plus"></i>
            <span>Créer</span>
          </button>

          <div className={`inside-options ${showInsideOptions ? 'show' : ''}`}>
            <button onClick={() => { setActiveTab('inside'); setShowInsideOptions(false); }}>
              <i className="fas fa-users"></i> Inside
            </button>
            <button onClick={() => { setActiveTab('inside'); setShowInsideOptions(false); }}>
              <i className="fas fa-bullhorn"></i> Publier
            </button>
          </div>

          <button
            className={`nav-bubble ${activeTab === 'messagerie' ? 'active' : ''}`}
            onClick={() => setActiveTab('messagerie')}
            title="Messagerie"
          >
            <i className="fas fa-envelope"></i>
            <span>Messages</span>
          </button>

          <button
            className={`nav-bubble ${activeTab === 'profil' ? 'active' : ''}`}
            onClick={() => setActiveTab('profil')}
            title="Mon Profil"
          >
            <i className="fas fa-user-circle"></i>
            <span>Profil</span>
          </button>
        </nav>

        {/* Floating Chat Bubble */}
        <button className="floating-chat-btn" title="Chat">
          <i className="fas fa-comments"></i>
        </button>

        {/* Floating Profile Bubble */}
        <button className="profile-bubble" title="Profil" onClick={handleSettings}>
          <i className="fas fa-user-circle"></i>
        </button>
      </div>

      <style jsx>{`
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          margin-top: 20px;
        }

        .project-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          cursor: pointer;
        }

        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(255, 148, 8, 0.15);
          border-color: #ff9408;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .project-header h3 {
          color: #1F386E;
          font-size: 1.1rem;
          margin: 0;
        }

        .project-status {
          background: linear-gradient(135deg, #ff9408 0%, #ff7c00 100%);
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .project-status.pending {
          background: #ffd700;
          color: #333;
        }

        .project-description {
          color: #666;
          font-size: 0.9rem;
          margin: 10px 0 15px 0;
        }

        .progress-bar {
          background: #e0e0e0;
          height: 8px;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          background: linear-gradient(90deg, #ff9408 0%, #ff7c00 100%);
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.85rem;
          color: #888;
          margin: 0;
        }

        .btn-new-project {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #ff9408 0%, #ff7c00 100%);
          color: white;
          border: none;
          padding: 20px;
          border-radius: 15px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-new-project:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(255, 148, 8, 0.3);
        }

        .inside-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
        }

        .inside-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .card-header {
          border-bottom: 2px solid #ff9408;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }

        .card-header h3 {
          color: #1F386E;
          margin: 0;
        }

        .question-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .question-item {
          padding: 15px;
          background: #f5f7fa;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .question-item:hover {
          background: linear-gradient(135deg, rgba(255, 148, 8, 0.1) 0%, rgba(255, 148, 8, 0.05) 100%);
        }

        .question-item p {
          margin: 5px 0;
          color: #333;
        }

        .question-meta {
          font-size: 0.85rem;
          color: #888 !important;
        }

        .btn-inside {
          width: 100%;
          background: linear-gradient(135deg, #ff9408 0%, #ff7c00 100%);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-inside:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 148, 8, 0.3);
        }

        .documents-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .doc-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid #e0e0e0;
        }

        .doc-card:hover {
          border-color: #ff9408;
          box-shadow: 0 8px 20px rgba(255, 148, 8, 0.15);
          transform: translateY(-5px);
        }

        .doc-card.empty {
          opacity: 0.6;
        }

        .doc-header {
          margin-bottom: 15px;
        }

        .doc-header i {
          font-size: 2.5rem;
          color: #ff9408;
          margin-bottom: 10px;
        }

        .doc-header h3 {
          color: #1F386E;
          margin: 10px 0 0 0;
          font-size: 0.95rem;
        }

        .doc-status {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .doc-status.valid {
          background: #d4edda;
          color: #155724;
        }

        .doc-status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .doc-status.missing {
          background: #f8d7da;
          color: #721c24;
        }

        .btn-upload {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #ff9408 0%, #ff7c00 100%);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-upload:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 148, 8, 0.3);
        }

        .messaging-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .message-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border-left: 4px solid #ff9408;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .message-card:hover {
          box-shadow: 0 8px 20px rgba(255, 148, 8, 0.15);
          transform: translateX(5px);
        }

        .message-header h3 {
          color: #1F386E;
          margin: 0 0 10px 0;
        }

        .message-preview {
          color: #666;
          margin: 10px 0;
          font-size: 0.95rem;
        }

        .message-time {
          font-size: 0.85rem;
          color: #999;
          margin: 0;
        }

        .btn-message {
          background: linear-gradient(135deg, #ff9408 0%, #ff7c00 100%);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-message:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 148, 8, 0.3);
        }

        .profile-container {
          max-width: 600px;
        }

        .profile-card {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .profile-header {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 2px solid #ff9408;
          align-items: center;
        }

        .profile-header i {
          color: #ff9408;
        }

        .profile-info h2 {
          color: #1F386E;
          margin: 0 0 5px 0;
        }

        .profile-info p {
          color: #888;
          margin: 0;
        }

        .profile-section {
          margin-bottom: 25px;
          padding-bottom: 25px;
          border-bottom: 1px solid #e0e0e0;
        }

        .profile-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .profile-section h4 {
          color: #1F386E;
          margin: 0 0 15px 0;
        }

        .btn-edit,
        .btn-logout {
          background: linear-gradient(135deg, #ff9408 0%, #ff7c00 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-edit:hover,
        .btn-logout:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(255, 148, 8, 0.3);
        }

        .btn-logout {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        .btn-logout:hover {
          box-shadow: 0 6px 15px rgba(220, 53, 69, 0.3);
        }
      `}</style>
    </>
  );
}
