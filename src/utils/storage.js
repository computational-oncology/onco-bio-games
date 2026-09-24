// LocalStorage state management for User Profile, Theme, Scores, Leaderboard, Badges

const USER_STORAGE_KEY = 'onco_bio_user_profile';
const LEADERBOARD_KEY = 'onco_bio_leaderboard';
const STATS_KEY = 'onco_bio_stats';
const THEME_KEY = 'onco_bio_theme';

export const AVATARS = [
  { id: 'dna', icon: 'Dna', label: 'Elica DNA', color: '#00f2fe' },
  { id: 'microscope', icon: 'Microscope', label: 'Microscopio', color: '#4facfe' },
  { id: 'shield', icon: 'ShieldCheck', label: 'Scudo Genomico', color: '#10b981' },
  { id: 'pill', icon: 'Pill', label: 'Medicina Target', color: '#ec4899' },
  { id: 'flame', icon: 'Flame', label: 'Bio-Onco Fire', color: '#f59e0b' },
  { id: 'brain', icon: 'Brain', label: 'BioIA', color: '#8b5cf6' }
];

export const ROLES = [
  'Studente Scuole Medie (11-14 anni)',
  'Studente Liceo / Superiori (14-19 anni)',
  'Docente / Insegnante di Scienze',
  'Ricercatore in Erba',
  'Passionato di Scienza'
];

export const BADGES = [
  {
    id: 'caccia_mutazioni_novizio',
    title: 'Detective del DNA',
    description: 'Trova l\'errore nelle lettere del DNA tra cellula sana e tumorale!',
    icon: 'Dna',
    color: '#00f2fe'
  },
  {
    id: 'citologo_esperto',
    title: 'Occhio di Falco',
    description: 'Trova le 5 differenze tra cellula normale e tumorale.',
    icon: 'Microscope',
    color: '#ec4899'
  },
  {
    id: 'effetto_warburg',
    title: 'Super-Scienziato (Effetto Warburg)',
    description: 'Trova la differenza metabolica difficile sui mitocondri!',
    icon: 'Flame',
    color: '#f59e0b'
  },
  {
    id: 'punteggio_300',
    title: 'Campione della Classe',
    description: 'Accumula più di 300 punti nelle sfide didattiche!',
    icon: 'Award',
    color: '#8b5cf6'
  }
];

const DEFAULT_LEADERBOARD = [
  { id: '1', name: 'Sofia R.', schoolClass: '3ª A Liceo', role: 'Studente Liceo / Superiori (14-19 anni)', score: 750, avatar: 'dna', badges: ['caccia_mutazioni_novizio', 'citologo_esperto', 'effetto_warburg', 'punteggio_300'] },
  { id: '2', name: 'Marco B.', schoolClass: '2ª B Media', role: 'Studente Scuole Medie (11-14 anni)', score: 550, avatar: 'microscope', badges: ['caccia_mutazioni_novizio', 'citologo_esperto', 'punteggio_300'] },
  { id: '3', name: 'Prof. Rossi', schoolClass: 'Docenti', role: 'Docente / Insegnante di Scienze', score: 450, avatar: 'shield', badges: ['citologo_esperto', 'punteggio_300'] },
  { id: '4', name: 'Elena C.', schoolClass: '4ª C Liceo', role: 'Studente Liceo / Superiori (14-19 anni)', score: 300, avatar: 'pill', badges: ['caccia_mutazioni_novizio'] }
];

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'dark';
  } catch (e) {
    return 'dark';
  }
}

export function saveStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Error saving theme', e);
  }
}

export function getUserProfile() {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveUserProfile(profile) {
  try {
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    updateLeaderboardUser(updated);
    return updated;
  } catch (e) {
    console.error('Error saving profile', e);
  }
}

export function getUserStats() {
  try {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : {
      totalScore: 0,
      gamesPlayed: {
        mutationHunter: 0,
        cellDifferences: 0
      },
      unlockedBadges: [],
      highScores: {
        mutationHunter: 0,
        cellDifferences: 0
      }
    };
  } catch (e) {
    return {
      totalScore: 0,
      gamesPlayed: { mutationHunter: 0, cellDifferences: 0 },
      unlockedBadges: [],
      highScores: { mutationHunter: 0, cellDifferences: 0 }
    };
  }
}

export function saveGameScore(gameKey, score, isWarburgFound = false) {
  const profile = getUserProfile();
  if (!profile) return;

  const stats = getUserStats();
  stats.totalScore += score;
  stats.gamesPlayed[gameKey] = (stats.gamesPlayed[gameKey] || 0) + 1;
  stats.highScores[gameKey] = Math.max(stats.highScores[gameKey] || 0, score);

  const newBadges = new Set(stats.unlockedBadges || []);

  if (gameKey === 'mutationHunter' && score > 0) {
    newBadges.add('caccia_mutazioni_novizio');
  }
  if (gameKey === 'cellDifferences' && score > 0) {
    newBadges.add('citologo_esperto');
  }
  if (isWarburgFound) {
    newBadges.add('effetto_warburg');
  }
  if (stats.totalScore >= 300) {
    newBadges.add('punteggio_300');
  }

  stats.unlockedBadges = Array.from(newBadges);
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));

  profile.score = stats.totalScore;
  profile.badges = stats.unlockedBadges;
  saveUserProfile(profile);

  return { stats, newlyUnlocked: Array.from(newBadges) };
}

export function getLeaderboard() {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    let list = data ? JSON.parse(data) : DEFAULT_LEADERBOARD;
    list.sort((a, b) => b.score - a.score);
    return list;
  } catch (e) {
    return DEFAULT_LEADERBOARD;
  }
}

function updateLeaderboardUser(userProfile) {
  try {
    let list = getLeaderboard();
    const existingIndex = list.findIndex(u => u.name.toLowerCase() === userProfile.name.toLowerCase());
    
    const entry = {
      id: userProfile.id || String(Date.now()),
      name: userProfile.name,
      schoolClass: userProfile.schoolClass || 'Studente',
      role: userProfile.role || 'Studente',
      score: userProfile.score || 0,
      avatar: userProfile.avatar || 'dna',
      badges: userProfile.badges || []
    };

    if (existingIndex >= 0) {
      list[existingIndex] = entry;
    } else {
      list.push(entry);
    }

    list.sort((a, b) => b.score - a.score);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error updating leaderboard', e);
  }
}
