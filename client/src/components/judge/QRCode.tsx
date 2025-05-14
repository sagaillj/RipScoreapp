import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/SectionTitle";

interface QRCodeProps {
  meetId?: string;
}

export function QRCode({ meetId }: QRCodeProps) {
  const qrCodeUrl = meetId 
    ? `https://ripscore.app/judge/${meetId}` 
    : "https://ripscore.app/judge";

  // In a real implementation, we would generate a QR code image here
  // using a QR code generation library, but for this demo we'll use
  // a mock SVG that looks like a QR code.
  
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6 text-center">
        <SectionTitle 
          title="Scan to Judge"
          subtitle="Use your mobile device's camera to scan this QR code and start scoring."
          centered
          className="mb-6"
        />
        
        <div className="border-8 border-[#0B1120] inline-block p-4 bg-white rounded-xl mb-6">
          {/* Mock QR code */}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="white"/>
            {/* QR Code Layout */}
            <rect x="20" y="20" width="40" height="40" fill="#0B1120"/>
            <rect x="30" y="30" width="20" height="20" fill="white"/>
            
            <rect x="140" y="20" width="40" height="40" fill="#0B1120"/>
            <rect x="150" y="30" width="20" height="20" fill="white"/>
            
            <rect x="20" y="140" width="40" height="40" fill="#0B1120"/>
            <rect x="30" y="150" width="20" height="20" fill="white"/>
            
            <rect x="70" y="20" width="10" height="10" fill="#0B1120"/>
            <rect x="90" y="20" width="10" height="10" fill="#0B1120"/>
            <rect x="110" y="20" width="10" height="10" fill="#0B1120"/>
            
            <rect x="20" y="70" width="10" height="10" fill="#0B1120"/>
            <rect x="40" y="70" width="10" height="10" fill="#0B1120"/>
            <rect x="70" y="70" width="10" height="10" fill="#0B1120"/>
            <rect x="90" y="70" width="10" height="10" fill="#0B1120"/>
            <rect x="140" y="70" width="10" height="10" fill="#0B1120"/>
            <rect x="170" y="70" width="10" height="10" fill="#0B1120"/>
            
            <rect x="20" y="90" width="10" height="10" fill="#0B1120"/>
            <rect x="50" y="90" width="10" height="10" fill="#0B1120"/>
            <rect x="80" y="90" width="10" height="10" fill="#0B1120"/>
            <rect x="110" y="90" width="10" height="10" fill="#0B1120"/>
            <rect x="140" y="90" width="10" height="10" fill="#0B1120"/>
            <rect x="170" y="90" width="10" height="10" fill="#0B1120"/>
            
            <rect x="20" y="110" width="10" height="10" fill="#0B1120"/>
            <rect x="50" y="110" width="10" height="10" fill="#0B1120"/>
            <rect x="70" y="110" width="10" height="10" fill="#0B1120"/>
            <rect x="100" y="110" width="10" height="10" fill="#0B1120"/>
            <rect x="130" y="110" width="10" height="10" fill="#0B1120"/>
            <rect x="170" y="110" width="10" height="10" fill="#0B1120"/>
            
            <rect x="80" y="140" width="10" height="10" fill="#0B1120"/>
            <rect x="100" y="140" width="10" height="10" fill="#0B1120"/>
            <rect x="140" y="140" width="10" height="10" fill="#0B1120"/>
            <rect x="160" y="140" width="10" height="10" fill="#0B1120"/>
            
            <rect x="70" y="170" width="10" height="10" fill="#0B1120"/>
            <rect x="90" y="170" width="10" height="10" fill="#0B1120"/>
            <rect x="110" y="170" width="10" height="10" fill="#0B1120"/>
            <rect x="130" y="170" width="10" height="10" fill="#0B1120"/>
            <rect x="160" y="170" width="10" height="10" fill="#0B1120"/>
          </svg>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {meetId ? (
            <p>This QR code is specific to <strong>Meet ID: {meetId}</strong></p>
          ) : (
            <p>Scan to access the general judging interface.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
