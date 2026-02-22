import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, Globe, Code2, Heart, ChevronLeft } from 'lucide-react';

export default function DeveloperSection() {
  const navigate = useNavigate();
  window.scrollTo(0, 0);

  // 🔹 ADD YOUR TEAM DETAILS HERE
  const developers = [
    {
      id: 1,
      name: "SAGNIK BANERJEE",
      role: "Full-Stack Developer",
      bio: "Passionate about building scalable ed-tech solutions and crafting intuitive user experiences.",
      image: "https://res.cloudinary.com/du3l9swv0/image/upload/v1771664999/eshiksha_submissions/sub-1771664998555-WhatsApp%20Image%202026-02-21%20at%202.jpg", 
    
      linkedin: "https://www.linkedin.com/in/sagnik-banerjee-74a96a319/",
      email: "ersagnikbanerjee@gmail.com"
    },
    {
      id: 2,
      name: "NAIRITH ANAND MALLICK",
      role: "Full-Stack Developer",
      bio: "Expert in database architecture, API design, and ensuring secure real-time communication.",
      image: "https://res.cloudinary.com/du3l9swv0/image/upload/v1771664798/eshiksha_submissions/sub-1771664798500-WhatsApp%20Image%202026-02-21%20at%201.jpg",
    
      linkedin: "https://www.linkedin.com/in/nairithanandmallick/?originalSubdomain=in",
      email: "nairithmallick2006@gmail.com"
    }
  ];

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 300, damping: 24 } 
    }
  };

  return (
    <div className="dev-wrapper">
      <style>{`
        :root {
          --bg-color: #0b0f19;
          --card-bg: rgba(15, 23, 42, 0.7);
          --card-border: rgba(255, 255, 255, 0.1);
          --theme-color: #38bdf8;
          --theme-glow: rgba(56, 189, 248, 0.4);
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
        }

        .dev-wrapper {
          min-height: 100vh;
          background-color: var(--bg-color);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 80px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Subtle Background Glows */
        .ambient-glow-1 {
          position: absolute; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
          top: -100px; left: -200px; border-radius: 50%; filter: blur(80px); pointer-events: none;
        }
        .ambient-glow-2 {
          position: absolute; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
          bottom: -100px; right: -100px; border-radius: 50%; filter: blur(80px); pointer-events: none;
        }

        /* 🔹 BACK BUTTON STYLES 🔹 */
        .back-btn {
          position: absolute;
          top: 30px;
          left: 30px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          padding: 10px 18px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          z-index: 100;
        }

        .back-btn:hover {
          background: rgba(56, 189, 248, 0.1);
          border-color: rgba(56, 189, 248, 0.4);
          color: var(--theme-color);
          transform: translateX(-4px);
        }

        .header-container {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 10;
        }

        .dev-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          color: var(--theme-color);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .dev-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 15px 0;
          line-height: 1.2;
        }

        .dev-title span {
          background: linear-gradient(to right, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dev-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* 🔹 REDESIGNED GRID FOR IMAGE-BG CARDS 🔹 */
        .dev-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
          width: 100%;
          max-width: 900px; /* Kept slightly tighter for 2 cards */
          position: relative;
          z-index: 10;
        }

        /* 🔹 NEW IMAGE BG CARD 🔹 */
        .dev-card {
          position: relative;
          height: 480px;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end; /* Pushes content to bottom */
        }

        .dev-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px -15px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.3);
          border-color: rgba(56, 189, 248, 0.4);
        }

        /* The actual background image layer */
        .dev-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 1;
          transition: transform 0.6s ease;
        }
        
        /* Slight zoom on hover for a premium feel */
        .dev-card:hover .dev-card-bg {
          transform: scale(1.05);
        }

        /* Dark gradient overlay so text is readable */
        .dev-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom, 
            rgba(11, 15, 25, 0.1) 0%, 
            rgba(11, 15, 25, 0.6) 40%, 
            rgba(11, 15, 25, 0.95) 100%
          );
          z-index: 2;
        }

        /* Content Container sitting above image/overlay */
        .dev-card-content {
          position: relative;
          z-index: 3;
          padding: 30px;
          text-align: left; /* Aligned left for a modern magazine look */
        }

        .dev-name {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 6px 0;
          letter-spacing: -0.5px;
        }

        .dev-role {
          font-size: 0.85rem;
          color: var(--theme-color);
          font-weight: 700;
          margin: 0 0 15px 0;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .dev-bio {
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3; /* Limits bio to 3 lines */
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Social Links */
        .social-links {
          display: flex;
          gap: 12px;
          width: 100%;
          padding-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .social-icon:hover {
          background: var(--theme-color);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(56, 189, 248, 0.4);
        }

        @media (max-width: 768px) {
          .dev-wrapper { padding: 80px 15px 40px; } 
          .back-btn { top: 15px; left: 15px; padding: 8px 14px; font-size: 0.85rem; }
          .dev-card { height: 420px; } /* Slightly shorter on mobile */
        }
      `}</style>

      {/* Background Ambience */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* 🔹 THE BACK BUTTON 🔹 */}
      <button className="back-btn" onClick={() => navigate('/')}>
        <ChevronLeft size={18} /> Home
      </button>

      <motion.div 
        className="header-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="dev-badge">
          <Code2 size={16} /> eShiksha Architects
        </div>
        <h1 className="dev-title">Meet the <span>Developers</span></h1>
        <p className="dev-subtitle">
          The passionate minds behind eShiksha, dedicated to bridging the gap between technology and modern education.
        </p>
      </motion.div>

      <motion.div 
        className="dev-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {developers.map((dev) => (
          <motion.div key={dev.id} className="dev-card" variants={cardVariants}>
            
            {/* 🔹 THE IMAGE BACKGROUND 🔹 */}
            <div 
              className="dev-card-bg" 
              style={{ backgroundImage: `url(${dev.image})` }}
            />
            {/* The darkening gradient over the image */}
            <div className="dev-card-overlay" />

            {/* 🔹 THE CONTENT OVERLAY 🔹 */}
            <div className="dev-card-content">
              <h2 className="dev-name">{dev.name}</h2>
              <h3 className="dev-role">{dev.role}</h3>
              <p className="dev-bio">{dev.bio}</p>
              
              <div className="social-links">
                {dev.github && (
                  <a href={dev.github} target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub">
                    <Github size={18} />
                  </a>
                )}
                {dev.linkedin && (
                  <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                )}
                {dev.twitter && (
                  <a href={dev.twitter} target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">
                    <Twitter size={18} />
                  </a>
                )}
                {dev.portfolio && (
                  <a href={dev.portfolio} target="_blank" rel="noopener noreferrer" className="social-icon" title="Portfolio">
                    <Globe size={18} />
                  </a>
                )}
                {dev.email && (
                  <a href={dev.email} className="social-icon" title="Email">
                    <Mail size={18} />
                  </a>
                )}
              </div>
            </div>

          </motion.div>
        ))}
      </motion.div>

      {/* Footer note */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ marginTop: '60px', color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}
      >
        Built with <Heart size={16} color="#ef4444" fill="#ef4444" /> for modern education
      </motion.div>

    </div>
  );

}
