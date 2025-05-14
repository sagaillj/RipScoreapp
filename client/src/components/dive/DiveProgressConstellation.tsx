import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import * as d3 from 'd3';

interface Dive {
  id: string;
  number: string;
  name: string;
  difficulty: number;
  isCompleted: boolean;
  score?: number;
  recentlyCompleted?: boolean;
}

interface DiveProgressConstellationProps {
  dives: Dive[];
  width?: number;
  height?: number;
  padding?: number;
  animate?: boolean;
  onDiveClick?: (dive: Dive) => void;
}

export const DiveProgressConstellation: React.FC<DiveProgressConstellationProps> = ({
  dives,
  width = 800,
  height = 500,
  padding = 70,
  animate = true,
  onDiveClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedDive, setSelectedDive] = useState<Dive | null>(null);
  const [hoveredDive, setHoveredDive] = useState<Dive | null>(null);
  const [nodes, setNodes] = useState<d3.SimulationNodeDatum[]>([]);
  const [links, setLinks] = useState<d3.SimulationLinkDatum<d3.SimulationNodeDatum>[]>([]);

  // Animation for the glow effect
  const glowAnimation = useSpring({
    from: { strokeOpacity: 0.2, strokeWidth: 0.5 },
    to: { strokeOpacity: 0.8, strokeWidth: 2 },
    config: { duration: 1500 },
    loop: { reverse: true },
  });

  // Function to generate constellation layout
  useEffect(() => {
    if (!dives.length) return;

    // Create nodes from dives
    const nodeData = dives.map((dive, index) => ({
      id: dive.id,
      dive,
      index,
      x: Math.random() * (width - 2 * padding) + padding,
      y: Math.random() * (height - 2 * padding) + padding,
    }));

    // Create links between consecutive dives
    const linkData = [];
    for (let i = 0; i < nodeData.length - 1; i++) {
      linkData.push({
        source: nodeData[i],
        target: nodeData[i + 1],
        value: 1
      });
    }

    setNodes(nodeData);
    setLinks(linkData);

    // Create force simulation
    const simulation = d3.forceSimulation(nodeData)
      .force("link", d3.forceLink(linkData).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force("collision", d3.forceCollide().radius(50));

    // Update node positions during simulation
    if (animate) {
      simulation.on("tick", () => {
        setNodes([...nodeData]);
        setLinks([...linkData]);
      });
    } else {
      // Run simulation without animation
      for (let i = 0; i < 300; i++) simulation.tick();
      setNodes([...nodeData]);
      setLinks([...linkData]);
    }

    // Stop simulation when component unmounts
    return () => simulation.stop();
  }, [dives, width, height, padding, animate]);

  // Handle dive click
  const handleDiveClick = (dive: Dive) => {
    setSelectedDive(dive);
    if (onDiveClick) {
      onDiveClick(dive);
    }
  };

  // Calculate node size based on difficulty
  const getNodeSize = (dive: Dive) => {
    const baseSize = 15;
    return baseSize + dive.difficulty * 5;
  };

  // Calculate color based on completion status and score
  const getNodeColor = (dive: Dive) => {
    if (!dive.isCompleted) {
      return '#555';
    }
    
    // Use a color scale based on score
    const score = dive.score || 0;
    if (score >= 8) return '#4ADE80'; // Excellent - green
    if (score >= 6.5) return '#60A5FA'; // Good - blue
    if (score >= 5) return '#FBBF24'; // Average - yellow
    return '#F87171'; // Poor - red
  };

  // Get stroke color for nodes
  const getNodeStroke = (dive: Dive) => {
    if (dive.recentlyCompleted) return '#FF80B5'; // Pink stroke for recently completed dives
    if (selectedDive?.id === dive.id) return '#FF80B5'; // Pink stroke for selected dive
    if (hoveredDive?.id === dive.id) return '#60A5FA'; // Blue stroke for hovered dive
    return 'rgba(255, 255, 255, 0.3)'; // Default stroke
  };

  // Calculate link style based on completion status
  const getLinkStyle = (source: any, target: any) => {
    const sourceDive = source.dive;
    const targetDive = target.dive;
    
    // Both connected dives are completed
    if (sourceDive.isCompleted && targetDive.isCompleted) {
      return {
        stroke: 'rgba(255, 128, 181, 0.8)', // Pink for completed path
        strokeWidth: 2,
        strokeDasharray: 'none'
      };
    }
    
    // Path to current dive
    if (sourceDive.isCompleted && !targetDive.isCompleted) {
      return {
        stroke: 'rgba(255, 128, 181, 0.5)', // Faded pink for current path
        strokeWidth: 1.5,
        strokeDasharray: '5,5'
      };
    }
    
    // Future path
    return {
      stroke: 'rgba(255, 255, 255, 0.2)', // Very faded white for future path
      strokeWidth: 1,
      strokeDasharray: '3,3'
    };
  };

  // Find current dive (first uncompleted dive)
  const currentDive = dives.find(dive => !dive.isCompleted);

  return (
    <div className="relative">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        className="bg-[var(--color-background-post)] rounded-xl"
      >
        {/* Background Grid */}
        <g className="grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <line 
              key={`grid-h-${i}`} 
              x1="0" 
              y1={i * (height / 20)} 
              x2={width} 
              y2={i * (height / 20)}
              stroke="rgba(255, 255, 255, 0.05)" 
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line 
              key={`grid-v-${i}`} 
              x1={i * (width / 20)} 
              y1="0" 
              x2={i * (width / 20)} 
              y2={height}
              stroke="rgba(255, 255, 255, 0.05)" 
            />
          ))}
        </g>

        {/* Links between dives */}
        <g className="links">
          {links.map((link, i) => {
            const source: any = link.source;
            const target: any = link.target;
            const style = getLinkStyle(source, target);
            
            return (
              <line
                key={`link-${i}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={style.stroke}
                strokeWidth={style.strokeWidth}
                strokeDasharray={style.strokeDasharray}
              />
            );
          })}
        </g>

        {/* Animated constellation lines */}
        <g className="constellation-lines">
          {links.map((link, i) => {
            const source: any = link.source;
            const target: any = link.target;
            const sourceDive = source.dive;
            const targetDive = target.dive;
            
            // Only show constellation effect for completed dives
            if (!(sourceDive.isCompleted && targetDive.isCompleted)) return null;
            
            return (
              <animated.line
                key={`constellation-${i}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="rgba(255, 128, 181, 0.5)"
                strokeWidth={glowAnimation.strokeWidth}
                strokeOpacity={glowAnimation.strokeOpacity}
                filter="url(#glow)"
              />
            );
          })}
        </g>

        {/* Dive nodes */}
        <g className="nodes">
          {nodes.map((node: any) => {
            const dive = node.dive;
            const nodeSize = getNodeSize(dive);
            const isCurrent = currentDive?.id === dive.id;
            
            return (
              <g
                key={`node-${dive.id}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleDiveClick(dive)}
                onMouseEnter={() => setHoveredDive(dive)}
                onMouseLeave={() => setHoveredDive(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer glow for recently completed dives */}
                {dive.recentlyCompleted && (
                  <animated.circle
                    r={nodeSize + 10}
                    fill="none"
                    stroke="#FF80B5"
                    strokeWidth={glowAnimation.strokeWidth}
                    strokeOpacity={glowAnimation.strokeOpacity}
                    filter="url(#glow)"
                  />
                )}
                
                {/* Current dive indicator */}
                {isCurrent && (
                  <animated.circle
                    r={nodeSize + 8}
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth={1.5}
                    strokeDasharray="4,4"
                  />
                )}
                
                {/* Main node circle */}
                <circle
                  r={nodeSize}
                  fill={getNodeColor(dive)}
                  stroke={getNodeStroke(dive)}
                  strokeWidth={dive.isCompleted ? 2 : 1}
                />
                
                {/* Dive number label */}
                <text
                  dy=".35em"
                  textAnchor="middle"
                  fill="white"
                  fontSize={10}
                  fontWeight={dive.isCompleted ? "bold" : "normal"}
                >
                  {dive.number}
                </text>
                
                {/* Dive difficulty indicator */}
                <text
                  dy="-.8em"
                  dx="1.4em"
                  textAnchor="middle"
                  fill="white"
                  fontSize={8}
                  fontWeight="normal"
                >
                  {dive.difficulty.toFixed(1)}
                </text>
              </g>
            );
          })}
        </g>

        {/* Filters for glow effects */}
        <defs>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
      
      {/* Dive details tooltip */}
      {(hoveredDive || selectedDive) && (
        <div 
          className="absolute bg-[var(--color-card-post)] border border-[var(--color-border-post)] p-3 rounded-lg shadow-lg z-10 min-w-60"
          style={{ 
            left: hoveredDive ? `${(hoveredDive as any).x + 20}px` : `${(selectedDive as any).x + 20}px`,
            top: hoveredDive ? `${(hoveredDive as any).y - 30}px` : `${(selectedDive as any).y - 30}px`,
          }}
        >
          <div className="font-medium text-base text-[var(--color-text-post)]">
            {hoveredDive?.number || selectedDive?.number} 
            <span className="ml-2 text-[var(--color-accent2-post)]">
              DD: {(hoveredDive?.difficulty || selectedDive?.difficulty)?.toFixed(1)}
            </span>
          </div>
          <div className="text-sm text-[var(--color-muted-post)] mb-1">
            {hoveredDive?.name || selectedDive?.name}
          </div>
          
          {/* Show score if completed */}
          {(hoveredDive?.isCompleted || selectedDive?.isCompleted) && (
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-[var(--color-muted-post)]">Score:</span>
              <span className="font-bold text-[var(--color-accent-post)]">
                {hoveredDive?.score || selectedDive?.score || 'N/A'}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-[var(--color-card-post)]/80 p-2 rounded-md text-xs flex gap-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#555] mr-2"></div>
          <span className="text-[var(--color-muted-post)]">Not Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#F87171] mr-2"></div>
          <span className="text-[var(--color-muted-post)]">Poor</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#FBBF24] mr-2"></div>
          <span className="text-[var(--color-muted-post)]">Average</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#60A5FA] mr-2"></div>
          <span className="text-[var(--color-muted-post)]">Good</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#4ADE80] mr-2"></div>
          <span className="text-[var(--color-muted-post)]">Excellent</span>
        </div>
      </div>
    </div>
  );
};

export default DiveProgressConstellation;