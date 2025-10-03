import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import { 
  FaComments, 
  FaStethoscope, 
  FaPaperPlane, 
  FaUserCircle, 
  FaTrash 
} from "react-icons/fa";

const proContacts = [
  {
    id: 1,
    name: "Coach Salma",
    specialty: "Coach sportif",
    phone: "+212 600 123 456",
    email: "salma.coach@example.com",
  },
  {
    id: 2,
    name: "Dr. Amine",
    specialty: "Médecin généraliste",
    phone: "+212 611 987 654",
    email: "amine.doctor@example.com",
  },
  {
    id: 3,
    name: "Coach Youssef",
    specialty: "Coach nutrition",
    phone: "+212 622 555 789",
    email: "youssef.nutrition@example.com",
  },
];

const Community = () => {
  const location = useLocation();
  const storedName = localStorage.getItem("user_fullname") || "Utilisateur";
  const userFullName = storedName;

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [activeSection, setActiveSection] = useState("posts");

  // Charger les posts au montage du composant
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/posts/");
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to load posts", err);
      }
    };
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    try {
      const response = await axios.post("http://localhost:8000/posts/", {
        name: userFullName.split(" ")[0],
        message: newPost,
      });
      // Ajoute le nouveau post en tête de la liste
      setPosts([response.data, ...posts]);
      setNewPost("");
    } catch (error) {
      console.error("Post creation failed", error);
    }
  };

  const handleDelete = (id) => {
    // Ici tu peux aussi appeler ton backend pour supprimer le post en base
    setPosts(posts.filter((p) => p.id !== id));
  };

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + "/");

  return (
   
  <Layout title="Community">
     
      <main style={styles.mainContent}>
       

        <div style={styles.tabBar}>
          <button
            onClick={() => setActiveSection("posts")}
            style={{
              ...styles.tabButton,
              ...(activeSection === "posts" ? styles.tabActive : {}),
            }}
            aria-label="Afficher les publications"
          >
            <FaComments style={{ marginRight: 8 }} />
            Posts
          </button>
          <button
            onClick={() => setActiveSection("pro")}
            style={{
              ...styles.tabButton,
              ...(activeSection === "pro" ? styles.tabActive : {}),
            }}
            aria-label="Afficher les conseils professionnels"
          >
            <FaStethoscope style={{ marginRight: 8 }} />
            Conseils professionnels
          </button>
        </div>

        {activeSection === "posts" && (
          <>
            <p style={{ fontSize: 14, color: "#666" }}>
              {posts.length} publication{posts.length > 1 ? "s" : ""}
            </p>
            <section style={styles.cardsSection}>
              <div style={styles.card}>
                <textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  style={styles.textArea}
                  maxLength={300}
                  aria-label="Contenu du post"
                />
                <button onClick={handlePost} style={styles.postButton} aria-label="Poster">
                  <FaPaperPlane
                    style={{ marginRight: 10, fontSize: 18, transform: "rotate(15deg)" }}
                  />
                  Poster
                </button>
              </div>

              {posts.map((post) => (
                <div key={post.id} style={styles.postCard}>
                  <div style={styles.postHeader}>
                    <FaUserCircle size={26} color="#FF6F3C" style={{ marginRight: 14 }} />
                    <div>
                      <strong style={{ fontSize: 17 }}>{post.name}</strong>
                      <br />
                      <small style={{ fontSize: 13, color: "#888" }}>
                        {post.timestamp || "Il y a quelques instants"}
                      </small>
                    </div>
                    
                  </div>
                  <p style={styles.postMessage}>{post.message}</p>
                </div>
              ))}
            </section>
          </>
        )}

        {activeSection === "pro" && (
          <div style={styles.card}>
            <h3 style={{ marginBottom: 15, color: "#FF6F3C" }}>Conseils professionnels</h3>
            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.5 }}>
              Cette section est réservée aux coachs et médecins. Voici quelques conseils récents :
            </p>

            <div style={{ ...styles.infoBox, backgroundColor: "#e3f2fd", borderColor: "#90caf9" }}>
              <strong>Coach Salma :</strong>
              <p>Commencez par 20 min de marche rapide chaque jour. 💪</p>
            </div>
            <div style={{ ...styles.infoBox, backgroundColor: "#fce4ec", borderColor: "#f48fb1" }}>
              <strong>Dr. Amine :</strong>
              <p>Consultez un médecin avant de changer radicalement de régime.</p>
            </div>

            <h4 style={{ marginTop: 30, color: "#FF6F3C" }}>Contacts</h4>
            <ul style={styles.proContactList}>
              {proContacts.map(({ id, name, specialty, phone, email }) => (
                <li key={id} style={styles.proContactItem}>
                  <strong>{name}</strong> — <em>{specialty}</em>
                  <br />
                  📞 {phone} <br />
                  📧 <a href={`mailto:${email}`} style={styles.mailLink}>{email}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </Layout>
  );
};


const styles = {
  
  tabBar: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 25,
    gap: 20,
  },
  tabButton: {
    cursor: "pointer",
    padding: "10px 20px",
    fontWeight: "600",
    fontSize: 16,
    borderRadius: 25,
    border: "1.8px solid transparent",
    backgroundColor: "#fff",
    color: "#444",
    display: "flex",
    alignItems: "center",
    userSelect: "none",
    transition: "all 0.3s ease",
  },
  tabActive: {
    backgroundColor: "#FF6F3C",
    color: "#fff",
    borderColor: "#FF6F3C",
    boxShadow: "0 6px 15px rgba(255,111,60,0.6)",
  },
  cardsSection: {
    display: "flex",
    flexDirection: "column",
    gap: 25,
  },
  card: {
    background: "#fff",
    borderRadius: 15,
    padding: 30,
    boxShadow: "0 10px 20px rgba(255,111,60,0.15)",
    maxWidth: 700,
    margin: "0 auto",
  },
  textArea: {
    width: "100%",
    height: 80,
    resize: "none",
    padding: 12,
    fontSize: 16,
    borderRadius: 10,
    border: "1.8px solid #ccc",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.06)",
    marginBottom: 15,
  },
  postButton: {
    backgroundColor: "#FF6F3C",
    color: "#fff",
    border: "none",
    padding: "12px 30px",
    borderRadius: 25,
    fontWeight: "700",
    cursor: "pointer",
    fontSize: 16,
    boxShadow: "0 6px 15px rgba(255,111,60,0.6)",
    display: "flex",
    alignItems: "center",
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    boxShadow: "0 5px 12px rgba(0,0,0,0.06)",
    padding: 20,
    marginBottom: 20,
  },
  postHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },
  postMessage: {
    fontSize: 16,
    lineHeight: 1.4,
    margin: 0,
  },
  infoBox: {
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    border: "1.5px solid",
    color: "#333",
  },
  proContactList: {
    listStyle: "none",
    padding: 0,
    marginTop: 10,
  },
  proContactItem: {
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 1.3,
  },
  mailLink: {
    color: "#FF6F3C",
    textDecoration: "none",
  },
};

export default Community;
