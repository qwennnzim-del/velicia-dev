"use client";
import { useAppContext } from '@/components/AppContext';
import { SettingsModal, ProfileModal, LoginModal } from '@/components/Modals';
import { auth, updateUserProfile, logAnalyticsEvent } from '@/services/firebase';

export const GlobalModals = () => {
    const { modals, toggleModal, language, setLanguage, userProfile, setUserProfile, setModals } = useAppContext();

    const handleSaveProfile = async (newProfile: any) => {
        setUserProfile(prev => ({ ...prev, ...newProfile }));
        if (auth.currentUser) {
            try {
                await updateUserProfile(auth.currentUser, newProfile.name);
            } catch (e) {
                console.error("Failed to update profile in firebase", e);
            }
        }
    };

    return (
        <>
            <SettingsModal 
                isOpen={modals.settings} 
                onClose={() => toggleModal('settings')} 
                language={language}
                setLanguage={(lang) => {
                    setLanguage(lang);
                    logAnalyticsEvent('change_language', { language: lang });
                }}
                onClearHistory={() => { 
                    if(userProfile.isLoggedIn && userProfile.uid) {
                        alert("Untuk saat ini, silakan hapus chat satu per satu di sidebar.");
                    } else {
                        localStorage.removeItem('velicia_chat_history');
                        window.location.reload(); 
                    }
                    logAnalyticsEvent('clear_history');
                }}
            />
            <ProfileModal 
                isOpen={modals.profile} 
                onClose={() => toggleModal('profile')}
                profile={userProfile}
                onSave={handleSaveProfile}
            />
            <LoginModal 
                isOpen={modals.login}
                onClose={() => toggleModal('login')}
                onLogin={() => {}} 
            />
        </>
    );
};
