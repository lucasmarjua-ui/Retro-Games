console.log("✅ script.js cargado");

// ===================== LOGIN ======================

const username = localStorage.getItem("retro-username");
const playerName = document.getElementById("playerName");

// ✅ Mostrar nombre si ya existe
if (username) {
  playerName.textContent = `👤 ${username}`;
}

// ✅ Botón: Identificarse
document.getElementById("openLoginBtn").addEventListener("click", () => {
  const newName = prompt("Escribe tu nombre:");

  if (!newName || newName.length < 2) {
    alert("⚠️ Debes escribir un nombre válido");
    return;
  }

  localStorage.setItem("retro-username", newName);
  playerName.textContent = `👤 ${newName}`;
});

// ===================== ACHIEVEMENTS ======================

window.openAchievementsPanel = () => {
  window.location.href = "achievements.html";
};
btnAchievements.addEventListener("click", () => {
    window.location.href = "achievements.html";
});
// ===================== RANKING ======================

window.openLeaderboard = () => {
  window.location.href = "ranking.html";
};
btnRanking.addEventListener("click", () => {
    window.location.href = "ranking.html";
});
// ===================== MODAL DE JUEGOS ======================

const modal = document.getElementById("gameModal");
const gameFrame = document.getElementById("gameFrame");
const closeModal = document.getElementById("closeModal");

document.querySelectorAll(".game-card").forEach(card => {
  card.addEventListener("click", () => {
    gameFrame.src = card.getAttribute("data-game");
    modal.style.display = "flex";
  });
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  gameFrame.src = "";
});
