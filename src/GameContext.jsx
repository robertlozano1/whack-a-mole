import { createContext, useContext, useState } from "react";

// Create the context for our game state
const GameContext = createContext();

// Custom hook to use the game context easily in components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

// Provider component that wraps our app and provides game state
export const GameProvider = ({ children }) => {
  // Track which screen we're on: 'welcome' or 'playing'
  const [gameScreen, setGameScreen] = useState("welcome");

  // Track the current score
  const [score, setScore] = useState(0);

  // Track which hole the mole is currently in (0-8 for a 3x3 grid)
  const [molePosition, setMolePosition] = useState(0);

  // Track high scores (array of best scores)
  const [highScores, setHighScores] = useState([5, 0]);

  // Function to start the game
  const startGame = () => {
    console.log("Starting game...");
    setScore(0); // Reset score to 0
    setMolePosition(getRandomPosition()); // Place mole in random hole
    setGameScreen("playing"); // Switch to playing screen
  };

  // Function to restart and go back to welcome screen
  const restartGame = () => {
    console.log("Restarting game...");
    // Save current score as a high score if it's good enough
    if (score > 0) {
      setHighScores((prevScores) => {
        const newScores = [...prevScores, score]
          .sort((a, b) => b - a)
          .slice(0, 10);
        return newScores;
      });
    }
    setGameScreen("welcome"); // Go back to welcome screen
  };

  // Function to handle clicking on a mole
  const whackMole = () => {
    console.log("Mole whacked! Score increased.");
    setScore((prevScore) => prevScore + 1); // Increase score by 1
    setMolePosition(getRandomPosition()); // Move mole to new random position
  };

  // Helper function to get a random hole position (0-8)
  const getRandomPosition = () => {
    return Math.floor(Math.random() * 9); // Random number between 0-8
  };

  // All the values and functions we want to share with components
  const gameValue = {
    gameScreen,
    score,
    molePosition,
    highScores,
    startGame,
    restartGame,
    whackMole,
  };

  return (
    <GameContext.Provider value={gameValue}>{children}</GameContext.Provider>
  );
};
