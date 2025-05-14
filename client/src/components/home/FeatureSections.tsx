import { Button } from "@/components/ui/Button";
import { FEATURE_SECTIONS } from "@/lib/constants";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export function FeatureSections() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="space-y-32">
          {FEATURE_SECTIONS.map((section, index) => (
            <div 
              key={section.id}
              className={cn(
                "flex flex-col md:flex-row items-center gap-8 md:gap-16",
                section.reversed && "md:flex-row-reverse"
              )}
            >
              {/* Feature content */}
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.title}</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {section.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  {section.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start">
                      <div className="shrink-0 h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center mt-1 mr-3">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <p className="text-muted-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
                
                <Link href="/pricing">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    {section.cta}
                  </Button>
                </Link>
              </div>
              
              {/* Feature image/visualization */}
              <div className="w-full md:w-1/2">
                <div className="bg-[#111B2E] rounded-xl overflow-hidden shadow-xl border border-primary/10 max-w-xl mx-auto">
                  <div className="h-8 bg-[#0D1625] flex items-center px-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF3B30]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FFB038]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#23D18B]"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    {/* We'd typically use an actual image here */}
                    <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 animate-pulse flex items-center justify-center">
                      <div className="text-sm text-muted-foreground">
                        {section.id === "scoring" ? (
                          <div className="w-full h-full flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b border-gray-800">
                              <span className="font-bold">Front 2.5 Pike (105B)</span>
                              <span className="text-primary">DD: 2.4</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2 p-4">
                              {[7.5, 8.0, 7.5, 8.0, 7.5].map((score, i) => (
                                <div key={i} className="bg-gray-800 rounded p-2 flex items-center justify-center">
                                  <span className="text-lg font-bold">{score}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-auto p-4 border-t border-gray-800 flex justify-between items-center">
                              <span>Total Score:</span>
                              <span className="text-xl font-bold text-primary">55.20</span>
                            </div>
                          </div>
                        ) : section.id === "team-management" ? (
                          <div className="w-full h-full flex flex-col">
                            <div className="grid grid-cols-2 gap-4 p-4">
                              <div className="bg-gray-800 rounded p-3">
                                <div className="font-bold mb-2">Team Attendance</div>
                                <div className="w-full bg-gray-700 h-2 rounded">
                                  <div className="bg-primary h-full rounded" style={{ width: "85%" }}></div>
                                </div>
                                <div className="text-xs mt-1">85% this month</div>
                              </div>
                              <div className="bg-gray-800 rounded p-3">
                                <div className="font-bold mb-2">Mood Tracker</div>
                                <div className="flex justify-between">
                                  {["😀", "😊", "😐", "😔", "😣"].map((emoji, i) => (
                                    <div key={i} className={`text-xl ${i === 1 ? "border-b-2 border-primary" : ""}`}>{emoji}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 p-4">
                              <div className="mb-2 font-bold">Recent Achievements</div>
                              <div className="flex space-x-2">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">🏆</div>
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">🎯</div>
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">⭐</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col">
                            <div className="font-bold p-4 border-b border-gray-800">Spring Invitational 2025</div>
                            <div className="p-4">
                              <div className="mb-4">
                                <div className="flex justify-between">
                                  <span>Event Status:</span>
                                  <span className="text-green-500">Active</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Teams:</span>
                                  <span>12</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Divers:</span>
                                  <span>48</span>
                                </div>
                              </div>
                              <div className="bg-gray-800 rounded p-3 mb-3">
                                <div className="flex justify-between">
                                  <span>Current Event:</span>
                                  <span>Girls 1m Finals</span>
                                </div>
                                <div className="mt-2 flex justify-between text-xs">
                                  <span>Progress:</span>
                                  <span>3/8 completed</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2 rounded mt-1">
                                  <div className="bg-primary h-full rounded" style={{ width: "37.5%" }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}