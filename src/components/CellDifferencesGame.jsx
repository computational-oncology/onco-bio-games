import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle2, Award, Sparkles, HelpCircle, Eye, AlertCircle, Info } from 'lucide-react';
import { playSound } from '../utils/audio';
import { saveGameScore } from '../utils/storage';
import confetti from 'canvas-confetti';

const DIFFERENCES = [
  {
    id: 'nucleus',
    title: '1. Nucleo Gigante e Storto',
    difficulty: 'Facile 🟢',
    diffBadgeColor: '#10b981',
    description: 'Nelle cellule tumorali il nucleo (il "cervello" della cellula) diventa enormemente grande e perde la sua bella forma rotonda.',
    hint: 'Guarda al centro della cellula tumorale: nota quanto è grande e deformato il nucleo rispetto a quello sano!'
  },
  {
    id: 'chromatin',
    title: '2. Macchie Scure nel Nucleo (DNA Arruffato)',
    difficulty: 'Facile 🟢',
    diffBadgeColor: '#10b981',
    description: 'Dentro al nucleo il DNA è ammucchiato in grandi macchie scure (ipercromasia). La cellula sta duplicando il suo DNA troppo in fretta.',
    hint: 'Guarda dentro al nucleo: vedi le palline scure ed il centro luminoso?'
  },
  {
    id: 'mitosis',
    title: '3. Divisione Cellulare Impazzita (Mitosi a 3)',
    difficulty: 'Facile 🟢',
    diffBadgeColor: '#10b981',
    description: 'La cellula normale si divide sempre in 2 cellule figlie ordinate. La cellula tumorale impazzisce e cerca di dividersi in 3 parti contemporaneamente!',
    hint: 'Cerca la struttura di divisione cellulare: vedi i filamenti che si tirano su 3 lati invece che su 2?'
  },
  {
    id: 'membrane',
    title: '4. Bordi Irregolari e "Bollosi" (Membrana)',
    difficulty: 'Facile 🟢',
    diffBadgeColor: '#10b981',
    description: 'La superficie esterna della cellula non è più liscia ed appiccicata alle altre, ma forma bolle ed ondulazioni per staccarsi e muoversi.',
    hint: 'Guarda i contorni esterni della cellula tumorale: noti le bolle e le increspature sui bordi?'
  },
  {
    id: 'warburg',
    title: '5. Super-Motore a Zucchero / Mitocondri Gonfi',
    difficulty: 'Difficile 🔴 (Super Scienziato)',
    diffBadgeColor: '#ef4444',
    isHard: true,
    description: '⭐ DIFFERENZA DIFFICILE (Effetto Warburg): I mitocondri (le "centrali elettriche") si gonfiano. La cellula tumorale divora tantissimo zucchero producendo acido invece di respirare normalmente!',
    hint: '⭐ DIFFICILE: Guarda in basso a sinistra nel citoplasma: noti i mitocondri gonfi rossi e le palline di acido (lattato)?'
  }
];

export default function CellDifferencesGame({ onBack, onScoreUpdate }) {
  const [foundIds, setFoundIds] = useState([]);
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSpotClick = (diffId) => {
    const diffObj = DIFFERENCES.find(d => d.id === diffId);

    if (foundIds.includes(diffId)) {
      setSelectedDiff(diffObj);
      playSound('click');
      return;
    }

    const newFound = [...foundIds, diffId];
    setFoundIds(newFound);
    setSelectedDiff(diffObj);

    const points = diffObj.isHard ? 250 : 150;
    const newScore = score + points;
    setScore(newScore);

    if (diffObj.isHard) {
      playSound('victory');
    } else {
      playSound('success');
    }

    saveGameScore('cellDifferences', points, diffObj.isHard);
    if (onScoreUpdate) onScoreUpdate();

    if (newFound.length === DIFFERENCES.length) {
      setIsCompleted(true);
      playSound('victory');
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  };

  const remainingDiffs = DIFFERENCES.filter(d => !foundIds.includes(d.id));

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <button className="btn-secondary" onClick={onBack} style={{ flexShrink: 0 }}>
          <ArrowLeft size={18} /> Torna ai Giochi
        </button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="badge-pill" style={{ color: 'var(--primary-cyan)', borderColor: 'var(--border-glass)', fontSize: '0.8rem' }}>
            <Eye size={15} /> Differenze: {foundIds.length} / {DIFFERENCES.length}
          </div>
          <div className="badge-pill" style={{ color: 'var(--primary-emerald)', borderColor: 'var(--border-glass)', fontSize: '0.8rem' }}>
            <Award size={15} /> Punti: {score}
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border-glass)' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-pink)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Osservazione al Microscopio per le Scuole
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '2px' }}>
              Trova le 5 Differenze: <span className="text-gradient-cyan">Cellula Sana vs Tumorale</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Clicca sui <strong>5 dettagli estranei nella cellula tumorale</strong> (4 facili, 1 super difficile!).
            </p>
          </div>

          <button
            className="btn-secondary"
            onClick={() => {
              setShowHint(!showHint);
              playSound('click');
            }}
            style={{ fontSize: '0.82rem', width: '100%', maxWidth: '200px' }}
          >
            <HelpCircle size={15} color="var(--primary-amber)" /> {showHint ? 'Nascondi Suggerimento' : 'Suggerimento'}
          </button>
        </div>

        {/* Suggerimento Box */}
        {showHint && remainingDiffs.length > 0 && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid var(--primary-amber)',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '16px',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} color="var(--primary-amber)" style={{ flexShrink: 0 }} />
            <div>
              <strong>Suggerimento:</strong> {remainingDiffs[0].hint}
            </div>
          </div>
        )}

        {/* Realism Dual Canvas SVG (Responsive Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          
          {/* CELLULA NORMALE */}
          <div style={{
            background: 'var(--bg-inner)',
            border: '2px solid var(--primary-emerald)',
            borderRadius: '24px',
            padding: '18px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-emerald)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              🔬 Cellula Sana (Ordinata e Regolare)
            </div>

            <svg viewBox="0 0 500 440" style={{ width: '100%', height: 'auto', borderRadius: '18px' }}>
              <defs>
                <radialGradient id="cytoplasmNorm" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
                </radialGradient>
                <radialGradient id="nucleusNorm" cx="40%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
                </radialGradient>
              </defs>

              {/* Membrana Cellulare Sana Liscia */}
              <path
                d="M 120 220 Q 90 140 180 90 Q 310 60 400 140 Q 440 240 370 330 Q 250 390 150 340 Q 80 290 120 220 Z"
                fill="url(#cytoplasmNorm)"
                stroke="#10b981"
                strokeWidth="3.5"
              />

              {/* Nucleo Sano piccolo e tondo */}
              <g>
                <ellipse cx="250" cy="220" rx="65" ry="60" fill="url(#nucleusNorm)" stroke="#10b981" strokeWidth="2.5" />
                <circle cx="240" cy="210" r="14" fill="#022c22" opacity="0.85" stroke="#34d399" strokeWidth="1.5" />
              </g>

              {/* Mitocondri Normali */}
              <g fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5">
                <rect x="132" y="131" width="36" height="18" rx="9" transform="rotate(-25 150 140)" />
                <rect x="322" y="251" width="36" height="18" rx="9" transform="rotate(40 340 260)" />
              </g>

              {/* Mitosi normale bipolare */}
              <g transform="translate(340, 130)">
                <line x1="-15" y1="0" x2="15" y2="0" stroke="#34d399" strokeWidth="2" strokeDasharray="2 2" />
                <circle cx="-15" cy="0" r="3" fill="#10b981" />
                <circle cx="15" cy="0" r="3" fill="#10b981" />
              </g>

              <rect x="140" y="390" width="220" height="32" rx="10" fill="var(--bg-card)" stroke="var(--primary-emerald)" strokeWidth="1" />
              <text x="250" y="411" fill="var(--primary-emerald)" fontSize="12" textAnchor="middle" fontWeight="bold">Cellula Sana con Bordi Lisci</text>
            </svg>
          </div>

          {/* CELLULA TUMORALE */}
          <div style={{
            background: 'var(--bg-inner)',
            border: '2px solid var(--primary-pink)',
            borderRadius: '24px',
            padding: '18px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-pink)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              ☣️ Cellula Tumorale - Clicca le 5 anomalie!
            </div>

            <svg viewBox="0 0 500 440" style={{ width: '100%', height: 'auto', borderRadius: '18px' }}>
              <defs>
                <radialGradient id="cytoplasmCancer" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#831843" stopOpacity="0.1" />
                </radialGradient>
                <radialGradient id="nucleusCancer" cx="40%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#4c0519" stopOpacity="0.95" />
                </radialGradient>
              </defs>

              {/* Membrana Tumorale Deformata */}
              <path
                d="M 100 200 Q 50 110 160 50 Q 300 30 420 100 Q 470 200 420 310 Q 340 410 200 390 Q 80 370 60 280 Q 90 240 100 200 Z"
                fill="url(#cytoplasmCancer)"
                stroke="#f43f5e"
                strokeWidth="3.5"
              />

              {/* HOTSPOT 4: MEMBRANA & BLEBBING (Clickable) */}
              <g onClick={() => handleSpotClick('membrane')} style={{ cursor: 'pointer' }}>
                <path d="M 420 100 Q 465 110 445 140 Q 480 170 440 200 Q 485 240 430 270" stroke="#f43f5e" strokeWidth="4" fill="none" />
                <circle cx="455" cy="180" r="32" fill={foundIds.includes('membrane') ? 'rgba(16,185,129,0.35)' : 'rgba(244,63,94,0.2)'} stroke={foundIds.includes('membrane') ? '#10b981' : '#f43f5e'} strokeWidth="2.5" strokeDasharray="3 3" />
                {foundIds.includes('membrane') && <text x="455" y="186" fill="#fff" fontSize="18" textAnchor="middle" fontWeight="bold">✓</text>}
              </g>

              {/* HOTSPOT 1: NUCLEO GIGANTE E STORTO (Clickable) */}
              <g onClick={() => handleSpotClick('nucleus')} style={{ cursor: 'pointer' }}>
                <path
                  d="M 150 190 Q 140 100 240 100 Q 340 110 330 200 Q 320 300 230 290 Q 130 280 150 190 Z"
                  fill="url(#nucleusCancer)"
                  stroke={foundIds.includes('nucleus') ? '#10b981' : '#f43f5e'}
                  strokeWidth="3.5"
                />
                {foundIds.includes('nucleus') && (
                  <text x="235" y="140" fill="#ffffff" fontSize="14" textAnchor="middle" fontWeight="bold">
                    ✓ Nucleo Gigante
                  </text>
                )}
              </g>

              {/* HOTSPOT 2: MACCHIE SCURE NEL NUCLEO (Clickable) */}
              <g onClick={() => handleSpotClick('chromatin')} style={{ cursor: 'pointer' }}>
                <circle cx="190" cy="170" r="16" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                <circle cx="270" cy="180" r="20" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                <circle cx="205" cy="195" r="11" fill="#fff" opacity="0.9" />

                <circle cx="230" cy="195" r="42" fill={foundIds.includes('chromatin') ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.05)'} stroke={foundIds.includes('chromatin') ? '#10b981' : '#fbbf24'} strokeWidth="2.5" strokeDasharray="4 4" />
                {foundIds.includes('chromatin') && <text x="230" y="200" fill="#fff" fontSize="16" textAnchor="middle" fontWeight="bold">✓ DNA Arruffato</text>}
              </g>

              {/* HOTSPOT 3: MITOSI A 3 VIE (Clickable) */}
              <g onClick={() => handleSpotClick('mitosis')} style={{ cursor: 'pointer' }}>
                <g transform="translate(360, 310)">
                  <line x1="0" y1="-20" x2="-20" y2="15" stroke="#f59e0b" strokeWidth="2.5" />
                  <line x1="0" y1="-20" x2="20" y2="15" stroke="#f59e0b" strokeWidth="2.5" />
                  <line x1="-20" y1="15" x2="20" y2="15" stroke="#f59e0b" strokeWidth="2.5" />
                </g>

                <circle cx="360" cy="310" r="34" fill={foundIds.includes('mitosis') ? 'rgba(16,185,129,0.35)' : 'rgba(245,158,11,0.2)'} stroke={foundIds.includes('mitosis') ? '#10b981' : '#f59e0b'} strokeWidth="2.5" strokeDasharray="3 3" />
                {foundIds.includes('mitosis') && <text x="360" y="316" fill="#fff" fontSize="16" textAnchor="middle" fontWeight="bold">✓ Mitosi a 3</text>}
              </g>

              {/* HOTSPOT 5: EFFETTO WARBURG / MITOCONDRI (DIFFICILE - Clickable) */}
              <g onClick={() => handleSpotClick('warburg')} style={{ cursor: 'pointer' }}>
                <g transform="translate(140, 320)">
                  <circle cx="0" cy="0" r="18" fill="#ef4444" stroke="#fca5a5" strokeWidth="2" />
                  <circle cx="-12" cy="15" r="5" fill="#fde68a" />
                  <circle cx="15" cy="-15" r="6" fill="#fde68a" />
                </g>

                <circle cx="155" cy="325" r="42" fill={foundIds.includes('warburg') ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.25)'} stroke={foundIds.includes('warburg') ? '#10b981' : '#ef4444'} strokeWidth="3" />
                {foundIds.includes('warburg') && <text x="155" y="331" fill="#fff" fontSize="15" textAnchor="middle" fontWeight="bold">✓ Warburg</text>}
              </g>

              <rect x="110" y="390" width="280" height="32" rx="10" fill="var(--bg-card)" stroke="var(--primary-pink)" strokeWidth="1" />
              <text x="250" y="411" fill="var(--primary-pink)" fontSize="12" textAnchor="middle" fontWeight="bold">Clicca sulle 5 anomalie evidenziate!</text>
            </svg>
          </div>
        </div>

        {/* Schede analitiche delle Differenze Trovate */}
        <div style={{ background: 'var(--bg-inner)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-glass)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info color="var(--primary-cyan)" size={20} /> Scheda di Riepilogo ({foundIds.length}/{DIFFERENCES.length} differenze trovate)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {DIFFERENCES.map((diff) => {
              const isFound = foundIds.includes(diff.id);
              return (
                <div
                  key={diff.id}
                  onClick={() => isFound && setSelectedDiff(diff)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: isFound ? (diff.isHard ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.12)') : 'var(--bg-card)',
                    border: isFound ? (diff.isHard ? '2px solid #ef4444' : '1px solid #10b981') : '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    opacity: isFound ? 1 : 0.6,
                    cursor: isFound ? 'pointer' : 'default',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isFound ? (diff.isHard ? '#ef4444' : '#10b981') : 'rgba(255,255,255,0.1)',
                      color: isFound ? '#fff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.95rem'
                    }}>
                      {isFound ? '✓' : '?'}
                    </div>

                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: isFound ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {diff.title}
                      </div>
                      {isFound && (
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '3px', lineHeight: 1.4 }}>
                          {diff.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="badge-pill" style={{ color: diff.diffBadgeColor, borderColor: 'var(--border-glass)', whiteSpace: 'nowrap' }}>
                    {diff.difficulty}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schermata di Vittoria */}
        {isCompleted && (
          <div style={{ textAlign: 'center', padding: '36px 20px', background: 'rgba(16,185,129,0.12)', borderRadius: '24px', border: '2px solid #10b981' }}>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '24px',
              background: 'rgba(16,185,129,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Award size={44} color="#10b981" />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: '800' }} className="text-gradient-cyan">
              Fantastico! Tutte le 5 Differenze Trovate!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '8px auto 24px' }}>
              Complimenti! Hai scoperto anche la differenza difficile del super-motore a zucchero (<strong>Effetto Warburg</strong>)!
            </p>

            <div style={{ display: 'inline-flex', gap: '24px', background: 'var(--bg-inner)', padding: '16px 36px', borderRadius: '18px', marginBottom: '28px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Punteggio Conquistato</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>{score} pt</div>
              </div>
            </div>

            <div>
              <button className="btn-primary" onClick={onBack} style={{ padding: '14px 32px' }}>
                Torna ai Giochi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
