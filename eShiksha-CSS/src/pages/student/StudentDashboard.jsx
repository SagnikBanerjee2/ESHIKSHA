import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import {
  Home, BookOpen, User, FileText,
  Upload, ChevronLeft, Zap, PenTool, Tv, Calendar,
  KeyRound, LogOut, Loader2, AlertCircle, CheckCircle2, Clock, Award,
  Download, HelpCircle, MessageCircle, Send, CornerUpLeft, Trash2, X,
  Medal // 🔥 NEW ICON
} from 'lucide-react';
import api from '../../api';
import OnlineStatusPill from '../../components/OnlineStatusPill';
import { useLanguage } from '../../context/LanguageContext';

// 🔥 HELPER: BADGE LOGIC
const getBadge = (score, total) => {
  if (!total || total === 0) return null;
  const percentage = (score / total) * 100;

  if (percentage >= 90) return { icon: <Medal size={20} color="#fbbf24" fill="#fbbf24" />, label: "Gold", color: "#fbbf24", bg: "rgba(251, 191, 36, 0.2)" }; // Gold
  if (percentage >= 75) return { icon: <Medal size={20} color="#94a3b8" fill="#94a3b8" />, label: "Silver", color: "#94a3b8", bg: "rgba(148, 163, 184, 0.2)" }; // Silver
  if (percentage >= 60) return { icon: <Medal size={20} color="#b45309" fill="#b45309" />, label: "Bronze", color: "#b45309", bg: "rgba(180, 83, 9, 0.2)" }; // Bronze
  return null; // No Badge
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);

  // --- EXAM STATE ---
  const [activeExamSession, setActiveExamSession] = useState(null);
  const [lastExamResult, setLastExamResult] = useState(null);

  // --- TOAST STATE ---
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // --- 🌍 FULL TRANSLATIONS OBJECT 🌍 ---
  const content = {
    // Navigation
    nav_home: { en: "Home", pa: "ਘਰ", hi: "होम", bn: "হোম" },
    nav_notes: { en: "Notes", pa: "ਨੋਟਸ", hi: "नोट्स", bn: "নোট" },
    nav_quiz: { en: "Quizzes", pa: "ਕਵਿਜ਼", hi: "क्विज़", bn: "কুইজ" },
    nav_assign: { en: "Assignments", pa: "ਅਸਾਈਨਮੈਂਟ", hi: "असाइनमेंट", bn: "অ্যাসাইনমেন্ট" },
    nav_doubts: { en: "Doubts", pa: "ਸ਼ੱਕ", hi: "संदेह", bn: "সন্দেহ" },
    nav_exams: { en: "Exams", pa: "ਪ੍ਰੀਖਿਆਵਾਂ", hi: "परीक्षाएं", bn: "পরীক্ষা" },
    nav_acc: { en: "Account", pa: "ਖਾਤਾ", hi: "खाता", bn: "অ্যাকাউন্ট" },

    // Home Section
    welcome: { en: "Welcome", pa: "ਜੀ ਆਇਆਂ ਨੂੰ", hi: "स्वागत है", bn: "স্বাগতম" },
    subtitle: { en: "Your intelligence hub is online.", pa: "ਤੁਹਾਡਾ ਇੰਟੈਲੀਜੈਂਸ ਹੱਬ ਔਨਲਾਈਨ ਹੈ।", hi: "आपका इंटेलिजेंस हब ऑनलाइन है।", bn: "আপনার ইন্টেলিজেন্স হাব অনলাইনে আছে।" },
    feat: { en: "Features", pa: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ", hi: "विशेषताएं", bn: "বৈশিষ্ট্য" },
    skills: { en: "Your Subjects", pa: "ਤੁਹਾਡੇ ਵਿਸ਼ੇ", hi: "आपके विषय", bn: "আপনার বিষয়" },
    
    // Offers / Features
    live_cls: { en: "Live Classes", pa: "ਲਾਈਵ ਕਲਾਸਾਂ", hi: "लाइव कक्षाएं", bn: "লাইভ ক্লাস" },
    live_desc: { en: "Interactive streaming", pa: "ਇੰਟਰਐਕਟਿਵ ਸਟ੍ਰੀਮਿੰਗ", hi: "इंटरएक्टिव स्ट्रीमिंग", bn: "ইন্টারঅ্যাক্টিভ স্ট্রিমিং" },
    pdf_notes: { en: "PDF Notes", pa: "PDF ਨੋਟਸ", hi: "PDF नोट्स", bn: "PDF নোট" },
    pdf_desc: { en: "Deep dive learning", pa: "ਡੂੰਘਾਈ ਨਾਲ ਸਿੱਖਣਾ", hi: "गहराई से सीखना", bn: "গভীরভাবে শেখা" },
    daily_quiz: { en: "Daily Quiz", pa: "ਰੋਜ਼ਾਨਾ ਕਵਿਜ਼", hi: "दैनिक क्विज़", bn: "দৈনিক কুইজ" },
    quiz_desc: { en: "Test your skills", pa: "ਆਪਣੇ ਹੁਨਰ ਦੀ ਜਾਂਚ ਕਰੋ", hi: "अपने कौशल का परीक्षण करें", bn: "আপনার দক্ষতা পরীক্ষা করুন" },
    live_exams: { en: "Live Exams", pa: "ਲਾਈਵ ਪ੍ਰੀਖਿਆਵਾਂ", hi: "लाइव परीक्षाएं", bn: "লাইভ পরীক্ষা" },
    exam_desc: { en: "Real-time assessment", pa: "ਅਸਲ-ਸਮੇਂ ਦਾ ਮੁਲਾਂਕਣ", hi: "वास्तविक समय मूल्यांकन", bn: "রিয়েল-টাইম মূল্যায়ন" },
    assign_feat: { en: "Assignments", pa: "ਅਸਾਈਨਮੈਂਟ", hi: "असाइनमेंट", bn: "অ্যাসাইনমেন্ট" },
    assign_desc: { en: "Homework portal", pa: "ਹੋਮਵਰਕ ਪੋਰਟਲ", hi: "होमवर्क पोर्टल", bn: "হোমওয়ার্ক পোর্টাল" },
    updates_feat: { en: "Class Updates", pa: "ਕਲਾਸ ਅੱਪਡੇਟ", hi: "कक्षा अपडेट", bn: "ক্লাস আপডেট" },
    updates_desc: { en: "Announcements", pa: "ਘੋਸ਼ਣਾਵਾਂ", hi: "घोषणाएं", bn: "ঘোষণা" },

    // Subjects
    sci: { en: "Science", pa: "ਵਿਗਿਆਨ", hi: "विज्ञान", bn: "বিজ্ঞান" },
    sst: { en: "SST", pa: "ਸਮਾਜਿਕ ਸਿੱਖਿਆ", hi: "सामाजिक अध्ययन", bn: "সামাজিক শিক্ষা" },
    math: { en: "Maths", pa: "ਗਣਿਤ", hi: "गणित", bn: "গণিত" },
    eng: { en: "English", pa: "ਅੰਗਰੇਜ਼ੀ", hi: "अंग्रेज़ी", bn: "ইংরেজি" },
    lang2: { en: "2nd Language", pa: "ਦੂਜੀ ਭਾਸ਼ਾ", hi: "दूसरी भाषा", bn: "দ্বিতীয় ভাষা" },
    misc: { en: "Misc", pa: "ਫੁਟਕਲ", hi: "विविध", bn: "বিবিধ" },

    // Exam Player
    exit: { en: "Exit", pa: "ਬਾਹਰ ਜਾਓ", hi: "बाहर निकलें", bn: "প্রস্থান" },
    questions: { en: "QUESTIONS", pa: "ਸਵਾਲ", hi: "प्रश्न", bn: "প্রশ্ন" },
    prev: { en: "Previous", pa: "ਪਿਛਲਾ", hi: "पिछला", bn: "আগের" },
    next: { en: "Next Question", pa: "ਅਗਲਾ ਸਵਾਲ", hi: "अगला प्रश्न", bn: "পরবর্তী প্রশ্ন" },
    submit_exam: { en: "Submit Exam", pa: "ਪ੍ਰੀਖਿਆ ਜਮ੍ਹਾਂ ਕਰੋ", hi: "परीक्षा जमा करें", bn: "পরীক্ষা জমা দিন" },
    submit_confirm: { en: "Submit Exam? You cannot undo this.", pa: "ਕੀ ਤੁਸੀਂ ਪ੍ਰੀਖਿਆ ਜਮ੍ਹਾਂ ਕਰਨੀ ਚਾਹੁੰਦੇ ਹੋ? ਇਹ ਵਾਪਸ ਨਹੀਂ ਹੋ ਸਕਦਾ।", hi: "परीक्षा जमा करें? आप इसे पूर्ववत नहीं कर सकते।", bn: "পরীক্ষা জমা দেবেন? আপনি এটি ফিরিয়ে আনতে পারবেন না।" },
    time_up: { en: "Time's up! Auto submitting.", pa: "ਸਮਾਂ ਸਮਾਪਤ! ਆਟੋ ਸਬਮਿਟ ਹੋ ਰਿਹਾ ਹੈ।", hi: "समय समाप्त! अपने आप जमा हो रहा है।", bn: "সময় শেষ! স্বয়ংক্রিয়ভাবে জমা হচ্ছে।" },
    exam_success: { en: "Exam Submitted Successfully!", pa: "ਪ੍ਰੀਖਿਆ ਸਫਲਤਾਪੂਰਵਕ ਜਮ੍ਹਾਂ ਹੋ ਗਈ!", hi: "परीक्षा सफलतापूर्वक जमा की गई!", bn: "পরীক্ষা সফলভাবে জমা দেওয়া হয়েছে!" },
    exam_fail: { en: "Submission Failed.", pa: "ਜਮ੍ਹਾਂ ਅਸਫਲ ਰਿਹਾ।", hi: "जमा विफल।", bn: "জমা ব্যর্থ হয়েছে।" },
  };

  const OFFERS = [
    { icon: <Tv />, title: t(content.live_cls), desc: t(content.live_desc), color: "#3b82f6" },
    { icon: <BookOpen />, title: t(content.pdf_notes), desc: t(content.pdf_desc), color: "#8b5cf6" },
    { icon: <Zap />, title: t(content.daily_quiz), desc: t(content.quiz_desc), color: "#f59e0b" },
    { icon: <PenTool />, title: t(content.live_exams), desc: t(content.exam_desc), color: "#ef4444" },
    { icon: <FileText />, title: t(content.assign_feat), desc: t(content.assign_desc), color: "#10b981" },
    { icon: <Calendar />, title: t(content.updates_feat), desc: t(content.updates_desc), color: "#06b6d4" },
  ];

  const SUBJECTS_DATA = [
    { id: "Science", name: t(content.sci), color: "#06b6d4", count: 24 },
    { id: "SST", name: t(content.sst), color: "#8b5cf6", count: 18 },
    { id: "Maths", name: t(content.math), color: "#3b82f6", count: 30 },
    { id: "English", name: t(content.eng), color: "#10b981", count: 15 },
    { id: "Second Language", name: t(content.lang2), color: "#f59e0b", count: 10 },
    { id: "Misc", name: t(content.misc), color: "#ec4899", count: 5 },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch (e) { console.error(e); }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (activeExamSession) {
    return (
      <ExamPlayer
        exam={activeExamSession.exam}
        user={user}
        content={content} 
        t={t} 
        onClose={() => setActiveExamSession(null)}
        onComplete={(exam, result) => {
          setActiveExamSession(null);
          setLastExamResult({
            score: result.score,
            totalMarks: result.totalMarks,
            subject: exam.subject,
            examId: exam._id
          });
          setActiveTab('exams'); 
          showToast(result.msg || t(content.exam_success), "success");
        }}
      />
    );
  }

  return (
    <div className="dashboard-wrapper">
      <style>{`
        :root { --bg-deep: #020617; --glass-surface: rgba(30, 41, 59, 0.6); --glass-border: rgba(255, 255, 255, 0.08); --primary-glow: #06b6d4; --accent-glow: #8b5cf6; --text-main: #f1f5f9; --text-muted: #94a3b8; }
        .dashboard-wrapper { height: 100vh; width: 100vw; background-color: var(--bg-deep); color: var(--text-main); font-family: 'Inter', sans-serif; display: flex; overflow: hidden; background-image: radial-gradient(circle at 0% 0%, rgba(6, 182, 212, 0.08), transparent 50%), radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.08), transparent 50%); }
        ::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-track { background: rgba(2, 6, 23, 0.5); } ::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.2); border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.5); } ::selection { background: rgba(139, 92, 246, 0.3); color: white; }
        .glass-panel { background: var(--glass-surface); border: 1px solid var(--glass-border); border-radius: 20px; padding: 24px; backdrop-filter: blur(12px); position: relative; overflow: hidden; }
        .glass-panel::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"); pointer-events: none; z-index: 0; }
        .glass-panel > * { position: relative; z-index: 1; }
        .sidebar { width: 90px; height: 100vh; background: rgba(15, 23, 42, 0.9); border-right: 1px solid var(--glass-border); display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 2rem 0; backdrop-filter: blur(20px); z-index: 100; transition: all 0.3s ease; }
        .nav-group { display: flex; flex-direction: column; gap: 1.5rem; width: 100%; align-items: center; }
        .nav-icon-box { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; transition: all 0.3s ease; position: relative; }
        .nav-icon-box:hover { background: rgba(255,255,255,0.05); color: white; transform: scale(1.1); }
        .nav-icon-box.active { background: linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05)); color: var(--primary-glow); border: 1px solid rgba(6,182,212,0.4); box-shadow: 0 0 15px rgba(6,182,212,0.3); }
        @media (max-width: 768px) { .dashboard-wrapper { flex-direction: column-reverse; } .sidebar { width: 100vw; height: 70px; flex-direction: row; justify-content: space-around; align-items: center; padding: 0; border-right: none; border-top: 1px solid var(--glass-border); position: fixed; bottom: 0; left: 0; background: rgba(2, 6, 23, 0.98); box-shadow: 0 -5px 20px rgba(0,0,0,0.5); } .nav-group { flex-direction: row; justify-content: space-evenly; width: 100%; gap: 0; } .nav-icon-box { width: 42px; height: 42px; border-radius: 10px; } .mobile-account-icon { display: flex; } .nav-spacer-bottom { display: none !important; } }
        @media (min-width: 769px) { .mobile-account-icon { display: none; } }
        .main-content { flex: 1; height: 100vh; overflow-y: auto; padding: 2rem 3rem; position: relative; padding-bottom: 120px; }
        @media (max-width: 768px) { .main-content { padding: 1.5rem; padding-bottom: 90px; } }
        .title-ash-blue { font-weight: 800; background: linear-gradient(to right, #f8fafc, #94a3b8, #3b82f6, #60a5fa, #f8fafc); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 5s linear infinite; line-height: 1.6; padding-top: 5px; padding-bottom: 5px; display: inline-block; }
        .title-cyan-emerald { font-weight: 800; background: linear-gradient(to right, #a7f3d0, #34d399, #06b6d4, #22d3ee, #a7f3d0); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 5s linear infinite; line-height: 1.6; padding-top: 5px; padding-bottom: 5px; display: inline-block; }
        .gradient-text { background: linear-gradient(90deg, #ffffff 0%, #38bdf8 50%, #818cf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200% auto; animation: shine 5s linear infinite; line-height: 1.6; padding-top: 5px; padding-bottom: 5px; display: inline-block; }
        @keyframes shine { to { background-position: 200% center; } }
        .section-header { font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
        .section-header::after { content: ''; height: 1px; flex: 1; background: linear-gradient(90deg, var(--glass-border), transparent); }
        .btn-primary { background: linear-gradient(135deg, var(--primary-glow), #22d3ee); color: #0f172a; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3); }
        .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .search-input { width: 100%; padding: 12px 20px; border-radius: 50px; background: rgba(15,23,42,0.8); border: 1px solid var(--glass-border); color: white; font-size: 1rem; outline: none; transition: 0.3s; }
        .search-input:focus { border-color: var(--primary-glow); box-shadow: 0 0 15px rgba(6,182,212,0.1); }
        .input-field { width: 100%; padding: 12px 16px; border-radius: 12px; background: rgba(15,23,42,0.8); border: 1px solid var(--glass-border); color: white; font-size: 0.95rem; outline: none; transition: 0.3s; }
        .carousel-track { display: flex; gap: 24px; padding: 10px 0; width: max-content; }
        .offer-card { width: 240px; height: 160px; background: linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid var(--glass-border); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0; transition: all 0.3s; }
        .offer-card:hover { border-color: var(--card-color); transform: translateY(-5px); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5); }
        .tech-chip { padding: 10px 24px; background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: 99px; font-size: 0.95rem; font-weight: 500; color: #cbd5e1; white-space: nowrap; flex-shrink: 0; }
        .subject-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; }
        .subject-card { aspect-ratio: 1; background: linear-gradient(135deg, rgba(255,255,255,0.03), transparent); border: 1px solid var(--glass-border); border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 15px; cursor: pointer; transition: all 0.3s; }
        .subject-card:hover { background: linear-gradient(135deg, rgba(6,182,212,0.1), transparent); border-color: var(--primary-glow); transform: translateY(-5px); }
        .subject-icon { width: 60px; height: 60px; border-radius: 50%; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; color: var(--text-main); flex-shrink: 0; }
        .subject-card h3 { font-size: 1.1rem; font-weight: 600; color: white; line-height: 1.2; margin-bottom: 4px; }
      `}</style>

      <nav className="sidebar">
        <div className="nav-group">
          <NavIcon icon={<Home size={24} />} id="home" active={activeTab} set={setActiveTab} tooltip={t(content.nav_home)} />
          <NavIcon icon={<BookOpen size={24} />} id="notes" active={activeTab} set={setActiveTab} tooltip={t(content.nav_notes)} />
          <NavIcon icon={<Zap size={24} />} id="quiz" active={activeTab} set={setActiveTab} tooltip={t(content.nav_quiz)} />
          <NavIcon icon={<FileText size={24} />} id="assignments" active={activeTab} set={setActiveTab} tooltip={t(content.nav_assign)} />
          
          <NavIcon icon={<MessageCircle size={24} />} id="doubts" active={activeTab} set={setActiveTab} tooltip={t(content.nav_doubts)} />

          <NavIcon icon={<PenTool size={24} />} id="exams" active={activeTab} set={setActiveTab} tooltip={t(content.nav_exams)} />
          <div className="mobile-account-icon">
            <NavIcon icon={<User size={24} />} id="account" active={activeTab} set={setActiveTab} tooltip={t(content.nav_acc)} />
          </div>
        </div>
        <div className="nav-group nav-spacer-bottom">
          <NavIcon icon={<User size={24} />} id="account" active={activeTab} set={setActiveTab} tooltip={t(content.nav_acc)} />
        </div>
      </nav>

      <main className="main-content">
        <div style={{ position: 'absolute', top: 20, right: 30, zIndex: 100 }}>
          
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              style={{
                position: 'fixed', top: '20px', left: '50%',
                background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                color: 'white', padding: '12px 24px', borderRadius: '50px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 9999, fontWeight: 600,
                backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">

          {/* 1. HOME TAB */}
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ marginBottom: '3rem', marginTop: '1rem' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, margin: 0 }} className="title-ash-blue">
                  {t(content.welcome)}, {user?.name?.split(' ')[0] || 'Student'}.
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', marginTop: '10px' }}>{t(content.subtitle)}</p>
              </div>

              <div style={{ marginBottom: '3rem', overflow: 'hidden' }}>
                <div className="section-header gradient-text" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }}>{t(content.feat)}</div>
                <motion.div className="carousel-track" animate={{ x: [0, -1000] }} transition={{ ease: "linear", duration: 35, repeat: Infinity }}>
                  {[...OFFERS, ...OFFERS, ...OFFERS].map((item, i) => (
                    <div key={i} className="offer-card" style={{ '--card-color': item.color }}>
                      <div style={{ color: item.color }}>{React.cloneElement(item.icon, { size: 28 })}</div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{item.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <div style={{ marginBottom: '3rem', overflow: 'hidden' }}>
                <div className="section-header gradient-text" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }}>{t(content.skills)}</div>
                <motion.div className="carousel-track" animate={{ x: [-500, 0] }} transition={{ ease: "linear", duration: 40, repeat: Infinity }}>
                  {[...SUBJECTS_DATA, ...SUBJECTS_DATA, ...SUBJECTS_DATA].map((s, i) => (
                    <div key={i} className="tech-chip" style={{ borderLeft: `3px solid ${s.color}` }}>{s.name}</div>
                  ))}
                </motion.div>
              </div>

              <NewsSection user={user} />
            </motion.div>
          )}

          {/* 2. NOTES TAB */}
          {activeTab === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%' }}>
              <NotesSection user={user} subjectsData={SUBJECTS_DATA} />
            </motion.div>
          )}

          {/* 3. QUIZ TAB */}
          {activeTab === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%' }}>
              <QuizSection user={user} subjectsData={SUBJECTS_DATA} showToast={showToast} />
            </motion.div>
          )}

          {/* 4. ASSIGNMENTS TAB */}
          {activeTab === 'assignments' && (
            <motion.div key="assignments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 className="title-cyan-emerald" style={{ fontSize: '2.5rem', marginBottom: '30px' }}>{t(content.nav_assign)}</h1>
                <AssignmentWidget user={user} fullPage={true} />
              </div>
            </motion.div>
          )}

          {/* 5. DOUBT CHAT TAB */}
          {activeTab === 'doubts' && (
            <motion.div key="doubts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DoubtChatManager user={user} />
            </motion.div>
          )}

          {/* 6. EXAMS TAB */}
          {activeTab === 'exams' && (
            <motion.div key="exams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 className="title-cyan-emerald" style={{ fontSize: '2.5rem', marginBottom: '30px' }}>{t(content.nav_exams)}</h1>
                <ExamWidget 
                  user={user} 
                  onStart={(exam) => setActiveExamSession({ exam })}
                  lastExamResult={lastExamResult}
                  setLastExamResult={setLastExamResult}
                  fullPage={true} 
                />
              </div>
            </motion.div>
          )}

          {/* 7. ACCOUNT */}
          {activeTab === 'account' && (
            <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccountSection user={user} setUser={setUser} handleLogout={handleLogout} showToast={showToast} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

/* --- HELPER COMPONENTS --- */

function NavIcon({ icon, id, active, set, tooltip }) {
  const isActive = active === id;
  return (
    <div className={`nav-icon-box ${isActive ? 'active' : ''}`} onClick={() => set(id)} title={tooltip}>
      {icon}
      {isActive && <motion.div layoutId="glow" style={{ position: 'absolute', inset: 0, borderRadius: '14px', boxShadow: '0 0 15px var(--primary-glow)', opacity: 0.3 }} />}
    </div>
  )
}

function Skeleton({ width, height }) {
  return (
    <div style={{
      width: width || '100%',
      height: height || '20px',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
      backgroundSize: '200% 100%',
      borderRadius: '8px',
      animation: 'shimmer 1.5s infinite'
    }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

/* === NEW: DOUBT CHAT MANAGER (STUDENT VERSION) === */
function DoubtChatManager({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const scrollRef = useRef(null);

  // 🔹 Initialize translation hook
  const { t } = useLanguage();

  // 🔹 Define all translations for the chat UI
  const content = {
    delete_confirm: { en: "Delete this message?", pa: "ਕੀ ਇਹ ਸੁਨੇਹਾ ਮਿਟਾਉਣਾ ਹੈ?", hi: "क्या यह संदेश हटाएं?", bn: "এই বার্তা মুছবেন?" },
    delete_fail: { en: "Failed to delete", pa: "ਮਿਟਾਉਣ ਵਿੱਚ ਅਸਫਲ", hi: "हटाने में विफल", bn: "মুছতে ব্যর্থ" },
    no_class: { en: "No Class Assigned", pa: "ਕੋਈ ਕਲਾਸ ਨਹੀਂ ਦਿੱਤੀ ਗਈ", hi: "कोई कक्षा असाइन नहीं की गई", bn: "কোনো ক্লাস নির্ধারণ করা হয়নি" },
    class_text: { en: "Class", pa: "ਕਲਾਸ", hi: "कक्षा", bn: "ক্লাস" }, 
    doubts: { en: "Doubts", pa: "ਸ਼ੰਕੇ", hi: "डाउट्स", bn: "সন্দেহ" },
    live_chat: { en: "Live Chat", pa: "ਲਾਈਵ ਚੈਟ", hi: "लाइव चैट", bn: "লাইভ চ্যাট" },
    no_doubts: { en: "No doubts yet. Be the first to ask!", pa: "ਅਜੇ ਕੋਈ ਸ਼ੰਕਾ ਨਹੀਂ। ਪੁੱਛਣ ਵਾਲੇ ਪਹਿਲੇ ਬਣੋ!", hi: "अभी तक कोई डाउट नहीं। पूछने वाले पहले व्यक्ति बनें!", bn: "এখনও কোনো সন্দেহ নেই। প্রথম জিজ্ঞাসা করুন!" },
    just_now: { en: "Just now", pa: "ਹੁਣੇ", hi: "अभी-अभी", bn: "এইমাত্র" },
    replying_to: { en: "Replying to", pa: "ਨੂੰ ਜਵਾਬ ਦੇ ਰਹੇ ਹੋ", hi: "जवाब दे रहे हैं", bn: "উত্তর দিচ্ছেন" },
    ask_doubt: { en: "Ask a doubt...", pa: "ਕੋਈ ਸ਼ੰਕਾ ਪੁੱਛੋ...", hi: "एक डाउट पूछें...", bn: "একটি সন্দেহ জিজ্ঞাসা করুন..." },
    send_fail: { en: "Failed to send message", pa: "ਸੁਨੇਹਾ ਭੇਜਣ ਵਿੱਚ ਅਸਫਲ", hi: "संदेश भेजने में विफल", bn: "বার্তা পাঠাতে ব্যর্থ" }
  };

  useEffect(() => {
    if (!user?.className) return;
    const fetchChat = async () => {
      try {
        const res = await api.get(`/doubts/${user.className}`);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to load chat", err);
      }
    };
    fetchChat();
    const interval = setInterval(fetchChat, 3000); 
    return () => clearInterval(interval);
  }, [user?.className]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.className) return;

    const myId = user._id || user.id;

    try {
      const payload = {
        className: user.className,
        text: newMessage,
        senderName: user.name,
        role: 'student', 
        userId: myId,
        replyTo: replyingTo ? {
          id: replyingTo._id,
          sender: replyingTo.senderName,
          text: replyingTo.text.substring(0, 50) + (replyingTo.text.length > 50 ? '...' : '')
        } : null
      };
      
      setMessages([...messages, { ...payload, createdAt: new Date() }]);
      setNewMessage('');
      setReplyingTo(null);

      await api.post('/doubts', payload);
    } catch (err) {
      alert(t(content.send_fail)); // 🔹 Translated alert
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm(t(content.delete_confirm))) return; // 🔹 Translated confirm dialog
    try {
      await api.delete(`/doubts/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch(err) { 
      alert(t(content.delete_fail)); // 🔹 Translated alert
    }
  };

  if (!user?.className) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
        <AlertCircle size={48} color="#fb923c" style={{ marginBottom: '20px', opacity: 0.8 }} />
        <h3 style={{ color: '#cbd5e1' }}>{t(content.no_class)}</h3>
      </div>
    );
  }

  const currentUserId = user._id || user.id;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="title-cyan-emerald" style={{ margin: 0, fontSize: '1.8rem' }}>
          {t(content.class_text)} {user.className} {t(content.doubts)}
        </h2>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t(content.live_chat)}</div>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>
              {t(content.no_doubts)}
            </div>
          )}
          
          {messages.map((msg, idx) => {
            const isMe = String(msg.userId) === String(currentUserId);
            const isTeacher = msg.role === 'teacher';

            return (
              <div key={idx} style={{ 
                alignSelf: isMe ? 'flex-end' : 'flex-start', 
                maxWidth: '75%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start'
              }}>
                <div style={{ 
                  background: isMe 
                    ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' 
                    : isTeacher 
                        ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' 
                        : 'rgba(30, 41, 59, 0.8)',
                  padding: '12px 16px', 
                  borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  color: 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  minWidth: '120px',
                  border: isTeacher ? '1px solid #f472b6' : 'none',
                  position: 'relative'
                }}>
                  
                  {msg.replyTo && (
                    <div style={{ 
                      background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid #fb923c', 
                      padding: '8px', marginBottom: '8px', borderRadius: '4px', fontSize: '0.75rem' 
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#fb923c' }}>{msg.replyTo.sender}</div>
                      <div style={{ opacity: 0.8 }}>{msg.replyTo.text}</div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '15px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isMe ? '#e0f2fe' : (isTeacher ? '#fce7f3' : '#94a3b8') }}>
                      {msg.senderName} {isTeacher ? '👑' : ''}
                    </span>
                    
                    <div style={{ display: 'flex', gap: '8px', opacity: 0.8 }}>
                       <button onClick={() => setReplyingTo(msg)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding:0 }} title="Reply">
                         <CornerUpLeft size={14} />
                       </button>

                       {isMe && (
                         <button onClick={() => handleDelete(msg._id)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding:0 }} title="Delete">
                           <Trash2 size={14} />
                         </button>
                       )}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.95rem', wordBreak: 'break-word', lineHeight: '1.4' }}>{msg.text}</div>
                </div>

                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : t(content.just_now)}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '15px', background: 'rgba(15, 23, 42, 0.6)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
           
           {replyingTo && (
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', marginBottom: '10px', borderLeft: '3px solid #3b82f6' }}>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {t(content.replying_to)} <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>{replyingTo.senderName}</span>
                </div>
                <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16}/></button>
             </div>
           )}

           <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
            <input 
              className="input-field" 
              placeholder={t(content.ask_doubt)}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ borderRadius: '50px', paddingLeft: '20px' }}
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

function NewsSection({ user }) {
  const { t } = useLanguage();
  const content = {
    header: { en: "Class Updates", pa: "ਜਮਾਤ ਅੱਪਡੇਟ", hi: "कक्षा अपडेट", bn: "ক্লাস আপডেট" },
    no_updates: { en: "No updates from your teacher yet.", pa: "ਤੁਹਾਡੇ ਅਧਿਆਪਕ ਵੱਲੋਂ ਅਜੇ ਕੋਈ ਅੱਪਡੇਟ ਨਹੀਂ।", hi: "आपके शिक्षक से अभी तक कोई अपडेट नहीं।", bn: "আপনার শিক্ষকের কাছ থেকে এখনও কোনো আপডেট নেই।" },
    fail_load: { en: "Failed to load class updates.", pa: "ਕਲਾਸ ਅੱਪਡੇਟ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕੇ।", hi: "क्लास अपडेट लोड करने में विफल।", bn: "ক্লাস আপডেট লোড করতে ব্যর্থ।" }
  };

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.className) { setUpdates([]); return; }
    const fetchUpdates = async () => {
      try {
        setLoading(true); setError('');
        const res = await api.get(`/updates/${user.className}`);
        setUpdates(res.data || []);
      } catch (e) {
        console.warn("New route failed (404). Using fallback.");
        try {
           const fallback = await api.get('/class-updates', { 
             params: { className: user.className, limit: 100 } 
           });
           setUpdates(fallback.data || []);
        } catch (err2) {
           setError(t(content.fail_load));
        }
      } finally { setLoading(false); }
    };
    fetchUpdates();
  }, [user?.className, t]);

  return (
    <div style={{ marginBottom: '40px' }}>
      <div className="section-header gradient-text" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }}>{t(content.header)}</div>
      <div className="glass-panel" style={{ height: '350px', overflowY: 'auto', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {loading && <div className="glass-panel" style={{ height: 100, background: 'rgba(255,255,255,0.05)' }}><Skeleton height="100%" /></div>}
          {error && <p style={{ color: '#f97373', fontSize: '0.9rem' }}>{error}</p>}
          {!loading && !error && updates.length === 0 && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{t(content.no_updates)}</p>}
          {!loading && !error && updates.map((u, index) => (
            <div key={u._id || index} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '15px', borderLeft: '3px solid var(--primary-glow)', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '8px', fontWeight: 600 }}>
                 {u.text || u.message || u.content || "No Content"}
              </h4>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                <span>👤 {u.postedBy?.name || 'Teacher'}</span>
                <span>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotesSection({ user, subjectsData }) {
    const { t } = useLanguage();
    const [viewState, setViewState] = useState('subjects'); 
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [videos, setVideos] = useState([]); 
    
    const content = {
        title: { en: "Study Notes", pa: "ਪੜ੍ਹਾਈ ਦੇ ਨੋਟਸ", hi: "अध्ययन नोट्स", bn: "অধ্যয়ন নোট" },
        sel_subj: { en: "Select Subject", pa: "ਵਿਸ਼ਾ ਚੁਣੋ", hi: "विषय चुनें", bn: "বিষয় নির্বাচন করুন" },
        no_notes: { en: "No notes available for this subject.", pa: "ਇਸ ਵਿਸ਼ੇ ਲਈ ਕੋਈ ਨੋਟਸ ਉਪਲਬਧ ਨਹੀਂ ਹਨ।", hi: "इस विषय के लिए कोई नोट्स उपलब्ध नहीं हैं।", bn: "এই বিষয়ের জন্য কোনো নোট উপলব্ধ নেই।" },
        download: { en: "Open / Download", pa: "ਖੋਲ੍ਹੋ / ਡਾਊਨਲੋਡ ਕਰੋ", hi: "खोलें / डाउनलोड करें", bn: "খুলুন / ডাউনলোড করুন" },
        lessons: { en: "Materials", pa: "ਸਮੱਗਰੀ", hi: "सामग्री", bn: "উপকরণ" }
    };

    const getFileUrl = (url) => {
        if (!url) return '#';
        if (url.startsWith('http')) return url;
        return `http://localhost:5000${url}`;
    };

    useEffect(() => {
        if (user?.className) {
            api.get('/videos', { params: { className: user.className } })
               .then((res) => setVideos(res.data || []))
               .catch(console.error);
        }
    }, [user]);

    const filteredNotes = useMemo(() => {
        if (!selectedSubjectId) return [];
        return videos.filter(v => 
            v.notesUrl && 
            (v.subject || 'Misc').toLowerCase() === selectedSubjectId.toLowerCase()
        );
    }, [videos, selectedSubjectId]);

    const handleSubjectClick = (subj) => {
        setSelectedSubjectId(subj.id);
        setViewState('list');
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                 {viewState === 'list' && (
                    <button onClick={() => setViewState('subjects')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '12px', color: 'white', cursor: 'pointer' }}>
                        <ChevronLeft size={24} />
                    </button>
                 )}
                 <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, margin: 0 }} className="title-cyan-emerald">
                     {viewState === 'subjects' ? t(content.title) : subjectsData.find(s=>s.id === selectedSubjectId)?.name}
                 </h2>
            </div>

            <AnimatePresence mode="wait">
                {viewState === 'subjects' ? (
                     <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="section-header gradient-text">{t(content.sel_subj)}</div>
                        <div className="subject-grid">
                            {subjectsData.map((subj, i) => (
                                <div key={subj.id || i} className="subject-card" onClick={() => handleSubjectClick(subj)}>
                                    <div className="subject-icon" style={{ color: subj.color, border: `1px solid ${subj.color}44` }}><BookOpen size={32} /></div>
                                    <h3>{subj.name}</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>{t(content.lessons)}</p>
                                </div>
                            ))}
                        </div>
                     </motion.div>
                ) : (
                    <motion.div key="list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        {filteredNotes.length === 0 ? <p style={{ color: '#64748b' }}>{t(content.no_notes)}</p> : (
                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                 {filteredNotes.map((note) => (
                                     <div key={note._id} className="glass-panel" style={{ background: 'rgba(255,255,255,0.03)', padding: 20 }}>
                                         <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 10 }}>{note.title}</h4>
                                         <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 15 }}>
                                             {note.description || "No description provided."}
                                         </p>
                                         
                                         <a 
                                             href={getFileUrl(note.notesUrl)} 
                                             target="_blank" 
                                             rel="noopener noreferrer"
                                             className="btn-primary"
                                             style={{ 
                                                 width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', 
                                                 textDecoration: 'none', background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '10px', 
                                                 border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', fontWeight: 600, cursor: 'pointer' 
                                             }}
                                         >
                                             <Download size={18} /> {t(content.download)}
                                         </a>
                                     </div>
                                 ))}
                             </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function QuizSection({ user, subjectsData, showToast }) {
    const { t } = useLanguage();
    const [viewState, setViewState] = useState('subjects'); 
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [myAttempts, setMyAttempts] = useState({}); 

    // Quiz Player State
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [quizSubmitting, setQuizSubmitting] = useState(false);
    const [quizResult, setQuizResult] = useState(null);

    const content = {
        title: { en: "Quizzes", pa: "ਕਵਿਜ਼", hi: "क्विज़", bn: "কুইজ" },
        sel_subj: { en: "Select Subject", pa: "ਵਿਸ਼ਾ ਚੁਣੋ", hi: "विषय चुनें", bn: "বিষয় নির্বাচন করুন" },
        no_quiz: { en: "No quizzes available.", pa: "ਕੋਈ ਕਵਿਜ਼ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।", hi: "कोई क्विज़ उपलब्ध नहीं है।", bn: "কোনো কুইজ উপলব্ধ নেই।" },
        start_quiz: { en: "Start Quiz", pa: "ਕਵਿਜ਼ ਸ਼ੁਰੂ ਕਰੋ", hi: "क्विज़ शुरू करें", bn: "কুইজ শুরু করুন" },
        view_score: { en: "Review Quiz", pa: "ਕਵਿਜ਼ ਦੀ ਸਮੀਖਿਆ ਕਰੋ", hi: "क्विज़ की समीक्षा करें", bn: "কুইজ পর্যালোচনা করুন" },
        questions: { en: "Questions", pa: "ਸਵਾਲ", hi: "प्रश्न", bn: "প্রশ্ন" },
        submit: { en: "Submit Quiz", pa: "ਜਮ੍ਹਾਂ ਕਰੋ", hi: "जमा करें", bn: "জমা দিন" },
        score: { en: "Your Score", pa: "ਤੁਹਾਡਾ ਸਕੋਰ", hi: "आपका स्कोर", bn: "আপনার স্কোর" },
        grade: { en: "Grade", pa: "ਗ੍ਰੇਡ", hi: "ग्रेड", bn: "গ্রেড" },
        submitted: { en: "Submitted", pa: "ਜਮ੍ਹਾਂ ਕੀਤਾ", hi: "जमा किया", bn: "জমা দেওয়া হয়েছে" },
        pending: { en: "Pending", pa: "ਬਕਾਇਆ", hi: "लंबित", bn: "পেন্ডিং" },
        completed: { en: "Completed", pa: "ਪੂਰਾ ਹੋਇਆ", hi: "पूर्ण हुआ", bn: "সম্পন্ন" }
    };

    useEffect(() => {
        if (user?.className && (user._id || user.id)) {
            const studentId = user._id || user.id;

            api.get('/quizzes', { params: { className: user.className } })
               .then((res) => setQuizzes(res.data || []))
               .catch(console.error);

            api.get(`/quizzes/my-attempts`, { params: { studentId, email: user.email } })
               .then(res => {
                   const map = {};
                   (res.data || []).forEach(attempt => {
                       const qId = attempt.quiz?._id || attempt.quiz; 
                       map[qId] = attempt;
                   });
                   setMyAttempts(map);
               })
               .catch(() => console.warn("Past attempts route not found."));
        }
    }, [user, viewState]); 

    const filteredQuizzes = useMemo(() => {
        if (!selectedSubjectId) return [];
        return quizzes.filter(q => (q.subject || 'Misc').toLowerCase() === selectedSubjectId.toLowerCase());
    }, [quizzes, selectedSubjectId]);

    const handleSubjectClick = (subj) => {
        setSelectedSubjectId(subj.id);
        setViewState('list');
    };

    const handleStartQuiz = (quiz) => {
        setSelectedQuiz(quiz);
        const attempt = myAttempts[quiz._id]; 

        if (attempt) {
            setQuizResult({ score: attempt.score, total: attempt.total });
            setQuizAnswers(attempt.answers || new Array(quiz.questions.length).fill(-1));
        } else {
            setQuizAnswers(new Array(quiz.questions.length).fill(-1));
            setQuizResult(null);
        }
        setViewState('player');
    };

    const handleSelectOption = (qIdx, optIdx) => {
        if (quizResult) return; 
        setQuizAnswers(prev => {
            const copy = [...prev];
            copy[qIdx] = optIdx;
            return copy;
        });
    };

    const handleSubmit = async () => {
        if (!selectedQuiz || !user?.email) return;
        try {
            setQuizSubmitting(true);
            const res = await api.post(`/quizzes/${selectedQuiz._id}/submit`, {
                answers: quizAnswers,
                name: user.name,
                email: user.email,
                className: user.className
            });
            
            const resultData = { score: res.data.score, total: res.data.total, answers: quizAnswers };
            setQuizResult(resultData);
            setMyAttempts(prev => ({ ...prev, [selectedQuiz._id]: resultData }));
            showToast('Quiz submitted successfully!', 'success');
        } catch (err) {
            showToast('Failed to submit quiz.', 'error');
        } finally {
            setQuizSubmitting(false);
        }
    };

    return (
         <div style={{ width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                 {viewState !== 'subjects' && (
                    <button onClick={() => {
                        if(viewState === 'player') setViewState('list');
                        else setViewState('subjects');
                    }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '12px', color: 'white', cursor: 'pointer' }}>
                        <ChevronLeft size={24} />
                    </button>
                 )}
                 <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, margin: 0 }} className="title-cyan-emerald">
                     {viewState === 'subjects' ? t(content.title) : (viewState === 'list' ? subjectsData.find(s=>s.id === selectedSubjectId)?.name : selectedQuiz?.title)}
                 </h2>
            </div>

            <AnimatePresence mode="wait">
                {viewState === 'subjects' && (
                    <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="section-header gradient-text">{t(content.sel_subj)}</div>
                        <div className="subject-grid">
                            {subjectsData.map((subj, i) => (
                                <div key={subj.id || i} className="subject-card" onClick={() => handleSubjectClick(subj)}>
                                    <div className="subject-icon" style={{ color: subj.color, border: `1px solid ${subj.color}44` }}><Zap size={32} /></div>
                                    <h3>{subj.name}</h3>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* 2. QUIZ LIST */}
                {viewState === 'list' && (
                    <motion.div key="list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        {filteredQuizzes.length === 0 ? <p style={{ color: '#64748b' }}>{t(content.no_quiz)}</p> : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                {filteredQuizzes.map((quiz) => {
                                    const attempt = myAttempts[quiz._id]; 
                                    const isDone = !!attempt;
                                    const badge = isDone ? getBadge(attempt.score, attempt.total) : null; // 🔥 GET BADGE

                                    return (
                                        <div key={quiz._id} className="glass-panel" style={{ 
                                            background: 'rgba(255,255,255,0.02)', 
                                            padding: '20px',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            borderLeft: isDone ? '4px solid #10b981' : '1px solid rgba(255,255,255,0.1)' 
                                        }}>
                                            <div>
                                                <div style={{display:'flex', justifyContent:'space-between', marginBottom: 5}}>
                                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin:0 }}>{quiz.title}</h3>
                                                    {badge ? ( // 🔥 SHOW BADGE IF EARNED
                                                      <span style={{ 
                                                        background: badge.bg, color: badge.color, padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 
                                                      }}>
                                                        {badge.icon} {badge.label}
                                                      </span>
                                                    ) : (
                                                      <span style={{ 
                                                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, 
                                                        background: isDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)', 
                                                        color: isDone ? '#10b981' : '#f59e0b' 
                                                      }}>
                                                        {isDone ? t(content.submitted) : t(content.pending)}
                                                      </span>
                                                    )}
                                                </div>
                                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '12px' }}>{quiz.subject}</p>
                                                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '20px' }}>
                                                    🎯 {t(content.questions)}: {quiz.questions.length}
                                                </div>
                                            </div>

                                            {isDone ? (
                                                <div style={{ marginTop: '10px' }}>
                                                    <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.1)', textAlign:'center', marginBottom:'15px' }}>
                                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#3b82f6' }}>
                                                            {t(content.grade)}: {attempt.score} / {attempt.total}
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleStartQuiz(quiz)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight:600 }}>
                                                        {t(content.view_score)}
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => handleStartQuiz(quiz)} className="btn-primary" style={{ width: '100%' }}>
                                                    <Zap size={16} /> {t(content.start_quiz)}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* 3. QUIZ PLAYER */}
                {viewState === 'player' && selectedQuiz && (
                    <motion.div key="player" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
                             {quizResult && (
                                 <div style={{ padding: 20, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 12, marginBottom: 25, border: '1px solid #3b82f6', textAlign: 'center' }}>
                                     <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
                                         {t(content.score)}: <span style={{ color: '#60a5fa' }}>{quizResult.score} / {quizResult.total}</span>
                                     </div>
                                     {/* 🔥 BADGE PREVIEW IN RESULT 🔥 */}
                                     {(() => {
                                        const b = getBadge(quizResult.score, quizResult.total);
                                        return b ? (
                                          <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: b.bg, color: b.color, fontWeight: 'bold' }}>
                                            {b.icon} {b.label} Badge Earned!
                                          </div>
                                        ) : null;
                                     })()}
                                 </div>
                             )}

                             {selectedQuiz.questions.map((q, qIdx) => (
                                <div key={qIdx} style={{ marginBottom: 25, paddingBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <h4 style={{ marginBottom: 15, fontSize: '1rem' }}>Q{qIdx + 1}. {q.questionText}</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        {q.options.map((opt, optIdx) => (
                                            <div 
                                                key={optIdx} 
                                                onClick={() => handleSelectOption(qIdx, optIdx)}
                                                style={{ 
                                                    padding: '12px', borderRadius: '8px', 
                                                    background: quizAnswers[qIdx] === optIdx ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.05)',
                                                    border: `1px solid ${quizAnswers[qIdx] === optIdx ? '#06b6d4' : 'transparent'}`,
                                                    cursor: quizResult ? 'default' : 'pointer',
                                                    opacity: quizResult && quizAnswers[qIdx] !== optIdx ? 0.5 : 1,
                                                    display: 'flex', alignItems: 'center', gap: 10
                                                }}
                                            >
                                                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #cbd5e1', background: quizAnswers[qIdx] === optIdx ? '#06b6d4' : 'transparent' }}></div>
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             ))}
                             
                             {!quizResult ? (
                                 <button onClick={handleSubmit} disabled={quizSubmitting} className="btn-primary" style={{ width: '100%' }}>
                                     {quizSubmitting ? "Submitting..." : t(content.submit)}
                                 </button>
                             ) : (
                                 <button onClick={() => setViewState('list')} className="btn-primary" style={{ width: '100%', background: '#22949e' }}>
                                     Back to List
                                 </button>
                             )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
         </div>
    );
}

function ExamPlayer({ exam, user, onClose, onComplete, content, t }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(new Array(exam.totalQuestions).fill(-1)); 
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60); 
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen().catch(() => { });
    const timer = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { handleSubmit(true); return 0; } return p - 1; });
    }, 1000);
    return () => { clearInterval(timer); if (document.exitFullscreen) document.exitFullscreen().catch(() => { }); };
  }, []);

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
    if (!auto && !window.confirm(t(content.submit_confirm))) return;
    setSubmitting(true);
    const totalMarks = exam.totalMarks || exam.questions.length;
    const releaseTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    try {
      const res = await api.post(`/exams/${exam._id}/submit`, {
        studentId: user._id || user.id, studentName: user.name, className: user.className,
        selectedAnswers: answers, totalMarks: totalMarks, resultReleaseTime: releaseTime, examId: exam._id 
      });
      onComplete(exam, { score: res.data.score || 0, totalMarks, msg: auto ? t(content.time_up) : t(content.exam_success) });
    } catch (e) { alert(t(content.exam_fail)); setSubmitting(false); }
  };

  const q = exam.questions[currentQ];
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60) < 10 ? '0' : ''}${s % 60}`;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020617', zIndex: 9999, display: 'flex', flexDirection: 'column', color: 'white' }}>
      <div style={{ height: 60, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{exam.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: timeLeft < 60 ? '#ef4444' : '#4ade80', fontWeight: 700, fontSize: '1.1rem' }}><Clock size={20} /> {formatTime(timeLeft)}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>{t(content.exit)}</button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '250px 1fr', height: 'calc(100vh - 60px)' }}>
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', padding: 20, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: 15 }}>{t(content.questions)}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {answers.map((ans, i) => (<button key={i} onClick={() => setCurrentQ(i)} style={{ height: 40, borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', background: currentQ === i ? '#3b82f6' : (ans !== -1 ? '#10b981' : 'rgba(255,255,255,0.1)'), color: 'white' }}>{i + 1}</button>))}
          </div>
        </div>
        <div style={{ padding: 40, overflowY: 'auto' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ marginBottom: 30, fontSize: '1.3rem', fontWeight: 600 }}><span style={{ color: '#94a3b8' }}>Q{currentQ + 1}.</span> {q.questionText}</div>
            <div style={{ display: 'grid', gap: 15 }}>
              {q.options.map((opt, i) => (
                <div key={i} onClick={() => { const n = [...answers]; n[currentQ] = i; setAnswers(n); }} style={{ padding: '15px 20px', borderRadius: 12, border: '1px solid', cursor: 'pointer', borderColor: answers[currentQ] === i ? '#3b82f6' : 'rgba(255,255,255,0.1)', background: answers[currentQ] === i ? 'rgba(59, 130, 246, 0.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: 15 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid', borderColor: answers[currentQ] === i ? '#3b82f6' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{answers[currentQ] === i && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }} />}</div>{opt}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 50 }}>
              <button disabled={currentQ === 0} onClick={() => setCurrentQ(p => p - 1)} style={{ padding: '10px 24px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer', opacity: currentQ === 0 ? 0.5 : 1 }}>{t(content.prev)}</button>
              {currentQ === exam.questions.length - 1 ? <button onClick={() => handleSubmit(false)} className="btn-primary" style={{ background: '#ef4444' }}>{t(content.submit_exam)}</button> : <button onClick={() => setCurrentQ(p => p + 1)} className="btn-primary">{t(content.next)}</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamWidget({ user, subject, onStart, lastExamResult, setLastExamResult, fullPage }) {
  const { t } = useLanguage();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examResults, setExamResults] = useState({});

  const content = {
    live: { en: "LIVE", pa: "ਲਾਈਵ", hi: "लाइव", bn: "লাইভ" },
    no_active: { en: "No active exams.", pa: "ਕੋਈ ਸਰਗਰਮ ਪ੍ਰੀਖਿਆ ਨਹੀਂ।", hi: "कोई सक्रिय परीक्षा नहीं।", bn: "কোনো সক্রিয় পরীক্ষা নেই।" },
    start: { en: "Start Exam", pa: "ਪ੍ਰੀਖਿਆ ਸ਼ੁਰੂ ਕਰੋ", hi: "परीक्षा शुरू करें", bn: "পরীক্ষা शुरू করুন" },
    submitted: { en: "Submitted", pa: "ਜਮ੍ਹਾਂ ਕੀਤਾ", hi: "जमा किया", bn: "জমা দেওয়া হয়েছে" },
    result: { en: "View Result", pa: "ਨਤੀਜਾ ਦੇਖੋ", hi: "परिणाम देखें", bn: "ফলাফল দেখুন" },
    score_alert: { en: "YOUR EXAM RESULT", pa: "ਤੁਹਾਡਾ ਨਤੀਜਾ", hi: "आपका परिणाम", bn: "আপনার ফলাফল" }
  };

  useEffect(() => {
    if (user?.className) {
      setLoading(true);
      api.get('/exams', { params: { className: user.className } })
        .then(async (res) => {
          const filtered = subject ? (res.data || []).filter(e => e.subject === subject) : (res.data || []);
          setExams(filtered);
          const resultsMap = {};
          if (user?._id || user?.id) {
             const studentId = user._id || user.id;
             await Promise.all(filtered.map(async (exam) => {
                try {
                   if (lastExamResult && lastExamResult.examId === exam._id) { resultsMap[exam._id] = { score: lastExamResult.score, totalMarks: lastExamResult.totalMarks }; }
                   else { const r = await api.get(`/exams/${exam._id}/result`, { params: { studentId } }); if (r.data?.score !== undefined) resultsMap[exam._id] = { score: r.data.score, totalMarks: r.data.totalMarks }; }
                } catch (e) { }
             }));
             setExamResults(resultsMap);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, subject, lastExamResult]);

const handleShowResult = (examId, title) => {
    const result = examResults[examId];
    if (result) {
      const percentage = (result.score / result.totalMarks) * 100;
      let remark = percentage >= 80 ? "🌟 Excellent!" : percentage >= 60 ? "👍 Good job!" : "⚠️ Needs Improvement.";
      
      // 🔥 BADGE LOGIC IN EXAM WIDGET 🔥
      let badgeStr = "";
      if (percentage >= 90) badgeStr = "🥇 GOLD Badge Earned!";
      else if (percentage >= 75) badgeStr = "🥈 SILVER Badge Earned!";
      else if (percentage >= 60) badgeStr = "🥉 BRONZE Badge Earned!";

      alert(`📢 ${t(content.score_alert)}\n\nExam: ${title}\nStudent: ${user.name}\n\n✅ Score: ${result.score} / ${result.totalMarks}\n📊 Percentage: ${percentage.toFixed(1)}%\n\n${badgeStr}\n${remark}`);
    }
  };
  
  return (
    <div className={fullPage ? "" : "glass-panel"} style={fullPage ? {} : { background: 'linear-gradient(135deg, rgba(239,68,68,0.1), transparent)', border: '1px solid rgba(239,68,68,0.3)', minHeight: '160px' }}>
      {!fullPage && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}><div style={{ color: '#fca5a5', fontWeight: 700 }}>Exams</div><div style={{ background: '#ef4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>{t(content.live)}</div></div>}
      {loading && <div style={{ display: 'flex', justifyContent: 'center' }}><Loader2 className="animate-spin" color="#ef4444" /></div>}
      {!loading && exams.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', marginTop: '10px' }}>{t(content.no_active)}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: fullPage ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr', gap: '15px' }}>
        {exams.map(exam => {
           const result = examResults[exam._id];
           return (
             <div key={exam._id} className="glass-panel" style={{ padding: '20px', background: fullPage ? 'rgba(255,255,255,0.03)' : 'transparent', border: fullPage ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px', fontWeight: '800' }}>{exam.title}</h3>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '15px', display: 'flex', gap: '10px' }}><span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{exam.subject}</span><span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{exam.duration} mins</span><span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{exam.totalQuestions} Qs</span></div>
                {!result ? <button onClick={() => onStart(exam)} style={{ width: '100%', background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><PenTool size={16} /> {t(content.start)}</button> : <div style={{ display: 'flex', gap: '10px' }}><div style={{ flex: 1, background: 'rgba(30, 41, 59, 0.6)', color: '#94a3b8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 600 }}>{t(content.submitted)}</div><button onClick={() => handleShowResult(exam._id, exam.title)} style={{ flex: 1.5, background: '#10b981', border: 'none', color: '#064e3b', padding: '10px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Award size={18} /> {t(content.result)}</button></div>}
             </div>
           );
        })}
      </div>
    </div>
  );
}

function AssignmentWidget({ user, fullPage }) {
  const { t } = useLanguage();
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.className) { fetchAssignments(); fetchMySubmissions(); }
  }, [user]);

  const fetchAssignments = async () => { try { const res = await api.get('/assignments', { params: { className: user.className } }); setAssignments(res.data || []); } catch (error) { console.error(error); } };
  const fetchMySubmissions = async () => { try { const res = await api.get('/assignments/my-submissions'); setMySubmissions(res.data || []); } catch (error) { setMySubmissions([]); } };

  const handleSubmitAssignment = async () => {
    if (!file || !user) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append('file', file); 
    formData.append('remarks', remarks || ''); 
    formData.append('studentId', user._id || user.id); 
    formData.append('studentName', user.name); 
    formData.append('className', user.className);
    
    try {
      const tempSubmission = { assignment: { _id: selectedAssignment._id }, assignmentId: selectedAssignment._id, graded: false, createdAt: new Date().toISOString() };
      setMySubmissions(prev => [tempSubmission, ...prev]);
      await api.post(`/assignments/${selectedAssignment._id}/submit`, formData);
      alert(t(content.submit_success_alert)); setShowSubmitModal(false); setFile(null); setRemarks(''); fetchAssignments(); fetchMySubmissions();
    } catch (error) { alert('Failed to submit.'); fetchMySubmissions(); } finally { setSubmitting(false); }
  };

  const getFileUrl = (url) => (!url ? '#' : url.startsWith('http') ? url : `http://localhost:5000${url}`);

  const content = {
    pending: { en: "Pending", pa: "ਬਕਾਇਆ", hi: "लंबित", bn: "পেন্ডিং" },
    submit: { en: "Submit", pa: "ਸਬਮਿਟ", hi: "जमा करें", bn: "जমা দিন" },
    submitted: { en: "Submitted", pa: "ਜਮ੍ਹਾਂ ਕੀਤਾ", hi: "जमा किया", bn: "জমা দেওয়া হয়েছে" },
    due: { en: "Due", pa: "ਅੰਤਿਮ", hi: "देय", bn: "বাকি" },
    marks: { en: "Marks", pa: "ਨੰਬਰ", hi: "अंक", bn: "নম্বর" },
    submit_assignment: { en: "Submit Assignment", pa: "ਅਸਾਈਨਮੈਂਟ ਸਬਮਿਟ ਕਰੋ", hi: "असाइनमेंट जमा करें", bn: "অ্যাসাইনমেন্ট জমা দিন" },
    select_file: { en: "Select File", pa: "ਫਾਈਲ ਚੁਣੋ", hi: "फ़ाइल चुनें", bn: "ফাইল নির্বাচন করুন" },
    remarks: { en: "Remarks", pa: "ਰਿਮਾਰਕਸ", hi: "टिप्पणी", bn: "মন্তব্য" },
    cancel: { en: "Cancel", pa: "ਰੱਦ ਕਰੋ", hi: "रद्द करें", bn: "বাতিল করুন" },
    upload: { en: "Upload", pa: "ਅਪਲੋਡ", hi: "अपलोड", bn: "আপলোড" },
    uploading: { en: "Uploading...", pa: "ਅਪਲੋਡ...", hi: "अपलोड...", bn: "আপলোড..." },
    your_grade: { en: "Grade", pa: "ਗ੍ਰੇਡ", hi: "ग्रेड", bn: "গ্রেড" },
    not_graded: { en: "Not graded", pa: "ਨੰਬਰ ਨਹੀਂ", hi: "ग्रेड नहीं", bn: "গ্রেড নেই" },
    teacher_rem: { en: "Teacher:", pa: "ਅਧਿਆਪਕ:", hi: "शिक्षक:", bn: "শিক্ষক:" },
    submit_success_alert: { en: "Assignment submitted successfully!", pa: "ਅਸਾਈਨਮੈਂਟ ਸਫਲਤਾਪੂਰਵਕ ਜਮ੍ਹਾਂ ਹੋ ਗਈ!", hi: "असाइनमेंट सफलतापूर्वक जमा किया गया!", bn: "অ্যাসাইনমেন্ট সফলভাবে জমা দেওয়া হয়েছে!" }
  };

  return (
    <div className={fullPage ? "" : "glass-panel"} style={{ display: 'grid', gap: '20px', gridTemplateColumns: fullPage ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr' }}>
      {assignments.map(a => {
        const submission = mySubmissions.find(s => String(s.assignment?._id || s.assignment) === String(a._id));
        const isSubmitted = !!submission;
        
        // 🔥 BADGE FOR ASSIGNMENT 🔥
        let badge = null;
        if (submission && submission.graded) {
            badge = getBadge(submission.marks, a.totalMarks);
        }

        return (
          <div key={a._id} className="glass-panel" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: `4px solid ${isSubmitted ? '#10b981' : '#f59e0b'}` }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{a.title}</h3>
                  {badge ? (
                      <span style={{ background: badge.bg, color: badge.color, padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {badge.icon} {badge.label}
                      </span>
                  ) : (
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: isSubmitted ? '#10b98120' : '#f59e0b20', color: isSubmitted ? '#10b981' : '#f59e0b' }}>
                          {isSubmitted ? t(content.submitted) : t(content.pending)}
                      </span>
                  )}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>{a.subject}</p>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{a.dueDate && <div>⏰ {t(content.due)}: {new Date(a.dueDate).toLocaleDateString()}</div>}<div>🎯 {t(content.marks)}: {a.totalMarks}</div></div>
            </div>
            {isSubmitted && submission ? (
              <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontWeight: 600, color: submission.graded ? '#3b82f6' : '#f59e0b', fontSize: '1.1rem' }}>{submission.graded ? `${t(content.your_grade)}: ${submission.marks} / ${a.totalMarks || 100}` : t(content.not_graded)}</div>
                {submission.remarks && <div style={{ fontSize: '0.85rem', marginTop: '5px', color: '#94a3b8' }}>{t(content.teacher_rem)} "{submission.remarks}"</div>}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button className="btn-primary" onClick={() => { setSelectedAssignment(a); setShowSubmitModal(true); }} style={{ flex: 1, fontSize: '0.9rem', padding: '10px' }}><Upload size={16} /> {t(content.submit)}</button>
                <a href={getFileUrl(a.fileUrl)} target="_blank" rel="noopener noreferrer" style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Download size={20} /></a>
              </div>
            )}
          </div>
        );
      })}
      {showSubmitModal && selectedAssignment && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999, padding: "20px" }}>
          <div className="glass-panel" style={{ width: "550px", maxWidth: "95%", maxHeight: "85vh", overflowY: "auto", padding: "30px" }}>
            <h3 style={{ marginBottom: '20px' }}>{t(content.submit_assignment)}</h3>
            <p style={{ marginBottom: '20px', color: '#94a3b8' }}>{selectedAssignment.title}</p>
            <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>{t(content.select_file)}</label><div onClick={() => document.getElementById('submitFileInput').click()} style={{ border: '2px dashed #475569', padding: '30px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', marginBottom: '20px', background: file ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}>{file ? <div style={{ color: '#3b82f6', fontWeight: 600 }}>{file.name}</div> : <div style={{ color: '#94a3b8' }}>Click to select PDF or Image</div>}<input id="submitFileInput" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" hidden onChange={(e) => setFile(e.target.files[0])} /></div></div>
            <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>{t(content.remarks)}</label><textarea className="input-field" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} style={{ minHeight: '80px' }} /></div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}><button onClick={() => { setShowSubmitModal(false); setFile(null); setRemarks(''); }} style={{ padding: '10px 20px', background: 'none', border: '1px solid #475569', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer' }}>{t(content.cancel)}</button><button onClick={handleSubmitAssignment} disabled={submitting || !file} className="btn-primary">{submitting ? <><Loader2 className="animate-spin" size={16}/> {t(content.uploading)}</> : t(content.upload)}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function AccountSection({ user, setUser, handleLogout, showToast }) {
  const { t } = useLanguage();
  const [generating, setGenerating] = useState(false);
  const [reveal, setReveal] = useState(false);
    
  const content = {
    class: { en: "Class", pa: "ਜਮਾਤ", hi: "कक्षा", bn: "ক্লাস" },
    assigned: { en: "Assigned Class", pa: "ਨਿਰਧਾਰਤ ਜਮਾਤ", hi: "आवंटित कक्षा", bn: "নির্ধারিত ক্লাস" },
    parent_acc: { en: "PARENT ACCESS", pa: "ਮਾਪਿਆਂ ਦੀ ਪਹੁੰਚ", hi: "अभिभावक एक्सेस", bn: "অভিভাবক অ্যাক্সেস" },
    generate: { en: "Generate", pa: "ਜਨਰੇਟ ਕਰੋ", hi: "उत्पन्न करें", bn: "জেনারেট করুন" },
    sign_out: { en: "Sign Out", pa: "ਸਾਈਨ ਆਉਟ", hi: "साइन आउट", bn: "সাইন আউট" },
    hide: { en: "Hide", pa: "ਲੁਕਾਓ", hi: "छिपाएं", bn: "লুকান" },
    show: { en: "Show", pa: "ਦਿਖਾਓ", hi: "दिखाएं", bn: "দেখান" }
  };

  const generateCode = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/parents/generate-code');
      if (res.data?.code || res.data?.parentAccessCode) {
        const u = { ...user, parentAccessCode: res.data.code || res.data.parentAccessCode };
        setUser(u); localStorage.setItem('user', JSON.stringify(u));
        showToast('Parent code generated!', 'success');
      }
    } catch (e) { showToast('Failed to generate code.', 'error'); } finally { setGenerating(false); }
  };

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '50px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.8)' }}>
      <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-glow), #3b82f6)', margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', fontWeight: 800, color: '#0f172a' }}>{user?.name?.charAt(0) || 'S'}</div>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '5px' }}>{user?.name}</h2>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px' }}>{t(content.class)} {user?.className} • {user?.email}</p>
      <div style={{ textAlign: 'left', marginBottom: '30px' }}>
        <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>{t(content.assigned)}</label>
        <div className="input-field" style={{ color: '#94a3b8', cursor: 'not-allowed' }}>{t(content.class)} {user?.className || "N/A"}</div>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign: 'left', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '50%' }}><KeyRound color="#34d399" /></div>
          <div><div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, letterSpacing: '1px' }}>{t(content.parent_acc)}</div><div style={{ fontSize: '1.2rem', fontFamily: 'monospace', color: 'white' }}>{user?.parentAccessCode ? (reveal ? user.parentAccessCode : '••••••') : 'NOT SET'}</div></div>
        </div>
        {user?.parentAccessCode ? <button onClick={() => setReveal(!reveal)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #475569', background: 'transparent', color: 'white', cursor: 'pointer' }}>{reveal ? t(content.hide) : t(content.show)}</button> : <button onClick={generateCode} disabled={generating} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#34d399', color: '#022c22', fontWeight: 700, cursor: 'pointer' }}>{t(content.generate)}</button>}
      </div>
      <button onClick={handleLogout} style={{ width: '100%', padding: '15px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><LogOut size={20} /> {t(content.sign_out)}</button>
    </div>
  )
}