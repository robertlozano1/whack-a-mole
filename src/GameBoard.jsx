import { useGame } from "./GameContext";

// Individual hole component - represents one hole that can contain a mole
function Hole({ holeIndex }) {
  const { molePosition, whackMole } = useGame();

  // Check if this hole currently has the mole in it
  const hasMole = molePosition === holeIndex;

  // Handle clicking on this hole
  const handleClick = () => {
    // Only do something if this hole has the mole
    if (hasMole) {
      console.log(`Clicked hole ${holeIndex} - has mole!`);
      whackMole(); // Call the whackMole function from context
    } else {
      console.log(`Clicked hole ${holeIndex} - no mole here`);
    }
  };

  return (
    <div
      className={`hole ${hasMole ? "mole" : ""}`}
      onClick={handleClick}
      style={{ cursor: hasMole ? "pointer" : "default" }}
    >
      {/* The CSS classes 'hole' and 'mole' will show the background images */}
    </div>
  );
}

// Main game board component - shows the playing area
export default function GameBoard() {
  const { score, restartGame } = useGame();

  // Create an array of 9 holes (0-8) for our 3x3 grid
  const holes = Array.from({ length: 9 }, (_, index) => index);

  return (
    <div className="game-board">
      {/* Title */}
      <h1 className="game-title">Whack a Mole</h1>

      {/* Score and restart section */}
      <div className="game-header">
        <div className="score-display">Score: {score}</div>
        <button className="restart-button" onClick={restartGame}>
          Restart
        </button>
      </div>

      {/* Grid of holes where moles can appear */}
      <div className="holes-grid">
        {holes.map((holeIndex) => (
          <Hole key={holeIndex} holeIndex={holeIndex} />
        ))}
      </div>
    </div>
  );
}
