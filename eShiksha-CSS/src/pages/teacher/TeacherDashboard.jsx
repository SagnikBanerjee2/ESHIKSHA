import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { 
  Home, Upload, FilePlus, Users, BarChart, 
  User, LogOut, KeyRound, ChevronDown, Trash2, CheckCircle, 
  X, Search, TrendingUp, Activity, Calendar, Globe, AlertCircle, Video, Film, CheckSquare, Bell,
  Clock, CornerUpLeft, Plus, ArrowRight, ArrowLeft, Layers, Eye, FileText, BookOpen, MessageCircle, Send
} from 'lucide-react';
import api from '../../api';
import OnlineStatusPill from '../../components/OnlineStatusPill';
import { useLanguage } from '../../context/LanguageContext';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('home'); 
  const [teacherUser, setTeacherUser] = useState(null);
  const [activeClass, setActiveClass] = useState('');
  const [homeStats, setHomeStats] = useState({
    totalStudents: 0,
    avgAttendance: null,
    avgScore: null,
  });

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [postingReply, setPostingReply] = useState(false);

  // TRANSLATIONS
  const content = {
    nav_home: { en: "Home", pa: "ਘਰ", hi: "होम", bn: "হোম" },
    nav_upload: { en: "Upload", pa: "ਅਪਲੋਡ", hi: "अपलोड", bn: "আপলোড" },
    nav_students: { en: "Students", pa: "ਵਿਦਿਆਰਥੀ", hi: "छात्र", bn: "ছাত্র" },
    nav_analytics: { en: "Analytics", pa: "ਅੰਕੜੇ", hi: "एनालिटिक्स", bn: "অ্যানালিটিক্স" },
    nav_updates: { en: "Updates", pa: "ਅੱਪਡੇਟ", hi: "अपडेट", bn: "আপডেট" },
    nav_doubts: { en: "Doubts", pa: "ਸ਼ੱਕ", hi: "संदेह", bn: "সন্দেহ" },
    nav_exams: { en: "Exams", pa: "ਪ੍ਰੀਖਿਆਵਾਂ", hi: "परीक्षाएं", bn: "পরীক্ষা" },
    nav_assign: { en: "Assignments", pa: "ਅਸਾਈਨਮੈਂਟ", hi: "असाइनमेंट", bn: "অ্যাসাইনমেন্ট" },
    nav_account: { en: "Account", pa: "ਖਾਤਾ", hi: "खाता", bn: "অ্যাকাউন্ট" },
    cmd_center: { en: "Command Center", pa: "ਕਮਾਂਡ ਸੈਂਟਰ", hi: "कमांड सेंटर", bn: "কমান্ড সেন্টার" },
    welcome: { en: "Welcome", pa: "ਜੀ ਆਇਆਂ ਨੂੰ", hi: "स्वागत है", bn: "স্বাগতম" },
    sel_cls_lbl: { en: "Select Active Class:", pa: "ਸਰਗਰਮ ਜਮਾਤ ਚੁਣੋ:", hi: "सक्रिय कक्षा चुनें:", bn: "সক্রিয় ক্লাস নির্বাচন করুন:" },
    sel_env_ph: { en: "Select Class", pa: "ਜਮਾਤ ਚੁਣੋ", hi: "कक्षा चुनें", bn: "ক্লাস নির্বাচন করুন" },
    live_ana: { en: "Live Analytics", pa: "ਲਾਈਵ ਅੰਕੜੇ", hi: "लाइव एनालिटिक्स", bn: "লাইভ অ্যানালিটিক্স" },
    tot_stu: { en: "Total Students", pa: "ਕੁੱਲ ਵਿਦਿਆਰਥੀ", hi: "कुल छात्र", bn: "মোট ছাত্র" },
    avg_att: { en: "Avg. Attendance", pa: "ਔਸਤ ਹਾਜ਼ਰੀ", hi: "औसत उपस्थिति", bn: "গড় উপস্থিতি" },
    avg_grow: { en: "Avg. Class Growth", pa: "ਔਸਤ ਜਮਾਤ ਵਿਕਾਸ", hi: "औसत कक्षा विकास", bn: "গড় ক্লাস বৃদ্ধি" },
    q_start: { en: "Quick Start", pa: "ਤੁਰੰਤ ਸ਼ੁਰੂਆਤ", hi: "त्वरित आरंभ", bn: "দ্রুত शुरू" },
    act_up: { en: "Upload Materials", pa: "ਸਮੱਗਰੀ ਅਪਲੋਡ ਕਰੋ", hi: "सामग्री अपलोड करें", bn: "उपकरण अपलोड करें" },
    desc_up: { en: "Notes & Quizzes", pa: "ਨੋਟਸ ਅਤੇ ਕਵਿਜ਼", hi: "नोट्स और क्विज़", bn: "নোট এবং কুইজ" },
    act_tsk: { en: "New Assignment", pa: "ਨਵੀਂ ਅਸਾਈਨਮੈਂਟ", hi: "नया असाइनमेंट", bn: "নতুন অ্যাসাইনমেন্ট" },
    desc_tsk: { en: "Homework portal", pa: "ਹੋਮਵਰਕ ਪੋਰਟਲ", hi: "होमवर्क पोर्टल", bn: "হোমওয়ার্ক পোর্টাল" },
    act_pst: { en: "Post Update", pa: "ਅੱਪਡੇਟ ਪੋਸਟ ਕਰੋ", hi: "अपडेट पोस्ट करें", bn: "আপডেট পোস্ট করুন" },
    desc_pst: { en: "Class announcements", pa: "ਜਮਾਤ ਐਲਾਨ", hi: "कक्षा घोषणाएं", bn: "ক্লাস ঘোষণা" },
    latest_dbt: { en: "Latest Doubts", pa: "ਨਵੀਨਤਮ ਸ਼ੱਕ", hi: "नवीनतम संदेह", bn: "সর্বশেষ সন্দেহ" },
    refresh: { en: "Refresh", pa: "ਰੀਫ੍ਰੈਸ਼", hi: "रिफ्रेश", bn: "রিফ্রেশ" },
    loading: { en: "Loading...", pa: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", hi: "लोड हो रहा है...", bn: "লোড হচ্ছে..." },
    no_dbts: { en: "No doubts have been posted yet.", pa: "ਅਜੇ ਕੋਈ ਸ਼ੱਕ ਪੋਸਟ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।", hi: "अभी तक कोई संदेह पोस्ट नहीं किया गया।", bn: "এখনও কোন সন্দেহ পোস্ট করা হয়নি।" },
    reply: { en: "Reply", pa: "ਜਵਾਬ ਦਿਓ", hi: "उत्तर दें", bn: "উত্তর দিন" },
    replying: { en: "Replying to", pa: "ਜਵਾਬ ਦਿੱਤਾ ਜਾ ਰਿਹਾ ਹੈ", hi: "उत्तर दिया जा रहा है", bn: "উত্তর দেওয়া হচ্ছে" },
    type_rep: { en: "Type your reply...", pa: "ਆਪਣਾ ਜਵਾਬ ਲਿਖੋ...", hi: "अपना उत्तर टाइप करें...", bn: "আপনার উত্তর লিখুন..." },
    cancel: { en: "Cancel", pa: "ਰੱਦ ਕਰੋ", hi: "रद्द करें", bn: "বাতিল করুন" },
    send_rep: { en: "Send Reply", pa: "ਜਵਾਬ ਭੇਜੋ", hi: "उत्तर भेजें", bn: "উত্তর পাঠান" },
    sending: { en: "Sending...", pa: "ਭੇਜ ਰਿਹਾ ਹੈ...", hi: "भेज रहा है...", bn: "পাঠানো হচ্ছে..." }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setTeacherUser(JSON.parse(stored));
    } catch {}
    const envClass = localStorage.getItem('teacherActiveClass');
    setActiveClass(envClass || '');
  }, []);

  useEffect(() => {
    if (!activeClass) {
      setHomeStats({ totalStudents: 0, avgAttendance: null, avgScore: null });
      return;
    }
    const fetchStats = async () => {
      try {
        const [userRes, progressRes] = await Promise.all([
          api.get('/users/stats/by-class', { params: { className: activeClass } }),
          api.get('/quizzes/class-progress', { params: { className: activeClass } }),
        ]);
        const totalStudents = userRes.data?.totalStudents ?? 0;
        const progress = progressRes.data || [];
        let avgAttendance = 0; let avgScore = 0;
        if (progress.length > 0) {
          avgAttendance = progress.reduce((acc, s) => acc + (s.attendancePercent || 0), 0) / progress.length;
          avgScore = progress.reduce((acc, s) => acc + (s.avgScore || 0), 0) / progress.length;
        }
        setHomeStats({ totalStudents, avgAttendance: Number(avgAttendance.toFixed(1)), avgScore: Number(avgScore.toFixed(1)) });
      } catch (err) { setHomeStats({ totalStudents: 0, avgAttendance: null, avgScore: null }); }
    };
    fetchStats();
  }, [activeClass]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getDisplayName = () => {
    if (teacherUser?.name && teacherUser.name !== 'Teacher') return teacherUser.name;
    if (teacherUser?.email) return teacherUser.email.split('@')[0];
    return 'Faculty';
  };

  const fetchNotifications = async () => {
    if (!activeClass) return;
    try {
      setNotifLoading(true); setNotifError('');
      const res = await api.get('/videos/comments/latest', { params: { className: activeClass, limit: 10 } });
      setNotifications(res.data || []);
    } catch (err) { setNotifError('Failed to load comments'); } finally { setNotifLoading(false); }
  };

  const handleToggleNotifications = () => {
    if (!activeClass) { alert("Please select a class first."); return; }
    setShowNotifications((prev) => {
      if (!prev) fetchNotifications();
      if (prev) { setReplyTarget(null); setReplyText(''); }
      return !prev;
    });
  };

  const handleReplySend = async () => {
    if (!replyTarget || !replyText.trim()) return;
    try {
      setPostingReply(true);
      await api.post(`/videos/${replyTarget.videoId}/comments`, {
        text: replyText.trim(), authorName: teacherUser?.name || 'Teacher', authorEmail: teacherUser?.email, role: 'teacher',
      });
      setReplyText(''); setReplyTarget(null); fetchNotifications();
    } catch (err) { alert('Failed to send reply'); } finally { setPostingReply(false); }
  };

  return (
    <div className="dashboard-wrapper">
      <style>{`
        :root { --bg-deep: #020617; --glass-surface: rgba(30, 41, 59, 0.6); --glass-border: rgba(255, 255, 255, 0.08); --primary-glow: #06b6d4; --accent-glow: #8b5cf6; --text-main: #f1f5f9; --text-muted: #94a3b8; }
        .dashboard-wrapper { height: 100vh; width: 100vw; background-color: var(--bg-deep); color: var(--text-main); font-family: 'Inter', sans-serif; display: flex; overflow: hidden; background-image: radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.08), transparent 40%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.08), transparent 40%); }
        
        /* SIDEBAR */
        .sidebar { width: 90px; height: 100vh; background: rgba(15, 23, 42, 0.9); border-right: 1px solid var(--glass-border); display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 2rem 0; backdrop-filter: blur(20px); z-index: 100; transition: all 0.3s ease; }
        .nav-group { display: flex; flex-direction: column; gap: 1.2rem; width: 100%; align-items: center; }

        @media (max-width: 768px) { 
          .dashboard-wrapper { flex-direction: column-reverse; } 
          .sidebar { width: 100vw; height: 75px; flex-direction: row; justify-content: space-evenly; align-items: center; padding: 0 10px; border-right: none; border-top: 1px solid var(--glass-border); position: fixed; bottom: 0; left: 0; background: rgba(2, 6, 23, 0.98); box-shadow: 0 -5px 20px rgba(0,0,0,0.5); }
          .nav-group { flex-direction: row; justify-content: space-evenly; gap: 0; width: 100%; }
        }
        
        .nav-icon-box { width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; transition: all 0.3s ease; position: relative; }
        .nav-icon-box:hover { background: rgba(255,255,255,0.05); color: white; transform: scale(1.1); }
        .nav-icon-box.active { background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05)); color: var(--accent-glow); border: 1px solid rgba(139, 92, 246, 0.4); box-shadow: 0 0 15px rgba(139, 92, 246, 0.25); }

        .main-content { flex: 1; height: 100vh; overflow-y: auto; padding: 2rem 3rem; position: relative; padding-bottom: 120px; }
        .main-content::-webkit-scrollbar { width: 6px; } .main-content::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        @media (max-width: 768px) { .main-content { padding: 1.5rem; height: calc(100vh - 70px); padding-bottom: 100px; } }
        
        /* 🔥 ORANGE GRADIENT TITLE ANIMATION & FONT FIX 🔥 */
        .title-orange { font-weight: 800; background: linear-gradient(to right, #ffedd5, #fb923c, #f97316, #ea580c, #ffedd5); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 5s linear infinite; line-height: 1.6; padding-top: 5px; padding-bottom: 5px; display: inline-block; }
        @keyframes shine { to { background-position: 200% center; } }
        .gradient-text { background: linear-gradient(90deg, #ffffff 0%, #fb923c 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; line-height: 1.6; padding-top: 5px; padding-bottom: 5px; display: inline-block; }

        .section-header { font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
        .section-header::after { content: ''; height: 1px; flex: 1; background: linear-gradient(90deg, var(--glass-border), transparent); }
        .glass-panel { background: var(--glass-surface); border: 1px solid var(--glass-border); border-radius: 20px; padding: 24px; backdrop-filter: blur(12px); }
        .quick-card { cursor: pointer; transition: all 0.2s ease; } .quick-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.03); border-color: var(--accent-glow); }
        .btn-primary { background: linear-gradient(135deg, var(--accent-glow), #ec4899); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
        .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); } .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .input-field { width: 100%; padding: 12px 16px; border-radius: 12px; background: rgba(15,23,42,0.8); border: 1px solid var(--glass-border); color: white; font-size: 0.95rem; outline: none; transition: 0.3s; }
        .input-field:focus { border-color: var(--accent-glow); box-shadow: 0 0 15px rgba(139, 92, 246, 0.15); }
        textarea.input-field { resize: vertical; min-height: 80px; }
        
        /* EXAM STYLES */
        .block-card { 
          border: 1px solid var(--glass-border); background: rgba(255,255,255,0.02); 
          border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.2s;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
        }
        .block-card:hover { border-color: var(--accent-glow); background: rgba(139, 92, 246, 0.1); }
        .block-card.selected { border-color: #ec4899; background: rgba(236, 72, 153, 0.15); box-shadow: 0 0 20px rgba(236, 72, 153, 0.2); }
      `}</style>

      {/* SIDEBAR */}
      <nav className="sidebar">
        <div className="nav-group">
          <NavIcon icon={<Home size={24} />} id="home" active={activeTab} set={setActiveTab} tooltip={t(content.nav_home)} />
          <NavIcon icon={<Upload size={24} />} id="upload" active={activeTab} set={setActiveTab} tooltip={t(content.nav_upload)} />
          <NavIcon icon={<Users size={24} />} id="students" active={activeTab} set={setActiveTab} tooltip={t(content.nav_students)} />
          
          <NavIcon icon={<Globe size={24} />} id="updates" active={activeTab} set={setActiveTab} tooltip={t(content.nav_updates)} />
          
          {/* 🔥 NEW DOUBTS TAB 🔥 */}
          <NavIcon icon={<MessageCircle size={24} />} id="doubts" active={activeTab} set={setActiveTab} tooltip={t(content.nav_doubts)} />
          
          <NavIcon icon={<AlertCircle size={24} />} id="exams" active={activeTab} set={setActiveTab} tooltip={t(content.nav_exams)} />
          <NavIcon icon={<FilePlus size={24} />} id="assignments" active={activeTab} set={setActiveTab} tooltip={t(content.nav_assign)} />
        </div>
        <div className="nav-group">
           <NavIcon icon={<User size={24} />} id="account" active={activeTab} set={setActiveTab} tooltip={t(content.nav_account)} />
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div style={{ position: 'absolute', top: 30, right: 40, zIndex: 120, display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          
        </div>

        {/* NOTIFICATIONS PANEL */}
        {showNotifications && (
          <div className="glass-panel" style={{ position: 'absolute', top: 80, right: 40, width: 380, maxHeight: 420, overflowY: 'auto', padding: 20, zIndex: 130, background: 'rgba(15,23,42,0.96)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>{t(content.latest_dbt)} – {activeClass || '—'}</div>
              <button onClick={fetchNotifications} style={{ fontSize: '0.75rem', background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer' }}>{t(content.refresh)}</button>
            </div>
            {notifLoading && <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{t(content.loading)}</p>}
            {!notifLoading && notifications.length === 0 && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{t(content.no_dbts)}</p>}
            {!notifLoading && notifications.map((item, idx) => (
               <div key={idx} style={{ padding: '10px 0', borderBottom: '1px solid rgba(30,64,175,0.4)', display: 'flex', gap: 10 }}>
                 <div style={{ width: 32, height: 32, borderRadius: '999px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#e5e7eb', flexShrink: 0 }}>{(item.authorName || 'ST').slice(0, 2).toUpperCase()}</div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 2 }}>{item.authorName} • <span style={{ color: '#e5e7eb' }}>{item.videoTitle}</span></div>
                   <div style={{ fontSize: '0.9rem', color: '#e5e7eb', marginBottom: 4 }}>{item.text}</div>
                   <button onClick={() => { setReplyTarget(item); setReplyText(item.authorName ? `@${item.authorName} ` : ''); }} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.75rem' }}>{t(content.reply)}</button>
                 </div>
               </div>
            ))}
            {replyTarget && (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(30,64,175,0.6)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6 }}>{t(content.replying)} {replyTarget.authorName}</div>
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={t(content.type_rep)} style={{ width: '100%', minHeight: 60, background: 'rgba(15,23,42,0.9)', borderRadius: 10, border: '1px solid rgba(148,163,184,0.4)', color: '#e5e7eb', padding: 8, marginBottom: 6 }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button onClick={() => { setReplyTarget(null); setReplyText(''); }} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }}>{t(content.cancel)}</button>
                  <button onClick={handleReplySend} disabled={postingReply || !replyText.trim()} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>{postingReply ? t(content.sending) : t(content.send_rep)}</button>
                </div>
              </div>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ marginBottom: '3rem', marginTop: '1rem' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }} className="title-orange">{t(content.cmd_center)}</h1>
                <p style={{ fontSize: '1.5rem', color: 'white', marginTop: '10px', fontWeight: 600 }}>{t(content.welcome)}, {getDisplayName()}</p>
                
                {/* 🔽 CLASS SELECTOR 🔽 */}
                <div style={{ marginTop: '20px', maxWidth: '300px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>
                    {t(content.sel_cls_lbl)}
                  </label>
                  <select 
                    className="input-field" 
                    value={activeClass} 
                    onChange={(e) => {
                      setActiveClass(e.target.value);
                      localStorage.setItem('teacherActiveClass', e.target.value);
                    }}
                  >
                    <option value="">{t(content.sel_env_ph)}</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i+1}>{t({en:"Class", pa:"ਜਮਾਤ", hi:"कक्षा", bn:"ক্লাস"})} {i+1}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="section-header">{t(content.live_ana)}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
                <StatCard label={t(content.tot_stu)} value={homeStats.totalStudents ?? '--'} icon={<Users size={28} color="#fb923c" />} bg="rgba(251, 146, 60, 0.1)" color="white" />
                
                <StatCard label={t(content.avg_grow)} value={homeStats.avgScore ? `+${homeStats.avgScore}%` : '--'} icon={<TrendingUp size={28} color="#8b5cf6" />} bg="rgba(139, 92, 246, 0.1)" color="#8b5cf6" />
              </div>

              <div className="section-header" style={{ marginTop: '40px' }}>{t(content.q_start)}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <QuickCard icon={<Upload size={24} color="#a78bfa" />} bg="rgba(139, 92, 246, 0.1)" title={t(content.act_up)} desc={t(content.desc_up)} onClick={() => setActiveTab('upload')} />
                <QuickCard icon={<FilePlus size={24} color="#f472b6" />} bg="rgba(236, 72, 153, 0.1)" title={t(content.act_tsk)} desc={t(content.desc_tsk)} onClick={() => setActiveTab('assignments')} />
                <QuickCard icon={<Globe size={24} color="#fb923c" />} bg="rgba(251, 146, 60, 0.1)" title={t(content.act_pst)} desc={t(content.desc_pst)} onClick={() => setActiveTab('updates')} />
              </div>
            </motion.div>
          )}

          {activeTab === 'upload' && <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><UploadModule /></motion.div>}
          {activeTab === 'students' && <motion.div key="students" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><StudentTracker activeClass={activeClass} /></motion.div>}
          {activeTab === 'analytics' && <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><AnalyticsModule /></motion.div>}
          
          {/* 🔥 FIXED UPDATES TAB - NOW SHOWS BOTH POSTING AND VIEWING 🔥 */}
          {activeTab === 'updates' && (
            <motion.div key="updates" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ClassUpdatesManager activeClass={activeClass} user={teacherUser} />
            </motion.div>
          )}

          {/* 🔥 DOUBTS CHAT TAB 🔥 */}
          {activeTab === 'doubts' && (
            <motion.div key="doubts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DoubtChatManager activeClass={activeClass} user={teacherUser} />
            </motion.div>
          )}
          
          {/* 🔥 EXAM MANAGER 🔥 */}
          {activeTab === 'exams' && <motion.div key="exams" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ExamManager activeClass={activeClass} user={teacherUser} totalStudents={homeStats.totalStudents} /></motion.div>}
          
          {activeTab === 'assignments' && <motion.div key="assignments" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><AssignmentManager activeClass={activeClass} /></motion.div>}
          {activeTab === 'account' && <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AccountSection user={teacherUser} activeClass={activeClass} handleLogout={handleLogout} /></motion.div>}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* --- HELPER COMPONENTS --- */
function NavIcon({ icon, id, active, set, tooltip, badge }) {
  const isActive = active === id;
  return (
    <div 
      className={`nav-icon-box ${isActive ? 'active' : ''}`} 
      onClick={() => set(id)} 
      title={tooltip}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
     
    >
      {icon}
      {isActive && (
        <motion.div 
          layoutId="glow" 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            borderRadius: '12px', 
            boxShadow: '0 0 15px var(--accent-glow)', 
            opacity: 0.3 
          }} 
        />
      )}
      
      {/* 🔴 The Notification Badge */}
      {badge > 0 && (
        <span className="notif-badge-icon">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
  );
}
function StatCard({ label, value, icon, bg, color }) {
  return (
    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div><div style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div><div style={{ fontSize: '2.5rem', fontWeight: 700, color: color, marginTop: '5px' }}>{value}</div></div>
      <div style={{ background: bg, padding: '15px', borderRadius: '50%' }}>{icon}</div>
    </div>
  )
}
function QuickCard({ icon, bg, title, desc, onClick }) {
    return (
        <div className="glass-panel quick-card" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px' }}>
            <div style={{ background: bg, padding: '12px', borderRadius: '12px' }}>{icon}</div>
            <div><div style={{ fontWeight: 600, color: 'white' }}>{title}</div><div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{desc}</div></div>
        </div>
    )
}

/* === NEW: DOUBT CHAT MANAGER === */
/* === FIXED DOUBT CHAT MANAGER (TEACHER) === */
/* === UPDATED DOUBT CHAT MANAGER (TEACHER) === */
function DoubtChatManager({ activeClass, user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); 
  const scrollRef = useRef(null);

  // 1. Fetch & Poll Messages
  useEffect(() => {
    if (!activeClass) return;
    const fetchChat = async () => {
      try {
        const res = await api.get(`/doubts/${activeClass}`);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Chat Error", err);
      }
    };
    fetchChat();
    const interval = setInterval(fetchChat, 3000); 
    return () => clearInterval(interval);
  }, [activeClass]);

  // 2. Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 3. Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeClass) return;

    try {
      const payload = {
        className: activeClass,
        text: newMessage,
        senderName: user?.name || 'Teacher',
        role: 'teacher', // 🔥 Forces alignment to Right
        userId: user?._id || user?.id,
        replyTo: replyingTo ? {
          id: replyingTo._id,
          sender: replyingTo.senderName,
          text: replyingTo.text.substring(0, 50) + '...'
        } : null
      };

      // Optimistic UI Update
      setMessages([...messages, { ...payload, createdAt: new Date() }]);
      setNewMessage('');
      setReplyingTo(null);

      await api.post('/doubts', payload);
    } catch (err) {
      alert("Failed to send message");
    }
  };

  // 4. Delete Message
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/doubts/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch(err) { alert("Failed to delete"); }
  };

  if (!activeClass) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
        <h3 style={{ color: '#cbd5e1' }}>Select a Class</h3>
        <p style={{ color: '#94a3b8' }}>Select a class from the top menu to view doubts.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="title-orange" style={{ margin: 0, fontSize: '1.8rem' }}>Class {activeClass} Doubts</h2>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }}></span> Live Chat
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, background: 'rgba(15, 23, 42, 0.6)' }}>
        
        {/* Messages Container */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>
              No doubts yet.
            </div>
          )}

          {messages.map((msg, idx) => {
            // Teacher Dashboard Logic: Teacher messages (Right), Students (Left)
            const isMe = msg.role === 'teacher'; 

            return (
              <div key={idx} style={{ 
                alignSelf: isMe ? 'flex-end' : 'flex-start', 
                maxWidth: '75%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: isMe ? 'flex-end' : 'flex-start' 
              }}>
                
                {/* Message Bubble */}
                <div style={{ 
                  background: isMe 
                    ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' // Teacher Blue/Cyan
                    : 'rgba(30, 41, 59, 0.95)', // Student Dark
                  padding: '12px 16px', 
                  borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  color: 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  minWidth: '140px',
                  border: isMe ? 'none' : '1px solid rgba(255,255,255,0.1)'
                }}>
                  
                  {/* Reply Preview */}
                  {msg.replyTo && (
                    <div style={{ 
                      background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid #fb923c', 
                      padding: '6px 10px', marginBottom: '8px', borderRadius: '4px', fontSize: '0.75rem' 
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#fb923c' }}>{msg.replyTo.sender}</div>
                      <div style={{ opacity: 0.8 }}>{msg.replyTo.text}</div>
                    </div>
                  )}

                  {/* Header: Name + Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '15px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isMe ? '#e0f2fe' : '#fb923c' }}>
                      {msg.senderName} {isMe ? '(You)' : ''}
                    </span>
                    
                    <div style={{ display: 'flex', gap: '8px', opacity: 0.8 }}>
                       {/* Reply Button */}
                       <button onClick={() => setReplyingTo(msg)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding:0 }} title="Reply">
                         <CornerUpLeft size={14} />
                       </button>

                       {/* Delete Button (Teacher can delete anything) */}
                       <button onClick={() => handleDelete(msg._id)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding:0 }} title="Delete">
                         <Trash2 size={14} />
                       </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{msg.text}</div>
                </div>

                {/* Time */}
                <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px', paddingRight: '4px' }}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div style={{ padding: '15px', background: 'rgba(2, 6, 23, 0.8)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
           
           {/* Replying Banner */}
           {replyingTo && (
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', marginBottom: '10px', borderLeft: '3px solid #3b82f6' }}>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  Replying to <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>{replyingTo.senderName}</span>
                </div>
                <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16}/></button>
             </div>
           )}

           <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
            <input 
              className="input-field" 
              placeholder="Type your reply..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ borderRadius: '50px', paddingLeft: '20px', background: 'rgba(30, 41, 59, 0.5)' }}
            />
            <button type="submit" className="btn-primary" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
/* === SUB MODULES === */
/* === REPLACED UPLOAD MODULE === */
function UploadModule() {
  const { t } = useLanguage();
  const notesInputRef = useRef(null);
  
  // Toggle State: 'notes' or 'quiz'
  const [activeSubTab, setActiveSubTab] = useState('notes');

  const content = {
      title: { en: "Content Studio", pa: "ਸਮੱਗਰੀ ਸਟੂਡੀਓ", hi: "कंटेंट स्टूडियो", bn: "কন্টেন্ট স্টুডিও" },
      tab_notes: { en: "Upload Notes", pa: "ਨੋਟਸ ਅਪਲੋਡ ਕਰੋ", hi: "नोट्स अपलोड करें", bn: "নোট আপলোড করুন" },
      tab_quiz: { en: "Create Quiz", pa: "ਕਵਿਜ਼ ਬਣਾਓ", hi: "क्विज़ बनाएं", bn: "কুইজ তৈরি করুন" },
      
      // Notes Labels
      notes_ti: { en: "Material Title", pa: "ਸਮੱਗਰੀ ਦਾ ਸਿਰਲੇਖ", hi: "सामग्री शीर्षक", bn: "উপকরণ শিরোনাম" },
      desc_ph: { en: "Description (optional)", pa: "ਵੇਰਵਾ (ਵਿਕਲਪਿਕ)", hi: "विवरण (वैकल्पिक)", bn: "বিবরণ (ঐচ্ছিক)" },
      attach_pdf: { en: "Click to Upload PDF", pa: "PDF ਅਪਲੋਡ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ", hi: "PDF अपलोड करने के लिए क्लिक करें", bn: "PDF আপলোড করতে ক্লিক করুন" },
      pub_notes: { en: "Publish Notes", pa: "ਨੋਟਸ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ", hi: "नोट्स प्रकाशित करें", bn: "নোট প্রকাশ করুন" },
      
      // Quiz Labels
      quiz_ti: { en: "Quiz Title", pa: "ਕਵਿਜ਼ ਸਿਰਲੇਖ", hi: "क्विज़ शीर्षक", bn: "কুইজ শিরোনাম" },
      q_txt: { en: "Question Text", pa: "ਸਵਾਲ", hi: "प्रश्न पाठ", bn: "প্রশ্নের পাঠ্য" },
      opt: { en: "Option", pa: "ਵਿਕਲਪ", hi: "विकल्प", bn: "বিকল্প" },
      add_q: { en: "+ Add Question", pa: "+ ਸਵਾਲ ਸ਼ਾਮਲ ਕਰੋ", hi: "+ प्रश्न जोड़ें", bn: "+ प्रश्न যোগ করুন" },
      pub_quiz: { en: "Publish Quiz", pa: "ਕਵਿਜ਼ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ", hi: "क्विज़ प्रकाशित करें", bn: "কুইজ প্রকাশ করুন" },
      
      // Common
      sel_sub: { en: "Select Subject", pa: "ਵਿਸ਼ਾ ਚੁਣੋ", hi: "विषय चुनें", bn: "বিষয় নির্বাচন করুন" },
      sel_cls: { en: "Select Class", pa: "ਜਮਾਤ ਚੁਣੋ", hi: "कक्षा चुनें", bn: "ক্লাস নির্বাচন করুন" },
      rec_up: { en: "Recent Uploads", pa: "ਹਾਲੀਆ ਅਪਲੋਡਸ", hi: "हाल के अपलोड", bn: "সাম্প্রতিক আপলোড" }
  };

  // Shared State
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [recentItems, setRecentItems] = useState([]); 

  // Notes State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [notesFile, setNotesFile] = useState(null);

  // Quiz State
  const [quizTitle, setQuizTitle] = useState('');
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);

  // Load recent uploads (mixed or filtered)
  useEffect(() => { 
      // Fetching both for the list
      Promise.all([
          api.get('/videos').catch(() => ({ data: [] })),
          api.get('/quizzes').catch(() => ({ data: [] }))
      ]).then(([vidRes, quizRes]) => {
          // Combine and sort by date if possible, here just flat list
          const combined = [
              ...(vidRes.data || []).map(i => ({ ...i, type: 'note' })),
              ...(quizRes.data || []).map(i => ({ ...i, type: 'quiz' }))
          ];
          setRecentItems(combined.slice(0, 10));
      });
  }, [uploading]); // Refresh when uploading changes

  // --- HANDLERS ---

 const handleNotesUpload = async (e) => {
      e.preventDefault();
      if(!noteTitle || !className || !subject || !notesFile) {
          return alert("Please fill all fields and attach a PDF.");
      }
      
      setUploading(true);
      const fd = new FormData();
      fd.append('title', noteTitle); 
      fd.append('subject', subject); 
      fd.append('className', className);
      fd.append('type', 'notes'); 
      fd.append('description', noteDesc);
      // 🔥 IMPORTANT: This name 'notes' matches your backend route logic
      fd.append('notes', notesFile); 

      try {
        // 🔥 FIX: No manual headers. Let Axios handle multipart boundary.
        const res = await api.post('/videos', fd); 

        console.log("Server Response:", res.data);
        alert("Notes Uploaded Successfully!");

        // Reset Form
        setNoteTitle(''); 
        setNoteDesc(''); 
        setNotesFile(null);
        if(notesInputRef.current) notesInputRef.current.value = "";

      }catch(e) { 
          console.error("Full Error Object:", e);
          const msg = e.response?.data?.message || e.message;
          alert(`Upload Failed: ${msg}`);
      } finally { 
          setUploading(false); 
      }
  };

  const handleAddQuestion = () => {
      if(!qText.trim()) return alert("Question text required");
      if(qOptions.some(o => !o.trim())) return alert("All 4 options are required");
      
      setQuizQuestions(p => [...p, { questionText: qText, options: [...qOptions], correctOptionIndex: correctIdx }]);
      setQText(''); setQOptions(['','','','']); setCorrectIdx(0);
  };

  const handleQuizPublish = async () => {
      if(!quizTitle || !className || !subject) return alert("Please fill Title, Class, and Subject.");
      if(quizQuestions.length === 0) return alert("Please add at least one question.");

      setUploading(true);
      try {
        await api.post('/quizzes', { 
            title: quizTitle, 
            subject, 
            className, 
            questions: quizQuestions 
        });
        alert("Quiz Published Successfully!");
        setQuizTitle(''); setQuizQuestions([]); setQText('');
      } catch(e) { 
          console.error(e);
          alert("Failed to publish quiz"); 
      } finally { 
          setUploading(false); 
      }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }} className="title-orange">{t(content.title)}</h2>

      {/* 🟢 TABS FOR SPLIT VIEW 🟢 */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          <button 
            onClick={() => setActiveSubTab('notes')}
            style={{
                flex: 1, padding: '15px', borderRadius: '12px',
                background: activeSubTab === 'notes' ? 'linear-gradient(135deg, var(--accent-glow), #ec4899)' : 'rgba(30, 41, 59, 0.6)',
                border: activeSubTab === 'notes' ? 'none' : '1px solid var(--glass-border)',
                color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:10}}>
                <FileText size={20} /> {t(content.tab_notes)}
            </div>
          </button>
          
          <button 
            onClick={() => setActiveSubTab('quiz')}
            style={{
                flex: 1, padding: '15px', borderRadius: '12px',
                background: activeSubTab === 'quiz' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(30, 41, 59, 0.6)',
                border: activeSubTab === 'quiz' ? 'none' : '1px solid var(--glass-border)',
                color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
             <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:10}}>
                <CheckSquare size={20} /> {t(content.tab_quiz)}
            </div>
          </button>
      </div>

      <div className="glass-panel" style={{ marginBottom: '30px', minHeight: '400px' }}>
          
          {/* === NOTES FORM === */}
          {activeSubTab === 'notes' && (
             <form onSubmit={handleNotesUpload} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 15 }}>
                    <select className="input-field" value={subject} onChange={e => setSubject(e.target.value)}>
                       <option value="">{t(content.sel_sub)}</option>
                       {['Science', 'Maths', 'English', 'SST', 'Second Language', 'Misc'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select className="input-field" value={className} onChange={e => setClassName(e.target.value)}>
                       <option value="">{t(content.sel_cls)}</option>
                       {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{t({en:'Class', pa:'ਜਮਾਤ', hi:'कक्षा', bn:'ক্লাস'})} {i+1}</option>)}
                    </select>
                 </div>

                 <input className="input-field" placeholder={t(content.notes_ti)} value={noteTitle} onChange={e => setNoteTitle(e.target.value)} />
                 
                 <div onClick={() => notesInputRef.current.click()} style={{ border: '2px dashed #475569', padding: 30, borderRadius: 15, textAlign: 'center', cursor: 'pointer', background: notesFile ? 'rgba(236, 72, 153, 0.05)' : 'transparent', transition: '0.3s' }}>
                    <FileText size={40} color={notesFile ? '#ec4899' : '#64748b'} style={{ marginBottom: 10 }} />
                    <p style={{ color: notesFile ? '#ec4899' : '#94a3b8', fontWeight: 600 }}>{notesFile ? notesFile.name : t(content.attach_pdf)}</p>
                    <input ref={notesInputRef} type="file" accept="application/pdf" hidden onChange={e => setNotesFile(e.target.files[0])} />
                 </div>
                 
                 <textarea className="input-field" placeholder={t(content.desc_ph)} value={noteDesc} onChange={e => setNoteDesc(e.target.value)} />
                 
                 <button className="btn-primary" disabled={uploading}>
                    {uploading ? 'Uploading...' : t(content.pub_notes)}
                 </button>
             </form>
          )}

          {/* === QUIZ FORM === */}
{/* === QUIZ FORM === */}
          {activeSubTab === 'quiz' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  
                  {/* Top Controls: Subject, Class, Title */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 15 }}>
                    <select className="input-field" value={subject} onChange={e => setSubject(e.target.value)}>
                       <option value="">{t(content.sel_sub)}</option>
                       {['Science', 'Maths', 'English', 'SST', 'Second Language', 'Misc'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select className="input-field" value={className} onChange={e => setClassName(e.target.value)}>
                       <option value="">{t(content.sel_cls)}</option>
                       {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{t({en:'Class', pa:'ਜਮਾਤ', hi:'कक्षा', bn:'ক্লাস'})} {i+1}</option>)}
                    </select>
                  </div>

                  <input className="input-field" placeholder={t(content.quiz_ti)} value={quizTitle} onChange={e => setQuizTitle(e.target.value)} />

                  {/* 🔥 REDESIGNED QUESTION BUILDER AREA 🔥 */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '25px', borderRadius: 16, border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                      
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <h4 style={{ margin: 0, color: '#38bdf8', fontSize: '1.1rem', display:'flex', alignItems:'center', gap:8 }}>
                            <Plus size={18}/> Add Question
                          </h4>
                          <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {quizQuestions.length} Questions Added
                          </span>
                      </div>
                      
                      {/* Question Text Input */}
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>Question Text</label>
                        <input 
                            className="input-field" 
                            placeholder="Type your question here..." 
                            value={qText} 
                            onChange={e => setQText(e.target.value)} 
                            style={{ background: 'rgba(2, 6, 23, 0.5)' }}
                        />
                      </div>
                      
                      {/* Options Grid (2x2 Layout) */}
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '10px', fontWeight: 600 }}>
                        Answer Options <span style={{fontWeight:400, opacity:0.7}}>(Click circle to mark correct answer)</span>
                      </label>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                          {qOptions.map((opt, i) => (
                              <div key={i} 
                                   onClick={() => setCorrectIdx(i)}
                                   style={{ 
                                       display: 'flex', alignItems: 'center', gap: 12, 
                                       background: 'rgba(2, 6, 23, 0.5)', 
                                       padding: '10px 15px', 
                                       borderRadius: 12, 
                                       border: correctIdx === i ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)',
                                       transition: 'all 0.2s',
                                       cursor: 'pointer'
                                   }}>
                                 {/* Custom Radio Button */}
                                 <div style={{
                                     width: 20, height: 20, borderRadius: '50%', 
                                     border: correctIdx === i ? '5px solid #22d3ee' : '2px solid #64748b',
                                     flexShrink: 0,
                                     transition: 'all 0.2s'
                                 }}></div>
                                 
                                 {/* Option Input */}
                                 <input 
                                     className="input-field" 
                                     placeholder={`Option ${i+1}`} 
                                     value={opt} 
                                     onChange={e => { const n = [...qOptions]; n[i] = e.target.value; setQOptions(n); }} 
                                     style={{
                                         border: 'none', background: 'transparent', padding: 0, 
                                         height: 'auto', width: '100%', boxShadow: 'none', color: '#f1f5f9'
                                     }}
                                     onClick={(e) => e.stopPropagation()} // Allows typing without triggering the radio selection
                                  />
                              </div>
                          ))}
                      </div>

                      <button 
                        type="button" 
                        onClick={handleAddQuestion} 
                        className="btn-primary" 
                        style={{ width: '100%', background: 'linear-gradient(90deg, #0891b2, #2563eb)', boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)' }}
                      >
                          {t(content.add_q)}
                      </button>
                  </div>

                  {/* Questions Preview List */}
                  {quizQuestions.length > 0 && (
                      <div style={{ background: 'rgba(15,23,42,0.4)', padding: 15, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                          <h5 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Review Questions</h5>
                          <div style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 5 }}>
                              {quizQuestions.map((q, i) => (
                                  <div key={i} style={{ fontSize: '0.9rem', color: '#cbd5e1', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 10 }}>
                                      <span style={{ fontWeight: 700, color: '#fb923c', minWidth: 20 }}>{i+1}.</span> 
                                      <div style={{flex:1}}>
                                        <div>{q.questionText}</div>
                                        <div style={{fontSize:'0.8rem', color:'#94a3b8', marginTop:2}}>
                                            Ans: <span style={{color:'#4ade80'}}>{q.options[q.correctOptionIndex]}</span>
                                        </div>
                                      </div>
                                      <button onClick={() => setQuizQuestions(p => p.filter((_, idx) => idx !== i))} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer'}}><Trash2 size={14}/></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  <button className="btn-primary" onClick={handleQuizPublish} disabled={uploading}>
                      {uploading ? 'Publishing...' : t(content.pub_quiz)}
                  </button>
              </div>
          )}  

      </div>

      <div className="section-header">{t(content.rec_up)}</div>
      <div style={{ display: 'grid', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
          {recentItems.map((item, idx) => (
             <div key={item._id || idx} className="glass-panel" style={{ padding: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{display:'flex', gap:15, alignItems:'center'}}>
                    <div style={{padding:10, background: item.type === 'quiz' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(236, 72, 153, 0.1)', borderRadius:'50%'}}>
                        {item.type === 'quiz' ? <CheckSquare size={18} color="#06b6d4"/> : <FileText size={18} color="#ec4899"/>}
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 600, margin:0 }}>{item.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin:0 }}>{item.subject} • Class {item.className}</p>
                    </div>
                </div>
                <Trash2 size={18} color="#ef4444" style={{ cursor: 'pointer', opacity: 0.7 }} onClick={async () => { 
                    if(window.confirm('Delete?')) { 
                        // Determine endpoint based on type
                        const ep = item.type === 'quiz' ? `/quizzes/${item._id}` : `/videos/${item._id}`;
                        await api.delete(ep); 
                        setRecentItems(p => p.filter(x => x._id !== item._id)); 
                    }
                }} />
             </div>
          ))}
      </div>
    </div>
  )
}

function StudentTracker({ activeClass }) {
  const { t } = useLanguage();
  const content = {
      prog: { en: "Student Progress", pa: "ਵਿਦਿਆਰਥੀ ਦੀ ਪ੍ਰਗਤੀ", hi: "छात्र की प्रगति", bn: "ছাত্রের অগ্রগতি" },
      trk_for: { en: "Tracking performance for Class", pa: "ਲਈ ਪ੍ਰਦਰਸ਼ਨ ਟ੍ਰੈਕਿੰਗ: ਜਮਾਤ", hi: "कक्षा के लिए प्रदर्शन ट्रैकिंग", bn: "ক্লাসের জন্য পারফরম্যান্স ট্র্যাকিং" },
      sel_ac: { en: "Select an Active Classroom in Account settings.", pa: "ਖਾਤਾ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਇੱਕ ਸਰਗਰਮ ਜਮਾਤ ਚੁਣੋ।", hi: "खाता सेटिंग्स में एक सक्रिय कक्षा चुनें।", bn: "অ্যাকাউন্ট সেটিংসে একটি সক্রিয় ক্লাসরুম নির্বাচন করুন।" },
      stu_nm: { en: "Student Name", pa: "ਵਿਦਿਆਰਥੀ ਦਾ ਨਾਮ", hi: "छात्र का नाम", bn: "ছাত্রের নাম" },
      scr: { en: "Avg Score", pa: "ਔਸਤ ਸਕੋਰ", hi: "औसत स्कोर", bn: "গড় স্কোর" },
      att: { en: "Attendance", pa: "ਹਾਜ਼ਰੀ", hi: "उपस्थिति", bn: "उपস্থিতি" },
      qz: { en: "Quizzes", pa: "ਕਵਿਜ਼", hi: "क्विज़", bn: "কুইজ" }
  };
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Add error state
    
  useEffect(() => {
      if(!activeClass) {
          setStats([]);
          return;
      }
      
      const fetchData = async () => {
          setLoading(true);
          setError('');
          try {
              // Ensure this endpoint matches your backend route exactly
              const res = await api.get('/quizzes/class-progress', { params: { className: activeClass } });
              console.log("Student Progress Data:", res.data); // Debug log
              setStats(res.data || []);
          } catch (err) {
              console.error("Failed to fetch student progress:", err);
              setError("Failed to load student data. Please try again.");
              setStats([]);
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, [activeClass]);

  return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
         <h2 style={{ fontSize: '2rem', marginBottom: 20 }} className="title-orange">{t(content.prog)}</h2>
         <p style={{ color: '#94a3b8', marginBottom: 30 }}>{activeClass ? `${t(content.trk_for)} ${activeClass}` : t(content.sel_ac)}</p>
         
         <div className="glass-panel">
            {loading && <p style={{textAlign:'center', color: '#94a3b8'}}>Loading...</p>}
            
            {!loading && error && (
                <div style={{textAlign:'center', color: '#ef4444', padding: '20px'}}>
                    <AlertCircle size={32} style={{marginBottom: 10, display: 'block', margin: '0 auto 10px'}} />
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && stats.length === 0 && (
                <p style={{textAlign:'center', color: '#64748b'}}>No student data found for Class {activeClass}.</p>
            )}

            {!loading && !error && stats.length > 0 && (
               <div style={{overflowX:'auto'}}>
                 <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1', minWidth:'500px' }}>
                   <thead>
                     <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left' }}>
                        <th style={{ padding: 15 }}>{t(content.stu_nm)}</th>
                        <th style={{ padding: 15 }}>{t(content.scr)}</th>
                        <th style={{ padding: 15 }}>{t(content.att)}</th>
                        <th style={{ padding: 15 }}>{t(content.qz)}</th>
                     </tr>
                   </thead>
                   <tbody>
                     {stats.map((s, index) => (
                        <tr key={s.studentId || index} style={{ borderBottom: '1px solid #1e293b' }}>
                           <td style={{ padding: 15, fontWeight: 600, color: 'white' }}>{s.name || 'Unknown Student'}</td>
                           <td style={{ padding: 15, color: '#4ade80' }}>
                               {typeof s.avgScore === 'number' ? s.avgScore.toFixed(1) : '0'}%
                           </td>
                           <td style={{ padding: 15 }}>
                               {typeof s.attendancePercent === 'number' ? s.attendancePercent : '0'}%
                           </td>
                           <td style={{ padding: 15 }}>
                               {s.attemptsCount || 0} / {s.totalQuizzes || 0}
                           </td>
                        </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            )}
         </div>
      </div>
  )
}

function AnalyticsModule() { 
    const { t } = useLanguage();
    return <div style={{maxWidth:900, margin:'0 auto'}}><h2 className="title-orange" style={{fontSize:'2rem', marginBottom:30}}>{t({en:"Class Analytics", pa:"ਜਮਾਤ ਵਿਸ਼ਲੇਸ਼ਣ", hi:"कक्षा एनालिटिक्स", bn:"ক্লাস অ্যানালিটিক্স"})}</h2><div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:30}}><div className="glass-panel" style={{height:300, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}><BarChart size={48} color="#8b5cf6" style={{marginBottom:10}}/><h3>Pass/Fail</h3><p style={{color:'#94a3b8'}}>Graph Placeholder</p></div><div className="glass-panel" style={{height:300, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}><TrendingUp size={48} color="#06b6d4" style={{marginBottom:10}}/><h3>Trend</h3><p style={{color:'#94a3b8'}}>Graph Placeholder</p></div></div></div> 
}

/* === UNIFIED CLASS UPDATES MANAGER (POST & VIEW) === */
/* === UNIFIED CLASS UPDATES MANAGER (POST & VIEW FIXED) === */
function ClassUpdatesManager({ activeClass, user }) {
  const { t } = useLanguage();
  const [updates, setUpdates] = useState([]);
  const [updateText, setUpdateText] = useState('');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  // 1. Fetch Updates
  const fetchUpdates = async () => {
    if (!activeClass) return;
    try {
      setLoading(true);
      // 🔥 FIX: Matches the backend route defined above
      const res = await api.get(`/updates/${activeClass}`);
      setUpdates(res.data || []);
    } catch (error) {
      console.error("Failed to fetch updates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load initially when class changes
  useEffect(() => {
    fetchUpdates();
  }, [activeClass]);

  // 2. Post Update
  const handlePost = async () => {
    if (!activeClass) return alert("Please select an active class first.");
    if (!updateText.trim()) return;

    setPosting(true);
    try {
      // 🔥 FIX: Changed from '/class-updates' to '/updates' to match the GET route
      await api.post('/updates', {
        className: activeClass,
        text: updateText,
        authorName: user?.name || 'Teacher'
      });
      
      setUpdateText('');
      alert("Posted!");
      
      // Refresh list immediately
      fetchUpdates();
      
    } catch (err) {
      console.error(err);
      alert("Failed to post update.");
    } finally {
      setPosting(false);
    }
  };

  // 3. Delete Update
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this update?")) return;
    try {
      // 🔥 FIX: Ensures we hit the delete route
      await api.delete(`/updates/${id}`);
      // Remove from UI instantly
      setUpdates(prev => prev.filter(u => u._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="title-orange" style={{ fontSize: '2rem', marginBottom: '30px' }}>
        {t({ en: "Class Updates", pa: "ਜਮਾਤ ਅੱਪਡੇਟ", hi: "कक्षा अपडेट", bn: "ক্লাস আপডেট" })}
      </h2>
      
      {/* POST SECTION */}
      <div className="glass-panel">
        <textarea 
          className="input-field" 
          placeholder="Share an announcement..." 
          value={updateText} 
          onChange={e => setUpdateText(e.target.value)}
          rows={4}
        ></textarea>
        <button 
          className="btn-primary" 
          style={{ marginTop: '20px', width: '100%' }} 
          onClick={handlePost}
          disabled={posting}
        >
          {posting ? "Posting..." : "Post Update"}
        </button>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginBottom:'40px' }}>
        Posting to Class {activeClass}
      </div>

      {/* LIST SECTION */}
      <h3 style={{ color: '#cbd5e1', marginBottom: '15px' }}>📜 Posted Updates History</h3>
      <div className="glass-panel" style={{ maxHeight: '400px', overflowY: 'auto', padding: '15px' }}>
        {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}
        {!loading && updates.length === 0 && <p style={{ color: '#64748b' }}>No updates found.</p>}

        {updates.map((u) => (
          <div key={u._id} style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(255,255,255,0.03)', marginBottom: '10px', padding: '15px', borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: 600, margin: '0 0 5px 0' }}>{u.text || u.message}</p>
              <small style={{ color: '#94a3b8' }}>{new Date(u.createdAt).toLocaleDateString()} • {new Date(u.createdAt).toLocaleTimeString()}</small>
            </div>
            <button 
              onClick={() => handleDelete(u._id)}
              style={{ 
                background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none', 
                padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* === ASSIGNMENT MANAGER (Compact Upload Box) === */
function AssignmentManager({ activeClass }) {
  const { t } = useLanguage();
  const [view, setView] = useState('list');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // Creation form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [file, setFile] = useState(null);
  const [creating, setCreating] = useState(false);

  // Grading state
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [marks, setMarks] = useState('');
  const [gradingRemarks, setGradingRemarks] = useState('');
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    if (activeClass) {
      fetchAssignments();
    }
  }, [activeClass]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/assignments', { 
        params: { className: activeClass } 
      });
      setAssignments(res.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      alert('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      setLoading(true);
      const res = await api.get(`/assignments/${assignmentId}/submissions`);
      setSubmissions(res.data || []);
      const statsRes = await api.get(`/assignments/${assignmentId}/stats`);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!file || !title || !activeClass) {
      alert('Please fill all required fields');
      return;
    }

    setCreating(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('subject', subject);
    formData.append('className', activeClass);
    formData.append('dueDate', dueDate);
    formData.append('totalMarks', totalMarks);
    formData.append('file', file); 

    try {
      await api.post('/assignments', formData);
      alert('Assignment created successfully!');
      setView('list');
      fetchAssignments();
      resetForm();
    } catch (error) {
      console.error('Error creating assignment:', error);
      const msg = error.response?.data?.message || "Failed to create assignment";
      alert(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment? All submissions will be lost.')) {
      return;
    }
    try {
      await api.delete(`/assignments/${id}`);
      alert('Assignment deleted successfully!');
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment');
    }
  };

 const handleGradeSubmission = async () => {
  const maxMarks = Number(selectedAssignment?.totalMarks || 100);
  const enteredMarks = Number(marks);

  if (marks === '' || enteredMarks > maxMarks || enteredMarks < 0) {
    alert(`Please enter valid marks (0 - ${maxMarks})`);
    return;
  }

    setGrading(true);
    try {
      await api.put(`/assignments/submissions/${gradingSubmission._id}/grade`, {
        marks: parseFloat(marks),
        remarks: gradingRemarks
      });
      alert('Assignment graded successfully!');
      setGradingSubmission(null);
      setMarks('');
      setGradingRemarks('');
      fetchSubmissions(selectedAssignment._id);
    } catch (error) {
      console.error('Error grading assignment:', error);
      alert('Failed to grade assignment');
    } finally {
      setGrading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubject('');
    setDueDate('');
    setTotalMarks('');
    setFile(null);
  };

  const downloadSubmission = (submission) => {
    window.open(submission.fileUrl, '_blank');
  };

  const content = {
    title: { en: "Assignment Manager", pa: "ਅਸਾਈਨਮੈਂਟ ਮੈਨੇਜਰ", hi: "असाइनमेंट प्रबंधक", bn: "অ্যাসাইনমেন্ট ম্যানেজার" },
    create_new: { en: "Create New Assignment", pa: "ਨਵੀਂ ਅਸਾਈਨਮੈਂਟ ਬਣਾਓ", hi: "नया असाइनमेंट बनाएं", bn: "নতুন অ্যাসাইনমেন্ট তৈরি করুন" },
    view_submissions: { en: "View Submissions", pa: "ਸਬਮਿਸ਼ਨ ਦੇਖੋ", hi: "सबमिशन देखें", bn: "জমা দেওয়া দেখুন" },
    back_to_list: { en: "Back to List", pa: "ਲਿਸਟ ਵਾਪਸ ਜਾਓ", hi: "सूची पर वापस", bn: "তালিকায় ফিরে যান" },
    ph_title: { en: "Assignment Title", pa: "ਅਸਾਈਨਮੈਂਟ ਸਿਰਲੇਖ", hi: "असाइनमेंट शीर्षक", bn: "অ্যাসাইনমেন্ট শিরোনাম" },
    ph_desc: { en: "Description (optional)", pa: "ਵੇਰਵਾ (ਵਿਕਲਪਿਕ)", hi: "विवरण (वैकल्पिक)", bn: "বিবরণ (ঐচ্ছিক)" },
    ph_subject: { en: "Select Subject", pa: "ਵਿਸ਼ਾ ਚੁਣੋ", hi: "विषय चुनें", bn: "বিষয় নির্বাচন করুন" },
    ph_due_date: { en: "Due Date", pa: "ਅੰਤਿਮ ਤਾਰੀਖ", hi: "देय तिथि", bn: "জমা দেওয়ার তারিখ" },
    ph_total_marks: { en: "Total Marks", pa: "ਕੁੱਲ ਨੰਬਰ", hi: "कुल अंक", bn: "মোট নম্বর" },
    ph_upload_file: { en: "Click to Upload PDF", pa: "PDF ਅਪਲੋਡ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ", hi: "PDF अपलोड करने के लिए क्लिक करें", bn: "PDF আপলোড করতে ক্লিক করুন" },
    btn_create: { en: "Create Assignment", pa: "ਅਸਾਈਨਮੈਂਟ ਬਣਾਓ", hi: "असाइनमेंट बनाएं", bn: "অ্যাসাইনমেন্ট তৈরি করুন" },
    creating: { en: "Creating...", pa: "ਬਣ ਰਿਹਾ ਹੈ...", hi: "बनाया जा रहा है...", bn: "তৈরি হচ্ছে..." },
    active_assignments: { en: "Active Assignments", pa: "ਸਰਗਰਮ ਅਸਾਈਨਮੈਂਟ", hi: "सक्रिय असाइनमेंट", bn: "सক্রিয় অ্যাসাইনমেন্ট" },
    no_assignments: { en: "No assignments found for this class.", pa: "ਇਸ ਕਲਾਸ ਲਈ ਕੋਈ ਅਸਾਈਨਮੈਂਟ ਨਹੀਂ ਮਿਲੀ।", hi: "इस कक्षा के लिए कोई असाइनमेंट नहीं मिला।", bn: "এই ক্লাসের জন্য কোনো অ্যাসাইনমেন্ট পাওয়া যায়নি।" },
    student_name: { en: "Student Name", pa: "ਵਿਦਿਆਰਥੀ ਦਾ ਨਾਮ", hi: "छात्र का नाम", bn: "ছাত্রের নাম" },
    submission_date: { en: "Submission Date", pa: "ਸਬਮਿਸ਼ਨ ਤਾਰੀਖ", hi: "सबमिशन तिथि", bn: "জমা দেওয়ার তারিখ" },
    status: { en: "Status", pa: "ਸਥਿਤੀ", hi: "स्थिति", bn: "অবস্থা" },
    marks: { en: "Marks", pa: "ਨੰਬਰ", hi: "अंक", bn: "নম্বর" },
    remarks: { en: "Remarks", pa: "ਰਿਮਾਰਕਸ", hi: "टिप्पणी", bn: "মন্তব্য" },
    actions: { en: "Actions", pa: "ਕਾਰਵਾਈਆਂ", hi: "क्रियाएं", bn: "অ্যাকশন" },
    grade: { en: "Grade", pa: "ਨੰਬਰ ਦਿਓ", hi: "ग्रेड", bn: "গ্রেড" },
    download: { en: "Download", pa: "ਡਾਊਨਲੋਡ", hi: "डाउनलोड", bn: "ডাউনলোড" },
    not_submitted: { en: "Not Submitted", pa: "ਸਬਮਿਟ ਨਹੀਂ ਕੀਤਾ", hi: "जमा नहीं किया गया", bn: "जमा দেওয়া হয়নি" },
    pending: { en: "Pending", pa: "ਬਕਾਇਆ", hi: "लंबित", bn: "পেন্ডিং" },
    graded: { en: "Graded", pa: "ਨੰਬਰ ਪ੍ਰਾਪਤ", hi: "ग्रेडेड", bn: "গ্রেডেড" },
    enter_marks: { en: "Enter Marks (out of", pa: "ਨੰਬਰ ਦਰਜ ਕਰੋ (", hi: "अंक दर्ज करें (में से", bn: "নম্বর লিখুন (এর মধ্যে" },
    grading_remarks: { en: "Grading Remarks", pa: "ਨੰਬਰ ਦੇਣ ਦੇ ਰਿਮਾਰਕਸ", hi: "ग्रेडिंग टिप्पणी", bn: "গ্রেডিং মন্তব্য" },
    submit_grade: { en: "Submit Grade", pa: "ਨੰਬਰ ਸਬਮਿਟ ਕਰੋ", hi: "ग्रेड जमा करें", bn: "গ্রেড জমা দিন" },
    grading: { en: "Grading...", pa: "ਨੰਬਰ ਦਿੱਤੇ ਜਾ ਰਹੇ ਹਨ...", hi: "ग्रेडिंग...", bn: "গ্রেডিং..." },
    statistics: { en: "Statistics", pa: "ਅੰਕੜੇ", hi: "आंकड़े", bn: "পরিসংখ্যান" },
    total_students: { en: "Total Students", pa: "ਕੁੱਲ ਵਿਦਿਆਰਥੀ", hi: "कुल छात्र", bn: "মোট ছাত্র" },
    submitted: { en: "Submitted", pa: "ਸਬਮਿਟ ਕੀਤੇ", hi: "जमा किए गए", bn: "जमा দেওয়া হয়েছে" },
    pending_grading: { en: "Pending Grading", pa: "ਨੰਬਰ ਬਕਾਇਆ", hi: "ग्रेडिंग लंबित", bn: "গ্রেডিং পেন্ডিং" },
    avg_marks: { en: "Average Marks", pa: "ਔਸਤ ਨੰਬਰ", hi: "औसत अंक", bn: "গড় নম্বর" },
    submission_rate: { en: "Submission Rate", pa: "ਸਬਮਿਸ਼ਨ ਦਰ", hi: "सबमिशन दर", bn: "জমা দেওয়ার হার" }
  };

  if (view === 'create') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <button 
            onClick={() => setView('list')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <ArrowLeft size={20} /> {t(content.back_to_list)}
          </button>
          <h2 className="title-orange" style={{ fontSize: '2rem', margin: 0 }}>{t(content.create_new)}</h2>
        </div>

        <div className="glass-panel">
          <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 🔥 ADDED PLACEHOLDERS HERE 🔥 */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>{t(content.ph_title)} *</label>
              <input
                className="input-field"
                placeholder="Type assignment title here..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>{t(content.ph_desc)}</label>
              <textarea
                className="input-field"
                placeholder="Type instructions or description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            {/* ---------------------------------- */}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>{t(content.ph_subject)} *</label>
                <select
                  className="input-field"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="">{t(content.ph_subject)}</option>
                  {['Science', 'Maths', 'English', 'SST', 'Second Language', 'Misc'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>{t(content.ph_due_date)}</label>
                <input
                  className="input-field"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>{t(content.ph_total_marks)}</label>
                <input
                  className="input-field"
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>{t(content.ph_upload_file)} *</label>
                
                {/* 🔥 COMPACT UPLOAD BOX (Size Restored) 🔥 */}
                <div
                  onClick={() => document.getElementById('fileInput').click()}
                  style={{
                    border: '2px dashed #475569',
                    padding: '20px', // ✅ Back to 20px (was 30px)
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: file ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    transition: '0.3s',
                    display: 'flex', // Flex to keep it tight
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FileText 
                    size={32} // ✅ Smaller Icon (was 40)
                    color={file ? '#3b82f6' : '#64748b'} 
                    style={{ marginBottom: '8px' }} 
                  />
                  <p style={{ color: file ? '#3b82f6' : '#94a3b8', fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>
                    {file ? file.name : t(content.ph_upload_file)}
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </div>
                {/* ----------------------------------------------- */}

              </div>
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={creating}
              style={{ marginTop: '20px' }}
            >
              {creating ? t(content.creating) : t(content.btn_create)}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'submissions' && selectedAssignment) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <button 
            onClick={() => { setView('list'); setSelectedAssignment(null); }}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <ArrowLeft size={20} /> {t(content.back_to_list)}
          </button>
          <div>
            <h2 className="title-orange" style={{ fontSize: '2rem', margin: 0 }}>{selectedAssignment.title}</h2>
            <p style={{ color: '#94a3b8', marginTop: '5px' }}>
              {selectedAssignment.subject} • Due: {selectedAssignment.dueDate ? new Date(selectedAssignment.dueDate).toLocaleDateString() : 'No due date'}
            </p>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="glass-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>{stats.totalStudents}</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{t(content.total_students)}</div>
            </div>
            <div className="glass-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>{stats.submittedCount}</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{t(content.submitted)}</div>
            </div>
            <div className="glass-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{stats.pendingCount}</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{t(content.pending_grading)}</div>
            </div>
            <div className="glass-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#8b5cf6' }}>{stats.averageMarks}</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{t(content.avg_marks)}</div>
            </div>
          </div>
        )}

        {/* Grading Modal */}
        {gradingSubmission && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="glass-panel" style={{ width: '500px', maxWidth: '90%' }}>
              <h3 style={{ marginBottom: '20px' }}>Grade {gradingSubmission.name}'s Submission</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <a 
                  href={gradingSubmission.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'none' }}
                >
                  📄 View Submission
                </a>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#94a3b8' }}>
                  {t(content.enter_marks)} {selectedAssignment.totalMarks})
                </label>
                <input
                  className="input-field"
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  min="0"
                  max={selectedAssignment.totalMarks}
                  step="0.5"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#94a3b8' }}>{t(content.grading_remarks)}</label>
                <textarea
                  className="input-field"
                  value={gradingRemarks}
                  onChange={(e) => setGradingRemarks(e.target.value)}
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setGradingSubmission(null)}
                  style={{
                    padding: '10px 20px',
                    background: 'none',
                    border: '1px solid #475569',
                    color: '#94a3b8',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleGradeSubmission}
                  disabled={grading}
                  className="btn-primary"
                >
                  {grading ? t(content.grading) : t(content.submit_grade)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Table */}
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b' }}>No submissions yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left' }}>
                  <th style={{ padding: '15px' }}>{t(content.student_name)}</th>
                  <th style={{ padding: '15px' }}>{t(content.submission_date)}</th>
                  <th style={{ padding: '15px' }}>{t(content.status)}</th>
                  <th style={{ padding: '15px' }}>{t(content.marks)}</th>
                  <th style={{ padding: '15px' }}>{t(content.remarks)}</th>
                  <th style={{ padding: '15px' }}>{t(content.actions)}</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission._id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '15px', fontWeight: 600 }}>{submission.name}</td>
                    <td style={{ padding: '15px' }}>
                      {new Date(submission.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: submission.graded ? '#10b98120' : '#f59e0b20',
                        color: submission.graded ? '#10b981' : '#f59e0b'
                      }}>
                        {submission.graded ? t(content.graded) : t(content.pending)}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontWeight: 600 }}>
                      {submission.graded ? (
                        <span style={{ color: '#3b82f6' }}>
                          {submission.marks}/{selectedAssignment.totalMarks}
                        </span>
                      ) : '--'}
                    </td>
                    <td style={{ padding: '15px', maxWidth: '200px', fontSize: '0.9rem' }}>
                      {submission.graded ? submission.remarks : '--'}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => downloadSubmission(submission)}
                          style={{
                            padding: '5px 10px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: '#3b82f6',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          {t(content.download)}
                        </button>
                        {!submission.graded && (
                          <button
                            onClick={() => {
                              setGradingSubmission(submission);
                              setMarks('');
                              setGradingRemarks('');
                            }}
                            style={{
                              padding: '5px 10px',
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              color: '#10b981',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            {t(content.grade)}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // Default list view
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 className="title-orange" style={{ fontSize: '2rem', margin: 0 }}>{t(content.title)}</h2>
        <button className="btn-primary" onClick={() => setView('create')}>
          <Plus size={18} /> {t(content.create_new)}
        </button>
      </div>

      {loading && (
        <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading assignments...</p>
      )}

      {!loading && assignments.length === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
          <FileText size={48} color="#64748b" style={{ marginBottom: '20px', opacity: 0.5 }} />
          <h3 style={{ color: '#94a3b8' }}>{t(content.no_assignments)}</h3>
          <button 
            className="btn-primary" 
            onClick={() => setView('create')}
            style={{ marginTop: '20px' }}
          >
            {t(content.create_new)}
          </button>
        </div>
      )}

      {!loading && assignments.length > 0 && (
        <div style={{ display: 'grid', gap: '15px' }}>
          {assignments.map((assignment) => (
            <div key={assignment._id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '5px' }}>{assignment.title}</h3>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '5px', fontSize: '0.9rem', color: '#94a3b8' }}>
                    <span>📚 {assignment.subject}</span>
                    <span>🏫 Class {assignment.className}</span>
                    {assignment.dueDate && (
                      <span>⏰ Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    )}
                    <span>🎯 Marks: {assignment.totalMarks}</span>
                  </div>
                  {assignment.description && (
                    <p style={{ marginTop: '10px', color: '#cbd5e1', fontSize: '0.95rem' }}>
                      {assignment.description}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setView('submissions');
                      fetchSubmissions(assignment._id);
                    }}
                    className="btn-primary"
                    style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                  >
                    {t(content.view_submissions)}
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Delete Assignment"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <a 
                href={assignment.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  color: '#3b82f6', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  marginTop: '10px'
                }}
              >
                📄 Download Assignment File
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🔥🔥 UPDATED EXAM MANAGER COMPONENT 🔥🔥 */
function ExamManager({ activeClass, user, totalStudents }) {
  const { t } = useLanguage();
    
  // CONFIG BLOCKS
  const BLOCKS = [
    { id: 1, time: 10, q: 7, label: "Short Snap" },
    { id: 2, time: 20, q: 15, label: "Standard" },
    { id: 3, time: 30, q: 23, label: "Extended" },
    { id: 4, time: 40, q: 38, label: "Deep Dive" },
    { id: 5, time: 70, q: 50, label: "Marathon" }
  ];

  const [view, setView] = useState('list'); // 'list' | 'create' | 'results'
  const [exams, setExams] = useState([]);
  const [step, setStep] = useState(1); // 1: Info, 2: Block, 3: Questions
    
  // Creation State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [questions, setQuestions] = useState([]); 
  const [currentQIndex, setCurrentQIndex] = useState(0); 
  const [creating, setCreating] = useState(false);

  // Results State
  const [selectedExamForResults, setSelectedExamForResults] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [absenteeNames, setAbsenteeNames] = useState([]); 
  const [loadingResults, setLoadingResults] = useState(false);
  const [allClassStudents, setAllClassStudents] = useState([]); // Store all students for comparison

  useEffect(() => {
    if(activeClass) {
        fetchExams();
        // Fetch all students in the class once for absentee calculation
        // ASSUMPTION: /users/stats/by-class?className=X&detailed=true returns { students: [{ _id, name, ... }] }
        api.get('/users/stats/by-class', { params: { className: activeClass, detailed: true } })
            .then(res => setAllClassStudents(res.data.students || []))
            .catch(e => console.error("Failed to load student list", e));
    }
  }, [activeClass]);

  const fetchExams = async () => {
    try {
      // NOTE: This route hides correct answers by design: .select('-questions.correctOptionIndex')
      const res = await api.get('/exams', { params: { className: activeClass } });
      setExams(res.data || []);
    } catch (e) { console.error(e); }
  };

  const handleStartCreate = () => {
    if(!activeClass) return alert("Select active class first");
    setView('create'); setStep(1); 
    setTitle(''); setSubject(''); setSelectedBlock(null); setQuestions([]);
  };

  const handleBlockSelect = (block) => {
    setSelectedBlock(block);
    const initQ = Array(block.q).fill(null).map(() => ({
      questionText: '', options: ['', '', '', ''], correctOptionIndex: 0
    }));
    setQuestions(initQ);
    setStep(3);
    setCurrentQIndex(0);
  };

  const updateQuestion = (field, value, optIdx = null) => {
    const updated = [...questions];
    if (field === 'text') updated[currentQIndex].questionText = value;
    if (field === 'correct') updated[currentQIndex].correctOptionIndex = value;
    if (field === 'option') updated[currentQIndex].options[optIdx] = value;
    setQuestions(updated);
  };

  const handleSubmitExam = async () => {
    if(questions.some(q => !q.questionText || q.options.some(o => !o))) {
      return alert("Please fill all questions and options.");
    }
    setCreating(true);
    try {
      await api.post('/exams', {
        title, subject, className: activeClass, blockId: selectedBlock.id, questions, teacherId: user?._id
      });
      alert("Exam Created Successfully!");
      setView('list');
      fetchExams();
    } catch (e) {
      alert("Failed to create exam: " + (e.response?.data?.message || e.message));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this exam? Results will be lost.")) {
      try {
        await api.delete(`/exams/${id}`);
        setExams(p => p.filter(e => e._id !== id));
      } catch(e) { alert("Failed to delete"); }
    }
  };

  // 🔥 FIX: The core logic to fetch details, submissions, and calculate absentees.
  const handleViewResults = async (exam) => {
    setLoadingResults(true);
    setView('results');
    
    try {
        // 1. Fetch COMPLETE exam details (WITH correct answers)
        // This relies on the new backend route /exams/:id/details
        const fullExamRes = await api.get(`/exams/${exam._id}/details`);
        const fullExam = fullExamRes.data;

        // 2. Fetch all submissions for this exam
        // This relies on the new backend route /exams/:id/submissions
        const submissionsRes = await api.get(`/exams/${exam._id}/submissions`); 
        const submissionsArray = submissionsRes.data || [];
        
        // 3. Determine Absentees (Compare all students against those who submitted)
        const submittedStudentIds = new Set(submissionsArray.map(sub => sub.studentId.toString()));
        const absentees = allClassStudents
            .filter(student => !submittedStudentIds.has(student._id.toString()))
            .map(student => student.name);
            
        // 4. Set state
        setSelectedExamForResults(fullExam);
        setSubmissions(submissionsArray);
        setAbsenteeNames(absentees);

    } catch (e) {
      console.error(e);
      // Display specific API error if available for debugging
      alert("Failed to load results. Check console for API route error (404/500).");
      setSubmissions([]); 
      setAbsenteeNames([]);
    } finally {
      setLoadingResults(false);
    }
  };

  /* --- RENDER HELPERS --- */
  if (view === 'list') {
    return (
      <div style={{maxWidth: 800, margin: '0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:30}}>
          <h2 className="title-orange" style={{fontSize:'2rem', margin:0}}>{t({en:"Exam Control", pa:"ਪ੍ਰੀਖਿਆ ਕੰਟਰੋਲ", hi:"परीक्षा नियंत्रण", bn:"পরীক্ষা নিয়ন্ত্রণ"})}</h2>
          <button className="btn-primary" onClick={handleStartCreate}><Plus size={18}/> New Exam</button>
        </div>
        
        {exams.length === 0 ? (
          <div className="glass-panel" style={{textAlign:'center', padding:40}}>
            <AlertCircle size={48} color="#ef4444" style={{marginBottom:20, opacity:0.5}}/>
            <h3 style={{color:'#94a3b8'}}>{t({en:"No Active Exams for Class " + activeClass, pa:"ਜਮਾਤ " + activeClass + " ਲਈ ਕੋਈ ਸਰਗਰਮ ਪ੍ਰੀਖਿਆ ਨਹੀਂ", hi:"कक्षा " + activeClass + " के लिए कोई सक्रिय परीक्षा नहीं", bn:"ক্লাস " + activeClass + " এর জন্য কোন সক্রিয় পরীক্ষা নেই"})}</h3>
          </div>
        ) : (
          <div style={{display:'grid', gap:15}}>
            {exams.map(ex => (
              <div key={ex._id} className="glass-panel" style={{padding:20, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <h3 style={{fontSize:'1.1rem', fontWeight:600}}>{ex.title}</h3>
                  <div style={{display:'flex', gap:15, marginTop:5, fontSize:'0.85rem', color:'#94a3b8'}}>
                    <span style={{display:'flex', alignItems:'center', gap:5}}><Layers size={14}/> {ex.subject}</span>
                    <span style={{display:'flex', alignItems:'center', gap:5}}><Clock size={14}/> {ex.duration} mins</span>
                    <span style={{display:'flex', alignItems:'center', gap:5}}><CheckSquare size={14}/> {ex.totalQuestions} Qs</span>
                  </div>
                </div>
                <div style={{display:'flex', gap: 10}}>
                   <button onClick={() => handleViewResults(ex)} title="View Results" style={{background:'rgba(59, 130, 246, 0.1)', border:'none', padding:10, borderRadius:8, cursor:'pointer', color:'#3b82f6'}}>
                    <Eye size={18}/>
                   </button>
                   <button onClick={() => handleDelete(ex._id)} title="Delete Exam" style={{background:'rgba(239, 68, 68, 0.1)', border:'none', padding:10, borderRadius:8, cursor:'pointer', color:'#ef4444'}}>
                    <Trash2 size={18}/>
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- RESULTS VIEW ---
  if (view === 'results' && selectedExamForResults) {
    const presentCount = submissions.length;
    const totalCount = totalStudents || allClassStudents.length;
    const totalQuestions = selectedExamForResults.totalQuestions;
    const optionLabels = ["A", "B", "C", "D"];

    return (
      <div style={{maxWidth: 1000, margin: '0 auto'}}>
          <button onClick={() => setView('list')} style={{background:'none', border:'none', color:'#94a3b8', display:'flex', alignItems:'center', gap:5, marginBottom:20, cursor:'pointer'}}>
              <ArrowLeft size={16}/> Back to Exams
          </button>
          
          <div style={{marginBottom: 30}}>
              <h2 className="title-orange" style={{fontSize:'1.8rem', margin:0}}>{selectedExamForResults.title} Results</h2>
              <div style={{display:'flex', gap: 20, marginTop: 15}}>
                <div className="glass-panel" style={{padding: '15px 25px', textAlign:'center'}}>
                  <div style={{fontSize:'2rem', fontWeight:700, color:'#4ade80'}}>{presentCount}</div>
                  <div style={{fontSize:'0.8rem', color:'#94a3b8'}}>Submitted</div>
                </div>
                <div className="glass-panel" style={{padding: '15px 25px', textAlign:'center'}}>
                  <div style={{fontSize:'2rem', fontWeight:700, color:'#ef4444'}}>{totalCount - presentCount > 0 ? totalCount - presentCount : 0}</div>
                  <div style={{fontSize:'0.8rem', color:'#94a3b8'}}>Absent</div>
                </div>
                <div className="glass-panel" style={{padding: '15px 25px', textAlign:'center'}}>
                   <div style={{fontSize:'2rem', fontWeight:700, color:'#3b82f6'}}>{totalCount || '--'}</div>
                   <div style={{fontSize:'0.8rem', color:'#94a3b8'}}>Total Students</div>
                </div>
              </div>
          </div>

          {/* ABSENTEE LIST */}
          {absenteeNames.length > 0 && (
             <div className="glass-panel" style={{marginBottom: 20}}>
                 <h3 style={{fontSize:'1rem', color:'#f87171', marginBottom: 10}}>Students Who Did NOT Attempt ({absenteeNames.length})</h3>
                 <div style={{display:'flex', flexWrap:'wrap', gap: 10}}>
                     {absenteeNames.map((name, i) => (
                         <span key={i} style={{padding: '5px 10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 5, fontSize: '0.85rem', color: '#f87171'}}>
                             {name}
                         </span>
                     ))}
                 </div>
             </div>
          )}

          {/* SUBMISSION TABLE */}
          <div className="glass-panel" style={{overflowX: 'auto'}}>
             <h3 style={{marginBottom: 20, color:'white'}}>Submission Details</h3>
             <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1', minWidth:'800px' }}>
               <thead>
                 <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left', fontSize:'0.9rem', color:'#94a3b8' }}>
                     <th style={{ padding: 15 }}>Student Name</th>
                     <th style={{ padding: 15 }}>Marks Obtained</th>
                     <th style={{ padding: 15 }}>Percentage</th>
                     <th style={{ padding: 15 }}>Answer Sheet (Q1, Q2, Q3...)</th>
                 </tr>
               </thead>
               <tbody>
                 {loadingResults ? (
                     <tr><td colSpan="4" style={{padding:20, textAlign:'center'}}>Loading results...</td></tr>
                   ) : submissions.length === 0 ? (
                     <tr><td colSpan="4" style={{padding:20, textAlign:'center'}}>No submissions yet.</td></tr>
                   ) : (
                     submissions.map(sub => {
                        const percentage = ((sub.score / sub.totalMarks) * 100).toFixed(1);
                        return (
                           <tr key={sub._id} style={{ borderBottom: '1px solid #1e293b' }}>
                              <td style={{ padding: 15, fontWeight: 600, color: 'white' }}>{sub.studentName}</td>
                              <td style={{ padding: 15 }}>{sub.score} / {sub.totalMarks}</td>
                              <td style={{ padding: 15, color: percentage >= 33 ? '#4ade80' : '#ef4444' }}>{percentage}%</td>
                              <td style={{ padding: 15 }}>
                                  <div style={{display:'flex', gap:5, flexWrap:'wrap'}}>
                                           {sub.selectedAnswers.map((ansIdx, qIdx) => {
                                              // Look up the correct answer index from the detailed exam object
                                              const correctQ = selectedExamForResults.questions.find((_, index) => index === qIdx);
                                              // Handle case where question data might be missing or corrupted
                                              const correctIdx = correctQ?.correctOptionIndex !== undefined ? correctQ.correctOptionIndex : -99; // Use -99 for unknown
                                              
                                              const isCorrect = ansIdx === correctIdx;
                                              
                                              // Map index (0, 1, 2, 3) to A, B, C, D
                                              const label = optionLabels[ansIdx] || "-";
                                              
                                              return (
                                                  <div 
                                                      key={qIdx} 
                                                      title={`Q${qIdx+1}: Ans: ${label} | Correct: ${optionLabels[correctIdx]}`} 
                                                      style={{
                                                          width: 28, height: 28, borderRadius: '50%', 
                                                          background: isCorrect ? 'rgba(74, 222, 128, 0.2)' : (ansIdx !== -1 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(148,163,184,0.1)'),
                                                          border: `1px solid ${isCorrect ? '#4ade80' : (ansIdx !== -1 ? '#ef4444' : '#94a3b8')}`,
                                                          color: isCorrect ? '#4ade80' : (ansIdx !== -1 ? '#ef4444' : '#94a3b8'),
                                                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700
                                                      }}
                                                  >
                                                      {label}
                                                  </div>
                                              )
                                           })}
                                  </div>
                              </td>
                           </tr>
                        )
                     })
                   )}
               </tbody>
             </table>
          </div>
      </div>
    );
  }

  // --- CREATE WIZARD (EXISTING CODE) ---
  return (
    <div style={{maxWidth: 800, margin: '0 auto'}}>
      <button onClick={() => setView('list')} style={{background:'none', border:'none', color:'#94a3b8', display:'flex', alignItems:'center', gap:5, marginBottom:20, cursor:'pointer'}}>
        <ArrowLeft size={16}/> Back to List
      </button>

      {/* STEP 1: INFO */}
      {step === 1 && (
        <div className="glass-panel">
          <h3 style={{marginBottom:20}}>Step 1: Exam Details</h3>
          <input className="input-field" placeholder="Exam Title (e.g., Mid-Term Physics)" value={title} onChange={e => setTitle(e.target.value)} style={{marginBottom:15}} />
          <select className="input-field" value={subject} onChange={e => setSubject(e.target.value)} style={{marginBottom:15}}>
             <option value="">Select Subject</option>
             {['Science', 'Maths', 'English', 'SST', 'Second Language', 'Misc'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{textAlign:'right'}}>
            <button className="btn-primary" disabled={!title || !subject} onClick={() => setStep(2)}>Next <ArrowRight size={16}/></button>
          </div>
        </div>
      )}

      {/* STEP 2: BLOCK SELECT */}
      {step === 2 && (
        <div>
          <h3 style={{marginBottom:20}}>Step 2: Select Configuration Block</h3>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:15}}>
            {BLOCKS.map(b => (
              <div key={b.id} className="block-card" onClick={() => handleBlockSelect(b)}>
                <div style={{fontSize:'1.5rem', fontWeight:800, color:'var(--accent-glow)'}}>{b.time}m</div>
                <div style={{fontSize:'0.9rem', color:'#cbd5e1'}}>{b.q} Questions</div>
                <div style={{fontSize:'0.75rem', color:'#94a3b8', marginTop:5}}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: QUESTIONS */}
      {step === 3 && questions.length > 0 && (
        <div className="glass-panel">
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
            <h3>Question {currentQIndex + 1} of {selectedBlock.q}</h3>
            <span style={{color:'var(--accent-glow)', fontSize:'0.9rem'}}>{selectedBlock.time} Mins Block</span>
          </div>

          <textarea 
            className="input-field" 
            placeholder="Type question here..." 
            value={questions[currentQIndex].questionText} 
            onChange={e => updateQuestion('text', e.target.value)}
            style={{minHeight:100, marginBottom:20}}
          />

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15, marginBottom:20}}>
            {questions[currentQIndex].options.map((opt, i) => (
              <div key={i} style={{display:'flex', gap:10, alignItems:'center'}}>
                <input 
                  type="radio" 
                  name={`q-${currentQIndex}`} 
                  checked={questions[currentQIndex].correctOptionIndex === i} 
                  onChange={() => updateQuestion('correct', i)}
                />
                <input 
                  className="input-field" 
                  placeholder={`Option ${i+1}`} 
                  value={opt} 
                  onChange={e => updateQuestion('option', e.target.value, i)} 
                />
              </div>
            ))}
          </div>

          <div style={{display:'flex', justifyContent:'space-between', marginTop:30}}>
            <button 
              className="btn-primary" 
              style={{background:'#334155'}} 
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(p => p - 1)}
            >
              Prev
            </button>
            
            {currentQIndex < selectedBlock.q - 1 ? (
              <button className="btn-primary" onClick={() => setCurrentQIndex(p => p + 1)}>Next Question</button>
            ) : (
              <button className="btn-primary" disabled={creating} onClick={handleSubmitExam}>
                {creating ? 'Publishing...' : 'Publish Exam'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AccountSection({ user, activeClass, handleLogout }) {
   const { t } = useLanguage();
   const [code, setCode] = useState('');
   const fetchCode = async () => { if(!activeClass) return alert("Select class"); const res = await api.get('/auth/referral-code', {params:{className:activeClass}}); setCode(res.data.referralCode); };
   return <div className="glass-panel" style={{width:'100%', maxWidth:500, padding:50, textAlign:'center', background:'rgba(15,23,42,0.8)'}}><div style={{width:100, height:100, borderRadius:'50%', background:'linear-gradient(135deg, var(--accent-glow), #ec4899)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', fontWeight:800, color:'#0f172a'}}>{user?.name?.charAt(0)||'T'}</div><h2 style={{fontSize:'1.8rem', fontWeight:700}}>{user?.name}</h2><p style={{color:'#94a3b8', fontSize:'1rem', marginBottom:30}}>{user?.email} • {t({en:"Faculty", pa:"ਫੈਕਲਟੀ", hi:"संकाय", bn:"অনুষদ"})}</p><div style={{background:'rgba(0,0,0,0.3)', padding:15, borderRadius:12, marginBottom:25, display:'flex', alignItems:'center', justifyContent:'space-between', border:'1px solid rgba(255,255,255,0.05)'}}><div style={{textAlign:'left'}}><div style={{fontSize:'0.75rem', color:'#fb923c', fontWeight:700, letterSpacing:'1px'}}>{t({en:"REFERRAL CODE", pa:"ਰੈਫਰਲ ਕੋਡ", hi:"रेफरल कोड", bn:"রেফারেল কোড"})}</div><div style={{fontSize:'1.1rem', fontFamily:'monospace', color:'white'}}>{code||'••••••'}</div></div><button onClick={fetchCode} style={{padding:'8px 16px', borderRadius:8, border:'none', background:'#fb923c', color:'#431407', fontWeight:700, cursor:'pointer'}}>{t({en:"Get Code", pa:"ਕੋਡ ਪ੍ਰਾਪਤ ਕਰੋ", hi:"कोड प्राप्त करें", bn:"কোড পান"})}</button></div><button onClick={handleLogout} style={{width:'100%', padding:15, borderRadius:16, background:'rgba(239, 68, 68, 0.15)', color:'#f87171', border:'1px solid rgba(239, 68, 68, 0.3)', fontSize:'1rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10}}><LogOut size={20}/> {t({en:"Sign Out", pa:"ਸਾਈਨ ਆਉਟ", hi:"साइन आउट", bn:"সাইন আউট"})}</button></div>
}
