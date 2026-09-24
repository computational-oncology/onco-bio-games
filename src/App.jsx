import React, { useState, useEffect } from 'react';
import HeaderNavbar from './components/HeaderNavbar';
import Dashboard from './components/Dashboard';
import UserLoginModal from './components/UserLoginModal';
import MutationHunterGame from './components/MutationHunterGame';
import CellDifferencesGame from './components/CellDifferencesGame';
import LeaderboardView from './components/LeaderboardView';
import InitiativeInfoView from './components/InitiativeInfoView';
import { getUserProfile, getStoredTheme, saveStoredTheme } from './utils/storage';

export default function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeGame, setActiveGame] = useState(null);
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveStoredTheme(nextTheme);
  };

  useEffect(() => {
    const existing = getUserProfile();
    if (existing && existing.name) {
      setUserProfile(existing);
    } else {
      setShowLoginModal(true);
    }
  }, []);

  const handleSaveProfile = (profile) => {
    setUserProfile(profile);
    setShowLoginModal(false);
  };

  const handleSelectGame = (gameId) => {
    setActiveGame(gameId);
  };

  const handleBackToDashboard = () => {
    setActiveGame(null);
  };

  const refreshProfileState = () => {
    const updated = getUserProfile();
    if (updated) setUserProfile(updated);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar con Theme Toggle */}
      <HeaderNavbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveGame(null);
        }}
        userProfile={userProfile}
        onEditProfile={() => setShowLoginModal(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeGame={activeGame}
      />

      {/* Main Container */}
      <main className="app-wrapper" style={{ flex: 1 }}>
        {/* Active Game Overlay */}
        {activeGame === 'mutationHunter' && (
          <MutationHunterGame onBack={handleBackToDashboard} onScoreUpdate={refreshProfileState} />
        )}
        {activeGame === 'cellDifferences' && (
          <CellDifferencesGame onBack={handleBackToDashboard} onScoreUpdate={refreshProfileState} />
        )}

        {/* Tab Views */}
        {!activeGame && activeTab === 'dashboard' && (
          <Dashboard
            userProfile={userProfile}
            onSelectGame={handleSelectGame}
            onEditProfile={() => setShowLoginModal(true)}
            onNavigate={setActiveTab}
          />
        )}
        {!activeGame && activeTab === 'leaderboard' && (
          <LeaderboardView userProfile={userProfile} />
        )}
        {!activeGame && activeTab === 'initiative' && (
          <InitiativeInfoView />
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="app-wrapper" style={{ paddingBottom: 0 }}>
          OncoBioGames • Iniziativa Didattica di <a href="https://github.com/computational-oncology" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-cyan)', textDecoration: 'none', fontWeight: '700' }}>computational-oncology</a> per le Scuole Medie e Superiori 🏫
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <UserLoginModal
          initialProfile={userProfile}
          onSave={handleSaveProfile}
          onClose={() => setShowLoginModal(false)}
          isCancelable={!!userProfile}
        />
      )}
    </div>
  );
}
