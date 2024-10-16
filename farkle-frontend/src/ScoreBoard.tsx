import { ScoreBoardProps } from "./App";

const ScoreBoard = (currentBoard: ScoreBoardProps) => {
  const { currentScore, roundScore, selectedScore } = currentBoard;

  return (
    <div className="scoreboard">
      <div>total/5000</div>
      <div>{currentScore}</div>
      <div>round</div>
      <div>{roundScore}</div>
      <div>selected</div>
      {selectedScore}
    </div>
  );
};

export default ScoreBoard;
