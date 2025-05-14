import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JudgePad } from "@/components/judge/JudgePad";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { useRoute } from "wouter";
import { QRCode } from "@/components/judge/QRCode";
import { Helmet } from "react-helmet";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function JudgeMeet() {
  const [_, params] = useRoute("/judge/:meetId");
  const meetId = params?.meetId || "";
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // In a real application, we would fetch meet details from the API
  const meetName = meetId.replace(/-/g, " ").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

  const handleScoreSubmit = (score: number) => {
    // In a real implementation, we would send the score to an API endpoint
    toast({
      title: "Score submitted!",
      description: `You gave a score of ${score.toFixed(1)}`,
    });
  };

  // Mock function to simulate judge login
  const handleJudgeLogin = () => {
    setIsLoggedIn(true);
    setIsActive(true);
    toast({
      title: "Logged in successfully",
      description: "You can now submit scores for this meet",
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Judge Scoring - ${meetName} - RipScore.app`}</title>
        <meta name="description" content={`Score dives for ${meetName} using the RipScore judging interface. Real-time score submission for diving competition judges.`} />
      </Helmet>
      
      <PageWrapper>
        {/* Header Section */}
        <section className="bg-[#0B1120] text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4">
              <Link href="/judge">
                <a className="text-[#8A9BA8] hover:text-white flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Judge Portal
                </a>
              </Link>
            </div>
            
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
                <span className="text-[#00F0FF]">{meetName}</span> Score Pad
              </h1>
              <p className="text-lg text-[#8A9BA8] animate-slide-up">
                Judge ID: {meetId} • {isActive ? (
                  <span className="text-success">Active</span>
                ) : (
                  <span className="text-[#FFB038]">Waiting for activation</span>
                )}
              </p>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {isLoggedIn ? (
                <>
                  <SectionTitle
                    title="Judge Score Pad"
                    subtitle="Enter your score for each dive using the number pad below."
                    centered
                  />
                  <JudgePad onScoreSubmit={handleScoreSubmit} />
                </>
              ) : (
                <div className="text-center">
                  <SectionTitle
                    title="Judge Authentication"
                    subtitle={`You're authorized for ${meetName}. Please confirm your identity to start judging.`}
                    centered
                  />
                  
                  <div className="mt-8 bg-background rounded-lg p-6 border shadow-sm max-w-md mx-auto">
                    <p className="mb-6 text-muted-foreground">
                      Before you can start judging, please login or scan the meet-specific QR code.
                    </p>
                    
                    <Button 
                      size="lg" 
                      className="w-full mb-4"
                      onClick={handleJudgeLogin}
                    >
                      Login as Judge
                    </Button>
                    
                    <div className="mt-8">
                      <QRCode meetId={meetId} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Information Section */}
        <section className="py-12 md:py-16 bg-mist dark:bg-[#111B2E]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <SectionTitle 
                title="Meet Information"
                centered
              />
              
              <div className="mt-6 p-6 bg-background rounded-lg border shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-sm uppercase text-muted-foreground mb-1">Meet Name</h3>
                    <p className="font-medium">{meetName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase text-muted-foreground mb-1">Date</h3>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase text-muted-foreground mb-1">Status</h3>
                    <p className="font-medium text-[#FFB038]">In Progress</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm uppercase text-muted-foreground mb-2">Current Diver</h3>
                  <div className="bg-mist dark:bg-[#111B2E] p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">Jamie Smith</p>
                        <p className="text-muted-foreground">Dolphins Dive Club</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Dive #3 of 6</p>
                        <p className="font-medium">Forward 2.5 Somersault (105B)</p>
                        <p className="text-sm">Difficulty: 2.4</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
