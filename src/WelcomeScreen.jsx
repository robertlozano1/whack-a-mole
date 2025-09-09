import { useGame } from "./GameContext";

// Welcome screen component - shows when game first loads
export default function WelcomeScreen() {
  // Get the startGame function and high scores from our game context
  const { startGame, highScores } = useGame();

  return (
    <div className="welcome-screen">
      <h1>Whack a Mole</h1>

      <p>Welcome to Whack a Mole!</p>
      <p>Whack a mole to earn points.</p>
      <p>How many can you get?</p>

      {/* Button to start the game - calls startGame from context */}
      <button className="play-button" onClick={startGame}>
        Play
      </button>

      <div className="high-scores">
        <h2>High Scores</h2>
        {highScores.length > 0 ? (
          highScores
            .slice(0, 5)
            .map((score, index) => <p key={index}>{score}</p>)
        ) : (
          <p>None yet... Play the game!</p>
        )}
      </div>
    </div>
  );
}
