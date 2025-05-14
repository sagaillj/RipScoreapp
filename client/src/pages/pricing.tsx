import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PricingTable } from "@/components/pricing/PricingTable";
import { FAQ } from "@/components/pricing/FAQ";
import { Button } from "@/components/ui/Button";
import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import { Helmet } from "react-helmet";

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing - RipScore.app</title>
        <meta name="description" content="Simple, transparent pricing for teams that want to win. View our base team license and per-diver pricing options." />
      </Helmet>
      
      <PageWrapper>
        {/* Hero Section */}
        <section className="bg-[#0B1120] text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                Simple Pricing for Teams <span className="text-[#00F0FF]">That Want to Win</span>
              </h1>
              <p className="text-lg text-[#8A9BA8] animate-slide-up">
                Transparent pricing with no hidden fees. Choose the plan that works best for your team's size and needs.
              </p>
            </div>
          </div>
        </section>
        
        {/* Pricing Table */}
        <PricingTable />
        
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <SectionTitle 
              title="Everything You Need for Successful Diving Competitions"
              subtitle="Every RipScore plan includes these powerful features"
              centered
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  title: "Meet Management",
                  features: [
                    "Unlimited diving meets",
                    "Automated scheduling",
                    "Dive sheet generation",
                    "Results tabulation",
                    "Immediate scoring calculation"
                  ]
                },
                {
                  title: "Judging Experience",
                  features: [
                    "Mobile-friendly score pad",
                    "QR code judge access",
                    "Instant score submission",
                    "Judge statistics",
                    "Customizable scoring rules"
                  ]
                },
                {
                  title: "Team & Diver Tools",
                  features: [
                    "Athlete performance tracking",
                    "Historical dive analysis",
                    "Progress visualization",
                    "Dive history export",
                    "Parent/spectator access"
                  ]
                }
              ].map((category, i) => (
                <div key={i} className="bg-mist dark:bg-[#111B2E] rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                  <ul className="space-y-3">
                    {category.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <FAQ />
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Diving Program?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the hundreds of teams already using RipScore to elevate their meets.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
