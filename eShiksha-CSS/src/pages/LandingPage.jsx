import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api'; 
import { 
  ChevronRight, Rocket, Sparkles, Heart, 
  Users, Activity, Code2 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const [userStats, setUserStats] = useState({ totalUsers: 0, studentCount: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  
  const { t } = useLanguage(); 

  const content = {
    version: { en: "ONLINE", pa: "ਲਾਈਵ", hi: "ऑनलाइन", bn: "অনলাইন" },
    active: { en: "Total Users", pa: "ਕੁੱਲ ਵਰਤੋਂਕਾਰ", hi: "कुल उपयोगकर्ता", bn: "মোট ব্যবহারকারী" },
    online: { en: "Students", pa: "ਵਿਦਿਆਰਥੀ", hi: "छात्र", bn: "ছাত্ররা" },
    titleStart: { en: "After School Learning With", pa: "ਹੁਨਰ ਸਿੱਖੋ", hi: "स्कूल के बाद सीखें", bn: "স্কুল পরবর্তী শিক্ষা" },
    titleEnd: { en: "eShiksha", pa: "ਸਿੱਖਿਆ ਨਾਲ", hi: "ई-शिक्षा के साथ", bn: "ই-শিক্ষার সাথে" },
    subtitle: { en: "The ultimate after-school companion.", pa: "ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਦਾ ਸਾਥੀ।", hi: "आपका बेहतरीन स्टडी पार्टनर।", bn: "আপনার সেরা স্টাডি পার্টনার।" },
    subtitle2: { en: "Level up your grades with practice", pa: "AI ਨਾਲ ਗ੍ਰੇਡ ਸੁਧਾਰੋ।", hi: "अभ्यास से ग्रेड सुधारें", bn: "অনুশীলন করে গ্রেড বাড়ান" },
    stu_portal: { en: "Student Zone", pa: "ਵਿਦਿਆਰਥੀ", hi: "छात्र ज़ोन", bn: "ছাত্র জোন" },
    stu_desc: { en: "Quizzes, Homework & AI Help", pa: "ਕਵਿਜ਼ ਅਤੇ ਹੋਮਵਰਕ", hi: "क्विज़, होमवर्क और AI मदद", bn: "কুইজ, হোমওয়ার্ক এবং AI" },
    teach_portal: { en: "Mentor Hub", pa: "ਅਧਿਆਪਕ", hi: "शिक्षक केंद्र", bn: "মেন্টর হাব" },
    teach_desc: { en: "Track & Guide Progress", pa: "ਤਰੱਕੀ ਟ੍ਰੈਕ ਕਰੋ", hi: "प्रगति ट्रैक करें", bn: "অগ্রগতি ট্র্যাক করুন" },
    parent_portal: { en: "Parent View", pa: "ਮਾਪੇ", hi: "अभिभावक", bn: "অভিভাবক" },
    parent_desc: { en: "Monitor Daily Growth", pa: "ਰੋਜ਼ਾਨਾ ਵਿਕਾਸ ਦੇਖੋ", hi: "दैनिक विकास देखें", bn: "দৈনিক গ্রোথ দেখুন" },
    enter: { en: "Enter Portal", pa: "ਦਾਖਲ ਹੋਵੋ", hi: "पोर्टल खोलें", bn: "प्रবেশ করুন" }
  };

  // Safe scroll-to-top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/stats');
        setUserStats({
          totalUsers: res.data?.totalUsers ?? 0,
          studentCount: res.data?.studentCount ?? 0,
        });
      } catch (err) {
        console.error('Failed to fetch user stats', err);
      } finally {
        setTimeout(() => setStatsLoading(false), 600);
      }
    };
    fetchStats();
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 35 }).map(() => ({
      x: Math.random() * 100, 
      y: Math.random() * 100, 
      scale: Math.random() * 0.4 + 0.2,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      isThick: Math.random() > 0.7
    }));
  }, []);

  return (
    <div className="landing-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Space+Grotesk:wght@700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&family=Noto+Sans+Gurmukhi:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&display=swap');

        :root {
          --bg-color: #05020a;
          --primary: #7913a1;
          --secondary: #d400ff;
          
          --card-bg: rgba(51, 2, 62, 0.6);
          --card-border: rgba(255, 255, 255, 0.1);
          --card-shadow: 0 20px 40px -15px rgba(0,0,0,0.6);
          
          --text-main: #ffffff;
          --text-muted: #94a3b8;
          
          --pill-bg: rgba(255,255,255,0.05);
          --grid-color: rgba(255, 255, 255, 0.05);
          --particle-color: #ffffff; 
        }

        .landing-wrapper {
          min-height: 100dvh; 
          background-color: var(--bg-color);
          font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', 'Noto Sans Bengali', 'Noto Sans Gurmukhi', sans-serif;
          position: relative;
          color: var(--text-main);
          display: flex;
          flex-direction: column;
        }

        .background-trap {
          position: fixed;
          inset: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .loading-screen {
          position: fixed;
          inset: 0;
          background-color: var(--bg-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .grid-background {
          position: absolute; inset: -50%;
          width: 200%; height: 200%;
          background-image: 
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
          background-size: 50px 50px;
          transform: perspective(500px) rotateX(60deg);
          animation: planeMove 15s linear infinite;
          opacity: 0.6;
        }
        @keyframes planeMove { 0% { transform: perspective(500px) rotateX(60deg) translateY(0); } 100% { transform: perspective(500px) rotateX(60deg) translateY(50px); } }

        .glow-spot {
          position: absolute; width: 600px; height: 600px; border-radius: 50%;
          filter: blur(140px); animation: float 10s ease-in-out infinite;
        }
        .glow-1 { top: -100px; left: -100px; background: var(--primary); opacity: 0.2; }
        .glow-2 { bottom: -100px; right: -100px; background: var(--secondary); opacity: 0.2; animation-delay: 5s; }

        @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 50px); } }

        .glitter {
          position: absolute;
          background: var(--particle-color);
          border-radius: 50%;
          box-shadow: 0 0 4px white;
        }

        .container {
          position: relative; z-index: 2; max-width: 1200px; margin: 0 auto;
          padding: 2rem; display: flex; flex-direction: column; align-items: center;
          flex-grow: 1; width: 100%;
        }

        .header-row {
          width: 100%; display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 60px; flex-wrap: wrap; gap: 20px;
        }

        .version-pill {
          background: var(--pill-bg); border: 1px solid var(--card-border);
          padding: 8px 16px; border-radius: 30px;
          font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; color: var(--text-muted);
          display: flex; align-items: center; gap: 8px;
        }
        .dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 10px #4ade80; }

        .stats-group { display: flex; gap: 16px; flex-wrap: wrap; justify-content: flex-end; }
        .stat-card {
          position: relative; background: var(--card-bg); backdrop-filter: blur(12px);
          border-radius: 16px; padding: 10px 20px; min-width: 120px; text-align: center;
          border: 1px solid var(--card-border); overflow: hidden;
          transition: transform 0.3s ease; box-shadow: var(--card-shadow);
        }
        .stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--stat-color), transparent); opacity: 0.8;
        }
        .stat-card:hover { transform: translateY(-3px); }
        
        .stat-num { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--text-main); }
        .stat-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 600; margin-top: 2px; }

        .hero { text-align: center; margin-bottom: 60px; }
        .hero h1 {
          font-size: clamp(2.5rem, 8vw, 5rem); font-weight: 800; line-height: 1.15;
          margin-bottom: 20px; letter-spacing: -1.5px; color: var(--text-main);
        }
        .text-gradient {
          background: linear-gradient(135deg, #fff 30%, #94a3b8);
          -webkit-background-clip: text; color: transparent;
        }
        .highlight { color: var(--secondary); position: relative; display: inline-block; }
        .hero p {
          color: var(--text-muted); font-size: clamp(1rem, 3vw, 1.2rem); max-width: 600px;
          margin: 0 auto; line-height: 1.6;
        }

        .mobile-break { display: none; }

        .card-grid {
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px; 
          width: 100%;
        }

        .card-link-wrapper { text-decoration: none; display: block; height: 100%; }

        .portal-card {
          position: relative; background: var(--card-bg);
          border: 1px solid var(--card-border); border-radius: 24px; padding: 35px;
          transition: border-color 0.3s, box-shadow 0.3s;
          display: flex; flex-direction: column; height: 100%;
          backdrop-filter: blur(10px); box-shadow: var(--card-shadow);
        }

        .portal-card:hover {
          border-color: var(--theme-color);
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.5);
          z-index: 10;
        }

        .icon-box {
          width: 56px; height: 56px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 25px; font-size: 24px; transition: all 0.4s ease;
        }

        .student-theme { --theme-color: #38bdf8; }
        .student-theme .icon-box { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2); }
        .mentor-theme { --theme-color: #f59e0b; }
        .mentor-theme .icon-box { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
        .parent-theme { --theme-color: #10b981; }
        .parent-theme .icon-box { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }

        .portal-card:hover .icon-box { transform: scale(1.1) rotate(5deg); background: var(--theme-color); color: white; }

        .card-title { color: var(--text-main); font-size: 1.5rem; font-weight: 700; margin-bottom: 10px; }
        .card-desc { color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 30px; flex-grow: 1; }

        .action-row {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.85rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1px; color: var(--theme-color); transition: gap 0.2s;
        }
        .portal-card:hover .action-row { gap: 15px; }

        @media (max-width: 768px) {
          .container { padding: 1.5rem 1rem; }
          .header-row {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 40px;
          }
          .stats-group {
            width: 100%;
            justify-content: flex-start; 
          }
          .stat-card { flex: 1; }
          .hero { margin-bottom: 40px; }
          .mobile-break { display: block; } 
          .card-grid { gap: 20px; }
          .portal-card { padding: 25px; }
        }
      `}</style>

      <AnimatePresence>
        {statsLoading && (
          <motion.div 
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
          >
            <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
              <motion.div
                style={{
                  position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
                  border: '3px solid transparent',
                  borderTopColor: 'var(--primary)',
                  borderBottomColor: 'var(--secondary)',
                  boxShadow: '0 0 20px rgba(212, 0, 255, 0.4)'
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />

              <motion.div
                style={{
                  position: 'absolute', width: '65%', height: '65%', borderRadius: '50%',
                  border: '3px solid transparent',
                  borderLeftColor: '#38bdf8', 
                  borderRightColor: '#10b981',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <motion.div
                animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Rocket size={28} color="#ffffff" style={{ filter: 'drop-shadow(0px 0px 8px rgba(255,255,255,0.8))' }}/>
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '1px', margin: 0 }}
            >
              <span className="text-gradient">eShiksha</span>
            </motion.h2>
            
            <motion.p
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600 }}
            >
              Preparing Portal...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="background-trap">
        <div className="grid-background"></div>
        <div className="glow-spot glow-1"></div>
        <div className="glow-spot glow-2"></div>

        {!statsLoading && particles.map((p, i) => (
          <motion.div
            key={i}
            className="glitter"
            style={{ 
              left: `${p.x}vw`, 
              top: `${p.y}vh`,
              width: p.isThick ? '3px' : '1px', 
              height: p.isThick ? '3px' : '1px' 
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0, p.scale, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}
      </div>

      {!statsLoading && (
        <motion.div 
          className="container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* TOP ROW */}
          <div className="header-row">
            <div className="version-pill">
                <div className="dot"></div>
                {t(content.version)}
            </div>

            <div className="stats-group">
              <motion.div 
                className="stat-card"
                style={{ '--stat-color': '#3cff00' }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', opacity: 0.8 }}>
                  <Users size={16} color="#ffffff" />
                </div>
                <span className="stat-num">{userStats.totalUsers}</span>
                <span className="stat-label">{t(content.active)}</span>
              </motion.div>

              <motion.div 
                className="stat-card"
                style={{ '--stat-color': '#00ff04' }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', opacity: 0.8 }}>
                  <Activity size={16} color="#ffffff" />
                </div>
                <span className="stat-num">{userStats.studentCount}</span>
                <span className="stat-label">{t(content.online)}</span>
              </motion.div>
            </div>
          </div>

          {/* HERO SECTION */}
          <div className="hero">
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-gradient">{t(content.titleStart)}</span> <br />
              <span className="highlight">{t(content.titleEnd)}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {t(content.subtitle)} <br className="mobile-break"/> {t(content.subtitle2)}
            </motion.p>
          </div>

          {/* CARDS GRID */}
          <div className="card-grid">
            <Link to="/login?role=student" className="card-link-wrapper">
              <motion.div 
                className="portal-card student-theme"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              >
                <div className="icon-box"><Rocket size={28} /></div>
                <h2 className="card-title">{t(content.stu_portal)}</h2>
                <p className="card-desc">{t(content.stu_desc)}</p>
                <div className="action-row">{t(content.enter)} <ChevronRight size={16} /></div>
              </motion.div>
            </Link>

            <Link to="/login?role=teacher" className="card-link-wrapper">
              <motion.div 
                className="portal-card mentor-theme"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              >
                <div className="icon-box"><Sparkles size={28} /></div>
                <h2 className="card-title">{t(content.teach_portal)}</h2>
                <p className="card-desc">{t(content.teach_desc)}</p>
                <div className="action-row">{t(content.enter)} <ChevronRight size={16} /></div>
              </motion.div>
            </Link>

            <Link to="/login?role=parent" className="card-link-wrapper">
              <motion.div 
                className="portal-card parent-theme"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
              >
                <div className="icon-box"><Heart size={28} /></div>
                <h2 className="card-title">{t(content.parent_portal)}</h2>
                <p className="card-desc">{t(content.parent_desc)}</p>
                <div className="action-row">{t(content.enter)} <ChevronRight size={16} /></div>
              </motion.div>
            </Link>
          </div>
          
          {/* MEET THE DEVELOPERS BUTTON - Upgraded to Framer Motion! */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ marginTop: '60px', textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Link to="/developers" style={{ textDecoration: 'none' }}>
              <motion.button 
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: 'rgba(56, 189, 248, 0.1)', 
                  borderColor: 'rgba(56, 189, 248, 0.4)', 
                  color: '#38bdf8',
                  y: -3
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                }}
              >
                <Code2 size={18} />
                Meet the Developers
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
