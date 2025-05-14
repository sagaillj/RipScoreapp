import { SectionTitle } from "@/components/ui/SectionTitle";
import { PricingCard } from "./PricingCard";
import { PRICING } from "@/lib/constants";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Check, MinusCircle, PlusCircle, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { CelebrationAnimation } from "@/components/common/CelebrationAnimation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function PricingTable() {
  const [_, setLocation] = useLocation();
  const [licenseType, setLicenseType] = useState<"silver" | "gold">("silver");
  const [diverCount, setDiverCount] = useState<number>(1); // Start with 1 since 1 diver is included
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate the price based on license type and additional divers
    const baseLicensePrice = licenseType === "silver" 
      ? PRICING.silverTeam.price 
      : PRICING.goldTeam.price;
    
    // Calculate additional divers (subtract 1 for the included diver)
    const additionalDivers = Math.max(0, diverCount - 1);
    const additionalDiversPrice = additionalDivers * PRICING.additionalDiver.price;
    
    const total = baseLicensePrice + additionalDiversPrice;
    setCalculatedPrice(total);
  }, [licenseType, diverCount]);

  const handleDiverDecrease = () => {
    if (diverCount > 1) setDiverCount(diverCount - 1);
  };

  const handleDiverIncrease = () => {
    setDiverCount(diverCount + 1);
  };

  // Ref for checkout section
  const checkoutRef = useRef<HTMLDivElement>(null);
  
  const handleBuyNow = () => {
    setShowCheckout(true);
    
    // Allow state to update before scrolling
    setTimeout(() => {
      if (checkoutRef.current) {
        checkoutRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  
  const handlePayment = () => {
    toast({
      title: "Thank you for your purchase!",
      description: "Processing your payment...",
    });
    
    // Simulate payment processing
    setTimeout(() => {
      setShowCelebration(true);
    }, 1000);
  };
  
  // Force navigation to onboarding page
  const handleCelebrationComplete = () => {
    // Create a direct HTML link and click it to ensure navigation works
    const link = document.createElement('a');
    link.href = '/onboarding';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Simple Annual Pricing for Teams That Want to Win"
          subtitle="Choose the plan that works best for your team's season, with transparent pricing and no hidden fees."
          centered
        />
        
        <div className="flex flex-col lg:flex-row gap-8 mt-12 max-w-6xl mx-auto">
          <div className="w-full lg:w-1/3">
            <PricingCard
              name={PRICING.silverTeam.name}
              price={PRICING.silverTeam.price}
              features={PRICING.silverTeam.features}
              isPrimary={licenseType === "silver"}
              buttonText="Perfect for single teams"
              className="h-full"
              buttonAction={() => setLicenseType("silver")}
            />
          </div>
          
          <div className="w-full lg:w-1/3">
            <PricingCard
              name={PRICING.goldTeam.name}
              price={PRICING.goldTeam.price}
              features={PRICING.goldTeam.features}
              isPrimary={licenseType === "gold"}
              buttonText="For championship hosts"
              className="h-full"
              buttonAction={() => setLicenseType("gold")}
            />
          </div>
          
          <div className="w-full lg:w-1/3">
            <Card className="h-full shadow-lg border-primary/20 bg-[#0B1120] text-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Calculate Your Season Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-lg block">License Type</Label>
                    <RadioGroup 
                      value={licenseType} 
                      onValueChange={(value) => setLicenseType(value as "silver" | "gold")}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer ${licenseType === "silver" ? "border-primary bg-primary/10" : "border-[#2D3748]"}`}
                        onClick={() => setLicenseType("silver")}
                      >
                        <RadioGroupItem value="silver" id="silver" className="text-primary" />
                        <Label htmlFor="silver" className="cursor-pointer">Silver</Label>
                      </div>
                      
                      <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer ${licenseType === "gold" ? "border-primary bg-primary/10" : "border-[#2D3748]"}`}
                        onClick={() => setLicenseType("gold")}
                      >
                        <RadioGroupItem value="gold" id="gold" className="text-primary" />
                        <Label htmlFor="gold" className="cursor-pointer">Gold</Label>
                      </div>
                    </RadioGroup>
                    
                    <div className="text-right text-[#8A9BA8]">
                      {licenseType === "silver" 
                        ? `Silver: $${PRICING.silverTeam.price}/season` 
                        : `Gold: $${PRICING.goldTeam.price}/season`}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg">
                        How many divers?
                        <span className="block text-xs text-[#8A9BA8] mt-1 font-normal">
                          First diver included in license
                        </span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleDiverDecrease} 
                          disabled={diverCount <= 1}
                          className="h-8 w-8 rounded-full border-primary/50 text-primary"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <Input 
                          type="number" 
                          value={diverCount} 
                          onChange={(e) => setDiverCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-center border-primary/20 bg-[#0E141E]"
                          min={1}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleDiverIncrease}
                          className="h-8 w-8 rounded-full border-primary/50 text-primary"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {diverCount > 1 && (
                      <div className="text-right text-[#8A9BA8]">
                        {diverCount - 1} additional {diverCount - 1 === 1 ? 'diver' : 'divers'} × ${PRICING.additionalDiver.price} = ${(diverCount - 1) * PRICING.additionalDiver.price}
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4 bg-primary/20" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Annual Season Cost</span>
                    <span className="text-2xl font-bold text-primary">${calculatedPrice}</span>
                  </div>
                  
                  <Button 
                    onClick={handleBuyNow} 
                    className="w-full bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none mt-4"
                    size="lg"
                  >
                    Buy Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto text-center">
          <div className="text-sm p-4 bg-[#131C2E] rounded-lg text-[#8A9BA8]">
            <p>Need to add another team in the future? You can add additional teams directly from the coaching portal after purchase.</p>
          </div>
        </div>
        
        <AnimatePresence>
          {showCheckout && (
            <motion.div 
              ref={checkoutRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 max-w-3xl mx-auto"
            >
              <Card className="shadow-lg border-primary/30 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#FF5CB3]/10 to-[#FF9CEE]/10">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> Checkout
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Annual Subscription Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{licenseType === "silver" ? "Silver" : "Gold"} Team License (Annual)</span>
                          <span>${licenseType === "silver" ? PRICING.silverTeam.price : PRICING.goldTeam.price}</span>
                        </div>
                        {diverCount > 1 && (
                          <div className="flex justify-between">
                            <span>{diverCount - 1} Additional Diver{diverCount - 1 > 1 ? 's' : ''} (Annual)</span>
                            <span>${(diverCount - 1) * PRICING.additionalDiver.price}</span>
                          </div>
                        )}
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Total Annual Cost</span>
                          <span>${calculatedPrice}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-4">
                      <Button variant="outline" onClick={() => setShowCheckout(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handlePayment}
                        className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
                      >
                        Finalize Purchase <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-16 max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <svg width="100" height="32" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M48.277 11.947C44.7417 11.947 41.8824 14.3953 41.8824 18.1055C41.8824 21.8157 44.7417 24.264 48.277 24.264C51.8123 24.264 54.6716 21.8157 54.6716 18.1055C54.6716 14.3953 51.8123 11.947 48.277 11.947ZM48.277 21.4834C46.326 21.4834 44.9558 20.0376 44.9558 18.1055C44.9558 16.1735 46.326 14.7276 48.277 14.7276C50.228 14.7276 51.5982 16.1735 51.5982 18.1055C51.5982 20.0376 50.228 21.4834 48.277 21.4834ZM38.9492 12.539H35.9496V8.73852H32.8761V12.539H30.6631V15.1967H32.8761V20.3516C32.8761 22.7407 34.4856 24.264 36.9093 24.264C37.8251 24.264 38.5233 24.0708 38.9492 23.8777L38.2511 21.3878C38.0335 21.4834 37.6076 21.5789 37.1817 21.5789C36.3358 21.5789 35.9496 21.1072 35.9496 20.2593V15.1967H38.9492V12.539ZM67.2583 11.947C65.7965 11.947 64.7331 12.7078 64.0766 13.8396L63.9645 12.1693H61.1052V29.6549H64.1789V22.7407C64.8554 23.6842 65.9189 24.3513 67.3702 24.3513C70.0435 24.3513 72.6047 22.2619 72.6047 18.1439C72.6047 14.026 70.0653 11.947 67.2583 11.947ZM66.4124 21.4834C64.8344 21.4834 64.1359 20.1932 64.1359 18.1247C64.1359 16.0562 64.8344 14.7661 66.4124 14.7661C67.9904 14.7661 68.7313 16.0562 68.7313 18.1247C68.7313 20.1932 67.9904 21.4834 66.4124 21.4834ZM80.4501 14.8117C81.9761 14.8117 83.0395 15.9051 83.0825 17.4083H77.7983C77.9329 15.8669 79.0387 14.8117 80.4501 14.8117ZM86.2001 19.7566H82.9705C82.6908 20.8499 81.8019 21.5982 80.3474 21.5982C79.0387 21.5982 77.8897 20.7311 77.7767 19.006H86.3347V18.1981C86.3347 14.5299 84.0785 11.947 80.3904 11.947C76.7015 11.947 74.7242 14.5108 74.7242 18.1247C74.7242 21.7386 76.7015 24.264 80.4335 24.264C83.6333 24.264 85.7777 22.3129 86.2001 19.7566ZM24.517 19.2658C24.517 16.4844 26.2628 14.8715 28.6003 14.8715C30.916 14.8715 32.3059 16.408 32.3059 19.0636V23.8777H35.3794V18.5582C35.3794 14.5108 33.0852 11.947 29.5161 11.947C27.5604 11.947 25.9108 12.8905 25.0218 14.4511L24.8474 12.1693H22.0526V23.8777H25.126V19.2658H24.517ZM14.1996 17.4083C14.3342 15.8669 15.4399 14.8117 16.8514 14.8117C18.3774 14.8117 19.4408 15.9051 19.4838 17.4083H14.1996ZM22.6013 19.7566H19.3717C19.092 20.8499 18.2031 21.5982 16.7486 21.5982C15.4399 21.5982 14.291 20.7311 14.178 19.006H22.736V18.1981C22.736 14.5299 20.4798 11.947 16.7917 11.947C13.1028 11.947 11.1255 14.5108 11.1255 18.1247C11.1255 21.7386 13.1028 24.264 16.8347 24.264C20.0345 24.264 22.179 22.3129 22.6013 19.7566ZM59.5488 12.1693L57.2115 20.3899L54.8312 12.1693H51.5767L55.5508 23.8777H58.8722L62.8463 12.1693H59.5488Z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M9.51445 18.2108C9.51445 15.5107 11.0924 13.1985 13.3914 12.1052C12.2425 10.6019 10.4751 9.60675 8.4763 9.60675C5.12976 9.60675 2.41766 12.4731 2.41766 16.0371C2.41766 19.601 5.12976 22.4674 8.4763 22.4674C10.4967 22.4674 12.2856 21.4531 13.4345 19.9116C11.114 18.8182 9.51445 16.5252 9.51445 18.2108Z" fill="url(#paint0_linear_0_1)"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M13.3914 12.1052C14.5403 11.0119 16.0851 10.3832 17.7878 10.3832C21.1343 10.3832 23.8464 13.2496 23.8464 16.8135C23.8464 20.3774 21.1343 23.2439 17.7878 23.2439C16.0636 23.2439 14.5188 22.6152 13.3699 21.5027C12.221 20.3901 11.5013 18.4005 11.5013 16.8135C11.5013 15.2266 12.2425 13.1985 13.3914 12.1052Z" fill="url(#paint1_linear_0_1)"/>
              <defs>
                <linearGradient id="paint0_linear_0_1" x1="9.22237" y1="10.1169" x2="5.4017" y2="22.7178" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF5CB3"/>
                  <stop offset="1" stopColor="#FF9CEE"/>
                </linearGradient>
                <linearGradient id="paint1_linear_0_1" x1="19.8626" y1="8.89771" x2="11.4797" y2="26.8148" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF5CB3"/>
                  <stop offset="1" stopColor="#FF9CEE"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <p className="text-muted-foreground">
            All payments are securely processed by Stripe. We don't store any payment information on our servers.
          </p>
        </div>
        
        {/* The celebration animation */}
        {showCelebration && (
          <CelebrationAnimation
            title="Welcome to RipScore!"
            message="We're thrilled to have you join the team! Get ready for an amazing diving experience."
            buttonText="Continue to Onboarding"
            onComplete={handleCelebrationComplete}
            type="purchase"
          />
        )}
      </div>
    </section>
  );
}
