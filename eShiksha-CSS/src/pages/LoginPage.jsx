import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, ArrowRight, ChevronLeft, ShieldCheck,
  CheckCircle2, UserPlus, Mail, KeyRound, Send,
  Eye, EyeOff, RefreshCw, GraduationCap, Library, BookOpen, AlertCircle, Phone
} from 'lucide-react';

import api from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const portalRole = searchParams.get('role') || 'student';
  const isDarkMode = true;

  const [view, setView] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [successMsg, setSuccessMsg] = useState('');
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setError(null);
    setSuccessMsg('');
  }, [view]);

  useEffect(() => {
    // Initialize window size immediately
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    referralCode: '', studentCode: '', parentPhone: '',
  });

  const [pendingSignupData, setPendingSignupData] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);

  // 🔹 ADDED TRANSLATIONS HERE
  const content = {
    back_home: { en: "Back to Home", pa: "ਵਾਪਸ ਘਰ", hi: "वापस होम", bn: "হোমে ফিরে যান" },
    back_login: { en: "Back to Login", pa: "ਲੌਗਇਨ ਤੇ ਵਾਪਸ", hi: "लॉगिन पर वापस", bn: "লগইনে ফিরে যান" },
    back_details: { en: "Back to Details", pa: "ਵੇਰਵਿਆਂ ਤੇ ਵਾਪਸ", hi: "विवरण पर वापस", bn: "বিবরণে ফিরে যান" },
    change_user: { en: "Change User", pa: "ਯੂਜ਼ਰ ਬਦਲੋ", hi: "उपयोगकर्ता बदलें", bn: "ব্যবহারকারী পরিবর্তন" },
    label_student: { en: "Student Learning Hub", pa: "ਵਿਦਿਆਰਥੀ ਸਿਖਲਾਈ ਕੇਂਦਰ", hi: "छात्र शिक्षण केंद्र", bn: "ছাত্র শিক্ষা কেন্দ্র" },
    label_teacher: { en: "Educator Console", pa: "ਅਧਿਆਪਕ ਕੰਸੋਲ", hi: "शिक्षक कंसोल", bn: "শিক্ষক কনসোল" },
    label_parent: { en: "Guardian Portal", pa: "ਸਰਪ੍ਰਸਤ ਪੋਰਟਲ", hi: "अभिभावक पोर्टल", bn: "অভিভাবক পোর্টাল" },
    welcome: { en: "Welcome Back", pa: "ਜੀ ਆਇਆਂ ਨੂੰ", hi: "स्वागत है", bn: "স্বাগতম" },
    access_secure: { en: "Access your secure", pa: "ਆਪਣੇ ਖਾਤੇ ਵਿੱਚ ਦਾਖਲ ਹੋਵੋ", hi: "अपने सुरक्षित खाते में प्रवेश करें", bn: "আপনার নিরাপদ অ্যাকাউন্টে প্রবেশ করুন" },
    lbl_email: { en: "Academic ID / Email", pa: "ਅਕਾਦਮਿਕ ਆਈਡੀ / ਈਮੇਲ", hi: "शैक्षणिक आईडी / ईमेल", bn: "একাডেমিক আইডি / ইমেল" },
    lbl_pass: { en: "Password", pa: "ਪਾਸਵਰਡ", hi: "पासवर्ड", bn: "পাসওয়ার্ড" },
    ph_email: { en: "Email Address", pa: "ਈਮੇਲ ਪਤਾ", hi: "ईमेल पता", bn: "ইমেল ঠিকানা" },
    forgot_pass: { en: "Forgot Password?", pa: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?", hi: "पासवर्ड भूल गए?", bn: "পাসওয়ার্ড ভুলে গেছেন?" },
    btn_signin: { en: "Secure Sign In", pa: "ਸੁਰੱਖਿਅਤ ਸਾਈਨ ਇਨ", hi: "सुरक्षित साइन इन", bn: "নিরাপদ সাইন ইন" },
    new_platform: { en: "New to the platform?", pa: "ਪਲੇਟਫਾਰਮ 'ਤੇ ਨਵੇਂ ਹੋ?", hi: "प्लेटफ़ॉर्म पर नए हैं?", bn: "প্ল্যাটফর্মে নতুন?" },
    act_account: { en: "Activate Account", pa: "ਖਾਤਾ ਚਾਲੂ ਕਰੋ", hi: "खाता सक्रिय करें", bn: "অ্যাকাউন্ট সক্রিয় করুন" },
    join_the: { en: "Join the", pa: "ਸ਼ਾਮਲ ਹੋਵੋ", hi: "जुड़ें", bn: "যোগ দিন" },
    ph_name: { en: "Full Legal Name", pa: "ਪੂਰਾ ਕਾਨੂੰਨੀ ਨਾਮ", hi: "पूरा कानूनी नाम", bn: "সম্পূর্ণ আইনি নাম" },
    ph_school_email: { en: "School Email Address", pa: "ਸਕੂਲ ਈਮੇਲ ਪਤਾ", hi: "स्कूल ईमेल पता", bn: "স্কুল ইমেল ঠিকানা" },
    ph_create_pass: { en: "Create Password", pa: "ਪਾਸਵਰਡ ਬਣਾਓ", hi: "पासवर्ड बनाएं", bn: "পাসওয়ার্ড তৈরি করুন" },
    ph_confirm_pass: { en: "Confirm Password", pa: "ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ", hi: "पासवर्ड की पुष्टि करें", bn: "পাসওয়ার্ড নিশ্চিত করুন" },
    ph_ref_code: { en: "Class referral code", pa: "ਕਲਾਸ ਰੈਫਰਲ ਕੋਡ", hi: "कक्षा रेफरल कोड", bn: "ক্লাস রেফারেল কোড" },
    msg_ref_code: { en: "Ask your teacher for this code.", pa: "ਇਸ ਕੋਡ ਲਈ ਆਪਣੇ ਅਧਿਆਪਕ ਨੂੰ ਪੁੱਛੋ।", hi: "इस कोड के लिए अपने शिक्षक से पूछें।", bn: "এই কোডটির জন্য আপনার শিক্ষককে জিজ্ঞাসা করুন।" },
    ph_parent_code: { en: "Enter your child's code", pa: "ਆਪਣੇ ਬੱਚੇ ਦਾ ਕੋਡ ਦਰਜ ਕਰੋ", hi: "अपने बच्चे का कोड दर्ज करें", bn: "আপনার সন্তানের কোড লিখুন" },
    ph_parent_phone: { en: "Parent phone number", pa: "ਮਾਪਿਆਂ ਦਾ ਫੋਨ ਨੰਬਰ", hi: "अभिभावक का फोन नंबर", bn: "অভিভাবকের ফোন নম্বর" },
    msg_parent_phone: { en: "Results SMS will be sent here (optional for teachers).", pa: "ਨਤੀਜਿਆਂ ਦੇ SMS ਇੱਥੇ ਭੇਜੇ ਜਾਣਗੇ (ਅਧਿਆਪਕਾਂ ਲਈ ਚੋਣਵਾਂ).", hi: "परिणाम एसएमएस यहां भेजे जाएंगे (शिक्षकों के लिए वैकल्पिक)।", bn: "ফলাফলের এসএমএস এখানে পাঠানো হবে (শিক্ষকদের জন্য ঐচ্ছিক)।" },
    msg_parent_code: { en: "Use the parent access code given by the school.", pa: "ਸਕੂਲ ਦੁਆਰਾ ਦਿੱਤਾ ਗਿਆ ਮਾਪਿਆਂ ਦਾ ਐਕਸੈਸ ਕੋਡ ਵਰਤੋ।", hi: "स्कूल द्वारा दिया गया अभिभावक एक्सेस कोड उपयोग करें।", bn: "স্কুল দ্বারা দেওয়া অভিভাবক অ্যাক্সেস কোড ব্যবহার করুন।" },
    btn_send_otp: { en: "Send OTP", pa: "OTP ਭੇਜੋ", hi: "ओटीपी भेजें", bn: "ওটিপি পাঠান" },
    already_account: { en: "Already have an account?", pa: "ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?", hi: "क्या आपके पास पहले से एक खाता मौजूद है?", bn: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?" },
    sign_in: { en: "Sign In", pa: "ਸਾਈਨ ਇਨ", hi: "साइन इन", bn: "সাইন ইন" },
    verify_email: { en: "Verify Your Email", pa: "ਆਪਣੀ ਈਮੇਲ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ", hi: "अपना ईमेल सत्यापित करें", bn: "আপনার ইমেল যাচাই করুন" },
    enter_code_msg: { en: "Enter the 6-digit code sent to", pa: "ਨੂੰ ਭੇਜਿਆ ਗਿਆ 6-ਅੰਕਾਂ ਦਾ ਕੋਡ ਦਰਜ ਕਰੋ", hi: "को भेजा गया 6-अंकीय कोड दर्ज करें", bn: "পাঠানো ৬-সংখ্যার কোড লিখুন" },
    btn_verify_create: { en: "Verify & Create Account", pa: "ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਖਾਤਾ ਬਣਾਓ", hi: "सत्यापित करें और खाता बनाएं", bn: "যাচাই করুন এবং অ্যাকাউন্ট তৈরি করুন" },
    didnt_receive: { en: "Didn't receive it?", pa: "ਇਹ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੋਇਆ?", hi: "यह प्राप्त नहीं हुआ?", bn: "এটি পাননি?" },
    resend_code: { en: "Resend Code", pa: "ਕੋਡ ਦੁਬਾਰਾ ਭੇਜੋ", hi: "कोड फिर से भेजें", bn: "কোড পুনরায় পাঠান" },
    acc_recovery: { en: "Account Recovery", pa: "ਖਾਤਾ ਰਿਕਵਰੀ", hi: "खाता पुनर्प्राप्ति", bn: "অ্যাকাউন্ট পুনরুদ্ধার" },
    recovery_msg: { en: "We'll send a verification code to your registered email.", pa: "ਅਸੀਂ ਤੁਹਾਡੀ ਰਜਿਸਟਰਡ ਈਮੇਲ 'ਤੇ ਇੱਕ ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ ਭੇਜਾਂਗੇ।", hi: "हम आपके पंजीकृत ईमेल पर एक सत्यापन कोड भेजेंगे।", bn: "আমরা আপনার নিবন্ধিত ইমেলে একটি যাচাইকরণ কোড পাঠাব।" },
    btn_send_verif: { en: "Send Verification Code", pa: "ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ ਭੇਜੋ", hi: "सत्यापन कोड भेजें", bn: "যাচাইকরণ কোড পাঠান" },
    security_check: { en: "Security Check", pa: "ਸੁਰੱਖਿਆ ਜਾਂਚ", hi: "सुरक्षा जांच", bn: "নিরাপত্তা পরীক্ষা" },
    btn_verify_access: { en: "Verify & Access", pa: "ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਪਹੁੰਚ ਪ੍ਰਾਪਤ ਕਰੋ", hi: "सत्यापित करें और पहुंच प्राप्त करें", bn: "যাচাই করুন এবং অ্যাক্সেস করুন" },
    set_new_pass: { en: "Set New Password", pa: "ਨਵਾਂ ਪਾਸਵਰਡ ਸੈੱਟ ਕਰੋ", hi: "नया पासवर्ड सेट करें", bn: "নতুন পাসওয়ার্ড সেট করুন" },
    create_secure_pass: { en: "Create a secure password to access your account.", pa: "ਆਪਣੇ ਖਾਤੇ ਤੱਕ ਪਹੁੰਚ ਕਰਨ ਲਈ ਇੱਕ ਸੁਰੱਖਿਅਤ ਪਾਸਵਰਡ ਬਣਾਓ।", hi: "अपने खाते तक पहुंचने के लिए एक सुरक्षित पासवर्ड बनाएं।", bn: "আপনার অ্যাকাউন্টে অ্যাক্সেস করতে একটি নিরাপদ পাসওয়ার্ড তৈরি করুন।" },
    ph_new_pass: { en: "New Password", pa: "ਨਵਾਂ ਪਾਸਵਰਡ", hi: "नया पासवर्ड", bn: "নতুন পাসওয়ার্ড" },
    ph_conf_new_pass: { en: "Confirm New Password", pa: "ਨਵੇਂ ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ", hi: "नए पासवर्ड की पुष्टि करें", bn: "নতুন পাসওয়ার্ড নিশ্চিত করুন" },
    btn_update_pass: { en: "Update Password", pa: "ਪਾਸਵਰਡ ਅੱਪਡੇਟ ਕਰੋ", hi: "पासवर्ड अपडेट करें", bn: "পাসওয়ার্ড আপডেট করুন" },
    select_curr: { en: "Select Curriculum", pa: "ਪਾਠਕ੍ਰਮ ਚੁਣੋ", hi: "पाठ्यक्रम चुनें", bn: "পাঠ্যক্রম নির্বাচন করুন" },
    choose_env: { en: "Choose your active learning environment", pa: "ਆਪਣਾ ਸਰਗਰਮ ਸਿੱਖਣ ਦਾ ਮਾਹੌਲ ਚੁਣੋ", hi: "अपना सक्रिय सीखने का माहौल चुनें", bn: "আপনার সক্রিয় শেখার পরিবেশ চয়ন করুন" },
    standard: { en: "Standard", pa: "ਕਲਾਸ", hi: "कक्षा", bn: "ক্লাস" }
  };

  const roleTheme = {
    student: {
      color: '#0ea5e9',
      glow: '0 0 80px rgba(14, 165, 233, 0.4)',
      bgGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
      label: t(content.label_student),
      icon: <GraduationCap size={32} />
    },
    teacher: {
      color: '#f59e0b',
      glow: '0 0 80px rgba(245, 158, 11, 0.4)',
      bgGradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
      label: t(content.label_teacher),
      icon: <Library size={32} />
    },
    parent: {
      color: '#10b981',
      glow: '0 0 80px rgba(16, 185, 129, 0.4)',
      bgGradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
      label: t(content.label_parent),
      icon: <ShieldCheck size={32} />
    }
  };

  const currentTheme = roleTheme[portalRole] || roleTheme.student;
  const classes = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email: loginEmail, password: loginPassword });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'parent') {
        navigate('/parent/dashboard');
      } else if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (user.role === 'student') {
        if (user.className) navigate('/student/dashboard');
        else setView('class-select');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: portalRole,
      };
      if (portalRole === 'student') {
        payload.referralCode = form.referralCode;
        payload.parentPhone = form.parentPhone;
      } else if (portalRole === 'teacher') {
        if (form.parentPhone?.trim()) {
          payload.parentPhone = form.parentPhone.trim();
        }
      } else if (portalRole === 'parent') {
        payload.studentCode = form.studentCode;
      }
      setPendingSignupData(payload);
      await api.post('/auth/register/send-otp', { email: payload.email, role: portalRole });
      setOtp('');
      setSuccessMsg(`OTP sent to ${payload.email}.`);
      setView('signup-otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySignupOtp = async (e) => {
    e.preventDefault();
    if (!pendingSignupData) {
      setError('Session expired.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await api.post('/auth/register', { ...pendingSignupData, otp });
      setSuccessMsg('Registration successful! Please log in.');
      setView('login');
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        referralCode: '',
        studentCode: '',
        parentPhone: '',
      });
      setPendingSignupData(null);
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSignupOtp = async () => {
    if (!pendingSignupData?.email) return;
    setError(null);
    setIsLoading(true);
    try {
      await api.post('/auth/register/send-otp', { email: pendingSignupData.email, role: portalRole });
      setSuccessMsg(`OTP resent to ${pendingSignupData.email}.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setError(null);
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: resetEmail });
      setView('otp-verify');
      setSuccessMsg(`OTP sent to ${resetEmail}`);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(<span>Email not found. <button className="text-link-inline" onClick={() => setView('signup')}>Create Account?</button></span>);
      } else {
        setError(err.response?.data?.message || 'Failed to send OTP.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api.post('/auth/verify-otp', { email: resetEmail, otp });
      setView('reset-password');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { email: resetEmail, otp, newPassword });
      setSuccessMsg("Password reset successful!");
      setView("login");
      setOtp(''); setNewPassword(''); setConfirmNewPassword(''); setResetEmail('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassSelect = async (selectedClass) => {
    if (portalRole === 'teacher') {
      localStorage.setItem('teacherActiveClass', selectedClass);
      navigate('/teacher/dashboard');
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.patch('/auth/class', { className: String(selectedClass) });
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        currentUser.className = res.data.className;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
      navigate('/student/dashboard');
    } catch (err) {
      navigate('/student/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // --- ANIMATIONS ---
  const particles = Array.from({ length: 80 }); 

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 20 } }
  };

  const shakeVariants = {
    hidden: { opacity: 0, height: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      scale: 1,
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  const inputFocusVariants = {
    rest: { scale: 1, borderColor: "rgba(255,255,255,0.1)", boxShadow: "none" },
    focus: { 
      scale: 1.02, 
      borderColor: currentTheme.color,
      boxShadow: `0 0 20px -5px ${currentTheme.color}`, 
      transition: { duration: 0.2 } 
    }
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { x: '200%', transition: { repeat: Infinity, duration: 1.5, ease: "linear", repeatDelay: 0.5 } }
  };

  return (
    <div className="login-wrapper">
      <style>{`
        :root { 
          --theme-color: ${currentTheme.color}; 
          --bg-color: #05020a;
          --grid-color: rgba(255, 255, 255, 0.05);
          --card-bg: rgba(20, 10, 30, 0.6);
          --card-border: rgba(255, 255, 255, 0.1);
          --card-shadow: 0 20px 40px -15px rgba(0,0,0,0.6);
          --text-main: #ffffff;
          --text-muted: #94a3b8;
          --text-label: #cbd5e1;
          --input-bg: rgba(0, 0, 0, 0.4);
          --input-border: rgba(255, 255, 255, 0.08);
          --input-text: #ffffff;
          --icon-color: #94a3b8;
          --logo-bg: rgba(255,255,255,0.1);
          --logo-border: rgba(255,255,255,0.2);
        }
        
        .login-wrapper {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          background-color: var(--bg-color);
          font-family: 'Inter', sans-serif;
          perspective: 1200px;
          padding: 20px;
        }

        .grid-background {
          position: absolute; inset: -50%;
          width: 200%; height: 200%;
          background-image: 
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
          background-size: 60px 60px;
          transform: perspective(500px) rotateX(60deg);
          animation: planeMove 10s linear infinite;
          opacity: 0.5; z-index: 0; pointer-events: none;
        }
        @keyframes planeMove { 0% { transform: perspective(500px) rotateX(60deg) translateY(0); } 100% { transform: perspective(500px) rotateX(60deg) translateY(60px); } }

        /* ✨ Glitter removed from CSS class to avoid positioning conflicts, used inline style now */

        .orb-1, .orb-2 {
          position: absolute; border-radius: 50%; filter: blur(100px); z-index: 0;
          animation: breathe 8s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        .orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, var(--theme-color) 0%, transparent 70%); top: -200px; left: -200px; opacity: 0.2; }
        .orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, #818cf8 0%, transparent 70%); bottom: -150px; right: -150px; opacity: 0.15; animation-delay: -4s; }
        @keyframes breathe { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }

        .login-container { position: relative; z-index: 10; width: 100%; max-width: 440px; transform-style: preserve-3d; }

        .ed-card {
          background: var(--card-bg);
          backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
          border: 1px solid var(--card-border);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          border-bottom: 2px solid var(--theme-color);
          border-radius: 32px; padding: 48px;
          box-shadow: var(--card-shadow), 0 0 0 1px rgba(255, 255, 255, 0.05);
          overflow: hidden; transition: all 0.5s ease;
        }

        .header-section { text-align: center; margin-bottom: 32px; }
        .logo-mark {
          width: 80px; height: 80px; margin: 0 auto 24px;
          border-radius: 24px;
          background: linear-gradient(135deg, var(--logo-bg), rgba(255,255,255,0.01));
          border: 1px solid var(--logo-border);
          display: flex; align-items: center; justify-content: center;
          color: white; 
          box-shadow: 0 0 30px -5px var(--theme-color);
        }
        
        .page-title { font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px; }
        .page-subtitle { color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; font-weight: 500; }

        .input-group { margin-bottom: 20px; position: relative; }
        .input-label { display: block; font-size: 0.75rem; font-weight: 800; color: var(--text-label); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .input-box { position: relative; }

        .ed-input {
          width: 100%;
          background: var(--input-bg);
          border: 2px solid var(--input-border);
          border-radius: 16px;
          padding: 16px 44px 16px 50px;
          color: var(--input-text); font-size: 1rem; font-weight: 500; outline: none;
          transition: all 0.3s;
        }
        
        .input-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--icon-color); transition: color 0.3s; pointer-events: none; }
        .password-toggle { position: absolute; right: 18px; top: 50%; transform: translateY(-50%); color: var(--icon-color); cursor: pointer; background: none; border: none; padding: 4px; transition: color 0.2s; display: flex; }
        .password-toggle:hover { color: var(--text-main); }

        .forgot-pass-link { font-size: 0.85rem; color: var(--text-muted); cursor: pointer; transition: all 0.2s; font-weight: 500; display: block; text-align: right; margin-top: -10px; margin-bottom: 20px; }
        .forgot-pass-link:hover { color: var(--theme-color); }

        .action-btn {
          width: 100%; padding: 18px; border-radius: 18px; border: none;
          background: ${currentTheme.bgGradient};
          color: white; font-size: 1.1rem; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 8px 20px -5px var(--theme-color);
          position: relative; overflow: hidden; letter-spacing: 0.5px;
        }
        .shimmer-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-20deg); pointer-events: none;
        }
        
        .btn-spinner { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-footer { margin-top: 32px; text-align: center; font-size: 0.9rem; color: var(--text-muted); border-top: 1px solid var(--input-border); padding-top: 24px; font-weight: 500; }
        .text-link { color: var(--theme-color); font-weight: 700; cursor: pointer; margin-left: 4px; transition: all 0.2s; }
        .text-link-inline { background: none; border: none; color: var(--theme-color); padding: 0; font: inherit; cursor: pointer; text-decoration: underline; font-weight: 700; }

        .back-nav { background: none; border: none; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-bottom: 24px; transition: color 0.2s; }
        .back-nav:hover { color: var(--text-main); transform: translateX(-4px); }

        .error-msg {
          background: rgba(220, 38, 38, 0.15); 
          border: 1px solid rgba(220, 38, 38, 0.5);
          color: #fca5a5; 
          font-size: 0.85rem; 
          font-weight: 500; 
          padding: 12px; 
          border-radius: 12px;
          margin-bottom: 20px; 
          display: flex; 
          align-items: center; 
          gap: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .class-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; max-height: 350px; overflow-y: auto; padding: 4px; }
        .class-btn {
          background: var(--input-bg); border: 2px solid var(--input-border);
          border-radius: 20px; padding: 20px 8px; text-align: center; cursor: pointer;
          transition: all 0.2s; position: relative;
        }
        .class-btn:hover { border-color: var(--theme-color); box-shadow: 0 0 20px -5px var(--theme-color); }
        .class-number { font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px; }
        .class-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
      `}</style>

      <div className="grid-background"></div>
      <div className="orb-1"></div>
      <div className="orb-2"></div>

      {/* ✨ GLITTER SYSTEM - FIXED FULL SCREEN */}
      {windowSize.w > 0 && particles.map((_, i) => (
        <motion.div
          key={i}
          className="glitter"
          initial={{ 
            x: Math.random() * windowSize.w, 
            y: Math.random() * windowSize.h, 
            scale: Math.random() * 0.4 + 0.2, 
            opacity: 0 
          }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1.2, 0] 
          }}
          transition={{ 
            duration: Math.random() * 2 + 1.5, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: Math.random() * 5 
          }}
          style={{
            position: 'fixed', // 👈 This fixes it to the viewport, ignoring the flex container
            top: 0,
            left: 0,
            width: '2px',
            height: '2px',
            backgroundColor: 'white',
            borderRadius: '50%',
            zIndex: 1,
            pointerEvents: 'none',
            boxShadow: `0 0 8px 1px white, 0 0 15px 2px ${currentTheme.color}`
          }}
        />
      ))}

      <motion.div
        className="login-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="ed-card"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.8, bounce: 0.3 }}
        >
          <AnimatePresence mode="wait">

            {/* VIEW 1: LOGIN */}
            {view === 'login' && (
              <motion.div key="login" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <motion.button variants={itemVariants} onClick={() => navigate('/')} className="back-nav"><ChevronLeft size={20} /> {t(content.back_home)}</motion.button>

                <motion.div variants={itemVariants} className="header-section">
                  <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="logo-mark">
                    {currentTheme.icon}
                  </motion.div>
                  <h1 className="page-title">{t(content.welcome)}</h1>
                  <p className="page-subtitle">{t(content.access_secure)} <span style={{ color: currentTheme.color, fontWeight: '700' }}>{currentTheme.label}</span></p>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div variants={shakeVariants} initial="hidden" animate="visible" exit="hidden" className="error-msg">
                      <AlertCircle size={20} /> 
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleAuth}>
                  <motion.div variants={itemVariants} className="input-group">
                    <label className="input-label">{t(content.lbl_email)}</label>
                    <div className="input-box">
                      <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type="text" className="ed-input" placeholder={t(content.ph_email)} required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                      <User size={20} className="input-icon" />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="input-group">
                    <label className="input-label">{t(content.lbl_pass)}</label>
                    <div className="input-box">
                      <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type={showLoginPass ? "text" : "password"} className="ed-input" placeholder="••••••••" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                      <Lock size={20} className="input-icon" />
                      <button type="button" className="password-toggle" onClick={() => setShowLoginPass(!showLoginPass)}>{showLoginPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <span className="forgot-pass-link" onClick={() => setView('forgot-password')}>{t(content.forgot_pass)}</span>
                  </motion.div>

                  {successMsg && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#4ade80', fontSize: '0.9rem', marginBottom: '16px', textAlign: 'center', fontWeight: '600' }}>{successMsg}</motion.p>}

                  <motion.button variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="action-btn" disabled={isLoading}>
                    {!isLoading && <motion.div className="shimmer-overlay" variants={shimmerVariants} initial="initial" animate="animate" />}
                    {isLoading ? <div className="btn-spinner"></div> : <>{t(content.btn_signin)} <ArrowRight size={22} /></>}
                  </motion.button>
                </form>

                <motion.div variants={itemVariants} className="auth-footer">
                  {t(content.new_platform)} <span className="text-link" onClick={() => { setError(null); setSuccessMsg(''); setView('signup'); }}>{t(content.act_account)}</span>
                </motion.div>
              </motion.div>
            )}

            {/* VIEW 2: SIGN UP */}
            {view === 'signup' && (
              <motion.div key="signup" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <motion.button variants={itemVariants} onClick={() => setView('login')} className="back-nav"><ChevronLeft size={20} /> {t(content.back_login)}</motion.button>
                <motion.div variants={itemVariants} className="header-section">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="logo-mark"><UserPlus size={32} /></motion.div>
                  <h1 className="page-title">{t(content.act_account)}</h1>
                  <p className="page-subtitle">{t(content.join_the)} <strong style={{ color: currentTheme.color }}>{currentTheme.label}</strong></p>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div variants={shakeVariants} initial="hidden" animate="visible" exit="hidden" className="error-msg">
                      <AlertCircle size={20} /> 
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleRegister}>
                  <motion.div variants={itemVariants} className="input-group">
                    <div className="input-box">
                      <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type="text" name="name" className="ed-input" placeholder={t(content.ph_name)} value={form.name} onChange={handleChange} required />
                      <User size={20} className="input-icon" />
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="input-group">
                    <div className="input-box">
                      <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type="tel" name="parentPhone" className="ed-input" placeholder={t(content.ph_parent_phone)} value={form.parentPhone} onChange={handleChange} required={portalRole === 'student'} />
                      <Phone size={20} className="input-icon" />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', marginLeft: '4px' }}>{t(content.msg_parent_phone)}</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="input-group">
                    <div className="input-box">
                      <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type="email" name="email" className="ed-input" placeholder={t(content.ph_school_email)} value={form.email} onChange={handleChange} required />
                      <Mail size={20} className="input-icon" />
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="input-group">
                    <div className="input-box">
                      <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type={showSignupPass ? "text" : "password"} name="password" className="ed-input" placeholder={t(content.ph_create_pass)} value={form.password} onChange={handleChange} required />
                      <Lock size={20} className="input-icon" />
                      <button type="button" className="password-toggle" onClick={() => setShowSignupPass(!showSignupPass)}>{showSignupPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="input-group">
                    <div className="input-box">
                      <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type={showConfirmPass ? "text" : "password"} name="confirmPassword" className="ed-input" placeholder={t(content.ph_confirm_pass)} value={form.confirmPassword} onChange={handleChange} required />
                      <KeyRound size={20} className="input-icon" />
                      <button type="button" className="password-toggle" onClick={() => setShowConfirmPass(!showConfirmPass)}>{showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                  </motion.div>
                  {portalRole === 'student' && (
                    <motion.div variants={itemVariants} className="input-group">
                      <div className="input-box">
                        <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type="text" name="referralCode" className="ed-input" placeholder={t(content.ph_ref_code)} value={form.referralCode} onChange={handleChange} required />
                        <KeyRound size={20} className="input-icon" />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>{t(content.msg_ref_code)}</p>
                    </motion.div>
                  )}
                  {portalRole === 'parent' && (
                    <motion.div variants={itemVariants} className="input-group">
                      <div className="input-box">
                        <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type="text" name="studentCode" className="ed-input" placeholder={t(content.ph_parent_code)} value={form.studentCode} onChange={handleChange} required />
                        <KeyRound size={20} className="input-icon" />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>{t(content.msg_parent_code)}</p>
                    </motion.div>
                  )}
                  <motion.button variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="action-btn" disabled={isLoading}>
                    {!isLoading && <motion.div className="shimmer-overlay" variants={shimmerVariants} initial="initial" animate="animate" />}
                    {isLoading ? <div className="btn-spinner"></div> : <>{t(content.btn_send_otp)} <ArrowRight size={22} /></>}
                  </motion.button>
                </form>
                <motion.div variants={itemVariants} className="auth-footer">
                  {t(content.already_account)} <span className="text-link" onClick={() => setView('login')}>{t(content.sign_in)}</span>
                </motion.div>
              </motion.div>
            )}

            {/* VIEW 2b: SIGN UP OTP */}
            {view === 'signup-otp' && (
              <motion.div key="signup-otp" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <motion.button variants={itemVariants} onClick={() => setView('signup')} className="back-nav"><ChevronLeft size={20} /> {t(content.back_details)}</motion.button>
                <motion.div variants={itemVariants} className="header-section">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="logo-mark"><ShieldCheck size={32} /></motion.div>
                  <h2 className="page-title">{t(content.verify_email)}</h2>
                  <p className="page-subtitle">{t(content.enter_code_msg)} <strong>{pendingSignupData?.email || form.email}</strong></p>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div variants={shakeVariants} initial="hidden" animate="visible" exit="hidden" className="error-msg">
                      <AlertCircle size={20} /> 
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleVerifySignupOtp}>
                  <motion.div variants={itemVariants} className="input-group">
                    <div className="input-box">
                      <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type="text" className="ed-input" placeholder="000 000" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} style={{ letterSpacing: '12px', textAlign: 'center', fontWeight: '900', fontSize: '1.8rem' }} required />
                      <Lock size={20} className="input-icon" />
                    </div>
                  </motion.div>
                  {successMsg && <p style={{ color: '#4ade80', fontSize: '0.9rem', marginBottom: '16px', textAlign: 'center' }}>{successMsg}</p>}
                  <motion.button variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="action-btn" disabled={isLoading}>
                    {!isLoading && <motion.div className="shimmer-overlay" variants={shimmerVariants} initial="initial" animate="animate" />}
                    {isLoading ? <div className="btn-spinner"></div> : <>{t(content.btn_verify_create)} <CheckCircle2 size={22} /></>}
                  </motion.button>
                  <motion.div variants={itemVariants} className="auth-footer" style={{ border: 'none', paddingTop: '10px' }}>
                    {t(content.didnt_receive)} <span className="text-link" onClick={handleResendSignupOtp}> {t(content.resend_code)}</span>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {/* VIEW 3: FORGOT PASSWORD */}
            {view === 'forgot-password' && (
              <motion.div key="forgot-password" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <motion.button variants={itemVariants} onClick={() => setView('login')} className="back-nav"><ChevronLeft size={20} /> {t(content.back_login)}</motion.button>
                <motion.div variants={itemVariants} className="header-section">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="logo-mark"><KeyRound size={32} /></motion.div>
                  <h2 className="page-title">{t(content.acc_recovery)}</h2>
                  <p className="page-subtitle">{t(content.recovery_msg)}</p>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div variants={shakeVariants} initial="hidden" animate="visible" exit="hidden" className="error-msg">
                      <AlertCircle size={20} /> 
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSendOtp}>
                  <motion.div variants={itemVariants} className="input-group">
                    <div className="input-box">
                      <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type="email" className="ed-input" placeholder="name@school.edu" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
                      <Mail size={20} className="input-icon" />
                    </div>
                  </motion.div>
                  {successMsg && <p style={{ color: '#4ade80', fontSize: '0.9rem', marginBottom: '16px', textAlign: 'center' }}>{successMsg}</p>}
                  <motion.button variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="action-btn" disabled={isLoading}>
                    {!isLoading && <motion.div className="shimmer-overlay" variants={shimmerVariants} initial="initial" animate="animate" />}
                    {isLoading ? <div className="btn-spinner"></div> : <>{t(content.btn_send_verif)} <Send size={22} /></>}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* VIEW 4: OTP VERIFY */}
            {view === 'otp-verify' && (
              <motion.div key="otp-verify" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <motion.button variants={itemVariants} onClick={() => setView('forgot-password')} className="back-nav"><ChevronLeft size={20} /> {t(content.back_details)}</motion.button>
                <motion.div variants={itemVariants} className="header-section">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="logo-mark"><ShieldCheck size={32} /></motion.div>
                  <h2 className="page-title">{t(content.security_check)}</h2>
                  <p className="page-subtitle">{t(content.enter_code_msg)} <strong>{resetEmail}</strong></p>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div variants={shakeVariants} initial="hidden" animate="visible" exit="hidden" className="error-msg">
                      <AlertCircle size={20} /> 
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleVerifyOtp}>
                  <motion.div variants={itemVariants} className="input-group">
                    <div className="input-box">
                      <motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type="text" className="ed-input" placeholder="000 000" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} style={{ letterSpacing: '12px', textAlign: 'center', fontWeight: '900', fontSize: '1.8rem' }} required />
                      <Lock size={20} className="input-icon" />
                    </div>
                  </motion.div>
                  <motion.button variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="action-btn" disabled={isLoading}>
                    {!isLoading && <motion.div className="shimmer-overlay" variants={shimmerVariants} initial="initial" animate="animate" />}
                    {isLoading ? <div className="btn-spinner"></div> : <>{t(content.btn_verify_access)} <CheckCircle2 size={22} /></>}
                  </motion.button>
                  <motion.div variants={itemVariants} className="auth-footer" style={{ border: 'none', paddingTop: '10px' }}>{t(content.didnt_receive)} <span className="text-link" onClick={handleSendOtp}> {t(content.resend_code)}</span></motion.div>
                </form>
              </motion.div>
            )}

            {/* VIEW 5: RESET PASSWORD */}
            {view === 'reset-password' && (
              <motion.div key="reset-password" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <motion.div variants={itemVariants} className="header-section">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="logo-mark"><RefreshCw size={32} /></motion.div>
                  <h2 className="page-title">{t(content.set_new_pass)}</h2>
                  <p className="page-subtitle">{t(content.create_secure_pass)}</p>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div variants={shakeVariants} initial="hidden" animate="visible" exit="hidden" className="error-msg">
                      <AlertCircle size={20} /> 
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleResetPassword}>
                  <motion.div variants={itemVariants} className="input-group"><div className="input-box"><motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type={showNewPass ? "text" : "password"} className="ed-input" placeholder={t(content.ph_new_pass)} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /><Lock size={20} className="input-icon" /><button type="button" className="password-toggle" onClick={() => setShowNewPass(!showNewPass)}>{showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></motion.div>
                  <motion.div variants={itemVariants} className="input-group"><div className="input-box"><motion.input variants={inputFocusVariants} whileFocus="focus" initial="rest" type={showConfirmNewPass ? "text" : "password"} className="ed-input" placeholder={t(content.ph_conf_new_pass)} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required /><KeyRound size={20} className="input-icon" /><button type="button" className="password-toggle" onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}>{showConfirmNewPass ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></motion.div>
                  {successMsg && <p style={{ color: '#4ade80', fontSize: '0.9rem', marginBottom: '16px' }}>{successMsg}</p>}
                  <motion.button variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="action-btn" disabled={isLoading}>
                    {!isLoading && <motion.div className="shimmer-overlay" variants={shimmerVariants} initial="initial" animate="animate" />}
                    {isLoading ? <div className="btn-spinner"></div> : <>{t(content.btn_update_pass)} <CheckCircle2 size={22} /></>}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* VIEW 6: CLASS SELECT */}
            {view === 'class-select' && (
              <motion.div key="class-select" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <motion.button variants={itemVariants} onClick={() => setView('login')} className="back-nav"><ChevronLeft size={20} /> {t(content.change_user)}</motion.button>
                <motion.div variants={itemVariants} className="header-section">
                  <div className="logo-mark" style={{ borderRadius: '50%' }}><BookOpen size={32} /></div>
                  <h2 className="page-title">{t(content.select_curr)}</h2>
                  <p className="page-subtitle">{t(content.choose_env)}</p>
                </motion.div>
                <div className="class-grid">
                  {classes.map((cls) => (
                    <motion.div variants={itemVariants} whileHover={{ scale: 1.1, y: -5, boxShadow: `0 10px 20px -5px ${currentTheme.color}` }} whileTap={{ scale: 0.95 }} key={cls} className="class-btn" onClick={() => handleClassSelect(cls)}>
                      <div className="class-number">{cls}</div>
                      <div className="class-label">{t(content.standard)}</div>
                      {cls >= 9 && <div style={{ position: 'absolute', top: 12, right: 12, width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--theme-color)', boxShadow: `0 0 10px var(--theme-color)` }}></div>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}