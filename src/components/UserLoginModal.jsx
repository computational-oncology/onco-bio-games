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
      <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '24px 20px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(0,242,254,0.15)',
            border: '1px solid var(--primary-cyan)',
            marginBottom: '10px'
          }}>
            <Dna size={28} color="var(--primary-cyan)" className="dna-glow" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontWeight: '800' }} className="text-gradient-cyan">
            Benvenuto in OncoBioGames!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
            Laboratorio didattico per le scuole 🏫 Inserisci il tuo nome e classe per iniziare.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nome o Soprannome */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px', color: 'var(--text-main)' }}>
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
                  padding: '10px 14px 10px 40px',
                  borderRadius: '10px',
                  background: 'var(--bg-inner)',
                  border: error ? '1px solid #ef4444' : '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{error}</p>}
          </div>

          {/* Classe o Scuola (Opzionale) */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px', color: 'var(--text-main)' }}>
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
                  padding: '10px 14px 10px 40px',
                  borderRadius: '10px',
                  background: 'var(--bg-inner)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Selezione Percorso / Scuola */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px', color: 'var(--text-main)' }}>
              Percorso scolastico
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'var(--bg-inner)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
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
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
              Scegli il tuo Avatar
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
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
                      borderRadius: '10px',
                      padding: '8px 0',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    <IconComponent size={20} color={av.color} />
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '-3px',
                        right: '-3px',
                        background: av.color,
                        borderRadius: '50%',
                        width: '14px',
                        height: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Check size={9} color="#000" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pulsanti Azione */}
          <div style={{ display: 'flex', gap: '10px' }}>
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
              style={{ flex: 1, padding: '12px' }}
            >
              <Sparkles size={16} /> Entra nel Gioco
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
