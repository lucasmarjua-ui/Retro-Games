console.log("✅ script.js cargado correctamente");

// ===================== LOGIN ======================
const openLoginBtn = document.getElementById("openLoginBtn");
const loginBox = document.getElementById("loginBox");
const loginButton = document.getElementById("loginButton");
const cancelLogin = document.getElementById("cancelLogin");
const usernameInput = document.getElementById("usernameInput");
const playerName = document.getElementById("playerName");

// Mostrar nombre si ya estaba guardado
const storedUser = localStorage.getItem("retro-username");
if (storedUser) {
  playerName.textContent = `👤 ${storedUser}`;
}

// Abrir panel de login
openLoginBtn.addEventListener("click", () => {
  loginBox.style.display = "block";
});

// Guardar usuario
loginButton.addEventListener("click", () => {
  const newUser = usernameInput.value.trim();

  if (newUser.length < 2) {
    alert("⚠️ El nombre debe tener al menos 2 caracteres.");
    return;
  }

  localStorage.setItem("retro-username", newUser);
  playerName.textContent = `👤 ${newUser}`;
  loginBox.style.display = "none";
});

// Cancelar login
cancelLogin.addEventListener("click", () => {
  loginBox.style.display = "none";
});


// ===================== NAV: ACHIEVEMENTS / RANKING ======================
document.getElementById("openAchievementsBtn").addEventListener("click", () => {
  window.location.href = "achievements.html";
});

document.getElementById("openRankingBtn").addEventListener("click", () => {
  window.location.href = "ranking.html";
});

// ===================== MODAL DE JUEGOS ======================
const modal = document.getElementById("gameModal");
const gameFrame = document.getElementById("gameFrame");
const closeModal = document.getElementById("closeModal");

// Abrir modal al hacer clic en una tarjeta
document.querySelectorAll(".game-card").forEach(card => {
  card.addEventListener("click", () => {
    gameFrame.src = card.dataset.game;
    modal.style.display = "flex";
  });
});

// Cerrar modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  gameFrame.src = "";
});

});
