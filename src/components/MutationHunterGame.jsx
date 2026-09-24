import React, { useState } from 'react';
import { Dna, CheckCircle2, XCircle, ArrowLeft, RefreshCw, Zap, Award, Sparkles, HelpCircle } from 'lucide-react';
import { playSound } from '../utils/audio';
import { saveGameScore } from '../utils/storage';
import confetti from 'canvas-confetti';

const MUTATION_LEVELS = [
  {
    id: 1,
    gene: 'Gene BRAF',
    disease: 'Melanoma',
    easySummary: 'Trova la lettera sballata nella sequenza del DNA!',
    refSeq:   ['A', 'T', 'G', 'C', 'T', 'A', 'C', 'A', 'G', 'T', 'G', 'A', 'A', 'A', 'T', 'C'],
    tumorSeq: ['A', 'T', 'G', 'C', 'T', 'A', 'C', 'A', 'T', 'T', 'G', 'A', 'A', 'A', 'T', 'C'],
    mutatedIndex: 8, // 'G' changed to 'T'
    originalLetter: 'G',
    mutatedLetter: 'T',
    type: 'Cambio di 1 Lettera (Sostituzione)',
    simpleExplain: 'Una singola "G" si è trasformata in "T". Questo piccolo errore dà alla cellula un comando sbagliato di crescere senza fermarsi!',
    funFact: '💡 Curiosità: Nel DNA ci sono solo 4 lettere (A, T, C, G). Basta un solo scambio per cambiare le istruzioni della cellula!'
  },
  {
    id: 2,
    gene: 'Gene EGFR',
    disease: 'Tumore ai Polmoni',
    easySummary: 'Confronta il DNA sano con quello del tumore.',
    refSeq:   ['C', 'T', 'G', 'C', 'T', 'G', 'G', 'C', 'C', 'A', 'C', 'C', 'G', 'C', 'A', 'T'],
    tumorSeq: ['C', 'T', 'G', 'C', 'T', 'G', 'G', 'C', 'C', 'G', 'C', 'C', 'G', 'C', 'A', 'T'],
    mutatedIndex: 9, // 'A' -> 'G'
    originalLetter: 'A',
    mutatedLetter: 'G',
    type: 'Cambio di 1 Lettera (Sostituzione)',
    simpleExplain: 'La lettera "A" al posto 10 è diventata "G". Questo mantiene l\'interruttore della cellula sempre su ACCESO.',
    funFact: '💡 Curiosità: Oggi esistono farmaci bersaglio nati proprio per "spegnere" l\'interruttore alterato da questo errore!'
  },
  {
    id: 3,
    gene: 'Gene KRAS',
    disease: 'Tumore al Pancreas e Colon',
    easySummary: 'Trova il punto in cui il codice si interrompe.',
    refSeq:   ['A', 'T', 'G', 'A', 'C', 'T', 'G', 'A', 'A', 'T', 'A', 'T', 'A', 'A', 'A', 'C'],
    tumorSeq: ['A', 'T', 'G', 'A', 'C', 'T', 'G', 'A', 'T', 'T', 'A', 'T', 'A', 'A', 'A', 'C'],
    mutatedIndex: 8, // 'A' -> 'T'
    originalLetter: 'A',
    mutatedLetter: 'T',
    type: 'Cambio di 1 Lettera (Sostituzione)',
    simpleExplain: 'La "A" si è trasformata in "T". Il gene KRAS funziona come un pedale dell\'acceleratore incastrato!',
    funFact: '💡 Curiosità: Il gene KRAS è uno dei geni più studiati al mondo nei laboratori di ricerca.'
  },
  {
    id: 4,
    gene: 'Gene TP53 (Il Guardiano)',
    disease: 'Freno naturale delle cellule',
    easySummary: 'Analizza il gene riparatore del DNA.',
    refSeq:   ['G', 'A', 'G', 'C', 'C', 'T', 'C', 'A', 'C', 'C', 'C', 'A', 'T', 'C', 'G', 'G'],
    tumorSeq: ['G', 'A', 'G', 'C', 'C', 'T', 'C', 'A', 'T', 'C', 'C', 'A', 'T', 'C', 'G', 'G'],
    mutatedIndex: 8, // 'C' -> 'T'
    originalLetter: 'C',
    mutatedLetter: 'T',
    type: 'Freno Rotto (Perdita di Funzione)',
    simpleExplain: 'TP53 è il "poliziotto" che aggiusta i guasti nel DNA. La lettera "C" cambiata in "T" rompe il freno della cellula.',
    funFact: '💡 Curiosità: TP53 viene chiamato il "Guardiano del Genoma" perché protegge il nostro corpo ogni giorno!'
  }
];

export default function MutationHunterGame({ onBack, onScoreUpdate }) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedPos, setSelectedPos] = useState(null);
  const [selectedMutType, setSelectedMutType] = useState('');
  const [phase, setPhase] = useState('identify'); // 'identify' | 'classify' | 'feedback' | 'completed'
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const currentLevel = MUTATION_LEVELS[currentLevelIdx];

  const handleBaseClick = (idx) => {
    if (phase !== 'identify') return;
    setSelectedPos(idx);
    playSound('dna');
  };

  const handleConfirmPosition = () => {
    if (selectedPos === null) return;

    if (selectedPos === currentLevel.mutatedIndex) {
      playSound('success');
      setPhase('classify');
      setFeedback({ type: 'success', text: `Esatto! Hai trovato l'errore alla posizione #${selectedPos + 1}!` });
    } else {
      playSound('error');
      setStreak(0);
      setFeedback({ type: 'error', text: `Alla posizione #${selectedPos + 1} la lettera è uguale nei due filamenti. Cerca dove cambia!` });
    }
  };

  const handleConfirmClassification = () => {
    if (!selectedMutType) return;

    const isCorrectType = selectedMutType === currentLevel.type;
    const levelScore = isCorrectType ? 200 : 120;
    const newScore = score + levelScore + (streak * 30);
    
    setScore(newScore);
    setStreak(s => s + 1);
    setPhase('feedback');
    playSound('success');

    saveGameScore('mutationHunter', levelScore);
    if (onScoreUpdate) onScoreUpdate();
  };

  const handleNextLevel = () => {
    if (currentLevelIdx + 1 < MUTATION_LEVELS.length) {
      setCurrentLevelIdx(c => c + 1);
      setSelectedPos(null);
      setSelectedMutType('');
      setPhase('identify');
      setFeedback(null);
    } else {
      setPhase('completed');
      playSound('victory');
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header bar gioco */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <button className="btn-secondary" onClick={onBack} style={{ flexShrink: 0 }}>
          <ArrowLeft size={18} /> Torna ai Giochi
        </button>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="badge-pill" style={{ color: 'var(--primary-cyan)', borderColor: 'var(--border-glass)', fontSize: '0.8rem' }}>
            <Dna size={15} /> Livello {currentLevelIdx + 1} / {MUTATION_LEVELS.length}
          </div>
          <div className="badge-pill" style={{ color: 'var(--primary-emerald)', borderColor: 'var(--border-glass)', fontSize: '0.8rem' }}>
            <Award size={15} /> Punti: {score}
          </div>
        </div>
      </div>

      {phase !== 'completed' ? (
        <div className="glass-panel" style={{ padding: '20px' }}>
          {/* Info Gene Target */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border-glass)' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Sfida Detective del DNA
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '2px' }}>
                {currentLevel.gene}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {currentLevel.easySummary}
              </p>
            </div>

            <div style={{
              background: 'var(--bg-inner)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              color: 'var(--text-main)',
              width: '100%',
              maxWidth: '380px'
            }}>
              🎯 Clicca sulla lettera del DNA tumorale che è diversa dal DNA sano!
            </div>
          </div>

          {/* Sequenze a confronto */}
          <div style={{ background: 'var(--bg-inner)', borderRadius: '14px', padding: '16px', marginBottom: '20px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center' }}>
              👈 Trascina lateralmente con il dito per vedere tutte le 16 lettere 👉
            </div>
            
            {/* Sequenza DNA Sano */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--primary-emerald)', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-emerald)' }}></span>
                Codice DNA Sano (Riferimento):
              </div>
              <div className="scroll-container-horizontal">
                {currentLevel.refSeq.map((base, idx) => (
                  <div key={'ref-' + idx} style={{ textAlign: 'center', flexShrink: 0 }}>
                    <span className={`nucleotide-badge base-${base}`}>{base}</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px' }}>#{idx + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sequenza DNA Tumorale */}
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--primary-pink)', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-pink)' }}></span>
                Codice DNA Tumorale (Trova l'errore):
              </div>
              <div className="scroll-container-horizontal">
                {currentLevel.tumorSeq.map((base, idx) => {
                  const isSelected = selectedPos === idx;
                  return (
                    <div key={'tum-' + idx} style={{ textAlign: 'center', flexShrink: 0 }}>
                      <button
                        onClick={() => handleBaseClick(idx)}
                        disabled={phase !== 'identify'}
                        className={`nucleotide-badge base-${base}`}
                        style={{
                          border: isSelected ? '3px solid var(--primary-cyan)' : '1px solid transparent',
                          transform: isSelected ? 'scale(1.15)' : 'none',
                          cursor: phase === 'identify' ? 'pointer' : 'default',
                          opacity: phase !== 'identify' && idx !== currentLevel.mutatedIndex ? 0.5 : 1
                        }}
                      >
                        {base}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feedback Messaggio errore/successo */}
          {feedback && (
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              marginBottom: '16px',
              background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${feedback.type === 'success' ? 'var(--primary-emerald)' : '#ef4444'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.88rem',
              color: 'var(--text-main)'
            }}>
              {feedback.type === 'success' ? <CheckCircle2 color="var(--primary-emerald)" size={20} /> : <XCircle color="#ef4444" size={20} />}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Azioni Fase 1: Identificazione */}
          {phase === 'identify' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                {selectedPos !== null 
                  ? `Hai selezionato la lettera #${selectedPos + 1}.`
                  : 'Clicca sulla lettera diversa nel DNA tumorale.'}
              </p>
              <button
                className="btn-primary"
                onClick={handleConfirmPosition}
                disabled={selectedPos === null}
                style={{ opacity: selectedPos === null ? 0.5 : 1, width: '100%', maxWidth: '280px' }}
              >
                Conferma Errore Trovato
              </button>
            </div>
          )}

          {/* Azioni Fase 2: Classificazione Semplice */}
          {phase === 'classify' && (
            <div style={{ background: 'var(--bg-inner)', borderRadius: '14px', padding: '18px', border: '1px solid var(--border-glass)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-cyan)', marginBottom: '8px' }}>
                Che tipo di cambiamento è avvenuto?
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                La lettera <strong>"{currentLevel.originalLetter}"</strong> è diventata <strong>"{currentLevel.mutatedLetter}"</strong>. Scegli la risposta corretta:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                {[
                  currentLevel.type,
                  'Una lettera è stata cancellata (Delezione)',
                  'È stata aggiunta una nuova lettera (Inserzione)',
                  'Il filamento si è spezzato a metà'
                ].map((optionType) => (
                  <button
                    key={optionType}
                    onClick={() => {
                      setSelectedMutType(optionType);
                      playSound('click');
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: selectedMutType === optionType ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-card)',
                      border: selectedMutType === optionType ? '2px solid var(--primary-cyan)' : '1px solid var(--border-glass)',
                      color: 'var(--text-main)',
                      textAlign: 'left',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {optionType}
                  </button>
                ))}
              </div>

              <button
                className="btn-primary"
                onClick={handleConfirmClassification}
                disabled={!selectedMutType}
                style={{ width: '100%', opacity: !selectedMutType ? 0.5 : 1 }}
              >
                Conferma Risposta e Scopri la Spiegazione
              </button>
            </div>
          )}

          {/* Fase 3: Spiegazione Semplice e Divertente */}
          {phase === 'feedback' && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', padding: '24px', border: '1px solid var(--primary-emerald)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-emerald)', fontWeight: '800', fontSize: '1.2rem', marginBottom: '10px' }}>
                <CheckCircle2 size={24} /> Spiegazione Scientifica per la Scuola
              </div>

              <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '14px', lineHeight: 1.5 }}>
                {currentLevel.simpleExplain}
              </p>

              <div style={{ background: 'var(--bg-card)', padding: '14px 18px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                {currentLevel.funFact}
              </div>

              <button className="btn-primary" onClick={handleNextLevel} style={{ width: '100%' }}>
                {currentLevelIdx + 1 < MUTATION_LEVELS.length ? 'Passa al Prossimo Gene' : 'Vedi i Risultati della Sfida'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Schermata Finale */
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '20px',
            background: 'rgba(0, 242, 254, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid var(--primary-cyan)'
          }}>
            <Award size={40} color="var(--primary-cyan)" />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: '800' }} className="text-gradient-cyan">
            Bravissimo! Sfida DNA Completata!
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '6px', marginBottom: '24px' }}>
            Hai trovato tutti gli errori nei geni analizzati come un vero scienziato!
          </p>

          <div style={{ display: 'inline-flex', gap: '24px', background: 'var(--bg-inner)', padding: '16px 32px', borderRadius: '16px', marginBottom: '28px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Punteggio Conquistato</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-cyan)' }}>{score} pt</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={() => {
              setCurrentLevelIdx(0);
              setSelectedPos(null);
              setSelectedMutType('');
              setPhase('identify');
              setScore(0);
              setStreak(0);
            }}>
              <RefreshCw size={18} /> Riprova
            </button>
            <button className="btn-primary" onClick={onBack}>
              Torna ai Giochi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
