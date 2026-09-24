import React, { useState } from 'react';
import { Pill, ArrowLeft, CheckCircle2, XCircle, Award, Sparkles, Stethoscope, RefreshCw, ShieldAlert } from 'lucide-react';
import { playSound } from '../utils/audio';
import { saveGameScore } from '../utils/storage';
import confetti from 'canvas-confetti';

const CLINICAL_CASES = [
  {
    id: 'case-1',
    patientCode: 'Paziente #104 - Clinica Oncologica',
    age: 58,
    diagnosis: 'Carcinoma Polmonare Non a Piccole Cellule (NSCLC) Metastatico',
    biomarkers: 'Mutazione EGFR L858R (Esone 21) confermata via NGS',
    options: [
      { id: 't1', drug: 'Osimertinib', class: 'Inibitore EGFR di 3ª generazione', isCorrect: true, mechanism: 'Inibitore chinasico irreversibile selettivo sia per EGFR sensibilizzante (L858R) che per la mutazione di resistenza T790M.' },
      { id: 't2', drug: 'Trastuzumab', class: 'Anticorpo anti-HER2', isCorrect: false, mechanism: 'Indicato per neoplasie mammarie o gastriche con iperespressione di HER2.' },
      { id: 't3', drug: 'Dabrafenib + Trametinib', class: 'Inibitori BRAF + MEK', isCorrect: false, mechanism: 'Indicati per tumori con mutazione BRAF V600E.' },
      { id: 't4', drug: 'Chemioterapia Platino-Doppietta', class: 'Citotossico generico', isCorrect: false, mechanism: 'Meno selettivo ed efficacia inferiore rispetto alla terapia targeted EGFR in 1ª linea.' }
    ]
  },
  {
    id: 'case-2',
    patientCode: 'Paziente #209 - Oncologia Dermatologica',
    age: 46,
    diagnosis: 'Melanoma Cutaneo Stadio IV',
    biomarkers: 'Mutazione somatica BRAF V600E (Codone 600)',
    options: [
      { id: 't1', drug: 'Dabrafenib + Trametinib', class: 'Combinazione inibitori BRAF/MEK', isCorrect: true, mechanism: 'Il doppio blocco della via MAPK riduce il fenomeno di resistenza acquisita e induce risposte tumorali rapide.' },
      { id: 't2', drug: 'Olaparib', class: 'Inibitore PARP', isCorrect: false, mechanism: 'Utilizzato in tumori con deficit di ricombinazione omologa (BRCA1/2 mutati).' },
      { id: 't3', drug: 'Imatinib', class: 'Inibitore BCR-ABL / c-KIT', isCorrect: false, mechanism: 'Indicato nella Leucemia Mieloide Cronica e nei GIST.' },
      { id: 't4', drug: 'Tamoxifene', class: 'Modulatore del recettore degli estrogeni', isCorrect: false, mechanism: 'Indicato per tumori mammari er-positivi.' }
    ]
  },
  {
    id: 'case-3',
    patientCode: 'Paziente #312 - Gynecologic Oncology',
    age: 61,
    diagnosis: 'Carcinoma Ovarico Sieroso ad Alto Grado',
    biomarkers: 'Mutazione germinale BRCA1 (p.Cys61Gly) con deficit di ricombinazione omologa (HRD+)',
    options: [
      { id: 't1', drug: 'Olaparib', class: 'Inibitore PARP (Poly ADP-ribose polymerase)', isCorrect: true, mechanism: 'Sfrutta la letalità sintetica: inibisce la riparazione dei single-strand breaks in cellule prive di BRCA1/2 funzionale.' },
      { id: 't2', drug: 'Cetuximab', class: 'Anticorpo Monoclonale anti-EGFR', isCorrect: false, mechanism: 'Indicato nel carcinoma colorettale RAS wild-type.' },
      { id: 't3', drug: 'Osimertinib', class: 'Inibitore EGFR', isCorrect: false, mechanism: 'Indicato nei tumori polmonari EGFR mutati.' },
      { id: 't4', drug: 'Sunitinib', class: 'Inibitore multichinasico VEGFR', isCorrect: false, mechanism: 'Utilizzato nel carcinoma renale avanzato.' }
    ]
  },
  {
    id: 'case-4',
    patientCode: 'Paziente #405 - Immunoncologia',
    age: 67,
    diagnosis: 'Carcinoma del Colorettale Metastatico',
    biomarkers: 'Elevata Instabilità dei Microsatelliti (MSI-High / dMMR)',
    options: [
      { id: 't1', drug: 'Pembrolizumab', class: 'Inibitore Checkpoint Immunitario (Anti-PD-1)', isCorrect: true, mechanism: 'Gli elevati neoantigeni causati dal dMMR rendono il tumore altamente immunogenico e responsivo al blocco di PD-1.' },
      { id: 't2', drug: 'Trastuzumab Deruxtecan', class: 'ADC anti-HER2', isCorrect: false, mechanism: 'Indicato per tumori HER2-positive.' },
      { id: 't3', drug: 'Erlotinib', class: 'Inibitore EGFR 1ª gen', isCorrect: false, mechanism: 'Indicato nei tumori polmonari.' },
      { id: 't4', drug: 'Vemurafenib', class: 'Inibitore BRAF mono-agente', isCorrect: false, mechanism: 'Ha scarsa efficacia nel colon se non associato ad anti-EGFR.' }
    ]
  }
];

export default function OncoMatchGame({ onBack, onScoreUpdate }) {
  const [currentCaseIdx, setCurrentCaseIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentCase = CLINICAL_CASES[currentCaseIdx];

  const handleSelectOption = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option.isCorrect) {
      playSound('success');
      const newScore = score + 300;
      setScore(newScore);
      saveGameScore('oncoMatch', 300);
      if (onScoreUpdate) onScoreUpdate();
    } else {
      playSound('error');
    }
  };

  const handleNextCase = () => {
    if (currentCaseIdx + 1 < CLINICAL_CASES.length) {
      setCurrentCaseIdx(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      playSound('victory');
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Torna ai Giochi
        </button>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="badge-pill" style={{ color: '#ec4899', borderColor: 'rgba(236, 72, 153, 0.3)' }}>
            <Stethoscope size={16} /> Caso {currentCaseIdx + 1} di {CLINICAL_CASES.length}
          </div>
          <div className="badge-pill" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <Award size={16} /> Punti: {score}
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="glass-panel" style={{ padding: '32px' }}>
          {/* Cartella Clinica del Paziente */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1))',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '28px',
            border: '1px solid rgba(236, 72, 153, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {currentCase.patientCode} • Età: {currentCase.age} anni
              </span>
              <span className="badge-pill" style={{ background: 'rgba(236,72,153,0.2)', color: '#fff', fontSize: '0.75rem' }}>
                Medicina di Precisione
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '10px' }}>
              Diagnosi: {currentCase.diagnosis}
            </h2>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '12px',
              padding: '14px 18px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Pill size={22} color="#00f2fe" />
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Profilo di Biomarcatori Molecolari:</span>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#00f2fe' }}>
                  {currentCase.biomarkers}
                </div>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', color: '#e5e7eb' }}>
            Seleziona la Terapia Target di Prima Scelta:
          </h3>

          {/* Opzioni di Terapia */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '28px' }}>
            {currentCase.options.map((option) => {
              const isSelected = selectedOption?.id === option.id;
              let btnStyle = {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)'
              };

              if (isAnswered) {
                if (option.isCorrect) {
                  btnStyle = {
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '2px solid #10b981'
                  };
                } else if (isSelected && !option.isCorrect) {
                  btnStyle = {
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '2px solid #ef4444'
                  };
                }
              } else if (isSelected) {
                btnStyle = {
                  background: 'rgba(0, 242, 254, 0.15)',
                  border: '2px solid #00f2fe'
                };
              }

              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  style={{
                    borderRadius: '14px',
                    padding: '18px 20px',
                    cursor: isAnswered ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    ...btnStyle
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>
                      {option.drug}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Classe farmacologica: {option.class}
                    </div>
                  </div>

                  {isAnswered && (
                    <div>
                      {option.isCorrect ? (
                        <CheckCircle2 size={24} color="#10b981" />
                      ) : isSelected ? (
                        <XCircle size={24} color="#ef4444" />
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Risultato e Razionale Scientifico */}
          {isAnswered && (
            <div style={{
              borderRadius: '16px',
              padding: '24px',
              background: selectedOption.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${selectedOption.isCorrect ? '#10b981' : '#ef4444'}`,
              marginBottom: '24px'
            }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '8px', color: selectedOption.isCorrect ? '#10b981' : '#ef4444' }}>
                {selectedOption.isCorrect ? '✓ Terapia Selezionata con Successo (+300 pt)' : '✕ Terapia Non Adeguata'}
              </div>

              <p style={{ fontSize: '0.95rem', color: '#e5e7eb', marginBottom: '20px' }}>
                <strong>Meccanismo d'Azione:</strong> {currentCase.options.find(o => o.isCorrect).mechanism}
              </p>

              <button className="btn-primary" onClick={handleNextCase} style={{ width: '100%' }}>
                {currentCaseIdx + 1 < CLINICAL_CASES.length ? 'Passa al Prossimo Caso Clinico' : 'Completa Sessione Clinica'}
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
            background: 'linear-gradient(135deg, rgba(236,72,153,0.3), rgba(139,92,246,0.3))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            border: '1px solid #ec4899'
          }}>
            <Sparkles size={44} color="#ec4899" />
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }} className="text-gradient-pink">
            Sessione Clinica Completata!
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: '24px' }}>
            Hai prescritto terapie di precisione mirate sui profili genomici dei pazienti.
          </p>

          <div style={{ display: 'inline-flex', gap: '24px', background: 'rgba(0,0,0,0.3)', padding: '20px 32px', borderRadius: '16px', marginBottom: '32px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Punteggio Totale</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ec4899' }}>{score} pt</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={() => {
              setCurrentCaseIdx(0);
              setSelectedOption(null);
              setIsAnswered(false);
              setIsCompleted(false);
              setScore(0);
            }}>
              <RefreshCw size={18} /> Riprova Casi
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
