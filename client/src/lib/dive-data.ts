// Types for dive data
export interface DiveDetails {
  code: string;            // The dive code (e.g., "101A")
  name: string;            // Full name of the dive
  group: DiveGroup;        // Which group the dive belongs to
  somersaults: number;     // Number of somersaults
  twists: number;          // Number of twists
  position: DivePosition;  // Body position
  difficulty: {            // Degree of difficulty values
    oneMeter: number | null;
    threeMeter: number | null;
  };
  description?: string;    // Optional additional description
}

export enum DiveGroup {
  Forward = "Forward",
  Back = "Back",
  Reverse = "Reverse",
  Inward = "Inward",
  Twisting = "Twisting"
}

export enum DivePosition {
  Straight = "A",
  Pike = "B",
  Tuck = "C",
  Free = "D"
}

// Sample of dives from the DD sheet
export const diveData: DiveDetails[] = [
  // Forward Group
  {
    code: "101A",
    name: "Forward Dive Straight",
    group: DiveGroup.Forward,
    somersaults: 0.5,
    twists: 0,
    position: DivePosition.Straight,
    difficulty: {
      oneMeter: 1.4,
      threeMeter: 1.6
    }
  },
  {
    code: "101B",
    name: "Forward Dive Pike",
    group: DiveGroup.Forward,
    somersaults: 0.5,
    twists: 0,
    position: DivePosition.Pike,
    difficulty: {
      oneMeter: 1.3,
      threeMeter: 1.5
    }
  },
  {
    code: "101C",
    name: "Forward Dive Tuck",
    group: DiveGroup.Forward,
    somersaults: 0.5,
    twists: 0,
    position: DivePosition.Tuck,
    difficulty: {
      oneMeter: 1.2,
      threeMeter: 1.4
    }
  },
  {
    code: "102A",
    name: "Forward 1 Somersault Straight",
    group: DiveGroup.Forward,
    somersaults: 1,
    twists: 0,
    position: DivePosition.Straight,
    difficulty: {
      oneMeter: 1.6,
      threeMeter: 1.7
    }
  },
  {
    code: "102B",
    name: "Forward 1 Somersault Pike",
    group: DiveGroup.Forward,
    somersaults: 1,
    twists: 0,
    position: DivePosition.Pike,
    difficulty: {
      oneMeter: 1.5,
      threeMeter: 1.6
    }
  },
  {
    code: "102C",
    name: "Forward 1 Somersault Tuck",
    group: DiveGroup.Forward,
    somersaults: 1,
    twists: 0,
    position: DivePosition.Tuck,
    difficulty: {
      oneMeter: 1.4,
      threeMeter: 1.5
    }
  },
  {
    code: "103A",
    name: "Forward 1½ Somersaults Straight",
    group: DiveGroup.Forward,
    somersaults: 1.5,
    twists: 0,
    position: DivePosition.Straight,
    difficulty: {
      oneMeter: 2.0,
      threeMeter: 1.9
    }
  },
  {
    code: "103B",
    name: "Forward 1½ Somersaults Pike",
    group: DiveGroup.Forward,
    somersaults: 1.5,
    twists: 0,
    position: DivePosition.Pike,
    difficulty: {
      oneMeter: 1.7,
      threeMeter: 1.6
    }
  },
  
  // Back Group
  {
    code: "201A",
    name: "Back Dive Straight",
    group: DiveGroup.Back,
    somersaults: 0.5,
    twists: 0,
    position: DivePosition.Straight,
    difficulty: {
      oneMeter: 1.7,
      threeMeter: 1.9
    }
  },
  {
    code: "201B",
    name: "Back Dive Pike",
    group: DiveGroup.Back,
    somersaults: 0.5,
    twists: 0,
    position: DivePosition.Pike,
    difficulty: {
      oneMeter: 1.6,
      threeMeter: 1.8
    }
  },
  {
    code: "201C",
    name: "Back Dive Tuck",
    group: DiveGroup.Back,
    somersaults: 0.5,
    twists: 0,
    position: DivePosition.Tuck,
    difficulty: {
      oneMeter: 1.5,
      threeMeter: 1.7
    }
  },
  
  // Reverse Group
  {
    code: "301A",
    name: "Reverse Dive Straight",
    group: DiveGroup.Reverse,
    somersaults: 0.5,
    twists: 0,
    position: DivePosition.Straight,
    difficulty: {
      oneMeter: 1.8,
      threeMeter: 2.0
    }
  },
  {
    code: "301B",
    name: "Reverse Dive Pike",
    group: DiveGroup.Reverse,
    somersaults: 0.5,
    twists: 0,
    position: DivePosition.Pike,
    difficulty: {
      oneMeter: 1.7,
      threeMeter: 1.9
    }
  },
  
  // Inward Group
  {
    code: "401A",
    name: "Inward Dive Straight",
    group: DiveGroup.Inward,
    somersaults: 0.5,
    twists: 0,
    position: DivePosition.Straight,
    difficulty: {
      oneMeter: 1.8,
      threeMeter: 1.7
    }
  },
  {
    code: "401B",
    name: "Inward Dive Pike",
    group: DiveGroup.Inward,
    somersaults: 0.5,
    twists: 0,
    position: DivePosition.Pike,
    difficulty: {
      oneMeter: 1.5,
      threeMeter: 1.4
    }
  },
  
  // Twisting Group
  {
    code: "5121D",
    name: "Forward 1 Somersault ½ Twist Free",
    group: DiveGroup.Twisting,
    somersaults: 1,
    twists: 0.5,
    position: DivePosition.Free,
    difficulty: {
      oneMeter: 1.7,
      threeMeter: 1.8
    }
  },
  {
    code: "5122D",
    name: "Forward 1 Somersault 1 Twist Free",
    group: DiveGroup.Twisting,
    somersaults: 1,
    twists: 1,
    position: DivePosition.Free,
    difficulty: {
      oneMeter: 1.9,
      threeMeter: 2.0
    }
  },
];

// Helper functions to work with dive data
export function getDivesByGroup(group: DiveGroup): DiveDetails[] {
  return diveData.filter(dive => dive.group === group);
}

export function getDiveByCode(code: string): DiveDetails | undefined {
  return diveData.find(dive => dive.code === code);
}

export function getDifficultyForDive(code: string, isThreeMeter: boolean = false): number | null {
  const dive = getDiveByCode(code);
  if (!dive) return null;
  return isThreeMeter ? dive.difficulty.threeMeter : dive.difficulty.oneMeter;
}

// Calculate positions for dive constellation based on dive properties
export function calculateDivePosition(dive: DiveDetails, index: number, total: number): { x: number, y: number } {
  // Map dive groups to different sectors of the circle
  const groupAngleMap = {
    [DiveGroup.Forward]: 0,
    [DiveGroup.Back]: Math.PI * 0.4,
    [DiveGroup.Reverse]: Math.PI * 0.8,
    [DiveGroup.Inward]: Math.PI * 1.2,
    [DiveGroup.Twisting]: Math.PI * 1.6
  };
  
  // Get base angle from group
  let baseAngle = groupAngleMap[dive.group];
  
  // Modify angle based on somersaults and twists
  const somersaultsOffset = dive.somersaults * 0.1;
  const twistsOffset = dive.twists * 0.05;
  
  // Calculate radius based on difficulty
  const baseDifficulty = dive.difficulty.oneMeter || dive.difficulty.threeMeter || 1.0;
  const normalizedDifficulty = Math.min(Math.max(baseDifficulty, 1.0), 3.5);
  const radius = 30 + (normalizedDifficulty - 1.0) * 25; // Scale radius by difficulty
  
  // Calculate the angle for this specific dive
  const angle = baseAngle + somersaultsOffset + twistsOffset;
  
  // Return position
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle)
  };
}