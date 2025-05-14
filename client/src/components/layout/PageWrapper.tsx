import { Header } from "./Header";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  withoutFooter?: boolean;
}

export function PageWrapper({ 
  children, 
  className,
  withoutFooter = false 
}: PageWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={cn(
        "flex-1 pt-20", // Add padding for header
        className
      )}>
        {children}
      </main>
      
      {!withoutFooter && <Footer />}
    </div>
  );
}
