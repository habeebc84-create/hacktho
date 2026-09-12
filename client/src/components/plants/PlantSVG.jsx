import React from 'react';

// Maps lowercase API keys (body/mind/craft/focus) to accent colors
const COLORS = {
  body:  '#E8A0A0',
  mind:  '#7FA88C',
  craft: '#F2B84B',
  focus: '#BA68C8',
  // fallback for any old uppercase usage
  Body:  '#E8A0A0',
  Mind:  '#7FA88C',
  Craft: '#F2B84B',
  Focus: '#BA68C8',
};

const PlantSVG = ({ type, stage, accentColor }) => {
  const color = accentColor || COLORS[type] || '#7FA88C';

  return (
    <div className="w-full h-full flex items-center justify-center plant-sway">
      <svg width="100" height="150" viewBox="0 0 100 150" className="drop-shadow-xl" aria-hidden="true">

        {/* Stage 1: Seed — tiny mound with sprouting tip */}
        {stage === 1 && (
          <g>
            <ellipse cx="50" cy="138" rx="20" ry="8" fill="#5A4632" opacity="0.5" />
            <path d="M46 138 Q 50 120 54 138" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="118" r="5" fill={color} />
          </g>
        )}

        {/* Stage 2: Sprout — stem + 2 leaves */}
        {stage === 2 && (
          <g>
            <ellipse cx="50" cy="140" rx="20" ry="6" fill="#5A4632" opacity="0.4" />
            <path d="M50 140 Q 50 100 50 80" fill="none" stroke="#7FA88C" strokeWidth="5" strokeLinecap="round" />
            <path d="M50 105 Q 28 95 38 115" fill={color} opacity="0.9" />
            <path d="M50 105 Q 72 95 62 115" fill={color} opacity="0.9" />
            <circle cx="50" cy="80" r="4" fill={color} />
          </g>
        )}

        {/* Stage 3: Bud — taller with a bud on top */}
        {stage === 3 && (
          <g>
            <ellipse cx="50" cy="140" rx="18" ry="6" fill="#5A4632" opacity="0.4" />
            <path d="M50 140 Q 50 80 50 50" fill="none" stroke="#7FA88C" strokeWidth="6" strokeLinecap="round" />
            <path d="M50 95 Q 22 82 34 108" fill={color} opacity="0.85" />
            <path d="M50 95 Q 78 82 66 108" fill={color} opacity="0.85" />
            <ellipse cx="50" cy="48" rx="10" ry="14" fill={color} opacity="0.9" />
            <ellipse cx="50" cy="42" rx="6" ry="8" fill={color} />
          </g>
        )}

        {/* Stage 4: Bloom — full open flower */}
        {stage === 4 && (
          <g>
            <ellipse cx="50" cy="140" rx="18" ry="6" fill="#5A4632" opacity="0.4" />
            <path d="M50 140 Q 50 80 50 42" fill="none" stroke="#7FA88C" strokeWidth="6" strokeLinecap="round" />
            <path d="M50 95 Q 22 82 34 108" fill="#7FA88C" opacity="0.8" />
            <path d="M50 95 Q 78 82 66 108" fill="#7FA88C" opacity="0.8" />
            {/* Petals */}
            <circle cx="50" cy="28" r="10" fill={color} opacity="0.9" />
            <circle cx="36" cy="34" r="9" fill={color} opacity="0.85" />
            <circle cx="64" cy="34" r="9" fill={color} opacity="0.85" />
            <circle cx="34" cy="48" r="9" fill={color} opacity="0.8" />
            <circle cx="66" cy="48" r="9" fill={color} opacity="0.8" />
            <circle cx="50" cy="54" r="9" fill={color} opacity="0.85" />
            {/* Center */}
            <circle cx="50" cy="40" r="8" fill="#F2B84B" />
          </g>
        )}

        {/* Stage 5: Tree */}
        {stage === 5 && (
          <g>
            {/* Trunk */}
            <rect x="44" y="75" width="12" height="65" rx="4" fill="#5A4632" />
            {/* Canopy layers */}
            <circle cx="50" cy="55" r="32" fill={color} opacity="0.85" />
            <circle cx="28" cy="65" r="22" fill={color} opacity="0.8" />
            <circle cx="72" cy="65" r="22" fill={color} opacity="0.8" />
            <circle cx="50" cy="30" r="22" fill={color} opacity="0.9" />
          </g>
        )}

        {/* Stage 6: Ancient Tree — massive with golden glow */}
        {stage >= 6 && (
          <g>
            {/* Glow ring */}
            <circle cx="50" cy="50" r="48" fill="none" stroke="#F2B84B" strokeWidth="2" opacity="0.4" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="#F2B84B" strokeWidth="1" opacity="0.2" />
            {/* Trunk */}
            <rect x="42" y="80" width="16" height="62" rx="5" fill="#5A4632" />
            {/* Massive canopy */}
            <circle cx="50" cy="50" r="38" fill={color} opacity="0.9" />
            <circle cx="18" cy="65" r="26" fill={color} opacity="0.8" />
            <circle cx="82" cy="65" r="26" fill={color} opacity="0.8" />
            <circle cx="30" cy="30" r="24" fill={color} opacity="0.85" />
            <circle cx="70" cy="30" r="24" fill={color} opacity="0.85" />
            {/* Golden sparkles */}
            <circle cx="50" cy="15" r="4" fill="#F2B84B" />
            <circle cx="20" cy="40" r="3" fill="#F2B84B" opacity="0.8" />
            <circle cx="80" cy="40" r="3" fill="#F2B84B" opacity="0.8" />
            <circle cx="35" cy="12" r="2" fill="#F2B84B" opacity="0.7" />
            <circle cx="65" cy="12" r="2" fill="#F2B84B" opacity="0.7" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default PlantSVG;
