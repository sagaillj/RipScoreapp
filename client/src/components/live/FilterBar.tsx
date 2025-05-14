import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MOCK_MEETS, MOCK_TEAMS } from "@/lib/constants";
import { Search } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filters: {
    meet: string;
    team: string;
    search: string;
  }) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [meet, setMeet] = useState("all");
  const [team, setTeam] = useState("all");
  const [search, setSearch] = useState("");

  const handleMeetChange = (value: string) => {
    setMeet(value);
    // Only pass the value if it's not 'all' (our new default value)
    onFilterChange({ 
      meet: value === 'all' ? '' : value, 
      team: team === 'all' ? '' : team, 
      search 
    });
  };

  const handleTeamChange = (value: string) => {
    setTeam(value);
    // Only pass the value if it's not 'all' (our new default value)
    onFilterChange({ 
      meet: meet === 'all' ? '' : meet, 
      team: value === 'all' ? '' : value, 
      search 
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ 
      meet: meet === 'all' ? '' : meet, 
      team: team === 'all' ? '' : team, 
      search: e.target.value 
    });
  };

  return (
    <div className="bg-background rounded-lg p-4 shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Select Meet</label>
          <Select value={meet} onValueChange={handleMeetChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Meets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meets</SelectItem>
              {MOCK_MEETS.map((meet) => (
                <SelectItem key={meet.id} value={meet.id}>
                  {meet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Select Team</label>
          <Select value={team} onValueChange={handleTeamChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {MOCK_TEAMS.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Search Divers</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name..." 
              value={search}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
