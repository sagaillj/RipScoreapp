import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  // Track scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-[#13151A]/95 backdrop-blur-md shadow-md border-b border-[#FF5CB3]/20 py-3" 
          : "bg-[#13151A]/80 backdrop-blur-sm py-5"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <span className="font-bold text-xl md:text-2xl text-[#00F0FF] cursor-pointer">
              RipScore<span className="text-white">.app</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <span 
                    className={cn(
                      "font-medium transition-colors cursor-pointer",
                      location === item.href 
                        ? "text-[#FF5CB3] border-b-2 border-[#FF5CB3] pb-1" 
                        : "text-white hover:text-[#FF9CEE]"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center">
            <Link href="/login">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] text-white hover:opacity-90 border-none font-medium"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
