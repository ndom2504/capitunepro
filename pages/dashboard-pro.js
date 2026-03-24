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

export default function DashboardPro() {
  const [activeTab, setActiveTab] = useState('projets');
  const [user, setUser] = useState(null);
  const [showInsideOptions, setShowInsideOptions] = useState(false);
  const [clients, setClients] = useState([
    {
      id: '1',
      email: 'sophie.martin@email.com',
      status: 'Actif',
      projectType: 'Permis d\'études'
    },
    {
      id: '2',
      email: 'marc.bernard@email.com',
      status: 'Actif',
      projectType: 'Résidence permanente'
    }
  ]);
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      clientName: 'Sophie Martin',
      type: 'Consultation',
      status: 'Confirmé'
    }
  ]);
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
        <title>Dashboard Professionnel - Capitune Pro</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="dashboard-header-left">
              <img src="/asset/icon.svg" alt="Capitune Pro" title="Accueil" />
            </div>
            <div className="dashboard-header-center">
              <h1>Capitune Pro</h1>
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
                  <i className="fas fa-briefcase"></i>
                  Mes Clients et Projets
                </div>
                <div className="clients-grid">
                  <div className="client-card">
                    <div className="client-header">
                      <div>
                        <h3>Sophie Martin</h3>
                        <p className="client-email">sophie.martin@email.com</p>
                      </div>
                      <span className="project-badge">Permis d'études</span>
                    </div>
                    <p className="client-status active">✓ En accompagnement</p>
                    <button className="btn-client-action">Voir le dossier</button>
                  </div>

                  <div className="client-card">
                    <div className="client-header">
                      <div>
                        <h3>Marc Bernard</h3>
                        <p className="client-email">marc.bernard@email.com</p>
                      </div>
                      <span className="project-badge">Résidence permanente</span>
                    </div>
                    <p className="client-status active">✓ En accompagnement</p>
                    <button className="btn-client-action">Voir le dossier</button>
                  </div>

                  <button className="btn-add-client">
                    <i className="fas fa-user-plus"></i> Ajouter un Client
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'inside' && (
              <div className="dashboard-section">
                <div className="section-title">
                  <i className="fas fa-network-wired"></i>
                  Réseau Professionnel
                </div>
                <div className="network-container">
                  <div className="network-card">
                    <div className="card-header">
                      <h3>Professionnels Connectés</h3>
                    </div>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <div className="stat-number">24</div>
                        <p>Professionnels actifs</p>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">156</div>
                        <p>Projets en commun</p>
                      </div>
                    </div>
                  </div>

                  <div className="network-card">
                    <div className="card-header">
                      <h3>Forums et Discussions</h3>
                    </div>
                    <button className="btn-network">Participer aux discussions</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="dashboard-section">
                <div className="section-title">
                  <i className="fas fa-file-contract"></i>
                  Modèles et Documents
                </div>
                <div className="documents-template-container">
                  <div className="template-card">
                    <div className="template-header">
                      <i className="fas fa-file-word"></i>
                      <h3>Lettre de Recommandation</h3>
                    </div>
                    <p className="template-desc">Modèle officiel pour recommander vos clients</p>
                    <button className="btn-template">Télécharger</button>
                  </div>

                  <div className="template-card">
                    <div className="template-header">
                      <i className="fas fa-file-excel"></i>
                      <h3>Checklist Permis d'études</h3>
                    </div>
                    <p className="template-desc">Assurer le suivi de tous les documents</p>
                    <button className="btn-template">Télécharger</button>
                  </div>

                  <div className="template-card">
                    <div className="template-header">
                      <i className="fas fa-file-pdf"></i>
                      <h3>Guide Résidence Permanente</h3>
                    </div>
                    <p className="template-desc">Référence complète pour accompagner vos clients</p>
                    <button className="btn-template">Télécharger</button>
                  </div>

                  <button className="btn-upload-template">
                    <i className="fas fa-cloud-upload-alt"></i> Ajouter un Document
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'messagerie' && (
              <div className="dashboard-section">
                <div className="section-title">
                  <i className="fas fa-comments"></i>
                  Communications
                </div>
                <div className="messaging-pro-container">
                  <div className="conversation-card">
                    <div className="conversation-header">
                      <div className="avatar">SM</div>
                      <div className="conversation-info">
                        <h3>Sophie Martin</h3>
                        <p>Question sur la documentation requise</p>
                      </div>
                    </div>
                    <p className="conversation-time">Aujourd'hui à 10:30</p>
                  </div>

                  <div className="conversation-card">
                    <div className="conversation-header">
                      <div className="avatar">MB</div>
                      <div className="conversation-info">
                        <h3>Marc Bernard</h3>
                        <p>Merci pour votre aide précieuse</p>
                      </div>
                    </div>
                    <p className="conversation-time">Hier à 16:45</p>
                  </div>

                  <button className="btn-message-pro">
                    <i className="fas fa-envelope-open"></i> Ouvrir la Messagerie
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'profil' && (
              <div className="dashboard-section">
                <div className="section-title">
                  <i className="fas fa-user-check"></i>
                  Mon Profil Professionnel
                </div>
                <div className="profile-pro-container">
                  <div className="profile-pro-card">
                    <div className="profile-pro-header">
                      <i className="fas fa-user-circle fa-5x"></i>
                      <div className="profile-pro-info">
                        <h2>{user.email}</h2>
                        <p>Professionnel Agréé</p>
                      </div>
                    </div>

                    <div className="profile-pro-section">
                      <h4>Informations Professionnelles</h4>
                      <div className="info-grid">
                        <p><strong>Clients accompagnés:</strong> 5</p>
                        <p><strong>Taux de satisfaction:</strong> 4.8/5</p>
                      </div>
                      <button className="btn-edit-pro">
                        <i className="fas fa-edit"></i> Modifier mon profil
                      </button>
                    </div>

                    <div className="profile-pro-section">
                      <h4>Certifications</h4>
                      <button className="btn-edit-pro">
                        <i className="fas fa-certificate"></i> Gérer mes certifications
                      </button>
                    </div>

                    <div className="profile-pro-section">
                      <h4>Compte</h4>
                      <button className="btn-logout-pro" onClick={handleLogout}>
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
            <i className="fas fa-briefcase"></i>
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
            title="Réseau"
          >
            <i className="fas fa-plus"></i>
            <span>Créer</span>
          </button>

          <div className="inside-options" style={{ display: showInsideOptions ? 'block' : 'none' }}>
            <button onClick={() => { setActiveTab('inside'); setShowInsideOptions(false); }}>
              <i className="fas fa-network-wired"></i> Inside
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
            <i className="fas fa-comments"></i>
            <span>Messages</span>
          </button>

          <button
            className={`nav-bubble ${activeTab === 'profil' ? 'active' : ''}`}
            onClick={() => setActiveTab('profil')}
            title="Mon Profil"
          >
            <i className="fas fa-user-check"></i>
            <span>Profil</span>
          </button>
        </nav>
      </div>

      <style jsx>{`
        .clients-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          margin-top: 20px;
        }

        .client-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .client-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(255, 148, 8, 0.15);
          border-color: #ff9408;
        }

        .client-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .client-header h3 {
          color: #1F386E;
          font-size: 1.1rem;
          margin: 0;
        }

        .client-email {
          color: #888;
          font-size: 0.9rem;
          margin: 5px 0 0 0;
        }

        .project-badge {
          background: linear-gradient(135deg, #ff9408 0%, #ff7c00 100%);
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .client-status {
          color: #28a745;
          font-weight: 600;
          margin: 10px 0 15px 0;
        }

        .client-status.active {
          color: #28a745;
        }

        .btn-client-action {
          width: 100%;
          background: linear-gradient(135deg, #ff9408 0%, #ff7c00 100%);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-client-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(255, 148, 8, 0.3);
        }

        .btn-add-client {
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

        .btn-add-client:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(255, 148, 8, 0.3);
        }

        .network-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
        }

        .network-card {
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

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .stat-item {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, rgba(255, 148, 8, 0.1) 0%, rgba(255, 148, 8, 0.05) 100%);
          border-radius: 10px;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #ff9408;
          margin-bottom: 10px;
        }

        .btn-network {
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

        .btn-network:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 148, 8, 0.3);
        }

        .documents-template-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .template-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          text-align: center;
          transition: all 0.3s ease;
        }

        .template-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(255, 148, 8, 0.15);
        }

        .template-header {
          margin-bottom: 15px;
        }

        .template-header i {
          font-size: 3rem;
          color: #ff9408;
          margin-bottom: 10px;
        }

        .template-header h3 {
          color: #1F386E;
          margin: 10px 0 0 0;
          font-size: 1rem;
        }

        .template-desc {
          color: #666;
          font-size: 0.9rem;
          margin: 15px 0;
        }

        .btn-template {
          background: linear-gradient(135deg, #ff9408 0%, #ff7c00 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          width: 100%;
        }

        .btn-template:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(255, 148, 8, 0.3);
        }

        .btn-upload-template {
          grid-column: 1 / -1;
          background: white;
          border: 2px dashed #ff9408;
          color: #ff9408;
          padding: 20px;
          border-radius: 15px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-upload-template:hover {
          background: rgba(255, 148, 8, 0.1);
        }

        .messaging-pro-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .conversation-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border-left: 4px solid #ff9408;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .conversation-card:hover {
          box-shadow: 0 8px 20px rgba(255, 148, 8, 0.15);
          transform: translateX(5px);
        }

        .conversation-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
        }

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff9408 0%, #ff7c00 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .conversation-info h3 {
          color: #1F386E;
          margin: 0;
          font-size: 1rem;
        }

        .conversation-info p {
          color: #666;
          font-size: 0.9rem;
          margin: 5px 0 0 0;
        }

        .conversation-time {
          font-size: 0.85rem;
          color: #999;
          margin: 0;
          padding-left: 65px;
        }

        .btn-message-pro {
          background: linear-gradient(135deg, #ff9408 0%, #ff7c00 100%);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-message-pro:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 148, 8, 0.3);
        }

        .profile-pro-container {
          max-width: 700px;
        }

        .profile-pro-card {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .profile-pro-header {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 2px solid #ff9408;
          align-items: center;
        }

        .profile-pro-header i {
          color: #ff9408;
        }

        .profile-pro-info h2 {
          color: #1F386E;
          margin: 0 0 5px 0;
        }

        .profile-pro-info p {
          color: #888;
          margin: 0;
        }

        .profile-pro-section {
          margin-bottom: 25px;
          padding-bottom: 25px;
          border-bottom: 1px solid #e0e0e0;
        }

        .profile-pro-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .profile-pro-section h4 {
          color: #1F386E;
          margin: 0 0 15px 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }

        .info-grid p {
          color: #666;
          margin: 0;
        }

        .btn-edit-pro,
        .btn-logout-pro {
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

        .btn-edit-pro:hover,
        .btn-logout-pro:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(255, 148, 8, 0.3);
        }

        .btn-logout-pro {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        .btn-logout-pro:hover {
          box-shadow: 0 6px 15px rgba(220, 53, 69, 0.3);
        }
      `}</style>
    </>
  );
}
