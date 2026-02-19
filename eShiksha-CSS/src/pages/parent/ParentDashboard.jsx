import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Home, Award, User, LogOut, AlertCircle, CheckCircle2,
  Calendar, TrendingUp, BookOpen, UserPlus, FileText, CheckSquare, Clock
} from "lucide-react";

import api from "../../api";
import OnlineStatusPill from "../../components/OnlineStatusPill";
// 🔥 Import Language Components
import { useLanguage } from "../../context/LanguageContext";
import LanguageFloatingBtn from "../../components/LanguageFloatingBtn";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage(); // 🔥 Use Translation Hook

  // --- State ---
  const [activeTab, setActiveTab] = useState("home");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [student, setStudent] = useState(null);
  const [attempts, setAttempts] = useState([]); // Quizzes
  const [exams, setExams] = useState([]);       // Exams
  const [assignments, setAssignments] = useState([]); // Assignments
  
  // Link Student State
  const [linkCode, setLinkCode] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  // --- TRANSLATIONS DICTIONARY ---
  const content = {
    // Nav
    nav_home: { en: "Overview", pa: "ਸੰਖੇਪ ਜਾਣਕਾਰੀ", hi: "अवलोकन", bn: "সংক্ষিপ্ত বিবরণ" },
    nav_exams: { en: "Exams", pa: "ਪ੍ਰੀਖਿਆਵਾਂ", hi: "परीक्षाएं", bn: "পরীক্ষা" },
    nav_quizzes: { en: "Quizzes", pa: "ਕਵਿਜ਼", hi: "क्विज़", bn: "কুইজ" },
    nav_assign: { en: "Assignments", pa: "ਅਸਾਈਨਮੈਂਟ", hi: "असाइनमेंट", bn: "অ্যাসাইনমেন্ট" },
    nav_account: { en: "Settings", pa: "ਸੈਟਿੰਗਾਂ", hi: "सेटिंग्स", bn: "সেটিংস" },
    
    // Headers
    portal_title: { en: "Parent Portal", pa: "ਮਾਪੇ ਪੋਰਟਲ", hi: "अभिभावक पोर्टल", bn: "অভিভাবক পোর্টাল" },
    welcome_title: { en: "Welcome to your dashboard", pa: "ਤੁਹਾਡੇ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ", hi: "आपके डैशबोर्ड में स्वागत है", bn: "আপনার ড্যাশবোর্ডে স্বাগতম" },
    track_prog: { en: "Track progress for", pa: "ਲਈ ਤਰੱਕੀ ਟ੍ਰੈਕ ਕਰੋ", hi: "के लिए प्रगति ट्रैक करें", bn: "এর জন্য অগ্রগতি ট্র্যাক করুন" },
    
    // Link Student
    link_stu_title: { en: "Link Your Student", pa: "ਆਪਣੇ ਵਿਦਿਆਰਥੀ ਨੂੰ ਲਿੰਕ ਕਰੋ", hi: "अपने छात्र को लिंक करें", bn: "আপনার ছাত্র লিঙ্ক করুন" },
    link_stu_desc: { en: "Enter the unique Parent Access Code provided by the student or teacher.", pa: "ਵਿਦਿਆਰਥੀ ਜਾਂ ਅਧਿਆਪਕ ਦੁਆਰਾ ਪ੍ਰਦਾਨ ਕੀਤਾ ਗਿਆ ਮਾਪੇ ਐਕਸੈਸ ਕੋਡ ਦਰਜ ਕਰੋ।", hi: "छात्र या शिक्षक द्वारा प्रदान किया गया अभिभावक एक्सेस कोड दर्ज करें।", bn: "ছাত্র বা শিক্ষক দ্বারা প্রদত্ত অভিভাবক অ্যাক্সেস কোড লিখুন।" },
    enter_code_btn: { en: "Enter Access Code", pa: "ਐਕਸੈਸ ਕੋਡ ਦਰਜ ਕਰੋ", hi: "एक्सेस कोड दर्ज करें", bn: "অ্যাক্সেস কোড লিখুন" },
    link_now_btn: { en: "Link Now", pa: "ਹੁਣੇ ਲਿੰਕ ਕਰੋ", hi: "अभी लिंक करें", bn: "এখন লিঙ্ক করুন" },
    cancel_btn: { en: "Cancel", pa: "ਰੱਦ ਕਰੋ", hi: "रद्द करें", bn: "বাতিল করুন" },

    // Stats
    total_act: { en: "TOTAL ACTIVITIES", pa: "ਕੁੱਲ ਗਤੀਵਿਧੀਆਂ", hi: "कुल गतिविधियां", bn: "মোট কার্যকলাপ" },
    overall_scr: { en: "OVERALL SCORE", pa: "ਕੁੱਲ ਸਕੋਰ", hi: "कुल स्कोर", bn: "সামগ্রিক স্কোর" },
    
    // Profile
    active_status: { en: "Active", pa: "ਸਰਗਰਮ", hi: "सक्रिय", bn: "সক্রিয়" },
    lbl_name: { en: "FULL NAME", pa: "ਪੂਰਾ ਨਾਮ", hi: "पूरा नाम", bn: "পুরো নাম" },
    lbl_email: { en: "EMAIL ADDRESS", pa: "ਈਮੇਲ ਪਤਾ", hi: "ईमेल पता", bn: "ইমেল ঠিকানা" },
    lbl_class: { en: "CLASS", pa: "ਜਮਾਤ", hi: "कक्षा", bn: "ক্লাস" },

    // Sections
    exam_results: { en: "Exam Results", pa: "ਪ੍ਰੀਖਿਆ ਨਤੀਜੇ", hi: "परीक्षा परिणाम", bn: "পরীক্ষার ফলাফল" },
    quiz_perf: { en: "Quiz Performance", pa: "ਕਵਿਜ਼ ਪ੍ਰਦਰਸ਼ਨ", hi: "क्विज़ प्रदर्शन", bn: "কুইজ পারফরম্যান্স" },
    assign_track: { en: "Assignments Tracker", pa: "ਅਸਾਈਨਮੈਂਟ ਟ੍ਰੈਕਰ", hi: "असाइनमेंट ट्रैकर", bn: "অ্যাসাইনমেন্ট ট্র্যাকার" },
    
    // Assignment Status
    pending: { en: "Pending", pa: "ਬਕਾਇਆ", hi: "लंबित", bn: "পেন্ডিং" },
    submitted: { en: "Submitted", pa: "ਜਮ੍ਹਾਂ ਕਰਵਾਏ", hi: "जमा किए गए", bn: "জমা দেওয়া হয়েছে" },
    all_caught_up: { en: "All Caught Up!", pa: "ਸਭ ਪੂਰਾ ਹੋ ਗਿਆ!", hi: "सब पूरा हो गया!", bn: "সব শেষ!" },
    no_pending: { en: "No pending assignments.", pa: "ਕੋਈ ਬਕਾਇਆ ਅਸਾਈਨਮੈਂਟ ਨਹੀਂ।", hi: "कोई लंबित असाइनमेंट नहीं।", bn: "কোনো পেন্ডিং অ্যাসাইনমেন্ট নেই।" },
    no_subs: { en: "No submissions yet.", pa: "ਅਜੇ ਕੋਈ ਸਬਮਿਸ਼ਨ ਨਹੀਂ।", hi: "अभी तक कोई सबमिशन नहीं।", bn: "এখনও জমা দেওয়া হয়নি।" },
    grading_pending: { en: "Grading Pending", pa: "ਗ੍ਰੇਡਿੰਗ ਬਕਾਇਆ", hi: "ग्रेडिंग लंबित", bn: "গ্রেডিং বাকি" },
    
    // Empty States
    no_recs: { en: "No records found yet.", pa: "ਅਜੇ ਕੋਈ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲਿਆ।", hi: "अभी तक कोई रिकॉर्ड नहीं मिला।", bn: "এখনও কোন রেকর্ড পাওয়া যায়নি।" },
    pls_link: { en: "Please link a student account.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਵਿਦਿਆਰਥੀ ਖਾਤਾ ਲਿੰਕ ਕਰੋ।", hi: "कृपया छात्र खाता लिंक करें।", bn: "অনুগ্রহ করে একটি ছাত্র অ্যাকাউন্ট লিঙ্ক করুন।" },

    // Account
    parent_set: { en: "Parent Settings", pa: "ਮਾਪੇ ਸੈਟਿੰਗਾਂ", hi: "अभिभावक सेटिंग्स", bn: "অভিভাবক সেটিংস" },
    manage_sess: { en: "Manage your portal session.", pa: "ਆਪਣੇ ਪੋਰਟਲ ਸੈਸ਼ਨ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ।", hi: "अपने पोर्टल सत्र का प्रबंधन करें।", bn: "আপনার পোর্টাল সেশন পরিচালনা করুন।" },
    sign_out: { en: "Sign Out", pa: "ਸਾਈਨ ਆਉਟ", hi: "साइन आउट", bn: "সাইন আউট" },
    loading: { en: "SYNCING DATA...", pa: "ਡਾਟਾ ਸਿੰਕ ਹੋ ਰਿਹਾ ਹੈ...", hi: "डेटा सिंक हो रहा है...", bn: "ডেটা সিঙ্ক হচ্ছে..." }
  };

  // --- Effects ---
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    fetchOverview();
  }, []);

  // --- Actions ---
  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get("/parents/overview");
      
      if (res.data && res.data.student) {
        setStudent(res.data.student);
        
        const sortedAttempts = (res.data.attempts || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAttempts(sortedAttempts);

        const sortedExams = (res.data.examSubmissions || []).sort(
          (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
        );
        setExams(sortedExams);

        setAssignments(res.data.assignmentData || []);

      } else {
        setStudent(null);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status !== 404) {
        showToast("Could not load dashboard data.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleLinkStudent = async (e) => {
    e.preventDefault();
    if (!linkCode.trim()) return;
    showToast("Feature coming soon! (Backend route needed)", "info");
    setLinkCode("");
  };

  const showToast = (msg, type = "success") => setToast({ message: msg, type });

  // --- Calculations ---
  const calculateAverage = () => {
    let totalScore = 0;
    let totalItems = 0;

    attempts.forEach(a => {
      totalScore += (a.score / (a.quiz?.questions?.length || 1));
      totalItems++;
    });

    exams.forEach(e => {
      totalScore += (e.score / (e.totalMarks || 1));
      totalItems++;
    });

    return totalItems === 0 ? 0 : Math.round((totalScore / totalItems) * 100);
  };

  const overallScore = calculateAverage();
  const totalActivities = attempts.length + exams.length + assignments.filter(a => a.status === 'Submitted').length;

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return "#22c55e"; 
    if (percentage >= 50) return "#3b82f6"; 
    return "#ef4444"; 
  };

  const pendingAssignments = assignments.filter(a => a.status === 'Pending');
  const submittedAssignments = assignments.filter(a => a.status === 'Submitted');

  return (
    <div className="dashboard-wrapper">
      <style>{`
        .dashboard-wrapper {
          height: 100vh; width: 100vw;
          background: #020617; color: white;
          display: flex; overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sidebar {
          width: 100px;
          background: rgba(15, 23, 42, 0.6);
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex; flex-direction: column;
          align-items: center; padding: 2.5rem 0;
          backdrop-filter: blur(20px);
          z-index: 50;
        }
        .nav-icon {
          width: 50px; height: 50px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; margin-bottom: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #64748b; position: relative;
        }
        .nav-icon:hover { background: rgba(255,255,255,0.08); color: #f8fafc; }
        .nav-icon.active {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05));
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.1);
        }
        .main-content {
          flex: 1; padding: 3rem;
          overflow-y: auto; position: relative;
          background: radial-gradient(circle at 10% 20%, rgba(34, 197, 94, 0.03) 0%, transparent 20%);
        }
        .glass-panel {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px; padding: 2rem;
          backdrop-filter: blur(16px);
          margin-bottom: 24px;
          box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.1);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px; margin-bottom: 32px; width: 100%;
        }
        .stat-mini-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px; padding: 24px;
          display: flex; align-items: center; gap: 20px;
          transition: transform 0.2s;
        }
        .stat-mini-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.1); }
        .icon-circle {
          width: 52px; height: 52px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
        }
        .section-header {
           display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
        }
        .badge {
          font-size: 0.75rem; font-weight: 700; padding: 6px 12px; border-radius: 20px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8;
        }
        .code-input {
          background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 16px; border-radius: 12px; color: white; width: 100%;
          outline: none; font-family: inherit; margin-bottom: 12px; font-size: 1rem;
        }
        .code-input:focus { border-color: #22c55e; }
        .action-btn {
          background: #22c55e; color: #020617; border: none; padding: 12px 20px;
          border-radius: 12px; font-weight: 700; cursor: pointer; width: 100%; transition: 0.2s;
        }
        .action-btn:hover { background: #16a34a; }
        @media (max-width: 768px) {
          .dashboard-wrapper { flex-direction: column-reverse; }
          .sidebar { width: 100%; height: 70px; flex-direction: row; justify-content: space-evenly; padding: 0; position: fixed; bottom: 0; left: 0; border-top: 1px solid rgba(255,255,255,0.1); background: #0f172a; }
          .main-content { padding: 1.5rem; padding-bottom: 100px; }
        }
      `}</style>

      {/* --- SIDEBAR --- */}
      <nav className="sidebar">
        <NavIcon icon={<Home size={22} />} id="home" active={activeTab} set={setActiveTab} tooltip={t(content.nav_home)} />
        <NavIcon icon={<FileText size={22} />} id="exams" active={activeTab} set={setActiveTab} tooltip={t(content.nav_exams)} />
        <NavIcon icon={<Award size={22} />} id="quizzes" active={activeTab} set={setActiveTab} tooltip={t(content.nav_quizzes)} />
        <NavIcon icon={<CheckSquare size={22} />} id="assignments" active={activeTab} set={setActiveTab} tooltip={t(content.nav_assign)} />
        <NavIcon icon={<User size={22} />} id="account" active={activeTab} set={setActiveTab} tooltip={t(content.nav_account)} />
      </nav>

      <main className="main-content">
        <div style={{ position: "absolute", top: 30, right: 40, zIndex: 10 }}>
         
        </div>

        {/* 🔥 FLOATING TRANSLATOR BUTTON 🔥 */}
        <LanguageFloatingBtn />

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              style={{
                position: "fixed", top: 30, left: "50%",
                padding: "12px 24px", borderRadius: "50px",
                background: toast.type === "error" ? "rgba(239,68,68,0.9)" : "rgba(34,197,94,0.9)",
                color: "white", fontWeight: 600, display: "flex", gap: 10, alignItems: "center",
                zIndex: 1000, backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#94a3b8" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <TrendingUp size={32} color="#22c55e" />
            </motion.div>
            <p style={{ letterSpacing: "1px", fontSize: "0.9rem" }}>{t(content.loading)}</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            
            {activeTab !== 'home' && (
              <header style={{ marginBottom: "30px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>{t(content.portal_title)}</h1>
                <p style={{ color: "#94a3b8" }}>{t(content.nav_home)} for {student ? student.name : 'Student'}</p>
              </header>
            )}

            {activeTab === 'home' && (
              <>
               <header style={{ marginBottom: "40px" }}>
                  <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "8px" }}>
                    {t(content.portal_title)}
                  </h1>
                  <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
                    {student ? (
                      <>{t(content.track_prog)} <span style={{ color: "#22c55e", fontWeight: 600 }}>{student.name}</span></>
                    ) : t(content.welcome_title)}
                  </p>
                </header>

                {!student && (
                  <motion.div 
                    className="glass-panel"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ textAlign: "center", padding: "4rem 2rem", border: "1px dashed rgba(255,255,255,0.2)" }}
                  >
                    <div style={{ width: 80, height: 80, background: "rgba(34,197,94,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                      <UserPlus size={32} color="#22c55e" />
                    </div>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{t(content.link_stu_title)}</h2>
                    <p style={{ color: "#94a3b8", maxWidth: "400px", margin: "0 auto 30px", lineHeight: "1.6" }}>
                      {t(content.link_stu_desc)}
                    </p>
                    {!showLinkInput ? (
                      <button className="action-btn" style={{ maxWidth: "200px" }} onClick={() => setShowLinkInput(true)}>
                        {t(content.enter_code_btn)}
                      </button>
                    ) : (
                      <form onSubmit={handleLinkStudent} style={{ maxWidth: "300px", margin: "0 auto" }}>
                        <input type="text" placeholder="e.g. A7X9-22B" className="code-input" value={linkCode} onChange={(e) => setLinkCode(e.target.value.toUpperCase())} autoFocus />
                        <div style={{ display: "flex", gap: 10 }}>
                          <button type="button" onClick={() => setShowLinkInput(false)} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", padding: "12px", borderRadius: "12px", color: "#94a3b8", cursor: "pointer" }}>{t(content.cancel_btn)}</button>
                          <button type="submit" className="action-btn" style={{ flex: 1 }}>{t(content.link_now_btn)}</button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}

                {student && (
                  <>
                    <div className="stats-grid">
                      <div className="stat-mini-card">
                        <div className="icon-circle" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}><BookOpen size={24} /></div>
                        <div>
                          <p style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px" }}>{t(content.total_act)}</p>
                          <h3 style={{ fontSize: "1.8rem", margin: 0, fontWeight: 700 }}>{totalActivities}</h3>
                        </div>
                      </div>
                      <div className="stat-mini-card">
                        <div className="icon-circle" style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22c55e" }}><TrendingUp size={24} /></div>
                        <div>
                          <p style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px" }}>{t(content.overall_scr)}</p>
                          <h3 style={{ fontSize: "1.8rem", margin: 0, fontWeight: 700 }}>{overallScore}%</h3>
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                        <h2 style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: 10 }}>
                          <User size={20} color="#22c55e" /> Student Profile
                        </h2>
                        <span style={{ fontSize: "0.8rem", padding: "4px 12px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>{t(content.active_status)}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
                        <div><label style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 700 }}>{t(content.lbl_name)}</label><p style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "4px" }}>{student.name}</p></div>
                        <div><label style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 700 }}>{t(content.lbl_email)}</label><p style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "4px" }}>{student.email}</p></div>
                        <div><label style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 700 }}>{t(content.lbl_class)}</label><p style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "4px" }}>Grade {student.className || "N/A"}</p></div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ================= ASSIGNMENTS TAB ================= */}
            {activeTab === 'assignments' && (
              <>
                <div className="section-header">
                  <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{t(content.assign_track)}</h2>
                  <span className="badge">{assignments.length} Total</span>
                </div>

                {!student ? (
                  <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}><p>{t(content.pls_link)}</p></div>
                ) : (
                  <div style={{ display: "grid", gap: "30px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                    
                    {/* PENDING COLUMN */}
                    <div>
                      <h3 style={{ fontSize: "1.2rem", color: "#f59e0b", marginBottom: "15px", display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={20}/> {t(content.pending)} ({pendingAssignments.length})
                      </h3>
                      
                      {pendingAssignments.length === 0 ? (
                        <div className="glass-panel" style={{ textAlign: "center", padding: "30px", border: "1px dashed rgba(34,197,94,0.2)" }}>
                          <CheckCircle2 size={32} color="#22c55e" style={{ margin: "0 auto 10px" }} />
                          <p style={{ color: "#22c55e", fontWeight: 600 }}>{t(content.all_caught_up)}</p>
                          <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{t(content.no_pending)}</p>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {pendingAssignments.map(a => (
                            <motion.div key={a._id} className="glass-panel" style={{ padding: "16px", borderLeft: "4px solid #f59e0b" }}>
                              <h4 style={{ margin: "0 0 6px 0", color: "#e2e8f0" }}>{a.title}</h4>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#94a3b8" }}>
                                <span>{a.subject}</span>
                                {a.dueDate && (
                                  <span style={{ color: "#f59e0b" }}>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SUBMITTED COLUMN */}
                    <div>
                      <h3 style={{ fontSize: "1.2rem", color: "#22c55e", marginBottom: "15px", display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={20}/> {t(content.submitted)} ({submittedAssignments.length})
                      </h3>
                      
                      {submittedAssignments.length === 0 ? (
                        <p style={{ color: "#64748b", fontStyle: "italic" }}>{t(content.no_subs)}</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {submittedAssignments.map(a => (
                            <motion.div key={a._id} className="glass-panel" style={{ padding: "16px", borderLeft: "4px solid #22c55e" }}>
                              <h4 style={{ margin: "0 0 6px 0", color: "#e2e8f0" }}>{a.title}</h4>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#94a3b8" }}>
                                <span>Submitted: {new Date(a.submittedAt).toLocaleDateString()}</span>
                                {a.graded ? (
                                  <span style={{ color: "#22c55e", fontWeight: "bold" }}>{a.marks}/{a.totalMarks}</span>
                                ) : (
                                  <span style={{ color: "#94a3b8" }}>{t(content.grading_pending)}</span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </>
            )}

            {/* ================= EXAMS TAB ================= */}
            {activeTab === "exams" && (
              <>
                <div className="section-header">
                  <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{t(content.exam_results)}</h2>
                  <span className="badge">{exams.length} Total</span>
                </div>

                {!student ? (
                  <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}><p>{t(content.pls_link)}</p></div>
                ) : exams.length === 0 ? (
                  <div className="glass-panel" style={{ textAlign: "center", color: "#94a3b8", padding: "3rem" }}>
                    <FileText size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                    <p>{t(content.no_recs)}</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {exams.map((e) => {
                      const percentage = Math.round((e.score / (e.totalMarks || 1)) * 100);
                      const color = getGradeColor(percentage);
                      return (
                        <motion.div key={e._id} className="glass-panel" whileHover={{ scale: 1.01, backgroundColor: "rgba(30, 41, 59, 0.5)" }} style={{ padding: "1.5rem", marginBottom: 0 }}>
                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                            <div>
                              <h3 style={{ fontSize: "1.2rem", color: "#f8fafc", fontWeight: 600 }}>{e.examId?.title || "Untitled Exam"}</h3>
                              <p style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: "0.9rem", marginTop: 6 }}>
                                <Calendar size={14} /> {new Date(e.submittedAt).toLocaleDateString('en-GB')}
                                <span style={{ width: 4, height: 4, background: "#475569", borderRadius: "50%" }}></span>
                                {e.examId?.subject || "General"}
                              </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: color }}>{percentage}%</span>
                              <p style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>{e.score}/{e.totalMarks}</p>
                            </div>
                          </div>
                          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", marginTop: "16px", overflow: "hidden" }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1 }} style={{ height: "100%", background: color, borderRadius: "10px" }} />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </>
            )}

            {/* ================= QUIZZES TAB ================= */}
            {activeTab === "quizzes" && (
              <>
                <div className="section-header">
                  <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{t(content.quiz_perf)}</h2>
                  <span className="badge">{attempts.length} Total</span>
                </div>

                {!student ? (
                  <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}><p>{t(content.pls_link)}</p></div>
                ) : attempts.length === 0 ? (
                  <div className="glass-panel" style={{ textAlign: "center", color: "#94a3b8", padding: "3rem" }}>
                    <Award size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                    <p>{t(content.no_recs)}</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {attempts.map((a) => {
                      const percentage = Math.round((a.score / (a.quiz?.questions?.length || 1)) * 100);
                      const color = getGradeColor(percentage);
                      return (
                        <motion.div key={a._id} className="glass-panel" whileHover={{ scale: 1.01, backgroundColor: "rgba(30, 41, 59, 0.5)" }} style={{ padding: "1.5rem", marginBottom: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                            <div>
                              <h3 style={{ fontSize: "1.2rem", color: "#f8fafc", fontWeight: 600 }}>{a.quiz?.title || "Untitled Quiz"}</h3>
                              <p style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: "0.9rem", marginTop: 6 }}>
                                <Calendar size={14} /> {new Date(a.createdAt).toLocaleDateString('en-GB')}
                                <span style={{ width: 4, height: 4, background: "#475569", borderRadius: "50%" }}></span>
                                {a.quiz?.subject || "General"}
                              </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: color }}>{percentage}%</span>
                              <p style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>{a.score}/{a.quiz?.questions?.length || "?"}</p>
                            </div>
                          </div>
                          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", marginTop: "16px", overflow: "hidden" }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1 }} style={{ height: "100%", background: color, borderRadius: "10px" }} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === "account" && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
                <div className="glass-panel" style={{ maxWidth: 450, width: "100%", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ width: 80, height: 80, background: "rgba(255,255,255,0.03)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><User size={40} color="#94a3b8" /></div>
                  <h2 style={{ marginBottom: "8px" }}>{t(content.parent_set)}</h2>
                  <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "0.9rem" }}>{t(content.manage_sess)}</p>
                  <button onClick={handleLogout} className="action-btn" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><LogOut size={18} /> {t(content.sign_out)}</div>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

function NavIcon({ icon, id, active, set, tooltip }) {
  const isActive = active === id;
  return (
    <div className={`nav-icon ${isActive ? "active" : ""}`} onClick={() => set(id)} title={tooltip}>
      {icon}
      {isActive && <motion.div layoutId="active-pill" style={{ position: "absolute", right: -2, width: 4, height: 20, background: "#22c55e", borderRadius: "4px 0 0 4px" }} />}
    </div>
  );
}