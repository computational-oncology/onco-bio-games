import React from 'react';
import { Trophy, Award, Sparkles, User, CheckCircle2, Lock, Download, School } from 'lucide-react';
import { getLeaderboard, BADGES, getUserStats, AVATARS } from '../utils/storage';
import { playSound } from '../utils/audio';

export default function LeaderboardView({ userProfile }) {
  const leaderboard = getLeaderboard();
  const stats = getUserStats();

  const handleDownloadCertificate = () => {
    playSound('success');
    const content = `=====================================================
CERTIFICATO DI MERITO DIDATTICO - COMPUTATIONAL ONCOLOGY
=====================================================

Si attesta che lo/la studente/essa:
  ${userProfile?.name?.toUpperCase() || 'PARTECIPANTE'}
  Classe/Scuola: ${userProfile?.schoolClass || 'Studente'}
  Percorso: ${userProfile?.role || 'Studente'}

ha completato con successo le sfide didattiche di OncoBioGames:
 - Caccia alle Mutazioni (Analisi Codice DNA)
 - Trova le 5 Differenze (Cellula Normale vs Tumorale & Effetto Warburg)

PUNTEGGIO TOTALE CONSEGUITO: ${stats.totalScore || 0} PUNTI
BADGE SBLOCCATI: ${stats.unlockedBadges?.length || 0} / ${BADGES.length}

Iniziativa: https://github.com/computational-oncology
Data: ${new Date().toLocaleDateString('it-IT')}
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificato_OncoBioGames_${userProfile?.name || 'Utente'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Sezione */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '60px',
          borderRadius: '18px',
          background: 'rgba(245,158,11,0.18)',
          border: '1px solid var(--primary-amber)',
          marginBottom: '14px'
        }}>
          <Trophy size={34} color="var(--primary-amber)" />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800' }} className="text-gradient-cyan">
          Classifica della Classe & Medaglie
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Confronta i tuoi risultati con i compagni di scuola e colleziona i badge scientifici!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Tabella Classifica */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <Trophy color="var(--primary-amber)" size={20} /> Classifica Partecipanti
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leaderboard.map((item, index) => {
              const isCurrentUser = userProfile?.name?.toLowerCase() === item.name.toLowerCase();
              const userAvatar = AVATARS.find(a => a.id === item.avatar) || AVATARS[0];

              return (
                <div
                  key={item.id || index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: isCurrentUser ? 'rgba(0, 242, 254, 0.12)' : 'var(--bg-inner)',
                    border: isCurrentUser ? '2px solid var(--primary-cyan)' : '1px solid var(--border-glass)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : 'var(--bg-card)',
                      color: index < 3 ? '#000' : 'var(--text-main)',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {index + 1}
                    </div>

                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'var(--bg-card)',
                      border: `1px solid ${userAvatar.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <User size={18} color={userAvatar.color} />
                    </div>

                    <div>
                      <div style={{ fontWeight: '800', fontSize: '1rem', color: isCurrentUser ? 'var(--primary-cyan)' : 'var(--text-main)' }}>
                        {item.name} {isCurrentUser && <span style={{ fontSize: '0.75rem', background: 'rgba(0,242,254,0.2)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>Tu</span>}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.schoolClass ? `${item.schoolClass} • ` : ''}{item.role}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary-cyan)' }}>
                      {item.score} pt
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.badges?.length || 0} badge
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sezione Badge & Certificato */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Certificato Card */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--primary-cyan)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--primary-cyan)', fontWeight: '800' }}>
              <Award size={22} /> Certificato per la Scuola
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Scarica il certificato didattico in formato testo da mostrare al docente di scienze!
            </p>
            <button className="btn-primary" onClick={handleDownloadCertificate} style={{ width: '100%' }}>
              <Download size={16} /> Scarica Certificato TXT
            </button>
          </div>

          {/* Badges Collection */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)' }}>
              🎖️ Stemmi Sbloccati ({stats.unlockedBadges?.length || 0}/{BADGES.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {BADGES.map((badge) => {
                const isUnlocked = stats.unlockedBadges?.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      background: isUnlocked ? 'var(--bg-inner)' : 'var(--bg-card)',
                      border: isUnlocked ? `2px solid ${badge.color}` : '1px solid var(--border-glass)',
                      opacity: isUnlocked ? 1 : 0.5
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isUnlocked ? badge.color : 'var(--border-glass)',
                      color: isUnlocked ? '#000' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800'
                    }}>
                      {isUnlocked ? <CheckCircle2 size={20} /> : <Lock size={18} />}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {badge.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {badge.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
