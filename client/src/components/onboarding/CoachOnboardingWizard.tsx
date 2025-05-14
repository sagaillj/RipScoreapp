import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowRight, Check, Pencil, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  collegeUrl: z.string()
    .min(1, "College URL is required")
    .transform(val => {
      // Check if URL begins with http:// or https://
      if (!/^https?:\/\//i.test(val)) {
        // If not, prepend https://
        return `https://${val}`;
      }
      return val;
    })
    .refine(val => {
      try {
        new URL(val);
        return true;
      } catch (e) {
        return false;
      }
    }, "Please enter a valid domain like 'stanford.edu' (no need to include 'https://')"),
});

type FormValues = z.infer<typeof formSchema>;

type TeamInfo = {
  name: string;
  logo: string | null;
  division: string;
  coachFirstName?: string;
  coachLastName?: string;
  coachBio?: string;
  coachPhoto?: string | null;
  numberOfDivers?: number;
  roster: Array<{
    name: string;
    year: string;
    position: string;
  }>;
  schedule: Array<{
    date: string;
    opponent: string;
    location: string;
  }>;
};

interface CoachOnboardingWizardProps {
  onComplete: (teamInfo: TeamInfo) => void;
}

const TeamInfoSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  division: z.string().min(1, "Division is required"),
  coachFirstName: z.string().min(1, "Coach first name is required"),
  coachLastName: z.string().min(1, "Coach last name is required"),
  coachBio: z.string().optional(),
  logo: z.string().nullable()
});

type TeamInfoFormValues = z.infer<typeof TeamInfoSchema>;

export function CoachOnboardingWizard({ onComplete }: CoachOnboardingWizardProps) {
  // Main wizard steps: URL input, Scrape Animation, Review & Edit
  const [step, setStep] = useState<"url" | "scraping" | "review" | "edit">("url");
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [editSection, setEditSection] = useState<"basic" | "roster" | null>(null);
  const [editDiverIndex, setEditDiverIndex] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Form for URL input
  const urlForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collegeUrl: "",
    },
  });
  
  // Form for editing team info
  const teamInfoForm = useForm<TeamInfoFormValues>({
    resolver: zodResolver(TeamInfoSchema),
    defaultValues: {
      name: "",
      division: "",
      coachFirstName: "",
      coachLastName: "",
      coachBio: "",
      logo: null
    }
  });
  
  // Reference for file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle URL form submission - starts the scraping process
  const handleUrlSubmit = (data: FormValues) => {
    setStep("scraping");
    scrapeCollegeMutation.mutate(data);
  };
  
  // Mutation for scraping college info
  const scrapeCollegeMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/scrape-college", { url: data.collegeUrl });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        try {
          // Extract coach name (if available) into first and last
          let firstName = "", lastName = "";
          if (data.college?.coachName) {
            const nameParts = data.college.coachName.split(' ');
            firstName = nameParts[0] || "";
            lastName = nameParts.slice(1).join(' ') || "";
          }
          
          // Validate that we have the minimum required data
          if (!data.college?.name) {
            throw new Error("College name not found in scraped data");
          }
          
          // Set the team info from scraped data with null checks
          const newTeamInfo = {
            name: data.college.name || "Unknown College",
            logo: data.college.logo || null,
            division: data.college.division || "Unknown",
            coachFirstName: firstName,
            coachLastName: lastName,
            coachBio: data.college.coachBio || "",
            coachPhoto: data.college.coachPhoto || null,
            numberOfDivers: data.college.numberOfDivers || 0,
            roster: Array.isArray(data.team?.roster) ? data.team.roster : [],
            schedule: Array.isArray(data.team?.schedule) ? data.team.schedule : [],
          };
          
          setTeamInfo(newTeamInfo);
          
          // Pre-fill the team info form for editing
          teamInfoForm.reset({
            name: newTeamInfo.name,
            division: newTeamInfo.division,
            coachFirstName: newTeamInfo.coachFirstName,
            coachLastName: newTeamInfo.coachLastName,
            coachBio: newTeamInfo.coachBio,
            logo: newTeamInfo.logo
          });
          
          // Move to review step
          setTimeout(() => {
            setStep("review");
          }, 1500); // Show animation for 1.5 seconds before moving to review
          
          toast({
            title: "College information found!",
            description: "We've found information about your team.",
          });
        } catch (error) {
          console.error("Error processing scraped data:", error);
          setStep("url");
          toast({
            title: "Error",
            description: "Found your college but couldn't process all the information. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        setStep("url");
        toast({
          title: "Error",
          description: data.error || "Failed to scrape college information",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      setStep("url");
      
      // Provide more helpful error messages based on common issues
      let errorMessage = "Failed to scrape college information";
      
      if (error.message?.includes("Failed to fetch") || error.message?.includes("Network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Connection timed out. The college website may be slow or unavailable.";
      } else if (error.response?.status === 400) {
        errorMessage = error.message || "Invalid college URL. Please check and try again.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. We had trouble processing your request.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error("College scraper error:", error);
    },
  });
  
  // Handle team info edit form submission
  const handleTeamInfoEdit = (data: TeamInfoFormValues) => {
    if (teamInfo) {
      setTeamInfo({
        ...teamInfo,
        name: data.name,
        division: data.division,
        coachFirstName: data.coachFirstName,
        coachLastName: data.coachLastName,
        coachBio: data.coachBio,
        logo: data.logo
      });
    }
    setEditSection(null);
  };
  
  // Handle adding/editing a diver
  const handleEditDiver = (index: number | null, diver?: any) => {
    if (index !== null && teamInfo && diver) {
      const newRoster = [...teamInfo.roster];
      newRoster[index] = diver;
      setTeamInfo({
        ...teamInfo,
        roster: newRoster
      });
    }
    setEditDiverIndex(null);
  };
  
  // Handle removing a diver
  const handleRemoveDiver = (index: number) => {
    if (teamInfo) {
      const newRoster = [...teamInfo.roster];
      newRoster.splice(index, 1);
      setTeamInfo({
        ...teamInfo,
        roster: newRoster
      });
    }
  };
  
  // Handle adding a new diver
  const handleAddDiver = (diver: any) => {
    if (teamInfo) {
      setTeamInfo({
        ...teamInfo,
        roster: [...teamInfo.roster, diver]
      });
    }
  };
  
  // Handle confirming and completing the wizard
  const handleConfirm = () => {
    if (teamInfo) {
      const finalTeamInfo = {
        name: teamInfo.name,
        logo: teamInfo.logo,
        division: teamInfo.division,
        coachFirstName: teamInfo.coachFirstName,
        coachLastName: teamInfo.coachLastName,
        coachBio: teamInfo.coachBio,
        coachPhoto: teamInfo.coachPhoto,
        numberOfDivers: teamInfo.numberOfDivers,
        roster: teamInfo.roster.map(diver => ({
          name: diver.name,
          year: diver.year || "",
          position: diver.position || ""
        })),
        schedule: teamInfo.schedule
      };
      onComplete(finalTeamInfo);
    }
  };
  
  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoUrl = event.target?.result as string;
        teamInfoForm.setValue("logo", logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <Card className="w-full max-w-3xl mx-auto overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE]">
            Coach Onboarding
          </CardTitle>
          <CardDescription className="text-center">
            Let's get your team set up! We'll help you import information about your college and team.
          </CardDescription>
          
          {/* Progress Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            <motion.div 
              className={`h-2 w-8 rounded-full ${step === "url" ? 'bg-[#FF5CB3]' : 'bg-muted'}`}
              animate={{ 
                backgroundColor: step === "url" ? "#FF5CB3" : "rgba(228, 228, 231, 0.4)"
              }}
            />
            <motion.div 
              className={`h-2 w-8 rounded-full ${step === "scraping" ? 'bg-[#FF5CB3]' : 'bg-muted'}`}
              animate={{ 
                backgroundColor: step === "scraping" ? "#FF5CB3" : "rgba(228, 228, 231, 0.4)"
              }}
            />
            <motion.div 
              className={`h-2 w-8 rounded-full ${step === "review" || step === "edit" ? 'bg-[#FF5CB3]' : 'bg-muted'}`}
              animate={{ 
                backgroundColor: step === "review" || step === "edit" ? "#FF5CB3" : "rgba(228, 228, 231, 0.4)"
              }}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            {/* Step 1: URL Input */}
            {step === "url" && (
              <motion.div
                key="url-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Form {...urlForm}>
                  <form onSubmit={urlForm.handleSubmit(handleUrlSubmit)} className="space-y-6">
                    <FormField
                      control={urlForm.control}
                      name="collegeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College Website URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="stanford.edu" 
                              {...field} 
                              className="bg-[#0E141E] border-[#2D3748]"
                            />
                          </FormControl>
                          <FormDescription>
                            Simply enter your college domain (e.g., "stanford.edu" or "harvard.edu"). 
                            No need to include "https://" - we'll add that automatically. 
                            We'll then find your swimming/diving team information.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
                      disabled={scrapeCollegeMutation.isPending}
                    >
                      {scrapeCollegeMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
                        </>
                      ) : (
                        <>
                          Find My Team <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
            
            {/* Step 2: Simplified Animation with Slow Fades */}
            {step === "scraping" && (
              <motion.div
                key="scraping"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="py-16 flex flex-col items-center justify-center text-center space-y-10"
              >
                {/* Simplified animation with just text fades */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] bg-clip-text text-transparent">
                    Finding Your Team
                  </h2>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="text-lg text-[#F4F6F8]"
                  >
                    Searching for your team's information on the web
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1.5 }}
                    className="text-sm text-[#8A9BA8] max-w-md"
                  >
                    We're looking for your team logo, coach details, division, roster, and schedule information
                  </motion.p>
                </motion.div>
                
                {/* Progress bar for scraping */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="h-1 bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] rounded-full mt-6 max-w-xs"
                />
                
                <div className="mt-4 flex items-center gap-2 text-[#8A9BA8]">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Searching for your team's information...</span>
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Review & Edit */}
            {step === "review" && teamInfo && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Basic Team Info Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Team Information</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setEditSection("basic");
                        setStep("edit");
                      }}
                      className="flex items-center gap-1 text-[#FF5CB3] hover:text-[#FF9CEE] hover:bg-[#131C2E]"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                  </div>
                  
                  <div className="flex flex-col gap-4 bg-[#131C2E] p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      {teamInfo.logo ? (
                        <img 
                          src={teamInfo.logo} 
                          alt={`${teamInfo.name} logo`} 
                          className="h-20 w-20 object-contain bg-white rounded-md p-1"
                        />
                      ) : (
                        <div className="h-20 w-20 bg-[#1D293E] rounded-md flex items-center justify-center">
                          <span className="text-3xl font-bold">{teamInfo.name?.charAt(0) || "T"}</span>
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <h4 className="font-bold text-xl">{teamInfo.name}</h4>
                        <p className="text-[#8A9BA8]">Division: {teamInfo.division || "Unknown"}</p>
                        <p className="text-[#8A9BA8]">
                          Coach: {teamInfo.coachFirstName} {teamInfo.coachLastName}
                        </p>
                        <p className="text-[#8A9BA8]">
                          Team Size: {teamInfo.numberOfDivers || teamInfo.roster?.length || 0} divers
                        </p>
                      </div>
                    </div>
                    
                    {/* Coach Bio and Photo Section */}
                    {(teamInfo.coachBio || teamInfo.coachPhoto) && (
                      <div className="mt-4 flex flex-col md:flex-row gap-4 p-3 bg-[#1D293E] rounded-md">
                        {teamInfo.coachPhoto && (
                          <div className="flex-shrink-0">
                            <img 
                              src={teamInfo.coachPhoto} 
                              alt={`Coach ${teamInfo.coachFirstName} ${teamInfo.coachLastName}`} 
                              className="w-24 h-24 rounded-md object-cover"
                            />
                          </div>
                        )}
                        
                        {teamInfo.coachBio && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Coach Bio</h4>
                            <p className="text-sm text-[#A0AEC0] line-clamp-4">
                              {teamInfo.coachBio}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator className="bg-[#2D3748]" />
                
                {/* Team Roster Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Team Roster</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setEditSection("roster");
                        setStep("edit");
                      }}
                      className="flex items-center gap-1 text-[#FF5CB3] hover:text-[#FF9CEE] hover:bg-[#131C2E]"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {teamInfo.roster && teamInfo.roster.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                        {teamInfo.roster.map((person, index) => (
                          <div key={index} className="flex justify-between items-center bg-[#131C2E] p-3 rounded-md">
                            <span>{person.name}</span>
                            <span className="text-[#8A9BA8] text-sm">{person.year}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#8A9BA8] text-sm">No roster information found. You can add team members later.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Edit Mode - Basic Team Info */}
            {step === "edit" && editSection === "basic" && teamInfo && (
              <motion.div
                key="edit-basic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Edit Team Information</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setStep("review")}
                    className="text-[#8A9BA8]"
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                </div>
                
                <Form {...teamInfoForm}>
                  <form onSubmit={teamInfoForm.handleSubmit(handleTeamInfoEdit)} className="space-y-4">
                    {/* Logo upload section */}
                    <div className="flex items-center gap-4 mb-4">
                      {teamInfoForm.watch("logo") ? (
                        <img 
                          src={teamInfoForm.watch("logo") || ""}
                          alt="Team logo" 
                          className="h-20 w-20 object-contain bg-white rounded-md p-1"
                        />
                      ) : (
                        <div className="h-20 w-20 bg-[#1D293E] rounded-md flex items-center justify-center">
                          <span className="text-3xl font-bold">{teamInfo.name?.charAt(0) || "T"}</span>
                        </div>
                      )}
                      
                      <div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1 bg-[#131C2E] border-[#2D3748]"
                        >
                          <Upload className="h-4 w-4" /> Upload Logo
                        </Button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                        <p className="text-[#8A9BA8] text-xs mt-1">
                          Upload a square image for best results
                        </p>
                      </div>
                    </div>
                    
                    {/* Team Name */}
                    <FormField
                      control={teamInfoForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-[#0E141E] border-[#2D3748]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Division */}
                    <FormField
                      control={teamInfoForm.control}
                      name="division"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Division</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#0E141E] border-[#2D3748]">
                                <SelectValue placeholder="Select division" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#131C2E] border-[#2D3748]">
                              <SelectItem value="Division I">Division I</SelectItem>
                              <SelectItem value="Division II">Division II</SelectItem>
                              <SelectItem value="Division III">Division III</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Coach First Name */}
                    <FormField
                      control={teamInfoForm.control}
                      name="coachFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coach First Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-[#0E141E] border-[#2D3748]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Coach Last Name */}
                    <FormField
                      control={teamInfoForm.control}
                      name="coachLastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coach Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-[#0E141E] border-[#2D3748]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Coach Bio */}
                    <FormField
                      control={teamInfoForm.control}
                      name="coachBio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coach Bio</FormLabel>
                          <FormControl>
                            <textarea 
                              {...field} 
                              className="w-full min-h-[100px] p-3 rounded-md bg-[#0E141E] border border-[#2D3748] text-sm"
                              placeholder="Enter coach biography information..."
                            />
                          </FormControl>
                          <FormDescription>
                            A brief biography or description of the coach's experience.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-4 bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
                    >
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
            
            {/* Edit Mode - Team Roster */}
            {step === "edit" && editSection === "roster" && teamInfo && (
              <motion.div
                key="edit-roster"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Edit Team Roster</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setStep("review")}
                    className="text-[#8A9BA8]"
                  >
                    <X className="h-4 w-4 mr-1" /> Done
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {teamInfo.roster.map((diver, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#131C2E] p-3 rounded-md">
                      <div>
                        <h4 className="font-medium">{diver.name}</h4>
                        <p className="text-sm text-[#8A9BA8]">{diver.year}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveDiver(index)}
                          className="text-[#FF5CB3] hover:text-[#FF9CEE] hover:bg-[#131C2E]"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed border-[#2D3748] text-[#8A9BA8] hover:text-white bg-[#131C2E]"
                  onClick={() => {
                    handleAddDiver({
                      name: "New Diver",
                      year: "",
                      position: ""
                    });
                  }}
                >
                  + Add Diver
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {step === "review" ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setStep("url")}
                className="bg-transparent border-[#2D3748] text-[#8A9BA8] hover:text-white"
              >
                Go Back
              </Button>
              <Button 
                onClick={handleConfirm}
                className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
              >
                <Check className="h-4 w-4 mr-2" />
                <span>Confirm and Continue</span>
              </Button>
            </>
          ) : step === "edit" ? (
            <Button 
              variant="outline" 
              onClick={() => setStep("review")}
              className="w-full bg-transparent border-[#2D3748] text-[#8A9BA8] hover:text-white"
            >
              Cancel and Return to Review
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </motion.div>
  );
}