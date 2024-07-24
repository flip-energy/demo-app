import useTime from "@/hooks/useTime";
import { formatMsToHhMm } from "@/utils";

const TimeLeft = ({ endTime }: { endTime: string }) => {
  const time = useTime();
  const endsInMs = new Date(endTime).getTime() - time.getTime();
  if (endsInMs < 0) return null;
  return <div>{formatMsToHhMm(endsInMs)} left</div>;
};

export default TimeLeft;
