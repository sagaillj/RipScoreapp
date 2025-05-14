// Application constants

// Navigation items
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Meets", href: "/meets" },
];

// Features for home page
export const FEATURES = [
  {
    title: "Smart Scoring System",
    description: "Accurately calculate and display dive scores in real-time with automatic DD calculation and instant results tabulation.",
    icon: "Calculator",
    color: "from-[#FF5CB3] to-[#FF9CEE]"
  },
  {
    title: "Mobile Judge Interface",
    description: "Judges score from any device by scanning a QR code. No app installation needed - just open and score.",
    icon: "Smartphone",
    color: "from-[#00F0FF] to-[#00BBE0]"
  },
  {
    title: "Meet Management",
    description: "Organize competitions with automated scheduling, participant registration, and comprehensive event oversight.",
    icon: "CalendarClock",
    color: "from-[#FFB038] to-[#FF8A3D]" 
  },
  {
    title: "Team Management",
    description: "Manage your diving squad, track member progress, and coordinate team activities all in one place.",
    icon: "Users",
    color: "from-[#23D18B] to-[#00B377]"
  },
  {
    title: "Interactive Analytics",
    description: "Visualize performance trends and identify areas for improvement with comprehensive data visualizations.",
    icon: "LineChart",
    color: "from-[#8B5CF6] to-[#6D28D9]"
  },
  {
    title: "Achievement Badges",
    description: "Motivate divers with gamified recognition. Earn badges for milestones, consistent training, and competition success.",
    icon: "Medal",
    color: "from-[#F43F5E] to-[#E11D48]"
  }
];

// Feature sections with more detail
export const FEATURE_SECTIONS = [
  {
    id: "scoring",
    title: "Your Complete Diving Command Center",
    description: "Say goodbye to fragmented tools and hello to the comprehensive diving hub that connects every aspect of your program in one unified system.",
    image: "/assets/scoring-screenshot.png",
    features: [
      "All-in-one platform eliminates the need for multiple separate tools",
      "Everything synchronized in real-time across coaches, divers, and judges",
      "Seamless progression from practice tracking to competition performance",
      "Integrated analytics that connect training outcomes to meet results"
    ],
    cta: "Unify your diving program"
  },
  {
    id: "team-management",
    title: "Motivate with Gamification",
    description: "Transform diving progress into an engaging journey with collectible achievements, visual progression paths, and milestone celebrations.",
    image: "/assets/team-management.png",
    features: [
      "Interactive dive constellation maps showing progression pathways",
      "Collectible achievement badges with rarity levels for motivation",
      "Visual celebration animations when unlocking new diving skills",
      "Team-based challenges and goals to foster friendly competition"
    ],
    cta: "Boost engagement and results",
    reversed: true
  },
  {
    id: "meet-running",
    title: "Streamlined Efficiency at Every Level",
    description: "From daily practice tracking to championship meet management, RipScore handles everything with speed, reliability, and professional polish.",
    image: "/assets/meet-running.png",
    features: [
      "Lightning-fast setup for practices, scrimmages, and official meets",
      "Automated workflows reduce administrative overhead by up to 80%",
      "Real-time visibility for coaches, divers, parents, and spectators",
      "Comprehensive data retention with powerful search and filtering"
    ],
    cta: "Experience next-level efficiency"
  }
];

// FAQ items for pricing page
export const FAQ_ITEMS = [
  {
    question: "How does the team license work?",
    answer: "The base team license covers your core team and coaching staff. You can add additional divers as needed with our per-diver pricing."
  },
  {
    question: "Is there a limit to how many meets I can manage?",
    answer: "No, your license includes unlimited meets throughout the year. Run as many competitions as your team requires."
  },
  {
    question: "Can judges use their own devices?",
    answer: "Yes! Judges can scan a QR code to access the scoring interface from any smartphone or tablet. No app installation required."
  },
  {
    question: "Do you offer discounts for schools or non-profit organizations?",
    answer: "We offer special pricing for educational institutions and non-profit diving organizations. Contact us for details."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 30-day free trial so you can experience the full RipScore platform before committing."
  }
];

// Mock team members for about page
export const TEAM_MEMBERS = [
  {
    name: "Alex Rivera",
    role: "Founder & Head Coach",
    bio: "Former Olympic diver with 15+ years of coaching experience."
  },
  {
    name: "Sam Patel",
    role: "Lead Developer",
    bio: "Software engineer and diving enthusiast behind RipScore's technology."
  },
  {
    name: "Jordan Chen",
    role: "UX Designer",
    bio: "Creating intuitive experiences for coaches, judges, and athletes."
  },
  {
    name: "Morgan Williams",
    role: "Customer Success",
    bio: "Ensuring teams get the most out of their RipScore experience."
  }
];

// Pricing tiers
export const PRICING = {
  silverTeam: {
    name: "Silver Team License",
    price: 499,
    features: [
      "1 diver included",
      "Single team management", 
      "Unlimited competitions",
      "Real-time judging",
      "Coach dashboard access",
      "Score history & analytics",
      "Mobile QR code judging",
      "Live results for spectators",
      "Email support",
      "Annual subscription"
    ]
  },
  goldTeam: {
    name: "Gold Team License",
    price: 999,
    features: [
      "1 diver included",
      "Championship meets with multiple teams",
      "Advanced analytics", 
      "Unlimited competitions",
      "Premium support",
      "Real-time judging",
      "Coach dashboard access",
      "Mobile QR code judging",
      "Live results for spectators",
      "Annual subscription"
    ]
  },
  additionalDiver: {
    name: "Additional Diver",
    price: 99,
    features: [
      "Add to any team license",
      "Personal performance tracking",
      "Historical dive analysis",
      "Progress visualization",
      "Unlimited competitions",
      "Mobile access",
      "Parent/guardian access",
      "Season statistics",
      "Annual subscription"
    ]
  }
};

// Mock meet data for live results page
export const MOCK_MEETS = [
  { id: "spring-invitational", name: "Spring Invitational 2023" },
  { id: "summer-championship", name: "Summer Championship 2023" },
  { id: "fall-qualifier", name: "Fall Qualifier 2023" }
];

export const MOCK_TEAMS = [
  { id: "dolphins", name: "Dolphins Dive Club" },
  { id: "barracudas", name: "Barracudas Aquatics" },
  { id: "sharks", name: "Sharks Diving Academy" }
];

export const MOCK_DIVERS = [
  { id: 1, name: "Jamie Smith", team: "Dolphins", age: 17, totalScore: 423.55 },
  { id: 2, name: "Casey Johnson", team: "Barracudas", age: 16, totalScore: 411.20 },
  { id: 3, name: "Taylor Brown", team: "Sharks", age: 18, totalScore: 445.75 },
  { id: 4, name: "Riley Davis", team: "Dolphins", age: 15, totalScore: 398.30 },
  { id: 5, name: "Jordan Lee", team: "Sharks", age: 17, totalScore: 432.65 },
  { id: 6, name: "Avery Wilson", team: "Barracudas", age: 16, totalScore: 404.85 },
  { id: 7, name: "Morgan Turner", team: "Dolphins", age: 18, totalScore: 428.40 },
  { id: 8, name: "Cam Martinez", team: "Sharks", age: 17, totalScore: 417.95 }
];
