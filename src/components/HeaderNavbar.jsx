import React from 'react';
import { Dna, Trophy, BookOpen, Gamepad2, User, Sun, Moon, Sparkles, School } from 'lucide-react';
import { AVATARS } from '../utils/storage';
import { playSound } from '../utils/audio';

export default function HeaderNavbar({ activeTab, setActiveTab, userProfile, onEditProfile, theme, onToggleTheme, activeGame }) {
  const currentAvatar = AVATARS.find(a => a.id === userProfile?.avatar) || AVATARS[0];

  const navItems = [
    { id: 'dashboard', label: 'Giochi', icon: Gamepad2 },
    { id: 'leaderboard', label: 'Classifica', icon: Trophy },
    { id: 'initiative', label: 'Info & GitHub', icon: BookOpen }
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: theme === 'light' ? 'rgba(248, 250, 252, 0.95)' : 'rgba(9, 13, 22, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-glass)',
        marginBottom: '20px',
        transition: 'background-color 0.25s ease'
      }}>
        <div className="app-wrapper" style={{ paddingBottom: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '68px',
            padding: '10px 0',
            gap: '12px',
            flexWrap: 'nowrap'
          }}>
            {/* Logo Brand */}
            <div 
              onClick={() => {
                setActiveTab('dashboard');
                playSound('click');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: theme === 'light' ? '#e0f2fe' : 'rgba(0,242,254,0.18)',
                border: '1px solid var(--primary-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Dna size={24} color="var(--primary-cyan)" className="dna-glow" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, lineHeight: 1.1 }}>
                  OncoBio<span className="text-gradient-cyan">Games</span>
                </h1>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.02em', display: 'block' }}>
                  Computational Oncology 🏫
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav" style={{ display: 'flex', gap: '6px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = !activeGame && activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      playSound('click');
                    }}
                    style={{
                      background: isActive ? (theme === 'light' ? '#e0f2fe' : 'rgba(0, 242, 254, 0.15)') : 'transparent',
                      border: isActive ? '1px solid var(--primary-cyan)' : '1px solid transparent',
                      color: isActive ? 'var(--primary-cyan)' : 'var(--text-muted)',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Theme Switcher & User Profile Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {/* Toggle Tema (Chiaro / Scuro) */}
              <button
                onClick={() => {
                  onToggleTheme();
                  playSound('click');
                }}
                title={theme === 'dark' ? 'Modalità Chiara' : 'Modalità Scura'}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#6366f1" />}
                <span className="desktop-nav">{theme === 'dark' ? 'Chiaro' : 'Scuro'}</span>
              </button>

              {/* User Profile */}
              {userProfile && (
                <div
                  onClick={() => {
                    onEditProfile();
                    playSound('click');
                  }}
                  title="Modifica il tuo nome o classe"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  className="glass-panel-interactive"
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: 'rgba(0, 242, 254, 0.15)',
                    border: `1px solid ${currentAvatar.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <User size={16} color={currentAvatar.color} />
                  </div>

                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>
                      {userProfile.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary-cyan)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Sparkles size={10} /> {userProfile.score || 0} pt
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !activeGame && activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                playSound('click');
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

