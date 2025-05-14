import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FeatureCard({ 
  title, 
  description, 
  icon,
  color = "from-primary to-primary",
  className,
  style
}: FeatureCardProps) {
  // Dynamically get the icon from Lucide
  const Icon = (LucideIcons as any)[icon] || LucideIcons.Activity;
  
  return (
    <div 
      className={cn(
        "bg-background rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:border-primary/50",
        className
      )}
      style={style}
    >
      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${color} mb-5`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
