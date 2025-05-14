import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Link } from "wouter";

export function LivePreview() {
  return (
    <section className="py-16 md:py-24 bg-mist dark:bg-[#111B2E]">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="See RipScore in Action"
          subtitle="Experience how our platform provides real-time scoring and comprehensive dive meet management."
          centered
        />
        
        <div className="mt-12 max-w-5xl mx-auto bg-background rounded-xl overflow-hidden shadow-lg border">
          <div className="p-4 bg-[#0B1120] text-white flex justify-between items-center">
            <div className="font-medium">Summer Championship 2023 - Finals</div>
            <div className="text-sm px-3 py-1 bg-[#FFB038] text-[#0B1120] rounded-full font-medium">LIVE</div>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Diver</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Dive</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {[
                    { rank: 1, name: "Taylor Brown", team: "Sharks", lastDive: "8.5, 8.0, 8.5", total: "445.75" },
                    { rank: 2, name: "Jordan Lee", team: "Sharks", lastDive: "8.0, 8.0, 7.5", total: "432.65" },
                    { rank: 3, name: "Jamie Smith", team: "Dolphins", lastDive: "7.5, 8.0, 7.5", total: "423.55" },
                    { rank: 4, name: "Cam Martinez", team: "Sharks", lastDive: "7.0, 7.5, 7.5", total: "417.95" },
                    { rank: 5, name: "Casey Johnson", team: "Barracudas", lastDive: "7.5, 7.0, 7.0", total: "411.20" },
                  ].map((diver, i) => (
                    <tr key={i} className={i === 0 ? "bg-primary/5" : ""}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        {i === 0 ? (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white font-bold">
                            {diver.rank}
                          </span>
                        ) : (
                          <span>{diver.rank}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{diver.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">{diver.team}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">{diver.lastDive}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold">
                        {i === 0 ? (
                          <span className="text-primary">{diver.total}</span>
                        ) : (
                          <span>{diver.total}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-center mt-8">
              <Link href="/live">
                <Button size="lg" className="animate-fade-in">
                  View Full Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
