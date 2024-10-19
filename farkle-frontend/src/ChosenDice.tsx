type DiceProps = {
  index: number;
  value: number;
};

const ChosenDice = (currentValues: DiceProps) => {
  const { value } = currentValues;
  return <div className="dice chosen">{value}</div>;
};

export default ChosenDice;
