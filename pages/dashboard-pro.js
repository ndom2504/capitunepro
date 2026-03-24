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

export default function DashboardPro() {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadProfessionalData(user.uid);
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadProfessionalData = async (userId) => {
    try {
      // Load clients
      const clientsSnapshot = await db.collection('users').where('role', '==', 'client').get();
      const professionalClients = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(professionalClients);

      // Load appointments
      const appointmentsSnapshot = await db.collection('appointments').where('professionalId', '==', userId).get();
      const professionalAppointments = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(professionalAppointments);
    } catch (error) {
      console.error('Error loading professional data:', error);
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
        <title>Tableau de Bord Professionnel - Capitune Pro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: 'Montserrat, sans-serif', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
        {/* Header */}
        <nav style={{ background: '#1F386E', padding: '15px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'white', margin: 0, fontWeight: 'bold' }}>Capitune Pro - Professionnel</h3>
            <button onClick={logout} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '8px 15px', borderRadius: '5px' }}>
              Déconnexion
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div style={{ padding: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#1F386E', marginBottom: '15px' }}>Clients Actifs</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F386E', marginBottom: '10px' }}>{clients.length}</div>
            </div>
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#1F386E', marginBottom: '15px' }}>Projets en Cours</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F386E', marginBottom: '10px' }}>18</div>
            </div>
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#1F386E', marginBottom: '15px' }}>Taux de Succès</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F386E', marginBottom: '10px' }}>92%</div>
            </div>
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#1F386E', marginBottom: '15px' }}>Note Moyenne</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F386E', marginBottom: '10px' }}>4.8</div>
            </div>
          </div>

          {/* Clients List */}
          <h3 style={{ color: '#1F386E', marginBottom: '30px' }}>Clients Récents</h3>
          {clients.map(client => (
            <div key={client.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ color: '#1F386E', margin: 0 }}>{client.email}</h4>
                  <p style={{ margin: '5px 0', color: '#666' }}>Dernière activité: Il y a 2 heures</p>
                </div>
                <button style={{ background: '#1F386E', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px' }}>
                  Voir Profil
                </button>
              </div>
            </div>
          ))}

          {/* Appointments */}
          <h3 style={{ color: '#1F386E', marginBottom: '30px' }}>Rendez-vous Aujourd'hui</h3>
          {appointments.map(appointment => (
            <div key={appointment.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: '#1F386E', color: 'white', padding: '10px', borderRadius: '5px', textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>14:00</div>
                    <div style={{ fontSize: '0.8rem' }}>Aujourd'hui</div>
                  </div>
                  <div>
                    <h4 style={{ color: '#1F386E', margin: 0 }}>Consultation - {appointment.clientName}</h4>
                    <p style={{ margin: '5px 0', color: '#666' }}>{appointment.type}</p>
                    <p style={{ margin: 0, color: '#666' }}><i className="fas fa-video"></i> Visioconférence</p>
                  </div>
                </div>
                <button style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px' }}>
                  Rejoindre
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
