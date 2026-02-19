import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check, ChevronUp, ChevronDown } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageFloatingBtn() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 🔹 Handle Responsive Screen Size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔹 Define all your languages here
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
  ];

  const handleLanguageChange = (langCode) => {
    if (setLanguage) {
      setLanguage(langCode);
    }
    setIsOpen(false);
  };

  const currentLabel = languages.find(l => l.code === language)?.label || 'Language';

  return (
    <>
      <div style={{
        position: 'absolute', // Scrolls with the page
        top: isMobile ? '20px' : 'auto',
        bottom: isMobile ? 'auto' : '30px', 
        right: isMobile ? '16px' : '30px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '5px',
      }}>
        
        {/* 🔹 THE DROP BOX MENU (Conditional for Mobile vs Desktop) */}
        <AnimatePresence>
          {isOpen && (
            isMobile ? (
              /* --- MOBILE BOTTOM SHEET TAB --- */
              <>
                {/* Darkened Background Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)} // Close when clicking outside
                  style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 100000,
                  }}
                />
                
                {/* The Slide-up Tab */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  style={{
                    position: 'fixed',
                    bottom: 0, left: 0, right: 0,
                    background: 'rgba(15, 23, 42, 0.98)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px',
                    padding: '24px 20px 40px', // Extra bottom padding for mobile screens
                    zIndex: 100001,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {/* Visual Drag Handle Pill */}
                  <div style={{
                    width: '40px', height: '5px', 
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '5px', 
                    margin: '0 auto 16px auto'
                  }} />
                  
                  <h3 style={{ 
                    color: '#fff', margin: '0 0 12px 0', 
                    fontSize: '1.1rem', textAlign: 'center', fontWeight: '600'
                  }}>
                    Select Language
                  </h3>

                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      style={{
                        background: language === lang.code ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid',
                        borderColor: language === lang.code ? 'rgba(139, 92, 246, 0.5)' : 'transparent',
                        color: language === lang.code ? '#fff' : '#94a3b8',
                        padding: '16px', // Larger touch target for mobile
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      {lang.label}
                      {language === lang.code && <Check size={18} color="#a78bfa" />}
                    </button>
                  ))}
                </motion.div>
              </>
            ) : (
              /* --- DESKTOP FLOATING DROPDOWN --- */
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  minWidth: '160px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                  marginBottom: '5px'
                }}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    style={{
                      background: language === lang.code ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                      border: 'none',
                      color: language === lang.code ? '#fff' : '#94a3b8',
                      padding: '10px 14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      if (language !== lang.code) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (language !== lang.code) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#94a3b8';
                      }
                    }}
                  >
                    {lang.label}
                    {language === lang.code && <Check size={16} color="#a78bfa" />}
                  </button>
                ))}
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* 🔹 THE MAIN BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '6px' : '10px',
            padding: isMobile ? '10px 16px' : '12px 20px',
            borderRadius: '50px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            color: '#fff',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            WebkitTapHighlightColor: 'transparent'
          }}
          onMouseOver={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
            }
          }}
          onMouseOut={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
          }}
        >
          <Globe size={isMobile ? 18 : 20} color="#a78bfa" />
          <span>{isMobile ? language.toUpperCase() : currentLabel.split(' ')[0]}</span> 
          {isOpen ? <ChevronDown size={isMobile ? 14 : 16} /> : <ChevronUp size={isMobile ? 14 : 16} />}
        </button>
      </div>
    </>
  );
}