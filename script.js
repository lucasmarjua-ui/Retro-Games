console.log("✅ script.js cargado");


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
// ------ LOGIN / IDENTIFICACIÓN ------
const loginBtn = document.getElementById("loginButton");
const usernameField = document.getElementById("usernameInput");
const welcomeText = document.getElementById("welcomeUser");
const loginBox = document.getElementById("loginBox");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const name = usernameField.value.trim();

    if (name === "") {
      alert("⚠️ Debes escribir un nombre");
      return;
    }

    // Guardamos el nombre en localStorage
    localStorage.setItem("retro-username", name);

    // Recargamos para que aparezca en el menú
    location.reload();
  });
}

// Mostrar nombre si ya está identificado
const savedUser = localStorage.getItem("retro-username");

if (savedUser) {
  if (welcomeText) {
    welcomeText.innerText = `👤 Bienvenido, ${savedUser}`;
  }
  if (loginBox) {
    loginBox.style.display = "none";
  }
}
// BOTONES DEL PANEL SUPERIOR
document.getElementById("achBtn").onclick = () => RG.openAchievementsPanel();
document.getElementById("rankBtn").onclick = () => RG.openLeaderboard("global");
document.getElementById("openLoginBtn").onclick = () => {
    document.getElementById("loginBox").style.display = "flex";
};

