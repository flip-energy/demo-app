const formatMsToHhMm = (ms: number) => {
  const hours = Math.floor(ms / 1000 / 60 / 60);
  const hoursText =
    hours > 0 ? (hours > 1 ? `${hours} hours` : `${hours} hour`) : "";
  const minutes = Math.floor((ms / 1000 / 60 / 60 - hours) * 60);
  const minutesText =
    minutes > 0
      ? minutes > 1
        ? `${minutes} minutes`
        : `${minutes} minute`
      : "";
  return `${hoursText} ${minutesText}`;
};

export default formatMsToHhMm;
