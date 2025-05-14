import { PageWrapper } from "@/components/layout/PageWrapper";
import { Leaderboard } from "@/components/live/Leaderboard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Helmet } from "react-helmet";

export default function Live() {
  return (
    <>
      <Helmet>
        <title>Live Results - RipScore.app</title>
        <meta name="description" content="View real-time diving competition results and leaderboards. Filter by meet, team, or athlete to track performance." />
      </Helmet>
      
      <PageWrapper>
        {/* Hero Section */}
        <section className="bg-[#0B1120] text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
                Live Meet Results
              </h1>
              <p className="text-lg text-[#8A9BA8] animate-slide-up">
                View real-time scores and standings from current and recent diving competitions.
              </p>
            </div>
          </div>
        </section>
        
        {/* Leaderboard Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <Leaderboard />
          </div>
        </section>
        
        {/* Legend Section */}
        <section className="py-12 md:py-16 bg-mist dark:bg-[#111B2E]">
          <div className="container mx-auto px-4">
            <SectionTitle 
              title="Understanding the Scores"
              subtitle="A quick guide to how diving scores are calculated at RipScore-powered events."
              centered
            />
            
            <div className="max-w-3xl mx-auto mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-background rounded-lg p-6 border shadow-sm">
                  <h3 className="text-xl font-bold mb-3">Individual Dive Score</h3>
                  <p className="text-muted-foreground mb-4">
                    Each dive receives scores from multiple judges, typically on a scale of 0-10.
                  </p>
                  <div className="p-4 bg-mist dark:bg-[#111B2E] rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Judge Scores:</span>
                      <span>7.5, 8.0, 7.5</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Difficulty:</span>
                      <span>2.4</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold">Dive Total:</span>
                      <span className="font-bold text-primary">55.2</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-6 border shadow-sm">
                  <h3 className="text-xl font-bold mb-3">Meet Scoring</h3>
                  <p className="text-muted-foreground mb-4">
                    A diver's total score is the sum of all their individual dive scores.
                  </p>
                  <div className="p-4 bg-mist dark:bg-[#111B2E] rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Dive 1:</span>
                      <span>55.2</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Dive 2:</span>
                      <span>67.5</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Dive 3:</span>
                      <span>62.4</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold">Total Score:</span>
                      <span className="font-bold text-primary">185.1</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-background rounded-lg border shadow-sm">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Leaderboards are updated in real-time as judges submit scores. Standings may change throughout the competition.
                </p>
              </div>
            </div>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
