import React, { useState, useEffect, useRef } from 'react';
import { Shield, ShieldAlert, ArrowLeft, RefreshCw, Zap, Award, Flame, Heart, AlertTriangle } from 'lucide-react';
import { playSound } from '../utils/audio';
import { saveGameScore } from '../utils/storage';
import confetti from 'canvas-confetti';

const THREAT_TYPES = [
  { id: 'dna_break', label: 'Danno al DNA (Doppio Filamento)', requiredAction: 'repair', color: '#ef4444', icon: '⚡' },
  { id: 'ras_mutation', label: 'Segnale Oncogenico RAS/RAF', requiredAction: 'inhibit', color: '#f59e0b', icon: '🔥' },
  { id: 'p53_loss', label: 'Perdita Checkpoint G1/S (p53)', requiredAction: 'arrest', color: '#ec4899', icon: '🛑' },
  { id: 'malignant_clone', label: 'Clone Tumorale Proliferativo', requiredAction: 'apoptosis', color: '#8b5cf6', icon: '☣️' }
];

export default function GenomeGuardianGame({ onBack, onScoreUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [integrity, setIntegrity] = useState(100);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [threats, setThreats] = useState([]);

  const gameLoopRef = useRef(null);
  const timerRef = useRef(null);

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setIsFinished(false);
    setIntegrity(100);
    setScore(0);
    setTimeLeft(45);
    setThreats([]);
    playSound('success');
  };

  // Timer countdown
  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  // Threat spawner & integrity drain loop
  useEffect(() => {
    if (!isPlaying) return;

    gameLoopRef.current = setInterval(() => {
      // Spawn a new threat with random type
      const randomThreatType = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
      const newThreat = {
        id: String(Date.now() + Math.random()),
        ...randomThreatType,
        x: Math.random() * 80 + 10, // percentage
        y: Math.random() * 70 + 15
      };

      setThreats((prev) => {
        // If too many threats, decrease integrity
        if (prev.length >= 6) {
          setIntegrity((ing) => {
            const nextIng = Math.max(0, ing - 8);
            if (nextIng <= 0) {
              endGame(false);
            }
            return nextIng;
          });
        }
        return [...prev.slice(-7), newThreat];
      });
    }, 1200);

    return () => clearInterval(gameLoopRef.current);
  }, [isPlaying]);

  const handleNeutralizeThreat = (threatId, actionType) => {
    if (!isPlaying) return;

    const targetThreat = threats.find((t) => t.id === threatId);
    if (!targetThreat) return;

    if (targetThreat.requiredAction === actionType) {
      playSound('success');
      setScore((s) => s + 100);
      setIntegrity((ing) => Math.min(100, ing + 4));
      setThreats((prev) => prev.filter((t) => t.id !== threatId));
    } else {
      playSound('error');
      setIntegrity((ing) => {
        const nextIng = Math.max(0, ing - 10);
        if (nextIng <= 0) endGame(false);
        return nextIng;
      });
    }
  };

  const endGame = (won) => {
    setIsPlaying(false);
    setIsFinished(true);
    clearInterval(gameLoopRef.current);
    clearInterval(timerRef.current);

    if (won) {
      playSound('victory');
      confetti({ particleCount: 100, spread: 70 });
      saveGameScore('genomeGuardian', score + 200);
    } else {
      playSound('error');
      saveGameScore('genomeGuardian', score);
    }
    if (onScoreUpdate) onScoreUpdate();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Torna ai Giochi
        </button>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="badge-pill" style={{ color: integrity > 40 ? '#10b981' : '#ef4444', borderColor: integrity > 40 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }}>
            <Heart size={16} /> Integrità DNA: {integrity}%
          </div>
          <div className="badge-pill" style={{ color: '#00f2fe', borderColor: 'rgba(0,242,254,0.3)' }}>
            ⏱️ Tempo: {timeLeft}s
          </div>
          <div className="badge-pill" style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}>
            <Award size={16} /> Punti: {score}
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        {!isPlaying && !isFinished && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(0,242,254,0.2))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              border: '1px solid #10b981'
            }}>
              <Shield size={44} color="#10b981" />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: '800' }} className="text-gradient-cyan">
              Guardiano del Genoma
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '12px auto 28px' }}>
              Le cellule sono sottoposte a mutazioni, rotture del DNA e iperattivazioni oncogeniche.
              Utilizza i meccasnismi del ciclo cellulare per neutralizzare le minacce prima che causino trasformazione tumorale!
            </p>

            <button className="btn-primary" onClick={startGame} style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
              <Zap size={20} /> Avvia Sorveglianza Genomica
            </button>
          </div>
        )}

        {isPlaying && (
          <div>
            {/* Barra Integrità Cellulare */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span>Stato di Integrità del DNA Cellulare:</span>
                <span style={{ fontWeight: '700', color: integrity > 50 ? '#10b981' : '#ef4444' }}>{integrity}%</span>
              </div>
              <div style={{ width: '100%', height: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${integrity}%`,
                  background: integrity > 50 ? 'linear-gradient(90deg, #10b981, #00f2fe)' : 'linear-gradient(90deg, #ef4444, #f59e0b)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Arena Cellulare Interattiva */}
            <div style={{
              height: '380px',
              borderRadius: '20px',
              background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.95), rgba(5, 8, 16, 0.98))',
              border: '1px solid rgba(0,242,254,0.2)',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '24px'
            }}>
              {threats.length === 0 && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(255,255,255,0.3)', fontWeight: '600', fontSize: '0.95rem' }}>
                  Microambiente cellulare stabile... In attesa di segnali.
                </div>
              )}

              {threats.map((threat) => (
                <div
                  key={threat.id}
                  style={{
                    position: 'absolute',
                    left: `${threat.x}%`,
                    top: `${threat.y}%`,
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: `2px solid ${threat.color}`,
                    borderRadius: '16px',
                    padding: '12px 16px',
                    boxShadow: `0 0 16px ${threat.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 10,
                    animation: 'pulseGlow 1.5s infinite ease-in-out'
                  }}
                >
                  <div style={{ fontSize: '1.4rem' }}>{threat.icon}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff', textAlign: 'center', maxWidth: '140px' }}>
                    {threat.label}
                  </div>

                  {/* Pulsanti Risposta Rapida */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px' }}>
                    <button
                      onClick={() => handleNeutralizeThreat(threat.id, 'repair')}
                      style={{ fontSize: '0.7rem', padding: '4px 6px', borderRadius: '6px', background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid #10b981', cursor: 'pointer' }}
                    >
                      🧬 BRCA
                    </button>
                    <button
                      onClick={() => handleNeutralizeThreat(threat.id, 'arrest')}
                      style={{ fontSize: '0.7rem', padding: '4px 6px', borderRadius: '6px', background: 'rgba(236,72,153,0.2)', color: '#ec4899', border: '1px solid #ec4899', cursor: 'pointer' }}
                    >
                      🛑 p53
                    </button>
                    <button
                      onClick={() => handleNeutralizeThreat(threat.id, 'inhibit')}
                      style={{ fontSize: '0.7rem', padding: '4px 6px', borderRadius: '6px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid #f59e0b', cursor: 'pointer' }}
                    >
                      🛡️ antiRAS
                    </button>
                    <button
                      onClick={() => handleNeutralizeThreat(threat.id, 'apoptosis')}
                      style={{ fontSize: '0.7rem', padding: '4px 6px', borderRadius: '6px', background: 'rgba(139,92,246,0.2)', color: '#8b5cf6', border: '1px solid #8b5cf6', cursor: 'pointer' }}
                    >
                      ⚡ Apoptosi
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
                🧬 <strong>Riparazione DNA</strong>: Usa BRCA su danni a doppio filamento (⚡)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(236,72,153,0.2)' }}>
                🛑 <strong>Arresto p53</strong>: Blocca perdite del checkpoint G1/S (🛑)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(245,158,11,0.2)' }}>
                🛡️ <strong>Inibizione RAS</strong>: Intercetta iperattivazioni oncogeniche (🔥)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(139,92,246,0.2)' }}>
                ⚡ <strong>Apoptosi</strong>: Elimina cloni tumorali maligni (☣️)
              </div>
            </div>
          </div>
        )}

        {isFinished && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }} className={integrity > 0 ? "text-gradient-cyan" : "text-gradient-pink"}>
              {integrity > 0 ? 'Sorveglianza Genomica Riuscita!' : 'Trasformazione Tumorale Avvenuta'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '12px 0 24px' }}>
              {integrity > 0 
                ? 'Hai difeso l\'integrità cellulare e mantenuto stabili i checkpoint del ciclo cellulare!'
                : 'L\'accumulo di lesioni non riparate ha superato la capacità di controllo degli oncosoppressori.'}
            </p>

            <div style={{ display: 'inline-flex', gap: '24px', background: 'rgba(0,0,0,0.3)', padding: '20px 32px', borderRadius: '16px', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Punteggio Finale</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#00f2fe' }}>{score} pt</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Integrità Residua</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: integrity > 0 ? '#10b981' : '#ef4444' }}>{integrity}%</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={startGame}>
                <RefreshCw size={18} /> Gioca Ancor
              </button>
              <button className="btn-primary" onClick={onBack}>
                Torna alla Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
