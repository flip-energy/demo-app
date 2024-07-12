const dayIndicesToNameString = (dayIndices: number[]): string => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (dayIndices.length === 1) {
    return days[dayIndices[0]];
  }
  const dayNames = dayIndices.map((index) => days[index]);
  const lastDayIndex = dayNames.length - 1;
  return (
    dayNames.slice(0, lastDayIndex).join(", ") +
    " and " +
    dayNames[lastDayIndex]
  );
};

export default dayIndicesToNameString;
