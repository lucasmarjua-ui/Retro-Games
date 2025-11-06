/* script.js - main (no module) */
console.log("✅ script.js cargado");

(function () {
  // elementos
  const modal = document.getElementById('gameModal');
  const gameFrame = document.getElementById('gameFrame');
  const closeModal = document.getElementById('closeModal');

  const uiLoginBtn = document.getElementById('openLoginBtn');
  const uiAchievementsBtn = document.getElementById('openAchievementsBtn');
  const uiRankingBtn = document.getElementById('openRankingBtn');
  const playerNameSpan = document.getElementById('playerName');

  const loginBox = document.getElementById('loginBox');
  const loginButton = document.getElementById('loginButton');
  const cancelLogin = document.getElementById('cancelLogin');
  const usernameInput = document.getElementById('usernameInput');

  const achievementsPanel = document.getElementById('achievementsPanel');
  const achievementsList = document.getElementById('achievementsList');
  const closeAchievements = document.getElementById('closeAchievements');

  const leaderboardPanel = document.getElementById('leaderboardPanel');
  const leaderboardContent = document.getElementById('leaderboardContent');
  const closeLeaderboard = document.getElementById('closeLeaderboard');

  const achievementPopup = document.getElementById('achievementPopup');

  // estado local
  let PLAYER = { id: null, username: null };

  // helpers localStorage
  function loadPlayer() {
    try {
      const raw = localStorage.getItem('rg_player');
      if (raw) {
        PLAYER = JSON.parse(raw);
        playerNameSpan.textContent = `👤 ${PLAYER.username}`;
      }
    } catch (e) { console.warn('loadPlayer', e); }
  }

  async function savePlayer(name) {
    name = (name || 'Jugador').toString().trim().slice(0, 24);
    if (!PLAYER.id) PLAYER.id = crypto.randomUUID ? crypto.randomUUID() : ('id-' + Date.now());
    PLAYER.username = name;
    localStorage.setItem('rg_player', JSON.stringify(PLAYER));
    playerNameSpan.textContent = `👤 ${PLAYER.username}`;

    // intentar upsert en supabase si está disponible
    if (window.supabase) {
      try {
        await window.supabase.from('users').upsert([{ id: PLAYER.id, username: PLAYER.username }], { onConflict: 'id' });
      } catch (e) {
        console.warn('supabase upsert user', e.message || e);
      }
    }
  }

  // Achievements local + popup
  function getUnlockedLocal() {
    try { return JSON.parse(localStorage.getItem('rg_achievements') || '[]'); } catch { return []; }
  }
  function setUnlockedLocal(list) { localStorage.setItem('rg_achievements', JSON.stringify(list)); }

  function showAchievementPopup(text) {
    achievementPopup.innerHTML = `<div style="padding:10px 14px; font-family:'Press Start 2P';">${text}</div>`;
    achievementPopup.style.display = 'block';
    achievementPopup.style.opacity = '1';
    setTimeout(()=> {
      achievementPopup.style.transition = 'opacity 0.5s';
      achievementPopup.style.opacity = '0';
      setTimeout(()=> achievementPopup.style.display = 'none', 550);
    }, 2000);
  }

  const ACHIEVEMENTS = [
    { id: 'first_play', name: 'Primer Jugador', description: 'Juega 1 partida', game_id: 'global' },
    { id: 'score_100', name: '100 puntos', description: 'Consigue 100 puntos en cualquier juego', game_id: 'global' },
    { id: 'pinball_master', name: 'Maestro Pinball', description: '5000 puntos en Pinball', game_id: 'pinball' },
    { id: 'snake_xl', name: 'Serpiente XL', description: '30 segmentos en Snake', game_id: 'snake' },
  ];

  async function unlockAchievement(achievementId) {
    const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!ach) return;
    const unlocked = getUnlockedLocal();
    if (unlocked.includes(achievementId)) return;
    unlocked.push(achievementId);
    setUnlockedLocal(unlocked);
    showAchievementPopup(`🏆 ${ach.name} — ${ach.description}`);

    if (window.supabase && PLAYER && PLAYER.id) {
      try {
        await window.supabase.from('achievements_unlocked').insert([{
          user_id: PLAYER.id,
          username: PLAYER.username,
          achievement_id: ach.id,
          achievement_name: ach.name,
          game_id: ach.game_id
        }]);
      } catch (e) {
        console.warn('Error subiendo logro:', e.message || e);
      }
    }
  }

  // submit score
  async function submitScore(gameId, score) {
    if (!PLAYER || !PLAYER.id) {
      alert('Identifícate para guardar la puntuación en el ranking global.');
      return;
    }
    if (!window.supabase) {
      console.warn('Supabase no está inicializado');
      return;
    }
    try {
      await window.supabase.from('scores').insert([{
        user_id: PLAYER.id,
        username: PLAYER.username,
        game_id: gameId,
        score: score
      }]);
    } catch (e) {
      console.warn('Error submitScore', e.message || e);
    }

    // chequear logros demo
    if (score >= 100) await unlockAchievement('score_100');
    if (gameId === 'pinball' && score >= 5000) await unlockAchievement('pinball_master');
    if (gameId === 'snake' && score >= 30) await unlockAchievement('snake_xl');
  }

  // leaderboard
  async function fetchLeaderboard(gameId, limit = 10) {
    if (!window.supabase) return [];
    try {
      const { data, error } = await window.supabase
        .from('scores')
        .select('username, score, created_at')
        .eq('game_id', gameId)
        .order('score', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.warn('fetchLeaderboard', e);
      return [];
    }
  }

  async function openLeaderboard(gameId = 'global') {
    leaderboardContent.innerHTML = 'Cargando...';
    const rows = await fetchLeaderboard(gameId);
    leaderboardContent.innerHTML = '';
    if (!rows.length) {
      leaderboardContent.innerHTML = '<div>No hay puntuaciones todavía.</div>';
    } else {
      const ol = document.createElement('ol');
      rows.forEach(r => {
        const li = document.createElement('li');
        li.innerHTML = `${escapeHtml(r.username)} — <strong>${r.score}</strong>`;
        ol.appendChild(li);
      });
      leaderboardContent.appendChild(ol);
    }
    leaderboardPanel.style.display = 'block';
  }

  // achievements panel
  function openAchievementsPanel() {
    achievementsList.innerHTML = '';
    const unlocked = getUnlockedLocal();
    ACHIEVEMENTS.forEach(a => {
      const li = document.createElement('li');
      li.style.marginBottom = '8px';
      li.innerHTML = `${unlocked.includes(a.id) ? '✅' : '❌'} <strong>${a.name}</strong> — <small>${a.description}</small>`;
      achievementsList.appendChild(li);
    });
    achievementsPanel.style.display = 'block';
  }

  // escape html
  function escapeHtml(s='') {
    return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // GAME CARD -> modal
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const gameUrl = card.getAttribute('data-game');
      if (!gameUrl) return;
      gameFrame.src = gameUrl;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  closeModal.addEventListener('click', () => {
    gameFrame.src = '';
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      gameFrame.src = '';
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  // smooth wheel -> allow page scroll if body has class scrollable
  document.addEventListener('wheel', (e) => {
    if (!document.body.classList.contains('scrollable')) return;
    window.scrollBy({ top: e.deltaY, left: 0, behavior: 'smooth' });
  });

  // BOTONES UI
  uiLoginBtn && uiLoginBtn.addEventListener('click', () => {
    loginBox.style.display = loginBox.style.display === 'flex' ? 'none' : 'flex';
    usernameInput.value = PLAYER.username || '';
  });
  uiAchievementsBtn && uiAchievementsBtn.addEventListener('click', openAchievementsPanel);
  uiRankingBtn && uiRankingBtn.addEventListener('click', () => openLeaderboard('global'));

  // loginBox actions
  loginButton && loginButton.addEventListener('click', async () => {
    const name = (usernameInput.value || '').trim();
    if (!name) return alert('Escribe un nombre para identificarte');
    await savePlayer(name);
    loginBox.style.display = 'none';
  });
  cancelLogin && cancelLogin.addEventListener('click', () => loginBox.style.display = 'none');

  // cerrar paneles
  closeAchievements && closeAchievements.addEventListener('click', () => achievementsPanel.style.display = 'none');
  closeLeaderboard && closeLeaderboard.addEventListener('click', () => leaderboardPanel.style.display = 'none');

  // expose to window
  window.RG = {
    submitScore,
    unlockAchievement,
    openAchievementsPanel,
    openLeaderboard,
    savePlayer
  };

  // init
  document.addEventListener('DOMContentLoaded', () => {
    loadPlayer();
  });

})();


