import React from 'react';

const PlantSVG = ({ type, stage }) => {
  const colors = {
    Body: '#E8A0A0',
    Mind: '#7FA88C',
    Craft: '#F2B84B',
    Focus: '#1B3A2F',
  };
  const color = colors[type] || colors.Body;

  return (
    <div className="w-full h-full flex items-center justify-center plant-sway">
      <svg width="100" height="150" viewBox="0 0 100 150" className="drop-shadow-xl">
        {/* Stage 1: Seed/Sprout */}
        {stage === 1 && (
          <g>
            <path d="M40 140 Q 50 120 60 140" fill="none" stroke={color} strokeWidth="4" />
            <circle cx="50" cy="120" r="4" fill={color} />
          </g>
        )}
        
        {/* Stage 2 */}
        {stage === 2 && (
          <g>
            <path d="M50 140 Q 50 100 50 80" fill="none" stroke={color} strokeWidth="5" />
            <path d="M50 100 Q 30 90 40 110" fill={color} />
            <path d="M50 100 Q 70 90 60 110" fill={color} />
          </g>
        )}

        {/* Stage 3 */}
        {stage === 3 && (
          <g>
            <path d="M50 140 Q 50 80 50 50" fill="none" stroke="#7FA88C" strokeWidth="6" />
            <path d="M50 80 Q 20 70 30 100" fill="#7FA88C" />
            <path d="M50 80 Q 80 70 70 100" fill="#7FA88C" />
            <circle cx="50" cy="50" r="10" fill={color} opacity="0.8" />
          </g>
        )}

        {/* Stage 4 */}
        {stage === 4 && (
          <g>
            <path d="M50 140 Q 50 80 50 40" fill="none" stroke="#7FA88C" strokeWidth="6" />
            <path d="M50 80 Q 20 70 30 100" fill="#7FA88C" />
            <path d="M50 80 Q 80 70 70 100" fill="#7FA88C" />
            <circle cx="50" cy="40" r="15" fill={color} />
            <circle cx="35" cy="40" r="10" fill={color} opacity="0.8" />
            <circle cx="65" cy="40" r="10" fill={color} opacity="0.8" />
            <circle cx="50" cy="25" r="10" fill={color} opacity="0.8" />
            <circle cx="50" cy="55" r="10" fill={color} opacity="0.8" />
          </g>
        )}

        {/* Stage 5 */}
        {stage === 5 && (
          <g>
            <path d="M45 140 L 45 70 L 55 70 L 55 140 Z" fill="#5A4632" />
            <circle cx="50" cy="50" r="30" fill={color} opacity="0.9" />
            <circle cx="30" cy="60" r="20" fill={color} opacity="0.8" />
            <circle cx="70" cy="60" r="20" fill={color} opacity="0.8" />
          </g>
        )}

        {/* Stage 6 */}
        {stage >= 6 && (
          <g>
            <path d="M40 140 L 45 60 L 55 60 L 60 140 Z" fill="#5A4632" />
            <circle cx="50" cy="40" r="40" fill={color} />
            <circle cx="20" cy="55" r="30" fill={color} opacity="0.8" />
            <circle cx="80" cy="55" r="30" fill={color} opacity="0.8" />
            <circle cx="35" cy="25" r="25" fill={color} opacity="0.9" />
            <circle cx="65" cy="25" r="25" fill={color} opacity="0.9" />
            {/* Glow */}
            <circle cx="50" cy="40" r="45" fill="none" stroke="#F2B84B" strokeWidth="2" opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default PlantSVG;
