import { PageWrapper } from "@/components/layout/PageWrapper";
import { QRCode } from "@/components/judge/QRCode";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Link } from "wouter";
import { Helmet } from "react-helmet";

export default function Judge() {
  return (
    <>
      <Helmet>
        <title>Judge Score Pad - RipScore.app</title>
        <meta name="description" content="Access the RipScore judging platform to score diving competitions in real-time. Scan the QR code to begin." />
      </Helmet>
      
      <PageWrapper>
        {/* Hero Section */}
        <section className="bg-[#0B1120] text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                Judge <span className="text-[#00F0FF]">Score Pad</span>
              </h1>
              <p className="text-lg text-[#8A9BA8] animate-slide-up">
                Scan the QR code with your mobile device to access the judging interface.
              </p>
            </div>
          </div>
        </section>
        
        {/* QR Code Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <QRCode />
          </div>
        </section>
        
        {/* Login Option */}
        <section className="py-16 md:py-24 bg-mist dark:bg-[#111B2E]">
          <div className="container mx-auto px-4">
            <SectionTitle
              title="Judge Profile Login"
              subtitle="Already have a judge profile? Sign in to access your judging history and upcoming meets."
              centered
            />
            
            <div className="flex justify-center mt-8">
              <Link href="/login">
                <Button size="lg">
                  Sign In to Judge Profile
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Information Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <SectionTitle
                title="How Judging Works"
                subtitle="A brief guide to using the RipScore judging system"
                centered
              />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Scan QR Code",
                    description: "Use your mobile device to scan the meet-specific QR code."
                  },
                  {
                    step: "2",
                    title: "Enter Score",
                    description: "Input your score from 0-10 for each dive as it's performed."
                  },
                  {
                    step: "3",
                    title: "Submit",
                    description: "Tap submit to instantly send your score to the leaderboard."
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-mist dark:bg-[#111B2E] rounded-xl p-6 text-center">
                    <div className="bg-[#0B1120] text-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 p-6 bg-background rounded-lg border shadow-sm">
                <h3 className="text-xl font-bold mb-4">Judge Guidelines</h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Score Range:</span> Scores typically range from 0-10 in 0.5 increments.
                  </p>
                  <p>
                    <span className="font-medium">Criteria:</span> Evaluate approach, takeoff, execution, and entry.
                  </p>
                  <p>
                    <span className="font-medium">Technical Issues:</span> If you experience any technical difficulties, please alert the meet director immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
