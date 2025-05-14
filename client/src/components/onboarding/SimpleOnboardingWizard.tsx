import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Define our form schema for the multi-step form
const coachDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const schoolDetailsSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  mascot: z.string().min(1, "Mascot is required"),
  division: z.string().min(1, "Division is required"),
});

const accountCredentialsSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const photoUploadSchema = z.object({
  coachPhoto: z.any()
    .refine(file => !file || !file.size || file.size <= MAX_FILE_SIZE, 
      `Max file size is 5MB.`)
    .refine(file => !file || !file.type || ACCEPTED_IMAGE_TYPES.includes(file.type), 
      "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional()
    .nullable(),
  teamLogo: z.any()
    .refine(file => !file || !file.size || file.size <= MAX_FILE_SIZE, 
      `Max file size is 5MB.`)
    .refine(file => !file || !file.type || ACCEPTED_IMAGE_TYPES.includes(file.type), 
      "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional()
    .nullable(),
});

interface DiverInfo {
  firstName: string;
  lastName: string;
  email: string;
  gradYear: string;
}

const diverSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
});

type DiverSchema = z.infer<typeof diverSchema>;

// Complete form type
type FormData = {
  firstName: string;
  lastName: string;
  schoolName: string;
  mascot: string;
  division: string;
  coachPhoto: File | null;
  teamLogo: File | null;
  email: string;
  password: string;
  confirmPassword: string;
  divers: DiverInfo[];
};

// Define TeamInfo type to match what the onboarding.tsx component expects
type TeamInfo = {
  name: string;
  mascot: string;
  logo: string | null;
  division: string;
  coachFirstName: string;
  coachLastName: string;
  coachPhoto: string | null;
  email: string;
  password: string;
  roster: Array<{
    name: string;
    email: string;
  }>;
};

interface SimpleOnboardingWizardProps {
  onComplete: (teamInfo: TeamInfo) => void;
  numberOfLicenses: number;
}

export function SimpleOnboardingWizard({ onComplete, numberOfLicenses = 1 }: SimpleOnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "John",
    lastName: "Smith",
    schoolName: "Westfield High",
    mascot: "Eagles",
    division: "Division I",
    coachPhoto: null,
    teamLogo: null,
    email: "coach@example.com",
    password: "Password123!",
    confirmPassword: "Password123!",
    divers: Array(Math.max(1, numberOfLicenses))
      .fill(null)
      .map((_, i) => ({
        firstName: `Diver${i+1}`,
        lastName: "Swimmer",
        email: `diver${i+1}@example.com`,
        gradYear: "2025"
      }))
  });
  
  const [coachPhotoPreview, setCoachPhotoPreview] = useState<string | null>(null);
  const [teamLogoPreview, setTeamLogoPreview] = useState<string | null>(null);
  
  const coachPhotoRef = useRef<HTMLInputElement>(null);
  const teamLogoRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  
  // Forms for each step
  const coachDetailsForm = useForm<z.infer<typeof coachDetailsSchema>>({
    resolver: zodResolver(coachDetailsSchema),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
    },
  });

  const schoolDetailsForm = useForm<z.infer<typeof schoolDetailsSchema>>({
    resolver: zodResolver(schoolDetailsSchema),
    defaultValues: {
      schoolName: formData.schoolName,
      mascot: formData.mascot,
      division: formData.division,
    },
  });

  const accountCredentialsForm = useForm<z.infer<typeof accountCredentialsSchema>>({
    resolver: zodResolver(accountCredentialsSchema),
    defaultValues: {
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    },
  });

  const photoUploadForm = useForm<z.infer<typeof photoUploadSchema>>({
    resolver: zodResolver(photoUploadSchema),
    defaultValues: {
      coachPhoto: null,
      teamLogo: null,
    },
  });
  
  // Enhanced diver schema with graduation year
  const enhancedDiverSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    gradYear: z.string(),
  });
  
  type EnhancedDiverSchema = z.infer<typeof enhancedDiverSchema>;
  
  // Create a fixed number of diver forms to avoid hooks in loops issue
  // We'll create a max of 5 forms (which should be enough for most teams)
  const maxDivers = 5;
  const diverForm1 = useForm<EnhancedDiverSchema>({
    resolver: zodResolver(enhancedDiverSchema),
    defaultValues: {
      firstName: formData.divers[0]?.firstName || "",
      lastName: formData.divers[0]?.lastName || "",
      email: formData.divers[0]?.email || "",
      gradYear: formData.divers[0]?.gradYear || "",
    },
  });
  
  const diverForm2 = useForm<EnhancedDiverSchema>({
    resolver: zodResolver(enhancedDiverSchema),
    defaultValues: {
      firstName: formData.divers[1]?.firstName || "",
      lastName: formData.divers[1]?.lastName || "",
      email: formData.divers[1]?.email || "",
      gradYear: formData.divers[1]?.gradYear || "",
    },
  });
  
  const diverForm3 = useForm<EnhancedDiverSchema>({
    resolver: zodResolver(enhancedDiverSchema),
    defaultValues: {
      firstName: formData.divers[2]?.firstName || "",
      lastName: formData.divers[2]?.lastName || "",
      email: formData.divers[2]?.email || "",
      gradYear: formData.divers[2]?.gradYear || "",
    },
  });
  
  const diverForm4 = useForm<EnhancedDiverSchema>({
    resolver: zodResolver(enhancedDiverSchema),
    defaultValues: {
      firstName: formData.divers[3]?.firstName || "",
      lastName: formData.divers[3]?.lastName || "",
      email: formData.divers[3]?.email || "",
      gradYear: formData.divers[3]?.gradYear || "",
    },
  });
  
  const diverForm5 = useForm<EnhancedDiverSchema>({
    resolver: zodResolver(enhancedDiverSchema),
    defaultValues: {
      firstName: formData.divers[4]?.firstName || "",
      lastName: formData.divers[4]?.lastName || "",
      email: formData.divers[4]?.email || "",
      gradYear: formData.divers[4]?.gradYear || "",
    },
  });
  
  // Create an array of the forms for easier access - limit to the number of licenses purchased
  const diverForms = [diverForm1, diverForm2, diverForm3, diverForm4, diverForm5].slice(0, Math.min(numberOfLicenses, maxDivers));

  // Handle form submissions for each step
  const handleCoachDetailsSubmit = (data: z.infer<typeof coachDetailsSchema>) => {
    setFormData(prev => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
    }));
    nextStep();
  };

  const handleSchoolDetailsSubmit = (data: z.infer<typeof schoolDetailsSchema>) => {
    setFormData(prev => ({
      ...prev,
      schoolName: data.schoolName,
      mascot: data.mascot,
      division: data.division,
    }));
    nextStep();
  };

  const handleAccountCredentialsSubmit = (data: z.infer<typeof accountCredentialsSchema>) => {
    setFormData(prev => ({
      ...prev,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    }));
    nextStep();
  };

  const handlePhotoUploadSubmit = (data: z.infer<typeof photoUploadSchema>) => {
    setFormData(prev => ({
      ...prev,
      coachPhoto: data.coachPhoto || null,
      teamLogo: data.teamLogo || null,
    }));
    nextStep();
  };

  // Shared function to convert files to data URLs
  const getDataUrl = (file: File | null): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  // Generate random 3-letter code for team with timestamp to ensure uniqueness
  const generateRandomCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // Add timestamp to make it more unique
    const timestamp = Date.now().toString().slice(-4);
    let code = '';
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    // Add two digits from timestamp
    return code + timestamp.slice(0, 2);
  };
  
  // Create a separate function for skipping the diver step
  const handleSkipDiverStep = async () => {
    try {
      // Just submit with empty divers array
      setFormData(prev => ({
        ...prev,
        divers: [],
      }));
      
      // Process the onComplete callback with empty roster
      const coachPhotoUrl = await getDataUrl(formData.coachPhoto);
      const teamLogoUrl = await getDataUrl(formData.teamLogo);
      
      const teamInfo = {
        name: formData.schoolName || 'My Team',
        mascot: formData.mascot || 'Eagles',
        logo: teamLogoUrl,
        division: formData.division || 'Division I',
        coachFirstName: formData.firstName || 'Coach',
        coachLastName: formData.lastName || 'User',
        coachPhoto: coachPhotoUrl,
        email: formData.email || 'coach@example.com',
        password: formData.password || 'Password123!',
        code: generateRandomCode(), // Add unique code to avoid DB conflicts
        roster: [], // Empty roster - using array of objects with name and email properties
      };
      
      onComplete(teamInfo);
    } catch (error) {
      console.error("Error in skip diver step:", error);
      toast({
        title: "Error",
        description: "There was a problem completing the onboarding process. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDiverSubmit = async () => {
    let allValid = true;
    const newDivers: DiverInfo[] = [];
    
    for (let i = 0; i < diverForms.length; i++) {
      const isValid = await diverForms[i].trigger();
      if (!isValid) {
        allValid = false;
      } else {
        const values = diverForms[i].getValues();
        newDivers.push({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          gradYear: values.gradYear,
        });
      }
    }
    
    if (allValid) {
      setFormData(prev => ({
        ...prev,
        divers: newDivers,
      }));
      
      // Use the shared getDataUrl function
      const coachPhotoUrl = await getDataUrl(formData.coachPhoto);
      const teamLogoUrl = await getDataUrl(formData.teamLogo);
      
      // Map DiverInfo objects to the format expected by the parent component
      const formattedRoster = newDivers.map(diver => ({
        name: diver.firstName && diver.lastName ? `${diver.firstName} ${diver.lastName}` : 'Team Member',
        email: diver.email || ''
      }));
      
      // Use the global generateRandomCode function
      
      // Format data for the onComplete callback
      const teamInfo = {
        name: formData.schoolName || 'My Team',
        mascot: formData.mascot || 'Eagles',
        logo: teamLogoUrl,
        division: formData.division || 'Division I',
        coachFirstName: formData.firstName || 'Coach',
        coachLastName: formData.lastName || 'User',
        coachPhoto: coachPhotoUrl,
        email: formData.email || 'coach@example.com',
        password: formData.password || 'Password123!',
        code: generateRandomCode(), // Add unique code to avoid DB conflicts
        roster: formattedRoster,
      };
      
      onComplete(teamInfo);
    } else {
      toast({
        title: "Please check your entries",
        description: "Some fields have errors that need to be corrected.",
        variant: "destructive",
      });
    }
  };
  
  // File upload handlers
  const handleCoachPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      photoUploadForm.setValue("coachPhoto", file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setCoachPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTeamLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      photoUploadForm.setValue("teamLogo", file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setTeamLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  // Calculate progress percentage
  const totalSteps = 5; // Fixed to always show 5 steps
  const progress = (step / totalSteps) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <Card className="w-full max-w-2xl mx-auto overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE]">
            Welcome to RipScore
          </CardTitle>
          <CardDescription className="text-center">
            Let's get your team set up! {step}/{totalSteps}
          </CardDescription>
          
          {/* Progress bar */}
          <div className="w-full bg-[#131C2E] h-1 rounded-full mt-4">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] rounded-full"
              initial={{ width: `${progress - (100/totalSteps)}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="pb-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Coach Details */}
            {step === 1 && (
              <motion.div
                key="coach-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold">Coach Information</h2>
                
                <Form {...coachDetailsForm}>
                  <form onSubmit={coachDetailsForm.handleSubmit(handleCoachDetailsSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={coachDetailsForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your first name" 
                                {...field} 
                                className="bg-[#1a202c] text-white border-[#2D3748]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={coachDetailsForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your last name" 
                                {...field} 
                                className="bg-[#1a202c] text-white border-[#2D3748]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
                      >
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
            
            {/* Step 2: School Details */}
            {step === 2 && (
              <motion.div
                key="school-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold">School Information</h2>
                
                <Form {...schoolDetailsForm}>
                  <form onSubmit={schoolDetailsForm.handleSubmit(handleSchoolDetailsSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={schoolDetailsForm.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your school name" 
                                {...field} 
                                className="bg-[#1a202c] text-white border-[#2D3748]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={schoolDetailsForm.control}
                        name="mascot"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mascot</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your team mascot" 
                                {...field} 
                                className="bg-[#1a202c] text-white border-[#2D3748]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={schoolDetailsForm.control}
                      name="division"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Division</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#1a202c] text-white border-[#2D3748]">
                                <SelectValue placeholder="Select division" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#131C2E] border-[#2D3748]">
                              <SelectItem value="Division I">Division I</SelectItem>
                              <SelectItem value="Division II">Division II</SelectItem>
                              <SelectItem value="Division III">Division III</SelectItem>
                              <SelectItem value="NJCAA">NJCAA</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="border-[#2D3748] bg-transparent"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
                      >
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
            
            {/* Step 3: Account Credentials */}
            {step === 3 && (
              <motion.div
                key="account-credentials"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold">Create Your Account</h2>
                <p className="text-sm text-[#8A9BA8]">
                  Set up your credentials to access RipScore after onboarding is complete.
                </p>
                
                <Form {...accountCredentialsForm}>
                  <form onSubmit={accountCredentialsForm.handleSubmit(handleAccountCredentialsSubmit)} className="space-y-6">
                    <FormField
                      control={accountCredentialsForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your email address" 
                              type="email"
                              {...field} 
                              className="bg-[#1a202c] text-white border-[#2D3748]"
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-[#8A9BA8]">
                            We'll use this for account recovery and notifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    

                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={accountCredentialsForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Create a password" 
                                type="password"
                                {...field} 
                                className="bg-[#1a202c] text-white border-[#2D3748]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={accountCredentialsForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Confirm your password" 
                                type="password"
                                {...field} 
                                className="bg-[#1a202c] text-white border-[#2D3748]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="border-[#2D3748] bg-transparent"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
                      >
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
            
            {/* Step 4: Photo Uploads (optional) */}
            {step === 4 && (
              <motion.div
                key="photo-uploads"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold flex items-center">
                  Upload Photos 
                  <span className="text-sm font-normal ml-2 text-[#8A9BA8]">(Optional)</span>
                </h2>
                
                <Form {...photoUploadForm}>
                  <form onSubmit={photoUploadForm.handleSubmit(handlePhotoUploadSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormLabel>Coach Photo</FormLabel>
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-24 h-24 rounded-lg border border-dashed border-[#2D3748] flex items-center justify-center overflow-hidden bg-[#131C2E]"
                          >
                            {coachPhotoPreview ? (
                              <img 
                                src={coachPhotoPreview} 
                                alt="Coach preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-[#8A9BA8] text-xs text-center p-2">
                                No photo
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => coachPhotoRef.current?.click()}
                              className="text-sm bg-[#131C2E] border-[#2D3748]"
                            >
                              <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Photo
                            </Button>
                            <input 
                              ref={coachPhotoRef}
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleCoachPhotoChange}
                            />
                            {coachPhotoPreview && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setCoachPhotoPreview(null);
                                  photoUploadForm.setValue("coachPhoto", null);
                                }}
                                className="text-xs text-[#8A9BA8] hover:text-white"
                              >
                                <X className="h-3 w-3 mr-1" /> Remove
                              </Button>
                            )}
                          </div>
                        </div>
                        <FormMessage className="mt-1">
                          {photoUploadForm.formState.errors.coachPhoto?.message?.toString()}
                        </FormMessage>
                      </div>
                      
                      <div className="space-y-4">
                        <FormLabel>Team Logo</FormLabel>
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-24 h-24 rounded-lg border border-dashed border-[#2D3748] flex items-center justify-center overflow-hidden bg-[#131C2E]"
                          >
                            {teamLogoPreview ? (
                              <img 
                                src={teamLogoPreview} 
                                alt="Team logo preview" 
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <div className="text-[#8A9BA8] text-xs text-center p-2">
                                No logo
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => teamLogoRef.current?.click()}
                              className="text-sm bg-[#131C2E] border-[#2D3748]"
                            >
                              <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Logo
                            </Button>
                            <input 
                              ref={teamLogoRef}
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleTeamLogoChange}
                            />
                            {teamLogoPreview && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setTeamLogoPreview(null);
                                  photoUploadForm.setValue("teamLogo", null);
                                }}
                                className="text-xs text-[#8A9BA8] hover:text-white"
                              >
                                <X className="h-3 w-3 mr-1" /> Remove
                              </Button>
                            )}
                          </div>
                        </div>
                        <FormMessage className="mt-1">
                          {photoUploadForm.formState.errors.teamLogo?.message?.toString()}
                        </FormMessage>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="border-[#2D3748] bg-transparent"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
                      >
                        {numberOfLicenses > 0 ? "Continue" : "Finish"} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
            
            {/* Step 5: Diver Information (based on licenses) */}
            {step === 5 && numberOfLicenses > 0 && (
              <motion.div
                key="diver-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Team Members</h2>
                    <p className="text-sm text-[#8A9BA8]">
                      Add your divers to invite them to create their profiles ({numberOfLicenses} license{numberOfLicenses > 1 ? 's' : ''})
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={handleSkipDiverStep}
                      className="text-[#8A9BA8]"
                    >
                      Skip this step
                    </Button>
                  </div>
                </div>
                
                {/* Table header */}
                <div className="grid grid-cols-12 gap-3 mb-2 text-sm font-semibold text-[#8A9BA8] px-2">
                  <div className="col-span-2">First Name</div>
                  <div className="col-span-2">Last Name</div>
                  <div className="col-span-5">Email</div>
                  <div className="col-span-3">Graduation Year</div>
                </div>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {/* Only show the forms for our available divers, up to the maximum number supported */}
                  {diverForms.map((form, index) => (
                    <div key={index} className="bg-[#111827] rounded-lg p-3 border border-[#2D3748]">
                      <Form {...form}>
                        <div className="grid grid-cols-12 gap-3 items-center">
                          {/* First Name field */}
                          <div className="col-span-2">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormControl>
                                    <Input 
                                      placeholder="First name" 
                                      {...field} 
                                      className="bg-[#1a202c] text-white border-[#2D3748]"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {/* Last Name field */}
                          <div className="col-span-2">
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormControl>
                                    <Input 
                                      placeholder="Last name" 
                                      {...field} 
                                      className="bg-[#1a202c] text-white border-[#2D3748]"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {/* Email field */}
                          <div className="col-span-5">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormControl>
                                    <Input 
                                      placeholder="Email address" 
                                      {...field} 
                                      className="bg-[#1a202c] text-white border-[#2D3748]"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {/* Graduation Year field */}
                          <div className="col-span-3">
                            <FormField
                              control={form.control}
                              name="gradYear"
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-[#1a202c] text-white border-[#2D3748]">
                                        <SelectValue placeholder="Grad year" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-[#1a202c] border-[#2D3748]">
                                      <SelectItem value="2025">2025</SelectItem>
                                      <SelectItem value="2026">2026</SelectItem>
                                      <SelectItem value="2027">2027</SelectItem>
                                      <SelectItem value="2028">2028</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </Form>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between pt-4 items-center">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="border-[#2D3748] bg-transparent"
                  >
                    Back
                  </Button>
                  
                  <Button 
                    onClick={handleDiverSubmit}
                    className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
                  >
                    Finish <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}