import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);
    const timer = useRef(null);

    const showToast = useCallback((message) => {
        setToast(message);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setToast(null), 2800);
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: `translateX(-50%) translateY(${toast ? '0' : '20px'})`, opacity: toast ? 1 : 0, transition: 'all 220ms cubic-bezier(0.16,1,0.3,1)', pointerEvents: 'none', zIndex: 999 }}>
                <div style={{ background: '#23262C', color: '#FFFFFF', fontSize: 13, fontWeight: 500, padding: '12px 20px', borderRadius: 999, boxShadow: '0 12px 32px rgba(0,0,0,0.28)', whiteSpace: 'nowrap' }}>
                    {toast}
                </div>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};
