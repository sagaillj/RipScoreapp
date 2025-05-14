import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Helmet } from "react-helmet";

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us - RipScore.app</title>
        <meta name="description" content="Get in touch with the RipScore team. We're here to answer your questions about our diving meet management platform." />
      </Helmet>
      
      <PageWrapper>
        {/* Hero Section */}
        <section className="bg-[#0B1120] text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                Get In <span className="text-[#00F0FF]">Touch</span>
              </h1>
              <p className="text-lg text-[#8A9BA8] animate-slide-up">
                Have questions about RipScore? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <SectionTitle 
                  title="Contact Information"
                  subtitle="Find us using the information below, or send us a message using the form."
                  className="text-left"
                />
                
                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Our Location</h3>
                      <p className="text-muted-foreground">
                        1234 Dive Way, Suite 300<br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Phone</h3>
                      <p className="text-muted-foreground">
                        (555) 123-4567
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        hello@ripscore.app
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9am - 6pm PST<br />
                        Saturday - Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Map */}
                <div className="mt-10 bg-mist dark:bg-[#111B2E] h-64 rounded-lg overflow-hidden border relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#0B1120]/20"></div>
                  <div className="text-center z-10">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 text-primary">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-sm">Interactive map would appear here</p>
                  </div>
                </div>
              </div>
              
              <div>
                <SectionTitle 
                  title="Send Us a Message"
                  subtitle="Fill out the form below and we'll get back to you as soon as possible."
                  className="text-left"
                />
                
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Teaser */}
        <section className="py-16 md:py-24 bg-mist dark:bg-[#111B2E]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <SectionTitle 
                title="Frequently Asked Questions"
                subtitle="Can't find what you're looking for? Check our FAQ section for quick answers to common questions."
                centered
              />
              
              <div className="mt-8 p-6 bg-background rounded-lg border shadow-sm">
                <div className="space-y-4">
                  {[
                    {
                      question: "How quickly will I receive a response?",
                      answer: "We strive to respond to all inquiries within 24 business hours."
                    },
                    {
                      question: "Do you offer demos for teams?",
                      answer: "Yes! We offer personalized demos for teams interested in RipScore. Contact us to schedule one."
                    },
                    {
                      question: "Is technical support included with all plans?",
                      answer: "All plans include email support. Our team license includes priority support via phone and email."
                    }
                  ].map((item, i) => (
                    <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <h3 className="font-bold mb-2">{item.question}</h3>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
