import { FC, useEffect, useState } from "react";
import ScoreBoard from "./ScoreBoard";
import Dice from "./Dice";
import ChosenDice from "./ChosenDice";

export type ScoreBoardProps = {
  player: string;
  currentScore: number;
  roundScore: number;
  selectedScore: number;
};

const App: FC = () => {
  const [myScoreBoard, setMyScoreBoard] = useState<ScoreBoardProps>({
    player: "me",
    currentScore: 0,
    roundScore: 0,
    selectedScore: 0,
  });
  const [enemyScoreBoard, setEnemyScoreBoard] = useState<ScoreBoardProps>({
    player: "enemy",
    currentScore: 0,
    roundScore: 0,
    selectedScore: 0,
  });
  const [currentPlayer, setCurrentPlayer] = useState<string>("me");
  const [throwedDices, setThrowedDices] = useState<number[]>([]);
  const [chosenDices, setChosenDices] = useState<number[]>([]);
  const [fixedDices, setFixedDices] = useState<number[]>([]);
  const [currentMaxDicesLength, setCurrentMaxDicesLength] = useState<number>(6);
  const [currentTurnScore, setCurrentTurnScore] = useState<number>(0);
  const [isRoundOver, setIsRoundOver] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  useEffect(() => {
    calculateScore(throwedDices, "round", false);
    calculateScore(chosenDices, "selected", false);
  }, [throwedDices, chosenDices]);

  useEffect(() => {
    if (isRoundOver && !isGameOver) {
      setCurrentTurnScore(0);
      setTimeout(() => {
        setThrowedDices([]);
        setFixedDices([]);
        setChosenDices([]);
      }, 5000);
    }
  }, [isRoundOver]);

  useEffect(() => {
    if (currentPlayer === "enemy" && !isRoundOver && !isGameOver) {
      setIsRoundOver(false);

      const enemyTurn = setTimeout(() => {
        throwDices();
      }, 2000);

      return () => clearTimeout(enemyTurn);
    }
  }, [currentPlayer, isRoundOver]);

  useEffect(() => {
    if (currentPlayer === "enemy" && throwedDices.length > 0 && !isRoundOver && !isGameOver) {
      const enemySelect = setTimeout(() => {
        const selectedDiceIndices: number[] = [];
        const numToSelect = Math.min(2, currentMaxDicesLength);

        while (selectedDiceIndices.length < numToSelect) {
          const randomIndex = Math.floor(Math.random() * throwedDices.length);
          if (!selectedDiceIndices.includes(randomIndex)) {
            selectedDiceIndices.push(randomIndex);
          }
        }

        const selectedDices: number[] = throwedDices.filter((_, index) =>
            selectedDiceIndices.includes(index)
        );

        setChosenDices((prevChosenDices) => [
          ...prevChosenDices,
          ...selectedDices,
        ]);

        setThrowedDices((prevThrowedDices) =>
            prevThrowedDices.filter((_, index) => !selectedDiceIndices.includes(index))
        );

        if (throwedDices.length === 0) {
          endRound();
        }
      }, 2000);

      return () => clearTimeout(enemySelect);
    }
  }, [throwedDices, currentPlayer, isRoundOver, currentMaxDicesLength]);

  useEffect(() => {
    if (chosenDices.length > 0 && !isGameOver) {
      setCurrentMaxDicesLength(currentMaxDicesLength - 1);
    }
  }, [chosenDices]);

  const calculateScore = (
      array: number[],
      property: string,
      isCurrentScore: boolean
  ) => {
    let currentScore = 0;
    const numberOfItems: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
      "6": number;
    } = {
      "1": array.filter((d) => d === 1).length,
      "2": array.filter((d) => d === 2).length,
      "3": array.filter((d) => d === 3).length,
      "4": array.filter((d) => d === 4).length,
      "5": array.filter((d) => d === 5).length,
      "6": array.filter((d) => d === 6).length,
    };

    if (numberOfItems["1"] === 1 || numberOfItems["1"] === 2) {
      currentScore += 100;
    } else if (numberOfItems["1"] >= 3) {
      currentScore += Math.pow(2, numberOfItems["1"] - 3) * 10 * 100;
    }

    if (numberOfItems["2"] >= 3) {
      currentScore += Math.pow(2, numberOfItems["2"] - 3) * 2 * 100;
    }
    if (numberOfItems["3"] >= 3) {
      currentScore += Math.pow(2, numberOfItems["3"] - 3) * 3 * 100;
    }
    if (numberOfItems["4"] >= 3) {
      currentScore += Math.pow(2, numberOfItems["4"] - 3) * 4 * 100;
    }

    if (numberOfItems["5"] === 1 || numberOfItems["5"] === 2) {
      currentScore += 50;
    } else if (numberOfItems["5"] >= 3) {
      currentScore += Math.pow(2, numberOfItems["5"] - 3) * 5 * 100;
    }
    if (numberOfItems["6"] >= 3) {
      currentScore += Math.pow(2, numberOfItems["6"] - 3) * 6 * 100;
    }

    if (currentPlayer === "me") {
      if (property === "round") {
        if (fixedDices.length > 0 && currentScore === 0 && chosenDices.length === 0) {
          setMyScoreBoard({
            ...myScoreBoard,
            currentScore:
                myScoreBoard.currentScore - currentTurnScore > 0 ? myScoreBoard.currentScore - currentTurnScore : 0,
            roundScore: 0,
            selectedScore: 0,
          });
          setIsRoundOver(true);
          return
        } else {
          setMyScoreBoard((prevState) => ({
            ...prevState,
            currentScore: prevState.currentScore,
            roundScore: currentScore,
            selectedScore: 0
          }));
        }
      } else {
        if (!isCurrentScore) {
          setMyScoreBoard((prevState) => ({
            ...prevState,
            currentScore: prevState.currentScore,
            selectedScore: currentScore,
          }));
        } else {
          setMyScoreBoard((prevState) => ({
            ...prevState,
            selectedScore: 0,
            currentScore: prevState.currentScore + currentScore,
          }));
        }
      }
    } else {
      if (property === "round") {
        setEnemyScoreBoard((prevState) => ({
          ...prevState,
          currentScore: prevState.currentScore,
          roundScore: currentScore,
        }));
      } else {
        if (!isCurrentScore) {
          if (fixedDices.length > 0 && currentScore === 0 && chosenDices.length === 0) {
            setEnemyScoreBoard({
              ...enemyScoreBoard,
              currentScore:
                  enemyScoreBoard.currentScore - currentTurnScore > 0 ? enemyScoreBoard.currentScore - currentTurnScore : 0,
              roundScore: 0,
              selectedScore: 0,
            });
            setIsRoundOver(true);
            return
          } else {
            setEnemyScoreBoard((prevState) => ({
              ...prevState,
              currentScore: prevState.currentScore,
              roundScore: currentScore,
              selectedScore: 0
            }));
          }
        } else {
          setEnemyScoreBoard((prevState) => ({
            ...prevState,
            selectedScore: 0,
            currentScore: prevState.currentScore + currentScore,
            roundScore: 0
          }));
        }
      }
    }

    if(property === "round"){
      setCurrentTurnScore(currentTurnScore + currentScore);
    }
  };

  const throwDices = () => {
    setFixedDices([...fixedDices, ...chosenDices]);
    calculateScore([...chosenDices, ...fixedDices], "selected", true);
    setChosenDices([]);
    const numbers: number[] = [];
    for (let i = 0; i < currentMaxDicesLength; i++) {
      numbers.push(Math.floor(Math.random() * 6) + 1);
    }
    setThrowedDices(numbers);
  };

  const endRound = () => {
    if (fixedDices.length || chosenDices.length) {
      calculateScore([...chosenDices, ...fixedDices], "selected", true);
    }
    setIsRoundOver(false);
    setCurrentPlayer(currentPlayer === "me" ? "enemy" : "me");
    setChosenDices([]);
    setFixedDices([]);
    setThrowedDices([]);
    setCurrentMaxDicesLength(6);
    setCurrentTurnScore(0); // Current turn score nullázása
    if (myScoreBoard.currentScore >= 5000 || enemyScoreBoard.currentScore >= 5000) {
      setIsGameOver(true);
    }
  };


  return (
      <div className="game">
        <div className="scoreboards">
          <ScoreBoard {...myScoreBoard} />
          <ScoreBoard {...enemyScoreBoard} />
        </div>
        <div className="game-items">
          <div className="buttons">
            {(!isGameOver && (isRoundOver || [...fixedDices, ...chosenDices].length === 6)) &&
            !throwedDices.length ? (
                <button onClick={endRound}>End round</button>
            ) : (
                ""
            )}
            {!throwedDices.length &&
                [...fixedDices, ...chosenDices].length !== 6 &&
                currentPlayer === "me" &&
                !isRoundOver && !isGameOver && (
                    <button onClick={throwDices}>Start game</button>
                )}
            {!!chosenDices.length && !isGameOver &&
                [...fixedDices, ...chosenDices].length !== 6 && currentPlayer === "me" && (
                    <button onClick={throwDices}>Collect score and throw another</button>
                )}
            {throwedDices.length === 6 && !isGameOver && <h2>Remove some dice first</h2>}
            {isRoundOver && !isGameOver && (
                <h2>Round is over. Your earned score this round: {currentTurnScore}</h2>
            )}
            {isGameOver && <h2>{myScoreBoard.currentScore >= 5000 ? 'You won' : 'You lost'}</h2>}
          </div>
          <div className="throwed-dices">
            {throwedDices.length > 0 &&
                throwedDices.map((value, index) => {
                  const currentValues = {
                    index,
                    value,
                    throwedDices,
                    setThrowedDices,
                    currentMaxDicesLength,
                    chosenDices,
                    setChosenDices,
                    currentPlayer,
                  };
                  return !isRoundOver ? (
                      <Dice key={index} {...currentValues} />
                  ) : (
                      <ChosenDice key={index} {...currentValues} />
                  );
                })}
          </div>
          {!!chosenDices.length || !!fixedDices.length ? (
              <>
                <h2>Chosen dices:</h2>
                <div className="throwed-dices">
                  {[...chosenDices, ...fixedDices].map((value, index) => {
                    const currentValues = {
                      index,
                      value,
                      throwedDices,
                      setThrowedDices,
                      currentMaxDicesLength,
                      chosenDices,
                      setChosenDices,
                    };
                    return <ChosenDice key={index} {...currentValues} />;
                  })}
                </div>
              </>
          ) : (
              ""
          )}
        </div>
      </div>
  );
};

export default App;
