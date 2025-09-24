document.addEventListener("DOMContentLoaded", () => {
  const gameDisplayArea = document.getElementById("gameDisplayArea");
  const playButton = document.getElementById("playButton");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const fullscreenIcon = document.getElementById("fullscreenIcon");
  const exitFullscreenIcon = document.getElementById("exitFullscreenIcon");
  const closeGameBtn = document.getElementById("closeGameBtn");
  const gameIframe = document.getElementById("gameIframe");

  const gameIconEl = document.getElementById("gameIcon");
  const gameMainTitleEl = document.getElementById("gameMainTitle");
  const gamePlaysEl = document.getElementById("gamePlays");

  const descriptionSectionTitleEl = document.getElementById("descriptionSectionTitle");
  const descriptionQuestionEl = document.getElementById("descriptionQuestion");
  const descriptionTextEl = document.getElementById("descriptionText");

  // FIX: Get data from URL parameters instead of localStorage
  function getGameDataFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if we have URL parameters
    if (urlParams.has('title') && urlParams.has('gameEmbedUrl')) {
      return {
        title: urlParams.get('title') || 'Game Title',
        iconUrl: urlParams.get('iconUrl') || 'https://via.placeholder.com/60x60.png?text=Icon',
        plays: urlParams.get('plays') || '0k',
        gameEmbedUrl: urlParams.get('gameEmbedUrl'),
        backgroundImageUrl: urlParams.get('backgroundImageUrl') || '',
        descriptionTitle: urlParams.get('descriptionTitle') || urlParams.get('title') || 'Game Title',
        descriptionQuestion: urlParams.get('descriptionQuestion') || '',
        descriptionText: urlParams.get('descriptionText') || 'No description available.'
      };
    }
    
    // Fallback: Try localStorage as backup
    const gameDataString = localStorage.getItem("currentGameDetails");
    if (gameDataString) {
      try {
        return JSON.parse(gameDataString);
      } catch (e) {
        console.error("Error parsing game data from localStorage:", e);
      }
    }
    
    // Final fallback
    return getFallbackGameData();
  }

  function getFallbackGameData() {
    return {
      title: "Block Scapes Paradise (Fallback)",
      iconUrl: "https://cdn-icons-png.flaticon.com/128/189/189333.png",
      plays: "50k",
      gameEmbedUrl: "https://www.addictinggames.com/embed/html5-games/23616",
      descriptionTitle: "Block Scapes Paradise",
      descriptionQuestion: "What is this game about?",
      backgroundImageUrl: "image/games/catch-egg-bg.png",
      descriptionText: "This is a fallback game. Please select a game from the main page."
    };
  }

  // Get game data using the fixed method
  const gameData = getGameDataFromURL();

  if (gameData && gameData.gameEmbedUrl) {
    // Update page title
    document.title = `${gameData.title || "Game"} - Thagamehub`;
    
    // Update game information
    if (gameIconEl) gameIconEl.src = gameData.iconUrl || "https://via.placeholder.com/60x60.png?text=Icon";
    if (gameMainTitleEl) gameMainTitleEl.textContent = gameData.title || "Game Title";
    if (gamePlaysEl) gamePlaysEl.textContent = gameData.plays || "N/A";
    if (descriptionSectionTitleEl) descriptionSectionTitleEl.textContent = gameData.descriptionTitle || gameData.title || "About this Game";
    if (descriptionQuestionEl) descriptionQuestionEl.textContent = gameData.descriptionQuestion || "";
    if (descriptionTextEl) descriptionTextEl.textContent = gameData.descriptionText || "No description available.";

    // Set background image
    if (gameData.backgroundImageUrl) {
      gameDisplayArea.style.backgroundImage = `url(${gameData.backgroundImageUrl})`;
      gameDisplayArea.style.backgroundSize = 'cover';
      gameDisplayArea.style.backgroundPosition = 'center';
    }

    // Hide game controls initially
    if (fullscreenBtn) fullscreenBtn.style.display = "none";
    if (closeGameBtn) closeGameBtn.style.display = "none";
    if (gameIframe) gameIframe.style.display = "none";

    // Play button functionality
    if (playButton) {
      playButton.addEventListener("click", () => {
        if (gameData.gameEmbedUrl) {
          console.log("Loading game:", gameData.gameEmbedUrl);
          
          // Show loading state
          playButton.textContent = "Loading...";
          playButton.disabled = true;
          
          // Configure game display
          gameDisplayArea.style.height = "100vh";
          gameIframe.src = gameData.gameEmbedUrl;
          gameIframe.style.display = "block";
          
          // Handle successful load
          gameIframe.addEventListener("load", function() {
            playButton.style.display = "none";
            if (fullscreenBtn) fullscreenBtn.style.display = "block";
            if (closeGameBtn) closeGameBtn.style.display = "block";
          });
          
          // Handle load errors
          gameIframe.addEventListener("error", function() {
            console.error("Failed to load game:", gameData.gameEmbedUrl);
            alert("Failed to load game. Please try again or select a different game.");
            
            // Reset button state
            playButton.textContent = "Play";
            playButton.disabled = false;
            playButton.style.display = "block";
            
            // Hide game iframe
            gameIframe.style.display = "none";
            gameIframe.src = "";
          });
          
          // Timeout handling
          setTimeout(() => {
            if (gameIframe.style.display === "block" && playButton.style.display !== "none") {
              console.warn("Game taking too long to load");
              playButton.textContent = "Try Again";
              playButton.disabled = false;
            }
          }, 10000); // 10 second timeout
          
        } else {
          console.error("Game embed URL is missing:", gameData);
          alert("Game URL not configured. Please contact support.");
        }
      });
    }

    // Fullscreen functionality
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
          if (gameIframe.requestFullscreen) {
            gameIframe.requestFullscreen();
          } else if (gameIframe.webkitRequestFullscreen) {
            gameIframe.webkitRequestFullscreen();
          } else if (gameIframe.msRequestFullscreen) {
            gameIframe.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      });
    }

    // Close game functionality
    if (closeGameBtn) {
      closeGameBtn.addEventListener("click", () => {
        gameIframe.src = "";
        gameIframe.style.display = "none";
        playButton.style.display = "block";
        playButton.textContent = "Play";
        playButton.disabled = false;
        fullscreenBtn.style.display = "none";
        closeGameBtn.style.display = "none";
        gameDisplayArea.style.height = "";
        
        // Restore background image
        if (gameData.backgroundImageUrl) {
          gameDisplayArea.style.backgroundImage = `url(${gameData.backgroundImageUrl})`;
        }
      });
    }

    // Fullscreen change handling
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        if (fullscreenIcon) fullscreenIcon.style.display = "block";
        if (exitFullscreenIcon) exitFullscreenIcon.style.display = "none";
      } else {
        if (fullscreenIcon) fullscreenIcon.style.display = "none";
        if (exitFullscreenIcon) exitFullscreenIcon.style.display = "block";
      }
    });

  } else {
    console.error("Failed to load game data.");
    if (gameMainTitleEl) gameMainTitleEl.textContent = "Error loading game";
    if (descriptionTextEl) descriptionTextEl.textContent = "Could not retrieve game details. Please try again from the main page.";
    if (playButton) {
      playButton.disabled = true;
      playButton.textContent = "Game Not Available";
    }
  }
});