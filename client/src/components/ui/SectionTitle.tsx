import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  subtitleClassName?: string;
}

export function SectionTitle({
  title,
  subtitle,
  centered = false,
  className,
  subtitleClassName,
}: SectionTitleProps) {
  return (
    <div className={cn(
      "mb-10",
      centered && "text-center",
      className
    )}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-lg text-muted-foreground max-w-3xl",
          centered && "mx-auto",
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
