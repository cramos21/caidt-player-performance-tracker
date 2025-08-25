import { useBluetooth } from "@/hooks/useBluetooth";

const ConnectionPill = () => {
  const { isConnected, isReady } = useBluetooth();
  const online = isReady || isConnected;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs ${
        online
          ? "bg-emerald-600/20 text-emerald-400"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {online ? "Online" : "Offline"}
    </span>
  );
};

export default ConnectionPill;