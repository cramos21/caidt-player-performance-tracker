// src/components/CountdownScreen.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlayIcon } from "lucide-react";

interface CountdownScreenProps {
  onCountdownComplete: () => void;
  onCancel: () => void;
}

const CountdownScreen = ({ onCountdownComplete, onCancel }: CountdownScreenProps) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onCountdownComplete();
    }
  }, [count, onCountdownComplete]);

  return (
    <div
      className="
        fixed inset-0 z-[100]
        bg-gradient-to-br from-primary/20 via-slate-900 to-slate-900
        text-foreground
        flex flex-col
      "
    >
      {/* Centered content (no horizontal padding) */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <CirclePlayIcon className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-2xl font-bold">Get Ready!</h1>
          </div>

          <div className="space-y-6">
            <div className="text-8xl font-bold text-primary animate-scale-in">
              {count > 0 ? count : "GO!"}
            </div>

            {count > 0 && (
              <p className="text-muted-foreground text-lg">
                Training starts in {count} second{count !== 1 ? "s" : ""}...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom action (kept off the edges, above bottom nav) */}
      {count > 0 && (
        <div className="pb-safe pb-6 flex justify-center">
          <Button
            onClick={onCancel}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default CountdownScreen;