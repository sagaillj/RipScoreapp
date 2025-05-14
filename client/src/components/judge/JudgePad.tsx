import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface JudgePadProps {
  onScoreSubmit?: (score: number) => void;
}

export function JudgePad({ onScoreSubmit }: JudgePadProps) {
  const [score, setScore] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  
  const handleNumberClick = (num: number) => {
    if (score.length >= 3) return;
    
    if (score === "0") {
      setScore(num.toString());
    } else if (score.includes(".")) {
      if (score.split(".")[1].length < 1) {
        setScore(score + num);
      }
    } else {
      setScore(score + num);
    }
  };
  
  const handleDecimalClick = () => {
    if (score.includes(".") || score.length === 0) return;
    setScore(score + ".");
  };
  
  const handleClearClick = () => {
    setScore("");
    setSubmitted(false);
  };
  
  const handleBackspaceClick = () => {
    if (score.length > 0) {
      setScore(score.slice(0, -1));
    }
  };
  
  const handleSubmitClick = () => {
    if (score && !submitted) {
      const numScore = parseFloat(score);
      if (numScore >= 0 && numScore <= 10) {
        if (onScoreSubmit) {
          onScoreSubmit(numScore);
        }
        setSubmitted(true);
      }
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="p-6 rounded-lg bg-background border shadow-sm mb-6">
        <div className="text-center mb-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Current Dive: Forward 2.5 Somersault (105B)
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Difficulty: 2.4
          </div>
        </div>
        
        <div className={cn(
          "text-4xl font-bold text-center p-6 rounded-md bg-mist dark:bg-[#111B2E] mb-6",
          submitted && "text-success"
        )}>
          {score || "0.0"}
          {submitted && (
            <div className="text-sm font-medium text-success mt-2">
              Score submitted!
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="h-16 text-xl font-medium"
              onClick={() => handleNumberClick(num)}
              disabled={submitted}
            >
              {num}
            </Button>
          ))}
          
          <Button
            variant="outline"
            className="h-16 text-xl font-medium"
            onClick={handleDecimalClick}
            disabled={submitted}
          >
            .
          </Button>
          
          <Button
            variant="outline"
            className="h-16 text-xl font-medium"
            onClick={() => handleNumberClick(0)}
            disabled={submitted}
          >
            0
          </Button>
          
          <Button
            variant="outline"
            className="h-16"
            onClick={handleBackspaceClick}
            disabled={submitted}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 4H8L1 12L8 20H21C21.5304 20 22.0391 19.7893 22.4142 19.4142C22.7893 19.0391 23 18.5304 23 18V6C23 5.46957 22.7893 4.96086 22.4142 4.58579C22.0391 4.21071 21.5304 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 9L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button
            variant="secondary"
            className="h-16 text-lg font-medium"
            onClick={handleClearClick}
          >
            Clear
          </Button>
          
          <Button
            variant="default"
            className="h-16 text-lg font-medium bg-[#00F0FF] text-[#0B1120] hover:bg-[#00F0FF]/90"
            onClick={handleSubmitClick}
            disabled={!score || submitted}
          >
            Submit
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-center text-muted-foreground">
        <p>Score range: 0.0 - 10.0</p>
        <p className="mt-1">Please submit your score within 15 seconds.</p>
      </div>
    </div>
  );
}
