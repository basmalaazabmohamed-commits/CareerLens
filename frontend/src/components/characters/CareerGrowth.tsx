interface CharacterProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * Career Growth — Sculpted clay character/scene representing career development.
 * Ascending growth path, rising graph pillars, sprouting career leaves, and glowing destination beacon.
 */
export default function CareerGrowth({ size = 120, className = '', animate = true }: CharacterProps) {
  return (
    <div
      className={`career-growth-wrapper ${animate ? 'clay-float' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: 'drop-shadow(0 14px 24px rgba(57, 134, 110, 0.20))',
      }}
      role="img"
      aria-label="Career Growth Mascot"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Base pot / foundation */}
          <linearGradient id="cg-pot" x1="40" y1="110" x2="120" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E7D4B5" />
            <stop offset="50%" stopColor="#D88768" />
            <stop offset="100%" stopColor="#C85726" />
          </linearGradient>

          {/* Sprout & foliage */}
          <linearGradient id="cg-leaf-grad" x1="40" y1="30" x2="120" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C8DEC9" />
            <stop offset="50%" stopColor="#8CCBC3" />
            <stop offset="100%" stopColor="#39866E" />
          </linearGradient>

          {/* Stepping pillars */}
          <linearGradient id="cg-step-1" x1="45" y1="100" x2="65" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#AECCEF" />
            <stop offset="100%" stopColor="#679BF1" />
          </linearGradient>

          <linearGradient id="cg-step-2" x1="70" y1="80" x2="90" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C7B8F5" />
            <stop offset="100%" stopColor="#8C72E8" />
          </linearGradient>

          <linearGradient id="cg-step-3" x1="95" y1="60" x2="115" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#83DCCB" />
            <stop offset="100%" stopColor="#39866E" />
          </linearGradient>

          {/* Beacon star */}
          <radialGradient id="cg-beacon" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFE0CE" />
            <stop offset="100%" stopColor="#F3BEA0" />
          </radialGradient>
        </defs>

        {/* Foundation Sculpted Clay Pot / Platform */}
        <ellipse cx="80" cy="138" rx="46" ry="14" fill="#252B3B" fillOpacity="0.10" />
        <path
          d="M48 116 C 48 116, 52 142, 80 142 C 108 142, 112 116, 112 116 Z"
          fill="url(#cg-pot)"
        />
        <ellipse cx="80" cy="116" rx="32" ry="7" fill="#FFE5D6" />

        {/* Rising Career Stepping Stones / Graph Pillars */}
        {/* Step 1 */}
        <rect x="48" y="98" width="16" height="20" rx="6" fill="url(#cg-step-1)" />
        <ellipse cx="56" cy="98" rx="8" ry="3" fill="#FFFFFF" fillOpacity="0.7" />

        {/* Step 2 */}
        <rect x="72" y="78" width="16" height="40" rx="6" fill="url(#cg-step-2)" />
        <ellipse cx="80" cy="78" rx="8" ry="3" fill="#FFFFFF" fillOpacity="0.7" />

        {/* Step 3 */}
        <rect x="96" y="58" width="16" height="60" rx="6" fill="url(#cg-step-3)" />
        <ellipse cx="104" cy="58" rx="8" ry="3" fill="#FFFFFF" fillOpacity="0.7" />

        {/* Rising Organic Growth Path Stem */}
        <path
          d="M56 98 Q 78 70, 104 56 Q 118 46, 122 30"
          stroke="#39866E"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Clay Sprouting Leaves */}
        {/* Left leaf */}
        <path
          d="M72 74 C 52 68, 50 50, 68 54 C 74 62, 74 70, 72 74 Z"
          fill="url(#cg-leaf-grad)"
        />
        {/* Right leaf */}
        <path
          d="M92 60 C 112 52, 114 36, 98 42 C 90 48, 90 56, 92 60 Z"
          fill="url(#cg-leaf-grad)"
        />

        {/* Glowing Career Destination Beacon (Top right) */}
        <g transform="translate(112 18)">
          <circle cx="12" cy="12" r="14" fill="url(#cg-beacon)" filter="drop-shadow(0 4px 10px rgba(200,87,38,0.3))" />
          <path
            d="M12 4 L14 10 L20 12 L14 14 L12 20 L10 14 L4 12 L10 10 Z"
            fill="#C85726"
          />
        </g>

        {/* Tiny Floating Skill Seed Node */}
        <circle cx="42" cy="62" r="6" fill="#8CCBC3" />
        <circle cx="40" cy="60" r="1.8" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
