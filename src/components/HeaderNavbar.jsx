import React from 'react';
import { Dna, Trophy, BookOpen, Gamepad2, User, Sun, Moon, Sparkles, School } from 'lucide-react';
import { AVATARS } from '../utils/storage';
import { playSound } from '../utils/audio';

export default function HeaderNavbar({ activeTab, setActiveTab, userProfile, onEditProfile, theme, onToggleTheme }) {
  const currentAvatar = AVATARS.find(a => a.id === userProfile?.avatar) || AVATARS[0];

  const navItems = [
    { id: 'dashboard', label: 'Giochi', icon: Gamepad2 },
    { id: 'leaderboard', label: 'Classifica & Badge', icon: Trophy },
    { id: 'initiative', label: 'Info & GitHub', icon: BookOpen }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: theme === 'light' ? 'rgba(248, 250, 252, 0.95)' : 'rgba(9, 13, 22, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-glass)',
      marginBottom: '28px',
      transition: 'background-color 0.25s ease'
    }}>
      <div className="app-wrapper" style={{ paddingBottom: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
          gap: '16px'
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
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: theme === 'light' ? '#e0f2fe' : 'rgba(0,242,254,0.18)',
              border: '1px solid var(--primary-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Dna size={26} color="var(--primary-cyan)" className="dna-glow" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, lineHeight: 1.1 }}>
                OncoBio<span className="text-gradient-cyan">Games</span>
              </h1>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.04em' }}>
                Bioinformatica per le Scuole 🏫
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '6px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
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
                    fontSize: '0.9rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Toggle Tema (Chiaro / Scuro) */}
            <button
              onClick={() => {
                onToggleTheme();
                playSound('click');
              }}
              title={theme === 'dark' ? 'Passa a Modalità Chiara (Sfondo Chiaro per Lavagne/Proiettori)' : 'Passa a Modalità Scura (Dark Mode)'}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
              <span>{theme === 'dark' ? 'Chiaro' : 'Scuro'}</span>
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
                  gap: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="glass-panel-interactive"
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(0, 242, 254, 0.15)',
                  border: `1px solid ${currentAvatar.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={18} color={currentAvatar.color} />
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
                    {userProfile.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary-cyan)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Sparkles size={11} /> {userProfile.score || 0} pt
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
