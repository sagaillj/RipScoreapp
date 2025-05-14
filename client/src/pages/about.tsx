import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TeamCard } from "@/components/about/TeamCard";
import { TEAM_MEMBERS } from "@/lib/constants";
import { Helmet } from "react-helmet";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us - RipScore.app</title>
        <meta name="description" content="Learn about the team behind RipScore, our mission, and how we're transforming diving competitions with modern technology." />
      </Helmet>
      
      <PageWrapper>
        {/* Hero Section */}
        <section className="bg-[#0B1120] text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                About <span className="text-[#00F0FF]">RipScore</span>
              </h1>
              <p className="text-lg text-[#8A9BA8] animate-slide-up">
                We're a team of diving enthusiasts and technology experts on a mission to revolutionize how diving competitions are managed, scored, and experienced.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <SectionTitle 
                title="Our Story"
                centered
              />
              
              <div className="prose prose-lg dark:prose-invert mx-auto">
                <p>
                  RipScore began when Alex Rivera, a former Olympic diver and experienced coach, identified a persistent problem in diving competitions: outdated scoring methods that led to delays, errors, and frustration.
                </p>
                <p>
                  Partnering with software engineer Sam Patel, they began building what would become the most intuitive and comprehensive diving meet management platform available today.
                </p>
                <p>
                  Launched in 2020, RipScore has quickly become the go-to solution for diving teams across the country, from small clubs to major collegiate programs.
                </p>
                <p>
                  Our platform has been used in over
                  <span className="font-bold text-primary"> 500 competitions </span>
                  and has processed more than
                  <span className="font-bold text-primary"> 50,000 dives</span>.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission & Values */}
        <section className="py-16 md:py-24 bg-mist dark:bg-[#111B2E]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <SectionTitle 
                  title="Our Mission"
                  className="text-left"
                />
                <div className="prose dark:prose-invert">
                  <p>
                    To empower diving teams with technology that enhances the competition experience, promotes fair judging, and helps athletes reach their full potential.
                  </p>
                  <p>
                    We believe that by streamlining the technical aspects of meet management, coaches can focus more on what matters most: developing great divers.
                  </p>
                </div>
              </div>
              
              <div>
                <SectionTitle 
                  title="Our Values"
                  className="text-left"
                />
                <ul className="space-y-4">
                  {[
                    {
                      title: "Excellence",
                      description: "We hold ourselves to the same high standards that divers strive for in competition."
                    },
                    {
                      title: "Innovation",
                      description: "We continuously improve our platform to meet the evolving needs of the diving community."
                    },
                    {
                      title: "Integrity",
                      description: "We believe in fair competition and transparent scoring systems."
                    },
                    {
                      title: "Community",
                      description: "We support the growth of diving as a sport at all levels of competition."
                    }
                  ].map((value, i) => (
                    <li key={i} className="bg-background rounded-lg p-4 shadow-sm border">
                      <h3 className="font-bold text-lg mb-1">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <SectionTitle 
              title="Meet Our Team"
              subtitle="The passionate people behind RipScore who are dedicated to transforming diving competitions."
              centered
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {TEAM_MEMBERS.map((member, index) => (
                <TeamCard
                  key={index}
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
