import { GameProvider, useGame } from "./GameContext";
import WelcomeScreen from "./WelcomeScreen";
import GameBoard from "./GameBoard";

// Main game component that decides which screen to show
function GameContent() {
  // Get the current game screen from our context
  const { gameScreen } = useGame();

  // Conditionally render welcome screen or game board
  if (gameScreen === "welcome") {
    return <WelcomeScreen />;
  } else if (gameScreen === "playing") {
    return <GameBoard />;
  }

  // Fallback (shouldn't happen)
  return <div>Something went wrong!</div>;
}

// Main App component - wraps everything in the GameProvider
export default function App() {
  return (
    <GameProvider>
      <div className="app">
        <GameContent />
      </div>
    </GameProvider>
  );
}
