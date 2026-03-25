import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import styles from '../styles/inside.module.css';

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

// Données mock
const MOCK_STORIES = [
  { id: 1, name: 'Marc Dubois', title: 'Avocat Immigration', avatar: 'MD', verified: true },
  { id: 2, name: 'Sophie Laurent', title: 'Consultant CRIC', avatar: 'SL', verified: true },
  { id: 3, name: 'Pierre Martin', title: 'Expert Permis', avatar: 'PM', verified: true },
  { id: 4, name: 'Marie Rousseau', title: 'Conseillère', avatar: 'MR', verified: true },
];

const MOCK_POSTS = [
  {
    id: 1,
    author: 'Marc Dubois',
    avatar: 'MD',
    title: 'Avocat Immigration',
    verified: true,
    date: '2 heures',
    content: 'Les délais de traitement pour Entrée Express sont actuellement entre 6-8 mois. Voici les critères essentiels à respecter...',
    image: null,
    category: '#EntreeExpress',
    likes: 342,
    comments: 28,
    shares: 67,
    saved: false,
    liked: false
  },
  {
    id: 2,
    author: 'Sophie Laurent',
    avatar: 'SL',
    title: 'Consultant CRIC',
    verified: true,
    date: '5 heures',
    content: 'Nouvelle mise à jour des provinces: l\'Ontario accélère les demandes de Permis d\'études pour 2024. Documents requis et délais...',
    image: null,
    category: '#PermisEtudes',
    likes: 198,
    comments: 43,
    shares: 52,
    saved: false,
    liked: false
  },
  {
    id: 3,
    author: 'Pierre Martin',
    avatar: 'PM',
    title: 'Expert Permis',
    verified: true,
    date: '1 jour',
    content: 'Guide complet: Les 5 erreurs les plus courantes dans les demandes d\'immigration et comment les éviter',
    image: null,
    category: '#ConseilsExpert',
    likes: 567,
    comments: 89,
    shares: 134,
    saved: false,
    liked: false
  },
];

const MOCK_EVENTS = [
  { id: 1, title: 'Webinaire: Entrée Express', date: '28 mars 2026', time: '19:00', attendees: 342 },
  { id: 2, title: 'Atelier Permis d\'études', date: '30 mars 2026', time: '18:00', attendees: 156 },
];

const MOCK_RESOURCES = [
  { id: 1, title: 'Guide Officiel IRCC', link: '#', type: 'Document' },
  { id: 2, title: 'Checklist Entrée Express', link: '#', type: 'Outil' },
  { id: 3, title: 'FAQ Permis d\'études', link: '#', type: 'Document' },
];

const CATEGORIES = ['#Tous', '#EntreeExpress', '#PermisEtudes', '#ResidencePermanente', '#ConseilsExpert'];

export default function Inside() {
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('#Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [selectedStory, setSelectedStory] = useState(null);
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

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, saved: !post.saved };
      }
      return post;
    }));
  };

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.author,
        text: post.content,
        url: window.location.href
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === '#Tous' || post.category === activeCategory;
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!user) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  return (
    <>
      <Head>
        <title>Capitune Inside - Communauté d'Immigration</title>
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
              <h1>Inside</h1>
            </div>

            <div className="dashboard-header-right">
              <button className="settings-btn" onClick={() => router.push('/dashboard-client')} title="Retour au tableau de bord">
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-inner" style={{ width: '100%', padding: '0', background: 'none' }}>
            <div className={styles.insideContainer}>
              {/* Header Inside */}
              <div className={styles.header} style={{ position: 'relative', top: '0', borderBottom: 'none', boxShadow: 'none', background: 'transparent', padding: '0' }}>
                <div className={styles.headerContent}>
                  <div className={styles.headerLeft}>
                    <h1 className={styles.logo}>INSIDE</h1>
                    <p className={styles.tagline}>Communauté Capitune</p>
                  </div>

                  <div className={styles.searchBar}>
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Chercher un expert ou un sujet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className={styles.headerRight}>
                    <button className={styles.notificationBtn}>
                      <i className="fas fa-bell"></i>
                      <span className={styles.badge}>3</span>
                    </button>
                    <button className={styles.profileBtn}>
                      <i className="fas fa-user-circle"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.mainContent}>
                {/* Colonne Gauche - Filtres */}
                <aside className={styles.sidebar}>
                  <div className={styles.filterSection}>
                    <h3>Filtres</h3>
                    <div className={styles.categoryList}>
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
                          onClick={() => setActiveCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.resourcesSection}>
                    <h3><i className="fas fa-link"></i> Ressources IRCC</h3>
                    <div className={styles.resourcesList}>
                      {MOCK_RESOURCES.map(resource => (
                        <a key={resource.id} href={resource.link} className={styles.resourceItem}>
                          <div className={styles.resourceIcon}>
                            <i className="fas fa-file-pdf"></i>
                          </div>
                          <div className={styles.resourceInfo}>
                            <p className={styles.resourceTitle}>{resource.title}</p>
                            <span className={styles.resourceType}>{resource.type}</span>
                          </div>
                          <i className="fas fa-arrow-right"></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Colonne Centrale - Feed */}
                <main className={styles.feed}>
                  {/* Stories */}
                  <div className={styles.storiesContainer}>
                    <h3 className={styles.storiesTitle}>Histoires Professionnelles</h3>
                    <div className={styles.storiesList}>
                      {MOCK_STORIES.map(story => (
                        <button
                          key={story.id}
                          className={`${styles.storyBubble} ${selectedStory?.id === story.id ? styles.active : ''}`}
                          onClick={() => setSelectedStory(story)}
                        >
                          <div className={styles.storyAvatar}>{story.avatar}</div>
                          {story.verified && <i className={`fas fa-check-circle ${styles.verified}`}></i>}
                          <p className={styles.storyName}>{story.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Posts */}
                  <div className={styles.postsList}>
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map(post => (
                        <article key={post.id} className={styles.post}>
                          <div className={styles.postHeader}>
                            <div className={styles.postAuthor}>
                              <div className={styles.postAvatar}>{post.avatar}</div>
                              <div className={styles.authorInfo}>
                                <h4 className={styles.authorName}>
                                  {post.author}
                                  {post.verified && <i className={`fas fa-check-circle ${styles.verifiedBadge}`}></i>}
                                </h4>
                                <p className={styles.authorTitle}>{post.title}</p>
                                <span className={styles.postDate}>{post.date}</span>
                              </div>
                            </div>
                            <button className={styles.menuBtn}>
                              <i className="fas fa-ellipsis-v"></i>
                            </button>
                          </div>

                          <div className={styles.postContent}>
                            <p>{post.content}</p>
                            {post.image && <img src={post.image} alt="Post" className={styles.postImage} />}
                            <div className={styles.postCategory}>{post.category}</div>
                          </div>

                          <div className={styles.postStats}>
                            <span><i className="fas fa-heart"></i> {post.likes}</span>
                            <span><i className="fas fa-comment"></i> {post.comments}</span>
                            <span><i className="fas fa-share"></i> {post.shares}</span>
                          </div>

                          <div className={styles.postActions}>
                            <button className={`${styles.actionBtn} ${post.liked ? styles.liked : ''}`} onClick={() => handleLike(post.id)}>
                              <i className={`fas fa-heart${post.liked ? '' : '-o'}`}></i> J'aime
                            </button>
                            <button className={styles.actionBtn}>
                              <i className="fas fa-comment"></i> Commenter
                            </button>
                            <button className={styles.actionBtn} onClick={() => handleShare(post)}>
                              <i className="fas fa-share"></i> Partager
                            </button>
                            <button className={`${styles.actionBtn} ${post.saved ? styles.saved : ''}`} onClick={() => handleSave(post.id)}>
                              <i className={`fas fa-bookmark${post.saved ? '' : '-o'}`}></i> Enregistrer
                            </button>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className={styles.noResults}>
                        <i className="fas fa-inbox"></i>
                        <p>Aucune publication trouvée</p>
                      </div>
                    )}
                  </div>
                </main>

                {/* Colonne Droite - Widgets */}
                <aside className={styles.widgets}>
                  <div className={styles.widget}>
                    <h3><i className="fas fa-calendar"></i> Prochains Événements</h3>
                    <div className={styles.eventsList}>
                      {MOCK_EVENTS.map(event => (
                        <div key={event.id} className={styles.eventItem}>
                          <div className={styles.eventDate}>{event.date}</div>
                          <p className={styles.eventTitle}>{event.title}</p>
                          <p className={styles.eventTime}><i className="fas fa-clock"></i> {event.time}</p>
                          <p className={styles.eventAttendees}><i className="fas fa-users"></i> {event.attendees} inscrits</p>
                          <button className={styles.eventBtn}>S'inscrire</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.widget}>
                    <h3><i className="fas fa-star"></i> Partenaires</h3>
                    <div className={styles.partnersList}>
                      <div className={styles.partnerCard}>
                        <div className={styles.partnerLogo}>🏫</div>
                        <h4>Université de Toronto</h4>
                        <p>Offres de bourses</p>
                        <button className={styles.partnerBtn}>Découvrir</button>
                      </div>
                      <div className={styles.partnerCard}>
                        <div className={styles.partnerLogo}>🏨</div>
                        <h4>Booking.com</h4>
                        <p>Réductions logement</p>
                        <button className={styles.partnerBtn}>Découvrir</button>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>

        <nav className="bottom-nav">
          <button className="nav-bubble" onClick={() => router.push('/dashboard-client') } title="Projets"><i className="fas fa-folder-open"></i><span>Projets</span></button>
          <button className="nav-bubble" onClick={() => router.push('/dashboard-client?tab=documents')} title="Docs"><i className="fas fa-file-alt"></i><span>Documents</span></button>
          <button className="nav-bubble inside-btn active" title="Inside"><i className="fas fa-users"></i><span>Inside</span></button>
          <button className="nav-bubble" onClick={() => router.push('/dashboard-client?tab=messagerie')} title="Messagerie"><i className="fas fa-envelope"></i><span>Messages</span></button>
          <button className="nav-bubble" onClick={() => router.push('/dashboard-client?tab=profil')} title="Profil"><i className="fas fa-user-circle"></i><span>Profil</span></button>
        </nav>

        <button className="floating-chat-btn" title="Chat"><i className="fas fa-comments"></i></button>

        <button className="profile-bubble" title="Profil" onClick={() => router.push('/dashboard-client?tab=profil')}>
          <i className="fas fa-user-circle"></i>
        </button>
      </div>
    </>
  );
}
