import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

const ApiHealthStatus = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/health", {
          method: "GET",
          signal: AbortSignal.timeout(3000),
        });
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      <Activity className="h-4 w-4" />
      <span className="text-muted-foreground">FastAPI Server:</span>
      {isChecking ? (
        <span className="text-muted-foreground">Checking...</span>
      ) : (
        <>
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-success animate-pulse" : "bg-destructive"
            }`}
          />
          <span className={isOnline ? "text-success" : "text-destructive"}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </>
      )}
    </div>
  );
};

export default ApiHealthStatus;
