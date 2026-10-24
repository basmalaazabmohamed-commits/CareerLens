interface CharacterProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * AI Analyst — Abstract, tactile AI character made of connected soft clay forms.
 * Floating nodes, central glowing analytical aperture, and subtle orbiting signals.
 */
export default function AIAnalyst({ size = 120, className = '', animate = true }: CharacterProps) {
  return (
    <div
      className={`ai-analyst-wrapper ${animate ? 'clay-float-orbit' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: 'drop-shadow(0 14px 26px rgba(103, 155, 241, 0.22))',
      }}
      role="img"
      aria-label="CareerLens AI Analyst Mascot"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Core sphere gradient */}
          <radialGradient id="ai-core-grad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#C7B8F5" />
            <stop offset="75%" stopColor="#8C72E8" />
            <stop offset="100%" stopColor="#302846" />
          </radialGradient>

          {/* Aperture gradient */}
          <linearGradient id="ai-aperture-grad" x1="50" y1="50" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#83DCCB" />
            <stop offset="100%" stopColor="#679BF1" />
          </linearGradient>

          {/* Floating node mint */}
          <radialGradient id="ai-node-mint" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#83DCCB" />
            <stop offset="100%" stopColor="#39866E" />
          </radialGradient>

          {/* Floating node peach */}
          <radialGradient id="ai-node-peach" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F3BEA0" />
            <stop offset="100%" stopColor="#C85726" />
          </radialGradient>
        </defs>

        {/* Tactile Connected Arc Lines */}
        <path
          d="M36 48 C 50 28, 110 32, 126 52"
          stroke="#AECCEF"
          strokeWidth="3"
          strokeDasharray="4 4"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M32 112 C 48 136, 114 138, 128 114"
          stroke="#C7B8F5"
          strokeWidth="3"
          strokeDasharray="4 4"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Orbiting Satellite Node 1 (Top Left) */}
        <g className="ai-orbit-node-1">
          <circle cx="34" cy="46" r="14" fill="url(#ai-node-mint)" />
          <circle cx="30" cy="42" r="4" fill="#FFFFFF" fillOpacity="0.8" />
        </g>

        {/* Orbiting Satellite Node 2 (Top Right) */}
        <g className="ai-orbit-node-2">
          <circle cx="128" cy="54" r="16" fill="url(#ai-node-peach)" />
          <circle cx="124" cy="50" r="5" fill="#FFFFFF" fillOpacity="0.8" />
        </g>

        {/* Orbiting Satellite Node 3 (Bottom Left) */}
        <g className="ai-orbit-node-3">
          <circle cx="32" cy="114" r="12" fill="#AECCEF" />
          <circle cx="30" cy="111" r="3" fill="#FFFFFF" fillOpacity="0.8" />
        </g>

        {/* Central Sculpted Clay AI Body */}
        <circle cx="80" cy="80" r="42" fill="url(#ai-core-grad)" />

        {/* Outer Bevel Highlight */}
        <circle cx="78" cy="78" r="40" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.6" fill="none" />

        {/* Central Iris / Intelligence Aperture */}
        <circle cx="80" cy="80" r="24" fill="#252B3B" />
        <circle cx="80" cy="80" r="20" fill="url(#ai-aperture-grad)" />

        {/* Concentric Pupil Ring */}
        <circle cx="80" cy="80" r="10" fill="#FFFFFF" />
        <circle cx="80" cy="80" r="6" fill="#2C65E3" />

        {/* Specular curved reflections */}
        <path
          d="M58 64 C64 52, 94 50, 102 58 C94 54, 70 56, 62 66 Z"
          fill="#FFFFFF"
          fillOpacity="0.75"
        />

        {/* Little Data Sparkle */}
        <circle cx="106" cy="102" r="3.5" fill="#83DCCB" />
        <circle cx="118" cy="94" r="2" fill="#679BF1" />
      </svg>
    </div>
  );
}
