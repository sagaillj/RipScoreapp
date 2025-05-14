import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    
    // Prevent scrolling when menu is open
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={toggleMenu}
        className="md:hidden text-white hover:bg-[#2A2E3B]"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Mobile Navigation Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-[#13151A] z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#2D3748]">
          <div onClick={closeMenu}>
            <Link href="/">
              <span className="font-bold text-xl text-[#00F0FF] cursor-pointer">
                RipScore<span className="text-white">.app</span>
              </span>
            </Link>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label="Close menu" 
            onClick={toggleMenu}
            className="text-white hover:bg-[#2A2E3B]"
          >
            <X size={24} />
          </Button>
        </div>

        <nav className="flex-1 overflow-auto py-8 px-6">
          <ul className="flex flex-col gap-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <div onClick={closeMenu}>
                  <Link href={item.href}>
                    <span 
                      className={cn(
                        "block text-lg font-medium py-2 transition-colors cursor-pointer",
                        location === item.href 
                          ? "text-[#FF5CB3]" 
                          : "text-white hover:text-[#FF9CEE]"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-[#2D3748]">
          <div onClick={closeMenu}>
            <Link href="/login">
              <Button 
                variant="default" 
                size="lg" 
                className="w-full font-medium bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] text-white hover:opacity-90 border-none"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
