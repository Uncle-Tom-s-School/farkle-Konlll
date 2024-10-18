import { useEffect, useState } from "react";
import ScoreBoard from "./ScoreBoard";
import Dice from "./Dice";
import ChosenDice from "./ChosenDice";

export type ScoreBoardProps = {
  player: string;
  currentScore: number;
  roundScore: number;
  selectedScore: number;
};

const App = () => {
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

  useEffect(() => {
    calculateScore(throwedDices, "round", false);
    calculateScore(chosenDices, "selected", false);
  }, [throwedDices, chosenDices]);

  useEffect(() => {
    if (chosenDices.length > 0) {
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

    // TODO: pontszámítást átgondolni -> 2^(n-3) * k * 100
    if (numberOfItems["1"] === 1) {
      currentScore += 100;
    } else if (numberOfItems["1"] >= 3) {
      currentScore += 1000 + numberOfItems["1"] * 100;
    }

    if (numberOfItems["2"] >= 3) {
      currentScore += 20 + numberOfItems["2"] * 20;
    }
    if (numberOfItems["3"] >= 3) {
      currentScore += 30 + numberOfItems["3"] * 30;
    }
    if (numberOfItems["4"] >= 3) {
      currentScore += 4 * (100 * numberOfItems["4"]);
    }

    if (numberOfItems["5"] === 1) {
      currentScore += 50;
    } else if (numberOfItems["5"] >= 3) {
      currentScore += 50 + numberOfItems["1"] * 50;
    }
    if (numberOfItems["6"] >= 3) {
      currentScore += 60 + numberOfItems["6"] * 60;
    }

    if (currentPlayer === "me") {
      if (property === "round") {
        setMyScoreBoard((prevState) => ({
          ...prevState,
          roundScore: currentScore,
        }));
      } else {
        if (!isCurrentScore) {
          setMyScoreBoard((prevState) => ({
            ...prevState,
            selectedScore: currentScore,
          }));
        } else {
          setMyScoreBoard((prevState) => ({
            ...prevState,
            selectedScore: 0,
            currentScore: currentScore,
          }));
        }
      }
    } else {
      if (property === "round") {
        setEnemyScoreBoard((prevState) => ({
          ...prevState,
          roundScore: currentScore,
        }));
      } else {
        if (!isCurrentScore) {
          setEnemyScoreBoard((prevState) => ({
            ...prevState,
            selectedScore: currentScore,
          }));
        } else {
          setEnemyScoreBoard((prevState) => ({
            ...prevState,
            selectedScore: 0,
            currentScore: currentScore,
          }));
        }
      }
    }
  };

  const throwDices = () => {
    setFixedDices([...chosenDices]);
    calculateScore(fixedDices, "selected", true);
    setChosenDices([]);
    const numbers: number[] = [];
    for (let i = 0; i < currentMaxDicesLength; i++) {
      numbers.push(Math.floor(Math.random() * 6) + 1);
    }
    setThrowedDices(numbers);
  };

  return (
    <div className="game">
      <div className="scoreboards">
        <ScoreBoard {...myScoreBoard} />
        <ScoreBoard {...enemyScoreBoard} />
      </div>
      <div className="game-items">
        <div className="buttons">
          {!throwedDices.length && (
            <button onClick={throwDices}>Start game</button>
          )}
          {chosenDices.length ? (
            <button onClick={throwDices}>
              Collect score and throw another
            </button>
          ) : (
            ""
          )}

          {throwedDices.length === 6 && <h2>Remove some dice first</h2>}
        </div>
        <div className="throwed-dices">
          {throwedDices.length > 0 &&
            throwedDices.map((value, index) => {
              let currentValues = {
                index,
                value,
                throwedDices,
                setThrowedDices,
                currentMaxDicesLength,
                chosenDices,
                setChosenDices,
              };
              return <Dice key={index} {...currentValues} />;
            })}
        </div>
        {!!chosenDices.length || !!fixedDices.length ? (
          <>
            <h2>Chosen dices:</h2>
            <div className="throwed-dices">
              {[...chosenDices, ...fixedDices].map((value, index) => {
                let currentValues = {
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
