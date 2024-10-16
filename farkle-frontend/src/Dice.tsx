type DiceProps = {
  index: number;
  value: number;
  throwedDices: number[];
  setThrowedDices: React.Dispatch<React.SetStateAction<number[]>>;
  currentMaxDicesLength: number;
  chosenDices: number[];
  setChosenDices: React.Dispatch<React.SetStateAction<number[]>>;
};

const Dice = (currentValues: DiceProps) => {
  const {
    index,
    value,
    throwedDices,
    setThrowedDices,
    currentMaxDicesLength,
    chosenDices,
    setChosenDices,
  } = currentValues;
  const removeFromDices = (currentIndex: number) => {
    setChosenDices([
      ...chosenDices,
      throwedDices.filter((dice, i) => i == currentIndex),
    ]);
    setThrowedDices(throwedDices.filter((dice, i) => i !== currentIndex));
  };

  return (
    <>
      {throwedDices.length === currentMaxDicesLength && (
        <div className="dice choosable" onClick={() => removeFromDices(index)}>
          {value}
        </div>
      )}
      {throwedDices.length < currentMaxDicesLength && (
        <div className="dice">{value}</div>
      )}
    </>
  );
};

export default Dice;
