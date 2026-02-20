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

  const [view, setView] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [successMsg, setSuccessMsg] = useState('');
  
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setError(null);
    setSuccessMsg('');
  }, [view]);

  useEffect(() => {
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

  // Password visibility states
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);

  const content = {
    back_home: { en: "Back to Home", pa: "ਵਾਪਸ ਘਰ", hi: "वापस होम", bn: "হোমে ফিরে যান" },
    back_login: { en: "Back to Login", pa: "ਲੌਗਇਨ ਤੇ ਵਾਪਸ", hi: "लॉगिन पर वापस", bn: "লগইনে ফিরে যান" },
    back_details: { en: "Back to Details", pa: "ਵੇਰਵਿਆਂ ਤੇ ਵਾਪਸ", hi: "विवरण पर वापस", bn: "বিবরণে ফিরে যান" },
    change_user: { en: "Change User", pa: "ਯੂਜ਼ਰ ਬਦਲੋ", hi: "उपयोगकर्ता बदलें", bn: "ব্যবহারকারী পরিবর্তন" },
    label_student: { en: "Student Login", pa: "ਵਿਦਿਆਰਥੀ ਲਾਗਇਨ", hi: "छात्र लॉगिन", bn: "ছাত্র লগইন" },
    label_teacher: { en: "Teacher Login", pa: "ਅਧਿਆਪਕ ਲਾਗਇਨ", hi: "शिक्षक लॉगिन", bn: "शिक्षक লগইন" },
    label_parent: { en: "Parent Login", pa: "ਮਾਪੇ ਲਾਗਇਨ", hi: "अभिभावक लॉगिन", bn: "অভিভাবক লগইন" },
    welcome: { en: "Welcome", pa: "ਜੀ ਆਇਆਂ ਨੂੰ", hi: "स्वागत है", bn: "স্বাগতম" },
    lbl_email: { en: "Email ID", pa: "ਈਮੇਲ ਆਈਡੀ", hi: "ईमेल आईडी", bn: "ইমেল আইডি" },
    lbl_pass: { en: "Password", pa: "ਪਾਸਵਰਡ", hi: "पासवर्ड", bn: "পাসওয়ার্ড" },
    ph_email: { en: "Enter your email", pa: "ਈਮੇਲ ਦਰਜ ਕਰੋ", hi: "अपना ईमेल दर्ज करें", bn: "আপনার ইমেল লিখুন" },
    forgot_pass: { en: "Forgot Password?", pa: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?", hi: "पासवर्ड भूल गए?", bn: "পাসওয়ার্ড ভুলে গেছেন?" },
    btn_signin: { en: "LOGIN", pa: "ਲਾਗਇਨ", hi: "लॉगिन", bn: "লগইন" },
    new_platform: { en: "New here?", pa: "ਇੱਥੇ ਨਵੇਂ ਹੋ?", hi: "यहाँ नए हैं?", bn: "এখানে নতুন?" },
    act_account: { en: "Create Account", pa: "ਖਾਤਾ ਬਣਾਓ", hi: "खाता बनाएं", bn: "অ্যাকাউন্ট তৈরি করুন" },
    ph_name: { en: "Full Name", pa: "ਪੂਰਾ ਨਾਮ", hi: "पूरा नाम", bn: "পুরো নাম" },
    ph_school_email: { en: "School Email", pa: "ਸਕੂਲ ਈਮੇਲ", hi: "स्कूल ईमेल", bn: "স্কুল ইমেল" },
    ph_create_pass: { en: "Password", pa: "ਪਾਸਵਰਡ", hi: "पासवर्ड", bn: "পাসওয়ার্ড" },
    ph_confirm_pass: { en: "Confirm Password", pa: "ਪਾਸਵਰਡ ਪੁਸ਼ਟੀ", hi: "पासवर्ड पुष्टि", bn: "পাসওয়ার্ড নিশ্চিত করুন" },
    ph_ref_code: { en: "Referral Code", pa: "ਰੈਫਰਲ ਕੋਡ", hi: "रेफरल कोड", bn: "রেফারেল কোড" },
    msg_ref_code: { en: "Ask your teacher.", pa: "ਅਧਿਆਪਕ ਨੂੰ ਪੁੱਛੋ।", hi: "शिक्षक से पूछें।", bn: "শিক্ষককে জিজ্ঞাসা করুন।" },
    ph_parent_code: { en: "Student Code", pa: "ਵਿਦਿਆਰਥੀ ਕੋਡ", hi: "छात्र कोड", bn: "ছাত্র কোড" },
    ph_parent_phone: { en: "Phone Number", pa: "ਫੋਨ ਨੰਬਰ", hi: "फोन नंबर", bn: "ফোন নম্বর" },
    btn_send_otp: { en: "SEND OTP", pa: "OTP ਭੇਜੋ", hi: "ओटीपी भेजें", bn: "ওটিপি পাঠান" },
    already_account: { en: "Have an account?", pa: "ਖਾਤਾ ਹੈ?", hi: "खाता है?", bn: "অ্যাকাউন্ট আছে?" },
    sign_in: { en: "Login", pa: "ਲਾਗਇਨ", hi: "लॉगिन", bn: "লগইন" },
    verify_email: { en: "Verify Email", pa: "ਈਮੇਲ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ", hi: "ईमेल सत्यापित करें", bn: "ইমেল যাচাই করুন" },
    enter_code_msg: { en: "Enter code sent to", pa: "ਨੂੰ ਭੇਜਿਆ ਕੋਡ ਦਰਜ ਕਰੋ", hi: "को भेजा गया कोड दर्ज करें", bn: "পাঠানো কোড লিখুন" },
    btn_verify_create: { en: "VERIFY & LOGIN", pa: "ਪੁਸ਼ਟੀ ਅਤੇ ਲਾਗਇਨ", hi: "सत्यापित और लॉगिन", bn: "যাচাই এবং লগইন" },
    didnt_receive: { en: "No code?", pa: "ਕੋਡ ਨਹੀਂ ਮਿਲਿਆ?", hi: "कोड नहीं मिला?", bn: "কোড পাননি?" },
    resend_code: { en: "Resend", pa: "ਦੁਬਾਰਾ ਭੇਜੋ", hi: "पुनः भेजें", bn: "পুনরায় পাঠান" },
    acc_recovery: { en: "Recovery", pa: "ਰਿਕਵਰੀ", hi: "पुनर्प्राप्ति", bn: "পুনরুদ্ধার" },
    recovery_msg: { en: "We'll send a code to your email.", pa: "ਅਸੀਂ ਤੁਹਾਡੀ ਈਮੇਲ 'ਤੇ ਕੋਡ ਭੇਜਾਂਗੇ।", hi: "हम आपके ईमेल पर एक कोड भेजेंगे।", bn: "আমরা আপনার ইমেলে একটি কোড পাঠাব।" },
    btn_send_verif: { en: "SEND CODE", pa: "ਕੋਡ ਭੇਜੋ", hi: "कोड भेजें", bn: "কোড পাঠান" },
    security_check: { en: "Security", pa: "ਸੁਰੱਖਿਆ", hi: "सुरक्षा", bn: "নিরাপত্তা" },
    btn_verify_access: { en: "VERIFY", pa: "ਪੁਸ਼ਟੀ ਕਰੋ", hi: "सत्यापित करें", bn: "যাচাই করুন" },
    set_new_pass: { en: "New Password", pa: "ਨਵਾਂ ਪਾਸਵਰਡ", hi: "नया पासवर्ड", bn: "নতুন পাসওয়ার্ড" },
    create_secure_pass: { en: "Create a new strong password.", pa: "ਇੱਕ ਨਵਾਂ ਮਜ਼ਬੂਤ ਪਾਸਵਰਡ ਬਣਾਓ।", hi: "एक नया मजबूत पासवर्ड बनाएं।", bn: "একটি নতুন শক্তিশালী পাসওয়ার্ড তৈরি করুন।" },
    ph_new_pass: { en: "New Password", pa: "ਨਵਾਂ ਪਾਸਵਰਡ", hi: "नया पासवर्ड", bn: "নতুন পাসওয়ার্ড" },
    ph_conf_new_pass: { en: "Confirm", pa: "ਪੁਸ਼ਟੀ ਕਰੋ", hi: "पुष्टि करें", bn: "নিশ্চিত করুন" },
    btn_update_pass: { en: "UPDATE", pa: "ਅੱਪਡੇਟ ਕਰੋ", hi: "अपडेट करें", bn: "আপডেট করুন" },
    select_curr: { en: "Select Class", pa: "ਜਮਾਤ ਚੁਣੋ", hi: "कक्षा चुनें", bn: "ক্লাস নির্বাচন করুন" },
    choose_env: { en: "Select your classroom", pa: "ਆਪਣੀ ਜਮਾਤ ਚੁਣੋ", hi: "अपनी कक्षा चुनें", bn: "আপনার ক্লাসরুম চয়ন করুন" },
    standard: { en: "Class", pa: "ਜਮਾਤ", hi: "कक्षा", bn: "ক্লাস" }
  };

  const roleTheme = {
    student: {
      color: '#3b82f6', 
      label: t(content.label_student),
      icon: <User size={36} />
    },
    teacher: {
      color: '#3b82f6', 
      label: t(content.label_teacher),
      icon: <User size={36} />
    },
    parent: {
      color: '#3b82f6', 
      label: t(content.label_parent),
      icon: <User size={36} />
    }
  };

  const currentTheme = roleTheme[portalRole] || roleTheme.student;
  const classes = Array.from({ length: 12 }, (_, i) => i + 1);

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
      setError(err.response?.data?.message || 'Login failed.');
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
      setForm({ name: '', email: '', password: '', confirmPassword: '', referralCode: '', studentCode: '', parentPhone: '' });
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

  // --- MINIMAL ANIMATION ---
  const fadeIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="login-wrapper">
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background-color: #0b0f19; /* Deep modern slate background */
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Soft Blue Aura */
        .blue-aura {
          position: absolute;
          width: 50vw;
          height: 50vw;
          min-width: 400px;
          min-height: 400px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 60%);
          filter: blur(80px);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
        }

        /* Modern Round Glass Card */
        .glass-card {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 32px; /* Very round modern edges */
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
          text-align: center;
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
        }

        /* Top Icon Circle */
        .user-icon-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          color: white;
          box-shadow: inset 0 0 15px rgba(255,255,255,0.05);
        }

        .login-title {
          color: white;
          font-size: 1.15rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 35px;
        }

        /* Modern Pill Inputs */
        .input-group {
          margin-bottom: 20px;
          position: relative;
          text-align: left;
        }

        .modern-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px; /* Perfect pill shape */
          padding: 15px 48px 15px 48px; /* Room for left and right icons */
          color: white;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }

        .modern-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.9rem;
        }

        .modern-input:focus {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 15px rgba(37, 99, 235, 0.3);
        }

        .input-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
          width: 18px;
          height: 18px;
          pointer-events: none;
          transition: color 0.3s;
        }

        .modern-input:focus ~ .input-icon {
          color: white;
        }

        /* Password Eye Toggle */
        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: white;
        }

        /* Footer Links */
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          padding: 0 5px;
        }

        .forgot-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: white; }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        
        .checkbox-custom {
          width: 16px;
          height: 16px;
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          border-radius: 4px;
          display: inline-block;
          transition: border-color 0.2s;
        }
        .checkbox-container:hover .checkbox-custom {
          border-color: white;
        }

        /* Rounded Blue Button */
        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 16px;
          border: none;
          border-radius: 50px; /* Matches input pill shape */
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          text-transform: uppercase;
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.5);
          transition: all 0.2s ease;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -5px rgba(37, 99, 235, 0.6);
          filter: brightness(1.1);
        }
        
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .error-msg {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.85rem;
          margin-bottom: 20px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bottom-link {
          margin-top: 25px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }
        .text-highlight {
          color: white;
          font-weight: 600;
          cursor: pointer;
          margin-left: 5px;
          transition: color 0.2s;
        }
        .text-highlight:hover { color: #60a5fa; }
        
        .text-link-inline { background: none; border: none; color: white; padding: 0; font: inherit; cursor: pointer; text-decoration: underline; font-weight: 600; }

        /* Class Grid for Selection */
        .class-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 15px; }
        .class-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 15px 10px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .class-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }

      `}</style>

      {/* The background aura */}
      <div className="blue-aura"></div>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: LOGIN */}
        {view === 'login' && (
          <motion.div key="login" className="glass-card" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
            
            {/* Nav Back */}
            <div style={{position: 'absolute', top: 24, left: 24, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s'}} onClick={() => navigate('/')} onMouseOver={(e)=>e.currentTarget.style.color='white'} onMouseOut={(e)=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>
               <ChevronLeft size={22} />
            </div>

            <div className="user-icon-circle">
              <User size={34} strokeWidth={1.5} />
            </div>

            <h2 className="login-title">{currentTheme.label}</h2>

            {error && (
              <div className="error-msg">
                <AlertCircle size={18} /> <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAuth}>
              <div className="input-group">
                <input 
                  className="modern-input" 
                  placeholder={t(content.ph_email)} 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  required 
                />
                <Mail className="input-icon" strokeWidth={1.5} />
              </div>

              <div className="input-group">
                <input 
                  className="modern-input" 
                  type={showLoginPass ? "text" : "password"} 
                  placeholder={t(content.lbl_pass)} 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  required 
                />
                <Lock className="input-icon" strokeWidth={1.5} />
                <button type="button" className="password-toggle" onClick={() => setShowLoginPass(!showLoginPass)}>
                  {showLoginPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="form-options">
                <div className="checkbox-container">
                  
                 
                </div>
                <span className="forgot-link" onClick={() => setView('forgot-password')}>
                  {t(content.forgot_pass)}
                </span>
              </div>

              {successMsg && <p style={{color: '#4ade80', fontSize: '0.85rem', marginBottom: 15}}>{successMsg}</p>}

              <button className="login-btn" disabled={isLoading}>
                {isLoading ? "..." : t(content.btn_signin)}
              </button>
            </form>

            <div className="bottom-link">
              {t(content.new_platform)} 
              <span className="text-highlight" onClick={() => { setError(null); setSuccessMsg(''); setView('signup'); }}>
                {t(content.act_account)}
              </span>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: SIGNUP */}
        {view === 'signup' && (
          <motion.div key="signup" className="glass-card" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
            <div style={{position: 'absolute', top: 24, left: 24, cursor: 'pointer', color: 'rgba(255,255,255,0.5)'}} onClick={() => setView('login')} onMouseOver={(e)=>e.currentTarget.style.color='white'} onMouseOut={(e)=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>
               <ChevronLeft size={22} />
            </div>
            
            <div className="user-icon-circle"><UserPlus size={34} strokeWidth={1.5} /></div>
            <h2 className="login-title">{t(content.act_account)}</h2>

            {error && <div className="error-msg"><AlertCircle size={18} /> <span>{error}</span></div>}

            <form onSubmit={handleRegister}>
              <div className="input-group">
                <input className="modern-input" placeholder={t(content.ph_name)} name="name" value={form.name} onChange={handleChange} required />
                <User className="input-icon" strokeWidth={1.5} />
              </div>
              <div className="input-group">
                <input className="modern-input" type="tel" placeholder={t(content.ph_parent_phone)} name="parentPhone" value={form.parentPhone} onChange={handleChange} required={portalRole === 'student'} />
                <Phone className="input-icon" strokeWidth={1.5} />
              </div>
              <div className="input-group">
                <input className="modern-input" type="email" placeholder={t(content.ph_school_email)} name="email" value={form.email} onChange={handleChange} required />
                <Mail className="input-icon" strokeWidth={1.5} />
              </div>
              <div className="input-group">
                <input className="modern-input" type={showSignupPass ? "text" : "password"} placeholder={t(content.ph_create_pass)} name="password" value={form.password} onChange={handleChange} required />
                <Lock className="input-icon" strokeWidth={1.5} />
                <button type="button" className="password-toggle" onClick={() => setShowSignupPass(!showSignupPass)}>
                  {showSignupPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="input-group">
                <input className="modern-input" type={showConfirmPass ? "text" : "password"} placeholder={t(content.ph_confirm_pass)} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
                <KeyRound className="input-icon" strokeWidth={1.5} />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {portalRole === 'student' && (
                <div className="input-group">
                  <input className="modern-input" placeholder={t(content.ph_ref_code)} name="referralCode" value={form.referralCode} onChange={handleChange} required />
                  <KeyRound className="input-icon" strokeWidth={1.5} />
                </div>
              )}
              {portalRole === 'parent' && (
                <div className="input-group">
                  <input className="modern-input" placeholder={t(content.ph_parent_code)} name="studentCode" value={form.studentCode} onChange={handleChange} required />
                  <KeyRound className="input-icon" strokeWidth={1.5} />
                </div>
              )}

              <button className="login-btn" disabled={isLoading}>{isLoading ? "..." : t(content.btn_send_otp)}</button>
            </form>
          </motion.div>
        )}

        {/* VIEW 2b: OTP */}
        {view === 'signup-otp' && (
          <motion.div key="otp" className="glass-card" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
             <div style={{position: 'absolute', top: 24, left: 24, cursor: 'pointer', color: 'rgba(255,255,255,0.5)'}} onClick={() => setView('signup')} onMouseOver={(e)=>e.currentTarget.style.color='white'} onMouseOut={(e)=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}><ChevronLeft size={22} /></div>
             <div className="user-icon-circle"><ShieldCheck size={34} strokeWidth={1.5} /></div>
             <h2 className="login-title">{t(content.verify_email)}</h2>
             <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: 25, fontSize: '0.85rem'}}>{t(content.enter_code_msg)} <br/><strong style={{color:'white'}}>{pendingSignupData?.email}</strong></p>
             
             {error && <div className="error-msg"><AlertCircle size={18}/> <span>{error}</span></div>}
             
             <form onSubmit={handleVerifySignupOtp}>
                <div className="input-group">
                  <input className="modern-input" placeholder="000 000" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} style={{textAlign:'center', letterSpacing: 8, fontWeight: 'bold', paddingLeft: 15}} />
                </div>
                <button className="login-btn" disabled={isLoading} style={{marginBottom: 15}}>{isLoading ? "..." : t(content.btn_verify_create)}</button>
             </form>
             
             <div style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)'}}>
                {t(content.didnt_receive)} <span className="text-highlight" onClick={handleResendSignupOtp}>{t(content.resend_code)}</span>
             </div>
          </motion.div>
        )}

        {/* VIEW 3: FORGOT PASSWORD */}
        {view === 'forgot-password' && (
          <motion.div key="forgot" className="glass-card" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
             <div style={{position: 'absolute', top: 24, left: 24, cursor: 'pointer', color: 'rgba(255,255,255,0.5)'}} onClick={() => setView('login')} onMouseOver={(e)=>e.currentTarget.style.color='white'} onMouseOut={(e)=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}><ChevronLeft size={22} /></div>
             <div className="user-icon-circle"><KeyRound size={34} strokeWidth={1.5} /></div>
             <h2 className="login-title">{t(content.acc_recovery)}</h2>
             <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: 25, fontSize: '0.85rem'}}>{t(content.recovery_msg)}</p>
             
             {error && <div className="error-msg"><AlertCircle size={18}/> <span>{error}</span></div>}
             
             <form onSubmit={handleSendOtp}>
                <div className="input-group">
                  <input className="modern-input" placeholder={t(content.ph_email)} value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                  <Mail className="input-icon" strokeWidth={1.5} />
                </div>
                {successMsg && <p style={{color: '#4ade80', fontSize: '0.85rem', marginBottom: 15}}>{successMsg}</p>}
                <button className="login-btn" disabled={isLoading}>{isLoading ? "..." : t(content.btn_send_verif)}</button>
             </form>
          </motion.div>
        )}

        {/* VIEW 4: OTP RESET */}
        {view === 'otp-verify' && (
          <motion.div key="otp-reset" className="glass-card" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
             <div style={{position: 'absolute', top: 24, left: 24, cursor: 'pointer', color: 'rgba(255,255,255,0.5)'}} onClick={() => setView('forgot-password')} onMouseOver={(e)=>e.currentTarget.style.color='white'} onMouseOut={(e)=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}><ChevronLeft size={22} /></div>
             <div className="user-icon-circle"><ShieldCheck size={34} strokeWidth={1.5} /></div>
             <h2 className="login-title">{t(content.security_check)}</h2>
             <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: 25, fontSize: '0.85rem'}}>{t(content.enter_code_msg)} <br/><strong style={{color:'white'}}>{resetEmail}</strong></p>
             
             {error && <div className="error-msg"><AlertCircle size={18}/> <span>{error}</span></div>}
             
             <form onSubmit={handleVerifyOtp}>
                <div className="input-group">
                  <input className="modern-input" placeholder="000 000" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} style={{textAlign:'center', letterSpacing: 8, fontWeight: 'bold', paddingLeft: 15}} />
                </div>
                <button className="login-btn" disabled={isLoading}>{isLoading ? "..." : t(content.btn_verify_access)}</button>
             </form>
          </motion.div>
        )}

        {/* VIEW 5: NEW PASS */}
        {view === 'reset-password' && (
          <motion.div key="new-pass" className="glass-card" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
             <div className="user-icon-circle"><RefreshCw size={34} strokeWidth={1.5} /></div>
             <h2 className="login-title">{t(content.set_new_pass)}</h2>
             
             {error && <div className="error-msg"><AlertCircle size={18}/> <span>{error}</span></div>}
             
             <form onSubmit={handleResetPassword}>
                <div className="input-group">
                  <input className="modern-input" type={showNewPass ? "text" : "password"} placeholder={t(content.ph_new_pass)} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <Lock className="input-icon" strokeWidth={1.5} />
                  <button type="button" className="password-toggle" onClick={() => setShowNewPass(!showNewPass)}>
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="input-group">
                  <input className="modern-input" type={showConfirmNewPass ? "text" : "password"} placeholder={t(content.ph_conf_new_pass)} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                  <KeyRound className="input-icon" strokeWidth={1.5} />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}>
                    {showConfirmNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button className="login-btn" disabled={isLoading}>{isLoading ? "..." : t(content.btn_update_pass)}</button>
             </form>
          </motion.div>
        )}

        {/* VIEW 6: CLASS SELECT */}
        {view === 'class-select' && (
          <motion.div key="class-select" className="glass-card" variants={fadeIn} initial="hidden" animate="visible" exit="exit" style={{maxWidth: 500}}>
             <div style={{position: 'absolute', top: 24, left: 24, cursor: 'pointer', color: 'rgba(255,255,255,0.5)'}} onClick={() => setView('login')} onMouseOver={(e)=>e.currentTarget.style.color='white'} onMouseOut={(e)=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}><ChevronLeft size={22} /></div>
             <div className="user-icon-circle"><BookOpen size={34} strokeWidth={1.5} /></div>
             <h2 className="login-title" style={{marginBottom: 15}}>{t(content.select_curr)}</h2>
             <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: 25, fontSize: '0.85rem'}}>{t(content.choose_env)}</p>
             
             <div className="class-grid">
               {classes.map(cls => (
                 <div key={cls} className="class-btn" onClick={() => handleClassSelect(cls)}>
                   <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{cls}</div>
                   <div style={{fontSize: '0.6rem', opacity: 0.6}}>{t(content.standard)}</div>
                 </div>
               ))}
             </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
