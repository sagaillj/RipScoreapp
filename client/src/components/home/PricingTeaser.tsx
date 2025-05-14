import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";

export function PricingTeaser() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <SectionTitle 
              title="Simple Pricing for Teams that Want to Win"
              subtitle="Affordable pricing plans designed to fit diving teams of all sizes."
              className="text-left"
            />
            
            <ul className="space-y-3 mt-6 mb-8">
              {[
                "Unlimited diving meets",
                "Real-time scoring system",
                "Comprehensive analytics",
                "Mobile-friendly judge interface",
                "Free technical support"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/pricing">
              <Button className="group">
                View Pricing Details
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="bg-[#0B1120] text-white rounded-xl p-8 border border-primary/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                <div className="h-36 w-36 rounded-full bg-primary/20 blur-2xl"></div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Silver Team License</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold">$499</span>
                <span className="text-[#8A9BA8] mb-1">/year</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  "1 diver included",
                  "Unlimited competitions",
                  "Coach dashboard access",
                  "Real-time judging",
                  "Mobile QR code judging"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-[#F4F6F8]">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-[#8A9BA8] text-sm mb-1">Gold Team License: $999/year</div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-xl">$99</span> 
                    <span className="text-[#8A9BA8] text-sm">/additional diver</span>
                  </div>
                  <Link href="/pricing">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
