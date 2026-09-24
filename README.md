# 🧬 OncoBioGames | Computational Oncology

Piattaforma didattica ed interattiva di **Bioinformatica applicata all'Oncologia Molecolare**, sviluppata per l'iniziativa su [https://github.com/computational-oncology](https://github.com/computational-oncology).

Tutti i contenuti, i giochi e le interfacce sono **completamente in lingua Italiana**.

---

## 🚀 Caratteristiche Principali

- 👤 **Accesso Personalizzato per Ogni Utente**: All'ingresso nella piattaforma ciascun utente inserisce il proprio **Nome/Soprannome**, seleziona il proprio **Ruolo Scientifico** (es. *Studente di Bioinformatica*, *Ricercatore in Oncologia*, *Biologo Molecolare*) e sceglie il proprio **Avatar Genomico**.
- 🎮 **4 Moduli di Gioco Interattivi**:
  1. 🧬 **Caccia alle Mutazioni (NGS Variant Hunter)**: Confronta sequenze di biopsie tumorali con il riferimento Wild-Type per identificare varianti somatiche puntiformi (SNV) e mutazioni driver in *BRAF*, *EGFR*, *KRAS*, *TP53*.
  2. 💊 **OncoMatch (Medicina di Precisione)**: Analizza cartelle cliniche molecolari e prescrivi le terapie target o immunoterapie più appropriate (es. *Osimertinib*, *Dabrafenib+Trametinib*, *Olaparib*, *Pembrolizumab*).
  3. 🛡️ **Guardiano del Genoma (Ciclo Cellulare & Oncosoppressori)**: Simulazione d'azione in tempo reale per proteggere la stabilità genomica contro lesioni al DNA e segnali oncogenici.
  4. ⚡ **BLAST Speed Race (Allineamento Rapido)**: Allinea reads RNA-Seq per identificare trascritti di fusione oncogenici (*BCR-ABL1*, *EML4-ALK*, *TMPRSS2-ERG*).
- 🏆 **Classifica & Stemmi Didattici (Leaderboard & Badges)**: Salvataggio locale dei punteggi, sblocco di 6 distintivi scientifici e generazione del **Certificato Didattico di Partecipazione** scaricabile.
- 🎨 **Design Moderno & Effetti Audio**: Interfaccia dark mode glassmorphism con sintesi audio integrata via Web Audio API.

---

## 🛠️ Istruzioni per Pubblicare il Repository su GitHub

Per creare il nuovo repository sulla tua organizzazione/profilo GitHub `computational-oncology`, esegui i seguenti comandi nel terminale:

```bash
# 1. Naviga nella cartella del progetto
cd /Users/bioinformatica_2024/.gemini/antigravity-ide/scratch/onco-bio-games

# 2. Inizializza il repository Git ed effettua il primo commit
git init
git add .
git commit -m "feat: Inizializzazione piattaforma OncoBioGames in Italiano"

# 3. Crea il nuovo repository su GitHub
gh repo create computational-oncology/onco-bio-games --public --source=. --remote=origin --push
```

### Pubblicazione Live su GitHub Pages

Per distribuire gratuitamente l'applicazione sul web tramite GitHub Pages:

```bash
# Installa gh-pages e pubblica la build
npm run build
npx gh-pages -d dist
```

L'applicazione sarà immediatamente raggiungibile su:
`https://computational-oncology.github.io/onco-bio-games/`

---

## 💻 Esecuzione in Locale (Sviluppo)

Per avviare la piattaforma in locale sul proprio computer:

```bash
npm install
npm run dev
```

Apri `http://localhost:5173` nel browser.

---

## 📜 Licenza & Crediti

Progetto realizzato per l'iniziativa **Computational Oncology** (2026).
Tutti i contenuti biologici e clinici sono stati curati a scopo didattico e divulgativo.
