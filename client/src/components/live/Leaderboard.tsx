import { useState, useEffect } from "react";
import { FilterBar } from "./FilterBar";
import { MOCK_DIVERS } from "@/lib/constants";
import { useTheme } from "@/lib/theme";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Trophy, Medal } from "lucide-react";

interface Diver {
  id: number;
  name: string;
  team: string;
  age: number;
  totalScore: number;
}

export function Leaderboard() {
  const { isDarkMode } = useTheme();
  const [divers, setDivers] = useState<Diver[]>(MOCK_DIVERS);
  const [filteredDivers, setFilteredDivers] = useState<Diver[]>(MOCK_DIVERS);

  useEffect(() => {
    // Sort divers by total score (highest first)
    setDivers([...MOCK_DIVERS].sort((a, b) => b.totalScore - a.totalScore));
    setFilteredDivers([...MOCK_DIVERS].sort((a, b) => b.totalScore - a.totalScore));
  }, []);

  const handleFilterChange = (filters: {
    meet: string;
    team: string;
    search: string;
  }) => {
    let filtered = [...divers];
    
    // Apply team filter if selected
    if (filters.team) {
      filtered = filtered.filter((diver) => 
        diver.team.toLowerCase() === filters.team.toLowerCase()
      );
    }
    
    // Apply search filter if provided
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((diver) => 
        diver.name.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredDivers(filtered);
  };

  const getMedalColor = (position: number) => {
    if (position === 0) return "text-yellow-400"; // Gold
    if (position === 1) return "text-slate-300"; // Silver
    if (position === 2) return "text-amber-600"; // Bronze
    return "";
  };

  const getMedalIcon = (position: number) => {
    if (position <= 2) {
      return <Medal className={`h-5 w-5 ${getMedalColor(position)}`} />;
    }
    return position + 1;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Live Meet Results</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">
            {isDarkMode ? "Dark" : "Light"} Mode
          </span>
          <ThemeToggle />
        </div>
      </div>
      
      <FilterBar onFilterChange={handleFilterChange} />
      
      <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
        <div className="bg-[#0B1120] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#FFB038]" />
            <h3 className="font-medium">Leaderboard</h3>
          </div>
          <div className="text-sm px-3 py-1 bg-[#FFB038] text-[#0B1120] rounded-full font-medium">
            LIVE
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Diver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDivers.map((diver, index) => (
                <tr 
                  key={diver.id} 
                  className={
                    index === 0 
                      ? "bg-primary/5 border-b" 
                      : "border-b hover:bg-muted/50"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center h-7 w-7">
                      {getMedalIcon(index)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {diver.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {diver.team}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {diver.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                    <span className={index === 0 ? "text-primary" : ""}>
                      {diver.totalScore.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
              
              {filteredDivers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    No divers found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
