import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

// Form schema for login
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Login form
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onLoginSubmit = async (data: LoginValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, we would send the login credentials to an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the currently selected role from the tabs
      const tabsElement = document.querySelector('[role="tablist"]');
      const selectedTab = tabsElement?.querySelector('[data-state="active"]')?.getAttribute('value') || 'coach';
      
      // Create a sample user based on the selected role
      const sampleUsers = {
        coach: {
          id: 1,
          name: "John Smith",
          email: data.email,
          role: "coach",
        },
        diver: {
          id: 2,
          name: "Emma Johnson",
          email: data.email,
          role: "diver",
        },
        judge: {
          id: 3,
          name: "Robert Davis",
          email: data.email,
          role: "judge",
        },
      };
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(sampleUsers[selectedTab as keyof typeof sampleUsers]));
      
      toast({
        title: "Login successful!",
        description: "Welcome back to RipScore.",
      });
      
      // Redirect to dashboard page
      window.location.href = '/dashboard';
      
      loginForm.reset();
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Login - RipScore.app</title>
        <meta name="description" content="Login to your RipScore account. Access dive meet management tools, scoring interfaces, and athlete dashboards." />
      </Helmet>
      
      <PageWrapper>
        {/* Hero Section */}
        <section className="pre-login bg-gradient-to-b from-white to-[#f0f8ff] text-[#0B1120] py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                Welcome to <span className="text-[var(--color-accent-post)]">Rip</span>Score<span className="text-[var(--color-accent-pink)]">.</span>
              </h1>
              <p className="text-lg text-[#556677] animate-slide-up">
                Sign in to your account to access your diving team dashboard.
              </p>
            </div>
          </div>
        </section>
        
        {/* Auth Section */}
        <section className="pre-login py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Tabs defaultValue="coach" className="w-full animate-slide-up delay-100">
                <TabsList className="grid grid-cols-3 mb-8 rounded-full bg-[#f0f8ff] p-1">
                  <TabsTrigger value="coach" className="rounded-full data-[state=active]:bg-[var(--color-accent-post)] data-[state=active]:text-white">Coach</TabsTrigger>
                  <TabsTrigger value="diver" className="rounded-full data-[state=active]:bg-[var(--color-accent-post)] data-[state=active]:text-white">Diver</TabsTrigger>
                  <TabsTrigger value="judge" className="rounded-full data-[state=active]:bg-[var(--color-accent-post)] data-[state=active]:text-white">Judge</TabsTrigger>
                </TabsList>
                
                {["coach", "diver", "judge"].map((role) => (
                  <TabsContent key={role} value={role}>
                    <div className="bg-white border rounded-xl p-6 shadow-sm animate-slide-up delay-200">
                      <div className="w-full">
                        <h3 className="text-xl font-semibold text-center mb-6">Login</h3>
                        
                        <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                            <FormField
                              control={loginForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="your.email@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••" 
                                        {...field} 
                                      />
                                      <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                      >
                                        {showPassword ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex items-center justify-between">
                              <a href="#" className="text-sm text-primary hover:underline">
                                Forgot password?
                              </a>
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full bg-gradient-to-r from-[var(--color-accent-post)] to-[var(--color-accent-pink)] hover:opacity-90 transition-opacity" 
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Signing in..." : "Sign In"}
                            </Button>
                          </form>
                        </Form>
                      </div>
                      
                      {role === "coach" && (
                        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
                          <p>
                            By signing in, you agree to our{" "}
                            <a href="#" className="text-primary hover:underline">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-primary hover:underline">
                              Privacy Policy
                            </a>
                            .
                          </p>
                        </div>
                      )}
                      
                      {role === "judge" && (
                        <div className="mt-6 pt-6 border-t">
                          <div className="bg-mist dark:bg-[#111B2E] p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <strong>Note for Judges:</strong> If you have received a meet-specific QR code, you can use it to access the judging interface without an account.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Information Section */}
        <section className="py-16 md:py-24 bg-mist dark:bg-[#111B2E]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <SectionTitle 
                title="Account Benefits"
                subtitle="Access powerful tools to manage your diving team, track performance, and organize meets."
                centered
              />
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "For Coaches",
                    features: [
                      "Complete meet management",
                      "Team performance analytics",
                      "Dive sheet creation",
                      "Practice planning tools"
                    ]
                  },
                  {
                    title: "For Divers",
                    features: [
                      "Personal performance dashboard",
                      "Dive history and statistics",
                      "Competition schedule",
                      "Skill progression tracking"
                    ]
                  },
                  {
                    title: "For Judges",
                    features: [
                      "Easy scoring interface",
                      "Judging history records",
                      "Meet assignments",
                      "Judging certification tools"
                    ]
                  }
                ].map((role, i) => (
                  <div key={i} className="bg-background rounded-lg p-6 border shadow-sm">
                    <h3 className="text-xl font-bold mb-4">{role.title}</h3>
                    <ul className="space-y-2">
                      {role.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}