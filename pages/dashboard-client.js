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

export default function DashboardClient() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([
    {
      id: '1',
      type: 'Permis d\'études',
      progress: 65,
      createdAt: new Date('2024-01-15'),
      status: 'En cours',
      description: 'Université de Toronto - Computer Science'
    },
    {
      id: '2',
      type: 'Demande de résidence',
      progress: 30,
      createdAt: new Date('2024-02-01'),
      status: 'En attente',
      description: 'Catégorie fédéral des travailleurs qualifiés'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadUserProjects(user.uid);
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserProjects = async (userId) => {
    try {
      const snapshot = await db.collection('projects').where('clientId', '==', userId).get();
      const userProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(userProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const logout = () => {
    auth.signOut();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tableau de Bord Client - Capitune Pro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: 'Montserrat, sans-serif', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
        {/* Header */}
        <nav style={{ background: '#1F386E', padding: '15px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'white', margin: 0, fontWeight: 'bold' }}>Capitune Pro - Client</h3>
            <button onClick={logout} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '8px 15px', borderRadius: '5px' }}>
              Déconnexion
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div style={{ padding: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#1F386E', marginBottom: '15px' }}>Projets Actifs</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F386E', marginBottom: '10px' }}>{projects.length}</div>
            </div>
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#1F386E', marginBottom: '15px' }}>Documents Soumis</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F386E', marginBottom: '10px' }}>12</div>
            </div>
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#1F386E', marginBottom: '15px' }}>Jours en Traitement</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F386E', marginBottom: '10px' }}>45</div>
            </div>
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#1F386E', marginBottom: '15px' }}>Étapes Complétées</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F386E', marginBottom: '10px' }}>2</div>
            </div>
          </div>

          {/* Projects List */}
          <h3 style={{ color: '#1F386E', marginBottom: '30px' }}>Mes Projets</h3>
          {projects.map(project => (
            <div key={project.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ color: '#1F386E', margin: 0 }}>{project.type}</h4>
                  <p style={{ margin: 0, color: '#666' }}>Soumis: {new Date(project.createdAt?.toDate()).toLocaleDateString('fr-FR')}</p>
                </div>
                <button style={{ background: '#1F386E', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px' }}>
                  Voir Détails
                </button>
              </div>
              <div style={{ background: '#e9ecef', borderRadius: '5px', height: '8px', marginBottom: '10px' }}>
                <div style={{ background: '#1F386E', height: '100%', borderRadius: '5px', width: `${project.progress || 0}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
