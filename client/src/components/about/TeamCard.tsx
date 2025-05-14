import { cn } from "@/lib/utils";

interface TeamCardProps {
  name: string;
  role: string;
  bio: string;
  className?: string;
}

export function TeamCard({ name, role, bio, className }: TeamCardProps) {
  // Generate a consistent but random-looking hue for the avatar background
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  
  return (
    <div className={cn(
      "bg-background rounded-xl p-6 border transition-all duration-300 hover:shadow-md",
      className
    )}>
      <div className="flex flex-col items-center text-center">
        <div 
          className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-white"
          style={{ backgroundColor: `hsl(${hue}, 80%, 45%)` }}
        >
          {name.split(' ').map(part => part[0]).join('')}
        </div>
        
        <h3 className="text-xl font-semibold">{name}</h3>
        <div className="text-primary font-medium mt-1 mb-3">{role}</div>
        <p className="text-muted-foreground">{bio}</p>
      </div>
    </div>
  );
}
