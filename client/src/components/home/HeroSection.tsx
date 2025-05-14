import { Button } from "@/components/ui/Button";
import { Link } from "wouter";
import { ArrowRight, Check, Award, Users, Timer, BarChart, Medal, CalendarClock } from "lucide-react";
import { DemoVideoModal } from "./DemoVideoModal";

export function HeroSection() {
  return (
    <section className="relative bg-[#0B1120] text-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Gradient blobs for background effect */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#FF5CB3] rounded-full filter blur-[120px] opacity-10 -z-10"></div>
      <div className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-[#00F0FF] rounded-full filter blur-[100px] opacity-10 -z-10"></div>
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-[#FFB038] rounded-full filter blur-[120px] opacity-5 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-20">
          <div className="w-full md:w-1/2 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
              The <span className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] bg-clip-text text-transparent">All-in-One</span> Diving Platform
            </h1>
            <p className="text-lg md:text-xl text-[#8A9BA8] mb-8 max-w-xl">
              RipScore unifies meet management, judging, team tracking, dive progression, and achievement gamification in one powerful platform that helps coaches and divers achieve their best.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <Link href="/pricing">
                <Button 
                  size="xl" 
                  className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] text-white hover:opacity-90 border-none"
                >
                  View Pricing
                </Button>
              </Link>
              <DemoVideoModal videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ" />
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: Award, text: "NCAA compliant" },
                { icon: Users, text: "Team management" },
                { icon: Timer, text: "Real-time judging" },
                { icon: BarChart, text: "Performance analytics" },
                { icon: Medal, text: "Achievement badges" },
                { icon: CalendarClock, text: "Meet scheduling" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 bg-white/5 p-3 rounded-lg border border-[#FF5CB3]/10">
                  <item.icon className="h-4 w-4 text-[#FF9CEE]" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 animate-slide-right">
            <div className="relative bg-[#111B2E] rounded-xl overflow-hidden shadow-2xl border border-[#FF5CB3]/20">
              <div className="absolute top-0 left-0 right-0 h-10 bg-[#0D1625] flex items-center px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF3B30]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFB038]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#23D18B]"></div>
                </div>
              </div>
              
              {/* Dashboard UI preview */}
              <div className="pt-12 p-4">
                <div className="flex border-b border-white/10 pb-3">
                  <div className="bg-[#FF5CB3]/10 px-3 py-1.5 rounded-lg border-b-2 border-[#FF5CB3] text-[#FF9CEE] font-medium">Dashboard</div>
                  <div className="px-3 py-1.5 text-[#8A9BA8] font-medium ml-2">Meets</div>
                  <div className="px-3 py-1.5 text-[#8A9BA8] font-medium ml-2">Team</div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-sm text-[#8A9BA8]">Active Meets</div>
                    <div className="text-2xl font-bold mt-1">2</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-sm text-[#8A9BA8]">Team Members</div>
                    <div className="text-2xl font-bold mt-1">16</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-sm text-[#8A9BA8]">New Badges</div>
                    <div className="text-2xl font-bold mt-1">4</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">Upcoming Events</div>
                    <div className="text-xs text-[#FF9CEE]">View All</div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { name: "Spring Invitational", date: "May 10", status: "Live" },
                      { name: "Southwest Regional", date: "May 24", status: "Upcoming" }
                    ].map((event, index) => (
                      <div key={index} className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="font-medium">{event.name}</div>
                          <div className="text-xs text-[#8A9BA8]">{event.date}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          event.status === "Live" 
                            ? "bg-[#FF5CB3]/20 text-[#FF9CEE]" 
                            : "bg-[#00F0FF]/10 text-[#00F0FF]"
                        }`}>
                          {event.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="font-semibold mb-2">Team Performance</div>
                  <div className="w-full h-24 bg-gradient-radial from-[#FF5CB3]/5 to-transparent rounded-lg flex items-end p-2">
                    {[40, 65, 50, 80, 75, 60, 90].map((height, index) => (
                      <div key={index} className="flex-1 mx-0.5">
                        <div 
                          className="bg-gradient-to-t from-[#FF5CB3] to-[#FF9CEE] rounded-sm" 
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
