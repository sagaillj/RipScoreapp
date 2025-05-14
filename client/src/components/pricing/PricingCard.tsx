import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PricingCardProps {
  name: string;
  price: number;
  features: string[];
  isPrimary?: boolean;
  buttonText?: string;
  buttonAction?: () => void;
  className?: string;
}

export function PricingCard({
  name,
  price,
  features,
  isPrimary = false,
  buttonText = "Get Started",
  buttonAction,
  className,
}: PricingCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-xl p-8 border transition-all duration-300",
        isPrimary 
          ? "bg-[#0B1120] text-white border-primary/20 shadow-xl relative overflow-hidden" 
          : "bg-background border-border",
        className
      )}
    >
      {isPrimary && (
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
          <div className="h-36 w-36 rounded-full bg-primary/20 blur-2xl"></div>
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="flex items-end gap-1 mb-6">
        <span className="text-4xl font-bold">${price}</span>
        <span className={cn(
          "mb-1",
          isPrimary ? "text-[#8A9BA8]" : "text-muted-foreground"
        )}>
          /year
        </span>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <div className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center mt-0.5",
              isPrimary ? "bg-primary/20" : "bg-primary/10"
            )}>
              <Check className={cn(
                "h-3.5 w-3.5",
                isPrimary ? "text-primary" : "text-primary"
              )} />
            </div>
            <span className={isPrimary ? "text-[#F4F6F8]" : ""}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        variant={isPrimary ? "default" : "outline"} 
        className="w-full"
        onClick={buttonAction}
      >
        {buttonText}
      </Button>
    </motion.div>
  );
}
