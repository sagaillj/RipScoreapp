import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { SimpleOnboardingWizard } from "@/components/onboarding/SimpleOnboardingWizard";
import { CelebrationConfetti } from "@/components/common/CelebrationConfetti";

export type TeamInfo = {
  name: string;
  mascot: string;
  logo: string | null;
  division: string;
  coachFirstName: string;
  coachLastName: string;
  coachPhoto: string | null;
  email: string; // Added email field
  password: string; // Added password field
  roster: Array<{
    name: string;
    email: string;
  }>;
};

export default function OnboardingPage() {
  const [step, setStep] = useState<"welcome" | "wizard" | "complete">("welcome");
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Setup welcome animation effect
  useEffect(() => {
    if (step === "welcome") {
      const timer = setTimeout(() => {
        setStep("wizard");
      }, 3000); // After 3 seconds, transition to wizard
      return () => clearTimeout(timer);
    }
  }, [step]);
  
  const [teamData, setTeamData] = useState<{ team: any; user: any; divers: any[]; teamInfo: any } | null>(null);
  
  const createTeamMutation = useMutation({
    mutationFn: async (teamInfo: TeamInfo) => {
      // Generate a more unique username with a timestamp to avoid conflicts
      const timestamp = new Date().getTime().toString().slice(-5);
      const username = `${teamInfo.coachFirstName.toLowerCase()}.${teamInfo.coachLastName.toLowerCase()}.${timestamp}`;
      
      // First create the coach user
      const userResponse = await apiRequest("POST", "/api/auth/register", {
        username: username,
        password: "defaultpassword123", // This would be changed during real authentication flow
        name: `${teamInfo.coachFirstName} ${teamInfo.coachLastName}`,
        email: "coach@example.com", // Would be collected in a real auth flow
        role: "coach"
      });
      
      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || "Failed to create user");
      }
      
      const user = await userResponse.json();
      
      // Create the team with the created user as coach
      const teamResponse = await apiRequest("POST", "/api/teams", {
        name: teamInfo.name,
        code: teamInfo.code, // Use code generated in SimpleOnboardingWizard
        coachId: user.id, // Using the newly created user ID
      });
      
      const team = await teamResponse.json();
      
      // If we have roster info, create divers
      const divers = [];
      if (teamInfo.roster && teamInfo.roster.length > 0) {
        for (const diver of teamInfo.roster) {
          const response = await apiRequest("POST", "/api/divers", {
            userId: null, 
            teamId: team.id,
            age: null,
            gender: null,
            email: diver.email,
            name: diver.name,
          });
          divers.push(await response.json());
        }
      }
      
      return { 
        team, 
        user,
        divers,
        teamInfo // Save the original input data too
      };
    },
    onSuccess: (data: any) => {
      setTeamData(data);
      setStep("complete");
      toast({
        title: "Onboarding Complete!",
        description: "Your team has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
    },
  });
  
  const handleOnboardingComplete = (teamInfo: TeamInfo) => {
    createTeamMutation.mutate(teamInfo);
  };
  
  const goToDashboard = () => {
    setLocation("/dashboard");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1120] to-[#0F172A] text-white">
      <Helmet>
        <title>Welcome to RipScore.app</title>
        <meta name="description" content="Complete your coach profile and set up your team on RipScore.app" />
      </Helmet>
      
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8"
              >
                <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M48.277 11.947C44.7417 11.947 41.8824 14.3953 41.8824 18.1055C41.8824 21.8157 44.7417 24.264 48.277 24.264C51.8123 24.264 54.6716 21.8157 54.6716 18.1055C54.6716 14.3953 51.8123 11.947 48.277 11.947Z"
                    stroke="#FF5CB3"
                    strokeWidth="2"
                    fill="none"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.51445 18.2108C9.51445 15.5107 11.0924 13.1985 13.3914 12.1052C12.2425 10.6019 10.4751 9.60675 8.4763 9.60675C5.12976 9.60675 2.41766 12.4731 2.41766 16.0371C2.41766 19.601 5.12976 22.4674 8.4763 22.4674C10.4967 22.4674 12.2856 21.4531 13.4345 19.9116C11.114 18.8182 9.51445 16.5252 9.51445 18.2108Z"
                    fill="url(#paint0_linear_welcome)"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.3914 12.1052C14.5403 11.0119 16.0851 10.3832 17.7878 10.3832C21.1343 10.3832 23.8464 13.2496 23.8464 16.8135C23.8464 20.3774 21.1343 23.2439 17.7878 23.2439C16.0636 23.2439 14.5188 22.6152 13.3699 21.5027C12.221 20.3901 11.5013 18.4005 11.5013 16.8135C11.5013 15.2266 12.2425 13.1985 13.3914 12.1052Z"
                    fill="url(#paint1_linear_welcome)"
                  />
                  <defs>
                    <linearGradient id="paint0_linear_welcome" x1="9.22237" y1="10.1169" x2="5.4017" y2="22.7178" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF5CB3"/>
                      <stop offset="1" stopColor="#FF9CEE"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_welcome" x1="19.8626" y1="8.89771" x2="11.4797" y2="26.8148" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF5CB3"/>
                      <stop offset="1" stopColor="#FF9CEE"/>
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-5xl font-bold mb-4"
              >
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE]">RipScore</span>
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-xl text-[#8A9BA8] max-w-md mx-auto"
              >
                Let's set up your diving team and get you started in just a few simple steps
              </motion.p>
            </div>
          </motion.div>
        )}
        
        {step === "wizard" && (
          <motion.div 
            key="wizard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container max-w-6xl mx-auto py-12 px-4"
          >
            <div className="flex flex-col items-center justify-center">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-8 text-center"
              >
                Coach Onboarding Wizard
              </motion.h1>
              
              <SimpleOnboardingWizard 
                onComplete={handleOnboardingComplete} 
                numberOfLicenses={3}  // Set this based on the user's purchased licenses
              />
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-[#8A9BA8] mt-8 max-w-md text-center"
              >
                Having trouble? You can always skip this step and manually set up your team later.
              </motion.p>
              <Button 
                variant="outline" 
                onClick={goToDashboard}
                className="mt-2 border-[#8A9BA8] text-[#8A9BA8] hover:text-white hover:border-white"
              >
                Skip for now
              </Button>
            </div>
          </motion.div>
        )}
        
        {step === "complete" && teamData && (
          <motion.div 
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container max-w-6xl mx-auto py-12 px-4 flex items-center justify-center min-h-screen"
          >
            <CelebrationConfetti trigger={true} delay={800} />
            <div className="text-center py-16 space-y-8 max-w-3xl mx-auto">
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, ease: "easeOut", times: [0, 0.2, 0.8, 1] }}
                className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] p-6 rounded-full inline-block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-4"
              >
                <h1 className="text-4xl font-bold">Onboarding Complete!</h1>
                <p className="text-lg text-[#8A9BA8] max-w-md mx-auto mt-2">
                  Your team has been set up successfully. You can now start managing your team, adding divers, and creating meets.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-[#131C2E] rounded-xl shadow-lg overflow-hidden border border-[#2D3748] text-left"
              >
                <div className="p-6 border-b border-[#2D3748]">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold">{teamData.team.name}</h2>
                      <span className="text-sm text-[#8A9BA8]">{teamData.teamInfo.division}</span>
                    </div>
                    <div className="bg-[#1E293B] h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold text-[#FF5CB3]">
                      {teamData.team.code}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-b border-[#2D3748]">
                  <h3 className="text-md font-medium mb-3">Coach</h3>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1E293B] h-10 w-10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#8A9BA8]">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{teamData.user.name}</p>
                      <p className="text-xs text-[#8A9BA8]">Head Coach</p>
                    </div>
                  </div>
                </div>
                
                {teamData.divers && teamData.divers.length > 0 && (
                  <div className="p-6">
                    <h3 className="text-md font-medium mb-3">Team Roster ({teamData.divers.length})</h3>
                    <div className="space-y-3">
                      {teamData.divers.map((diver: any, index: number) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + (index * 0.1) }}
                          className="flex items-center gap-3"
                        >
                          <div className="bg-[#1E293B] h-8 w-8 rounded-full flex items-center justify-center text-xs">
                            {diver.name ? diver.name.split(' ').map((n: string) => n[0]).join('') : 'TM'}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{diver.name || 'Team Member'}</p>
                            <p className="text-xs text-[#8A9BA8]">{diver.email || 'No email provided'}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Button 
                  onClick={goToDashboard}
                  size="lg"
                  className="mt-6 bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
                >
                  Go to Dashboard
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}