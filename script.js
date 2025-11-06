const modal = document.getElementById('gameModal');
const gameFrame = document.getElementById('gameFrame');
const closeModal = document.getElementById('closeModal');
async function saveAchievement(userName, achievementName, score) {
  const { data, error } = await supabase
    .from("achievements")
    .insert([
      {
        user_id: userName,
        achievement: achievementName,
        score: score,
      }
    ]);

  if (error) {
    console.error("❌ Error guardando el logro:", error);
  } else {
    console.log("✅ Logro guardado:", data);
  }
}


document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
        const gameUrl = card.getAttribute('data-game');
        gameFrame.src = gameUrl;
        modal.style.display = 'flex';
    });
});

closeModal.addEventListener('click', () => {
    gameFrame.src = '';
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if(e.target === modal){
        gameFrame.src = '';
        modal.style.display = 'none';
    }
});
document.addEventListener('wheel', (e) => {
  // Solo vertical
  window.scrollBy({
    top: e.deltaY,
    left: 0,
    behavior: 'smooth' // hace scroll suave
  });
});
