import React, { useState, useEffect } from 'react';
import { Zap, ArrowLeft, RefreshCw, Award, Dna, CheckCircle2, Search, Crosshair } from 'lucide-react';
import { playSound } from '../utils/audio';
import { saveGameScore } from '../utils/storage';
import confetti from 'canvas-confetti';

const FUSION_ROUNDS = [
  {
    id: 1,
    queryRead: 'ACGT-BCR-ABL1-TGCA',
    readSequence: 'ATG GCG TGG GCA TCG CGG GAG CTC',
    fusionName: 'BCR-ABL1 (Cromosoma Philadelphia t(9;22))',
    disease: 'Leucemia Mieloide Cronica (LMC)',
    candidates: [
      { id: 'c1', name: 'BCR-ABL1 (Chimerico t(9;22))', matchPct: 100, isCorrect: true, detail: 'Fusione tra la regione breakpoint di BCR e la tirosina chinasi ABL1.' },
      { id: 'c2', name: 'EML4-ALK (Inversione Cromosomica p21;p23)', matchPct: 42, isCorrect: false, detail: 'Tipico del carcinoma polmonare, non coincide con la sequenza di read.' },
      { id: 'c3', name: 'TMPRSS2-ERG (Fusione Androgeno-Dipendente)', matchPct: 25, isCorrect: false, detail: 'Frequente nel carcinoma prostatico.' },
      { id: 'c4', name: 'MYC-IGH (Traslocazione t(8;14))', matchPct: 15, isCorrect: false, detail: 'Tipico del Linfoma di Burkitt.' }
    ]
  },
  {
    id: 2,
    queryRead: 'TGCA-EML4-ALK-GATC',
    readSequence: 'CGT AAG CTT ACC TGG GGA TCC GAT',
    fusionName: 'EML4-ALK (Variante 1 v1)',
    disease: 'Carcinoma Polmonare Non a Piccole Cellule (NSCLC)',
    candidates: [
      { id: 'c1', name: 'EML4-ALK (Variante 1 v1)', matchPct: 100, isCorrect: true, detail: 'Fusione tra l\'esone 13 di EML4 e l\'esone 20 del gene chinasi ALK.' },
      { id: 'c2', name: 'RET-KIF5B (Rearrangiamento RET)', matchPct: 38, isCorrect: false, detail: 'Inversione cromosomica differente.' },
      { id: 'c3', name: 'BCR-ABL1 (p210)', matchPct: 20, isCorrect: false, detail: 'Non coerente con la regione EML4.' },
      { id: 'c4', name: 'NTRK1-LMNA (Fusione NTRK)', matchPct: 18, isCorrect: false, detail: 'Fusione neurotrofica rara.' }
    ]
  },
  {
    id: 3,
    queryRead: 'GGAT-TMPRSS2-ERG-CCTA',
    readSequence: 'TGA CTA CTT GGG ACC CTA AAT CCG',
    fusionName: 'TMPRSS2-ERG (Delezione 21q22)',
    disease: 'Carcinoma della Prostata',
    candidates: [
      { id: 'c1', name: 'TMPRSS2-ERG (Delezione 21q22)', matchPct: 100, isCorrect: true, detail: 'Pone il fattore trascrizionale ERG sotto il controllo del promotore regolato dagli androgeni TMPRSS2.' },
      { id: 'c2', name: 'EWSR1-FLI1 (t(11;22))', matchPct: 40, isCorrect: false, detail: 'Associato al Sarcoma di Ewing.' },
      { id: 'c3', name: 'SS18-SSX (t(X;18))', matchPct: 30, isCorrect: false, detail: 'Tipico del Sarcoma Sinoviale.' },
      { id: 'c4', name: 'PAX8-PPARG (t(2;3))', matchPct: 22, isCorrect: false, detail: 'Frequente nel Carcinoma Tiroideo Follicolare.' }
    ]
  }
];

export default function BlastSpeedGame({ onBack, onScoreUpdate }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentRound = FUSION_ROUNDS[roundIdx];

  useEffect(() => {
    if (isAnswered || isCompleted) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setIsAnswered(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [roundIdx, isAnswered, isCompleted]);

  const handleSelectCandidate = (cand) => {
    if (isAnswered) return;
    setSelectedCandidate(cand);
    setIsAnswered(true);

    if (cand.isCorrect) {
      playSound('success');
      const timeBonus = timer * 10;
      const roundScore = 300 + timeBonus;
      const newTotal = score + roundScore;
      setScore(newTotal);
      saveGameScore('blastSpeed', roundScore);
      if (onScoreUpdate) onScoreUpdate();
    } else {
      playSound('error');
    }
  };

  const handleNextRound = () => {
    if (roundIdx + 1 < FUSION_ROUNDS.length) {
      setRoundIdx(r => r + 1);
      setSelectedCandidate(null);
      setIsAnswered(false);
      setTimer(30);
    } else {
      setIsCompleted(true);
      playSound('victory');
      confetti({ particleCount: 100, spread: 70 });
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Torna ai Giochi
        </button>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="badge-pill" style={{ color: '#00f2fe', borderColor: 'rgba(0, 242, 254, 0.3)' }}>
            <Crosshair size={16} /> Allineamento {roundIdx + 1} di {FUSION_ROUNDS.length}
          </div>
          <div className="badge-pill" style={{ color: timer > 10 ? '#10b981' : '#ef4444', borderColor: 'rgba(255,255,255,0.1)' }}>
            ⏱️ Timer: {timer}s
          </div>
          <div className="badge-pill" style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
            <Award size={16} /> Punti: {score}
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="glass-panel" style={{ padding: '32px' }}>
          {/* Read NGS Floating Box */}
          <div style={{
            background: 'radial-gradient(circle at center, rgba(0,242,254,0.15), rgba(15,23,42,0.9))',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '28px',
            border: '1px solid rgba(0, 242, 254, 0.4)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#00f2fe', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              BLASTn Query Read (RNA-Seq High-Throughput)
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'monospace', color: '#ffffff', margin: '8px 0', letterSpacing: '0.1em' }}>
              {currentRound.readSequence}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Identifica l'evento di fusione oncogenica (Chimeric Gene Fusion) corrispondente nell'infrastruttura BLAST.
            </p>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', color: '#e5e7eb' }}>
            Seleziona il Gene di Fusione con Bit-Score e Identità Elevata (100% Identity):
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '28px' }}>
            {currentRound.candidates.map((cand) => {
              const isSelected = selectedCandidate?.id === cand.id;
              let style = {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)'
              };

              if (isAnswered) {
                if (cand.isCorrect) {
                  style = { background: 'rgba(16,185,129,0.15)', border: '2px solid #10b981' };
                } else if (isSelected) {
                  style = { background: 'rgba(239,68,68,0.15)', border: '2px solid #ef4444' };
                }
              }

              return (
                <div
                  key={cand.id}
                  onClick={() => handleSelectCandidate(cand)}
                  style={{
                    borderRadius: '14px',
                    padding: '16px 20px',
                    cursor: isAnswered ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                    ...style
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
                      {cand.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Identità di allineamento: <strong>{cand.matchPct}%</strong>
                    </div>
                  </div>

                  <div className="badge-pill" style={{
                    background: cand.matchPct === 100 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                    color: cand.matchPct === 100 ? '#10b981' : '#9ca3af'
                  }}>
                    {cand.matchPct}% Match
                  </div>
                </div>
              );
            })}
          </div>

          {isAnswered && (
            <div style={{
              borderRadius: '16px',
              padding: '24px',
              background: selectedCandidate?.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${selectedCandidate?.isCorrect ? '#10b981' : '#ef4444'}`,
              marginBottom: '24px'
            }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '8px', color: selectedCandidate?.isCorrect ? '#10b981' : '#ef4444' }}>
                {selectedCandidate?.isCorrect ? `✓ Allineamento BLAST Corretto! Bonus Tempo: +${timer * 10} pt` : '✕ Allineamento Errato o Tempo Scaduto'}
              </div>

              <p style={{ fontSize: '0.95rem', color: '#e5e7eb', marginBottom: '20px' }}>
                <strong>Dettaglio Genomico:</strong> {currentRound.candidates.find(c => c.isCorrect).detail}
              </p>

              <button className="btn-primary" onClick={handleNextRound} style={{ width: '100%' }}>
                {roundIdx + 1 < FUSION_ROUNDS.length ? 'Prossimo Read NGS' : 'Vedi Risultati BLAST'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Schermata Finale */
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(0,242,254,0.3), rgba(245,158,11,0.3))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            border: '1px solid #00f2fe'
          }}>
            <Zap size={44} color="#00f2fe" />
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }} className="text-gradient-cyan">
            BLAST Speed Race Completata!
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: '24px' }}>
            Hai allineato con successo le sequenze di fusione oncogenica a tempo di record!
          </p>

          <div style={{ display: 'inline-flex', gap: '24px', background: 'rgba(0,0,0,0.3)', padding: '20px 32px', borderRadius: '16px', marginBottom: '32px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Punteggio Finale</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#00f2fe' }}>{score} pt</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={() => {
              setRoundIdx(0);
              setSelectedCandidate(null);
              setIsAnswered(false);
              setIsCompleted(false);
              setScore(0);
              setTimer(30);
            }}>
              <RefreshCw size={18} /> Nuova Gara
            </button>
            <button className="btn-primary" onClick={onBack}>
              Torna alla Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
