document.addEventListener("DOMContentLoaded", () => {
  const playButtons = document.querySelectorAll(".game-item");

  playButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const gameData = {
        title: this.dataset.title,
        iconUrl: this.dataset.iconUrl,
        plays: this.dataset.plays,
        gameEmbedUrl: this.dataset.gameEmbedUrl,
        backgroundImageUrl: this.dataset.backgroundImageUrl,
        descriptionTitle: this.dataset.descriptionTitle,
        descriptionQuestion: this.dataset.descriptionQuestion,
        descriptionText: this.dataset.descriptionText,
      };

      // Validate game URL
      if (
        !gameData.gameEmbedUrl ||
        gameData.gameEmbedUrl.startsWith("REPLACE_WITH_ACTUAL_GAME_EMBED_URL") ||
        gameData.gameEmbedUrl.trim() === ""
      ) {
        console.error(
          "Game URL is not configured for this game yet. Please update the data-game-embed-url attribute for:",
          gameData.title || "Unknown game"
        );
        alert(`Game "${gameData.title || 'Unknown'}" is not configured yet. Please contact support.`);
        return;
      }

      // FIX: Store data in localStorage instead of URL parameters
      try {
        localStorage.setItem("currentGameDetails", JSON.stringify(gameData));
        console.log("Game data stored in localStorage:", gameData);
        
        // Navigate to game details page
        window.location.href = "game-details.html";
        
      } catch (error) {
        console.error("Failed to store game data:", error);
        alert("Failed to load game. Please try again.");
      }
    });
  });
});