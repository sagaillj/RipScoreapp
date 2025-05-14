import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeatureCard } from "./FeatureCard";
import { FEATURES } from "@/lib/constants";

export function FeatureGrid() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="One Platform for All Your Diving Needs"
          subtitle="RipScore is the central command center for coaches, divers, and teams - unifying all aspects of diving management in one fast, easy, and powerful system that grows with your program."
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
