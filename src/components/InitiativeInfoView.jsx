import React, { useState } from 'react';
import { GitBranch, ExternalLink, Copy, Check, Terminal, Code, Globe, Shield, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function InitiativeInfoView() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const gitCommands = [
    {
      title: '1. Inizializzazione Repository Git locale',
      cmd: `cd /Users/bioinformatica_2024/.gemini/antigravity-ide/scratch/onco-bio-games\ngit init\ngit add .\ngit commit -m "feat: Inizializzazione piattaforma OncoBioGames in Italiano"`
    },
    {
      title: '2. Creazione Repository su GitHub Organization',
      cmd: `gh repo create computational-oncology/onco-bio-games --public --source=. --remote=origin --push`
    },
    {
      title: '3. Pubblicazione su GitHub Pages (Opzione automatica gh-pages)',
      cmd: `npm run build\nnpx gh-pages -d dist`
    }
  ];

  const handleCopy = (cmd, idx) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    playSound('success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '20px', background: 'radial-gradient(circle at 10% 10%, rgba(139,92,246,0.15), transparent 40%), var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <GitBranch size={26} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>
              Iniziativa <span className="text-gradient-cyan">Computational Oncology</span>
            </h2>
            <a
              href="https://github.com/computational-oncology"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00f2fe', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px', wordBreak: 'break-all' }}
            >
              https://github.com/computational-oncology <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Piattaforma didattica di giochi in lingua italiana per l'insegnamento pratico di <strong>Bioinformatica ed Oncologia Molecolare</strong>.
        </p>
      </div>

      {/* Guida Pubblicazione su GitHub */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
          <Terminal color="#00f2fe" size={20} /> Guida Deployment GitHub
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Esegui questi comandi per caricare il codice ed attivare la pubblicazione live su GitHub Pages:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {gitCommands.map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#00f2fe' }}>
                  {item.title}
                </span>
                <button
                  onClick={() => handleCopy(item.cmd, idx)}
                  className="btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                >
                  {copiedIndex === idx ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  {copiedIndex === idx ? 'Copiato!' : 'Copia Comando'}
                </button>
              </div>

              <pre style={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#e5e7eb',
                background: 'rgba(0,0,0,0.3)',
                padding: '10px 12px',
                borderRadius: '8px',
                overflowX: 'auto',
                margin: 0
              }}>
                {item.cmd}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Panoramica delle 2 sfide */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', color: '#ffffff' }}>
          🧬 Panoramica delle 2 sfide didattiche:
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,242,254,0.2)' }}>
            <div style={{ fontWeight: '700', color: '#00f2fe', marginBottom: '4px', fontSize: '0.92rem' }}>1. Caccia alle Mutazioni</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Analisi di sequenze DNA tumorali e confronto con la sequenza wild-type per identificare mutazioni somatiche in BRAF, EGFR, KRAS, TP53.
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(236,72,153,0.2)' }}>
            <div style={{ fontWeight: '700', color: '#ec4899', marginBottom: '4px', fontSize: '0.92rem' }}>2. Trova le 5 Differenze Cellulari</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Analisi di 5 anomalie citologiche tra cellula normale e tumorale: 4 facili (nucleo, cromatina, membrana, mitosi) ed 1 difficile (Effetto Warburg).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
