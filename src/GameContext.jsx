import { createContext, useContext, useState, useRef, useEffect } from "react";

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

  // Timer functionality - 15 second countdown
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameActive, setGameActive] = useState(false);
  const timerRef = useRef(null);
  const scoreRef = useRef(0); // Keep current score in a ref to avoid closure issues
  const scoreSavedRef = useRef(false); // Track if score has already been saved for this game

  // Function to start the game
  const startGame = () => {
    setScore(0); // Reset score to 0
    scoreRef.current = 0; // Reset score ref too
    scoreSavedRef.current = false; // Reset score saved flag for new game
    setTimeLeft(15); // Reset timer to 15 seconds
    setGameActive(true); // Set game as active
    setMolePosition(getRandomPosition()); // Place mole in random hole
    setGameScreen("playing"); // Switch to playing screen

    // Start the countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Time's up! Stop the game and go back to welcome screen immediately
          setGameActive(false);
          clearInterval(timerRef.current);

          // Save current score as a high score using the ref value
          const currentScore = scoreRef.current;
          if (currentScore > 0 && !scoreSavedRef.current) {
            setHighScores((prevScores) => {
              const newScores = [...prevScores, currentScore]
                .sort((a, b) => b - a)
                .slice(0, 10);
              return newScores;
            });
            scoreSavedRef.current = true; // Mark score as saved
          }

          // Immediately return to welcome screen
          setGameScreen("welcome");

          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Count down every second
  };

  // Function to restart and go back to welcome screen
  const restartGame = () => {
    // Clear the timer if it's running
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameActive(false);

    // Save current score as a high score if it's good enough
    const currentScore = scoreRef.current;
    if (currentScore > 0 && !scoreSavedRef.current) {
      setHighScores((prevScores) => {
        const newScores = [...prevScores, currentScore]
          .sort((a, b) => b - a)
          .slice(0, 10);
        return newScores;
      });
      scoreSavedRef.current = true; // Mark score as saved
    }
    setGameScreen("welcome"); // Go back to welcome screen
  };

  // Function to handle clicking on a mole
  const whackMole = () => {
    // Only allow clicking if game is active (timer hasn't run out)
    if (!gameActive) {
      return;
    }

    setScore((prevScore) => {
      const newScore = prevScore + 1;
      scoreRef.current = newScore; // Keep ref in sync
      return newScore;
    });
    setMolePosition(getRandomPosition(molePosition)); // Move mole to new random position (different from current)
  };

  // Helper function to get a random hole position (0-8)
  // Ensures the new position is different from the current mole position
  const getRandomPosition = (currentPosition = null) => {
    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * 9); // Random number between 0-8
    } while (currentPosition !== null && newPosition === currentPosition);
    return newPosition;
  };

  // Cleanup timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // All the values and functions we want to share with components
  const gameValue = {
    gameScreen,
    score,
    molePosition,
    highScores,
    timeLeft,
    gameActive,
    startGame,
    restartGame,
    whackMole,
  };

  return (
    <GameContext.Provider value={gameValue}>{children}</GameContext.Provider>
  );
};
