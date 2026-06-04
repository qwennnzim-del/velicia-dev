"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, updateUserProfile, logAnalyticsEvent } from '@/services/firebase';
import { UserProfile } from '@/types';

interface ExtendedUserProfile extends UserProfile {
    uid?: string;
}

interface AppContextType {
    userProfile: ExtendedUserProfile;
    setUserProfile: React.Dispatch<React.SetStateAction<ExtendedUserProfile>>;
    language: 'id' | 'en';
    setLanguage: (lang: 'id' | 'en') => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    modals: {
        settings: boolean;
        profile: boolean;
        login: boolean;
    };
    setModals: React.Dispatch<React.SetStateAction<{
        settings: boolean;
        profile: boolean;
        login: boolean;
    }>>;
    toggleModal: (key: 'settings' | 'profile' | 'login') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userProfile, setUserProfile] = useState<ExtendedUserProfile>({
        name: 'Guest',
        bio: '',
        isLoggedIn: false
    });
    const [language, setLanguage] = useState<'id' | 'en'>('id');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [modals, setModals] = useState({
        settings: false,
        profile: false,
        login: false
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserProfile({
                    name: user.displayName || 'User Velicia',
                    bio: user.email || 'Velicia Member',
                    isLoggedIn: true,
                    photoURL: user.photoURL || undefined,
                    uid: user.uid
                });
                setModals(prev => ({ ...prev, login: false }));
            } else {
                setUserProfile({
                    name: 'Guest',
                    bio: '',
                    isLoggedIn: false
                });
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSetLanguage = (lang: 'id' | 'en') => {
        setLanguage(lang);
        logAnalyticsEvent('change_language', { language: lang });
    };

    const toggleModal = (key: 'settings' | 'profile' | 'login') => {
        setModals(prev => ({ ...prev, [key]: !prev[key] }));
        setIsSidebarOpen(false);
    };

    return (
        <AppContext.Provider value={{
            userProfile,
            setUserProfile,
            language,
            setLanguage: handleSetLanguage,
            isSidebarOpen,
            setIsSidebarOpen,
            modals,
            setModals,
            toggleModal
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
