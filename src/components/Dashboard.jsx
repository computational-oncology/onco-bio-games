import React from 'react';
import { Dna, Microscope, Trophy, Award, Sparkles, User, ArrowRight, BookOpen } from 'lucide-react';
import { getUserStats, BADGES, AVATARS } from '../utils/storage';
import { playSound } from '../utils/audio';

export default function Dashboard({ userProfile, onSelectGame, onEditProfile, onNavigate }) {
  const stats = getUserStats();
  const currentAvatar = AVATARS.find(a => a.id === userProfile?.avatar) || AVATARS[0];

  const games = [
    {
      id: 'mutationHunter',
      title: '1. Caccia alle Mutazioni',
      subtitle: 'Analisi Sequenza DNA & Variant Calling',
      description: 'Confronta i reads del sequenziamento tumorale con la sequenza di riferimento Wild-Type. Identifica le varianti geniche somatiche in BRAF, EGFR, KRAS e TP53.',
      icon: Dna,
      color: '#00f2fe',
      gradient: 'linear-gradient(135deg, rgba(0,242,254,0.15), rgba(0,180,219,0.05))',
      borderColor: 'rgba(0,242,254,0.3)',
      highScore: stats.highScores?.mutationHunter || 0
    },
    {
      id: 'cellDifferences',
      title: '2. Trova le 5 Differenze Cellulari',
      subtitle: 'Cellula Normale vs Tumorale (4 Facili + 1 Difficile)',
      description: 'Analizza la morfologia citologica ed il metabolismo. Trova le 5 anomalie strutturali, tra cui nucleo anaplastico, cromatina addensata ed il difficile Effetto Warburg!',
      icon: Microscope,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.05))',
      borderColor: 'rgba(236,72,153,0.3)',
      highScore: stats.highScores?.cellDifferences || 0
    }
  ];

  return (
    <div>
      {/* Welcome Hero Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 90% 10%, rgba(0, 242, 254, 0.12), transparent 40%), var(--bg-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 300px', maxWidth: '650px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0,242,254,0.3)', borderRadius: '999px', padding: '6px 14px', fontSize: '0.82rem', color: '#00f2fe', fontWeight: '700', marginBottom: '14px' }}>
              <Sparkles size={14} /> Piattaforma Didattica Computational Oncology
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: '800', lineHeight: 1.2, marginBottom: '12px' }}>
              Benvenuto/a, <span className="text-gradient-cyan">{userProfile?.name || 'Ricercatore'}</span>!
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Due sfide interattive di bioinformatica ed oncologia molecolare in lingua italiana. Impara l'allineamento di sequenza e l'analisi citopatologica tumorale.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  onSelectGame('mutationHunter');
                  playSound('click');
                }}
                style={{ flex: '1 1 200px' }}
              >
                <Dna size={18} /> Inizia Caccia alle Mutazioni
              </button>

              <button
                className="btn-pink"
                onClick={() => {
                  onSelectGame('cellDifferences');
                  playSound('click');
                }}
                style={{ flex: '1 1 200px' }}
              >
                <Microscope size={18} /> Sfida 5 Differenze Cellulari
              </button>
            </div>
          </div>

          {/* Scheda Statistiche Rapide Utente */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '20px',
            flex: '1 1 260px',
            maxWidth: '100%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: `1px solid ${currentAvatar.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={22} color={currentAvatar.color} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userProfile?.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{userProfile?.role}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Punteggio</span>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#00f2fe' }}>{stats.totalScore || 0}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Badge Sbloccati</span>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ec4899' }}>{stats.unlockedBadges?.length || 0} / {BADGES.length}</div>
              </div>
            </div>

            <button
              onClick={onEditProfile}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              ⚙️ Cambia Nome / Profilo Utente
            </button>
          </div>
        </div>
      </div>

      {/* Titolo Sezione Giochi */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dna color="#00f2fe" size={22} /> Le 2 Sfide Interattive
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Seleziona uno dei due giochi per iniziare:
        </p>
      </div>

      {/* Grid dei 2 Giochi (Responsive 280px min) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {games.map((g) => {
          const Icon = g.icon;
          return (
            <div
              key={g.id}
              className="glass-panel glass-panel-interactive"
              onClick={() => {
                onSelectGame(g.id);
                playSound('click');
              }}
              style={{
                padding: '24px',
                background: g.gradient,
                borderColor: g.borderColor,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: `1px solid ${g.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={26} color={g.color} />
                  </div>

                  <span className="badge-pill" style={{ color: g.color, borderColor: g.borderColor, fontSize: '0.78rem' }}>
                    Record: {g.highScore} pt
                  </span>
                </div>

                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: g.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {g.subtitle}
                </span>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '4px 0 8px', color: '#ffffff' }}>
                  {g.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '20px' }}>
                  {g.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255,255,255,0.08)'
              }}>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: g.color }}>
                  Avvia Gioco
                </span>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: g.color,
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
