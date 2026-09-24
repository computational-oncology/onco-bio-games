import React, { useState } from 'react';
import { Dna, Microscope, ShieldCheck, Pill, Flame, Brain, User, Sparkles, School, Check } from 'lucide-react';
import { AVATARS, ROLES, saveUserProfile } from '../utils/storage';
import { playSound } from '../utils/audio';

const iconMap = {
  Dna,
  Microscope,
  ShieldCheck,
  Pill,
  Flame,
  Brain
};

export default function UserLoginModal({ initialProfile, onSave, onClose, isCancelable = false }) {
  const [name, setName] = useState(initialProfile?.name || '');
  const [schoolClass, setSchoolClass] = useState(initialProfile?.schoolClass || '');
  const [role, setRole] = useState(initialProfile?.role || ROLES[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(initialProfile?.avatar || AVATARS[0].id);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Inserisci il tuo nome per iniziare!');
      playSound('error');
      return;
    }

    playSound('success');
    const profile = saveUserProfile({
      id: initialProfile?.id || String(Date.now()),
      name: name.trim(),
      schoolClass: schoolClass.trim() || 'Studente',
      role,
      avatar: selectedAvatar,
      score: initialProfile?.score || 0,
      badges: initialProfile?.badges || []
    });

    onSave(profile);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '32px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'rgba(0,242,254,0.15)',
            border: '1px solid var(--primary-cyan)',
            marginBottom: '12px'
          }}>
            <Dna size={32} color="var(--primary-cyan)" className="dna-glow" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }} className="text-gradient-cyan">
            Benvenuto in OncoBioGames!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
            Laboratorio didattico per le scuole 🏫 Inserisci il tuo nome e classe per iniziare.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nome o Soprannome */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-main)' }}>
              Il tuo Nome o Soprannome <span style={{ color: 'var(--primary-pink)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Es. Mario / Elena C."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                maxLength={25}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  background: 'var(--bg-inner)',
                  border: error ? '1px solid #ef4444' : '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '4px' }}>{error}</p>}
          </div>

          {/* Classe o Scuola (Opzionale) */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-main)' }}>
              Classe o Scuola (Opzionale)
            </label>
            <div style={{ position: 'relative' }}>
              <School size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Es. 3ª A Media / 4ª B Liceo"
                value={schoolClass}
                onChange={(e) => setSchoolClass(e.target.value)}
                maxLength={25}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  background: 'var(--bg-inner)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Selezione Percorso / Scuola */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-main)' }}>
              Percorso scolastico
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'var(--bg-inner)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                outline: 'none',
                fontFamily: 'inherit',
                cursor: 'pointer'
              }}
            >
              {ROLES.map((r) => (
                <option key={r} value={r} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Selezione Avatar */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>
              Scegli il tuo Avatar
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
              {AVATARS.map((av) => {
                const IconComponent = iconMap[av.icon] || Dna;
                const isSelected = selectedAvatar === av.id;

                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av.id);
                      playSound('click');
                    }}
                    title={av.label}
                    style={{
                      background: isSelected ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-inner)',
                      border: isSelected ? `2px solid ${av.color}` : '1px solid var(--border-glass)',
                      borderRadius: '12px',
                      padding: '10px 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    <IconComponent size={22} color={av.color} />
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: av.color,
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Check size={10} color="#000" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pulsanti Azione */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {isCancelable && (
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                style={{ flex: 1 }}
              >
                Annulla
              </button>
            )}
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, padding: '14px' }}
            >
              <Sparkles size={18} /> Entra nel Gioco
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
