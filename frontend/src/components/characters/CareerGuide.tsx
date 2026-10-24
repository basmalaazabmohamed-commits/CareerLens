interface CharacterProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * Career Guide — Professional clay-style character representing career guidance and discovery.
 * Sculpted friendly figure holding a resume folio with verified badge and tactile layers.
 */
export default function CareerGuide({ size = 120, className = '', animate = true }: CharacterProps) {
  return (
    <div
      className={`career-guide-wrapper ${animate ? 'clay-float-alt' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: 'drop-shadow(0 14px 24px rgba(140, 114, 232, 0.18))',
      }}
      role="img"
      aria-label="CareerLens Guide Mascot"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Head & body gradient */}
          <linearGradient id="cg-skin" x1="60" y1="20" x2="100" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE0CE" />
            <stop offset="100%" stopColor="#F3BEA0" />
          </linearGradient>

          {/* Torso clay blazer gradient */}
          <linearGradient id="cg-blazer" x1="45" y1="80" x2="115" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#AECCEF" />
            <stop offset="60%" stopColor="#679BF1" />
            <stop offset="100%" stopColor="#2C65E3" />
          </linearGradient>

          {/* Portfolio folder gradient */}
          <linearGradient id="cg-portfolio" x1="25" y1="90" x2="85" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C7B8F5" />
            <stop offset="100%" stopColor="#8C72E8" />
          </linearGradient>

          {/* Badge gradient */}
          <linearGradient id="cg-badge" x1="75" y1="75" x2="95" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#83DCCB" />
            <stop offset="100%" stopColor="#39866E" />
          </linearGradient>
        </defs>

        {/* Floating Back Resume Document */}
        <g transform="rotate(-8 50 80)">
          <rect x="36" y="58" width="46" height="60" rx="8" fill="#FFFFFF" filter="drop-shadow(0 4px 10px rgba(44,101,227,0.12))" />
          <rect x="44" y="68" width="22" height="4" rx="2" fill="#AECCEF" />
          <rect x="44" y="76" width="30" height="3" rx="1.5" fill="#E2D9FA" />
          <rect x="44" y="83" width="26" height="3" rx="1.5" fill="#E2D9FA" />
          <rect x="44" y="90" width="18" height="3" rx="1.5" fill="#E2D9FA" />
        </g>

        {/* Torso / Clay Jacket */}
        <path
          d="M48 102 C48 88, 112 88, 112 102 L118 144 C118 152, 42 152, 42 144 Z"
          fill="url(#cg-blazer)"
        />
        {/* Blazer Lapel highlight */}
        <path
          d="M62 94 L80 120 L98 94"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />

        {/* Round Sculpted Head */}
        <circle cx="80" cy="56" r="28" fill="url(#cg-skin)" />
        {/* Soft hair/cap clay shape */}
        <path
          d="M54 52 C54 36, 106 36, 106 52 C106 40, 96 32, 80 32 C64 32, 54 40, 54 52 Z"
          fill="#302846"
        />

        {/* Friendly eyes */}
        <circle cx="72" cy="54" r="3.2" fill="#252B3B" />
        <circle cx="71" cy="53" r="1.2" fill="#FFFFFF" />
        <circle cx="88" cy="54" r="3.2" fill="#252B3B" />
        <circle cx="87" cy="53" r="1.2" fill="#FFFFFF" />
        {/* Smile */}
        <path d="M75 64 Q80 69 85 64" stroke="#252B3B" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Cheeks */}
        <circle cx="67" cy="60" r="3" fill="#F3BEA0" fillOpacity="0.8" />
        <circle cx="93" cy="60" r="3" fill="#F3BEA0" fillOpacity="0.8" />

        {/* Held Clay Portfolio */}
        <rect x="34" y="102" width="48" height="36" rx="10" fill="url(#cg-portfolio)" transform="rotate(4 58 120)" />
        <rect x="36" y="104" width="44" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.4" transform="rotate(4 58 120)" />

        {/* Hand holding portfolio */}
        <circle cx="48" cy="116" r="6" fill="url(#cg-skin)" />

        {/* Verified Career Signal Badge */}
        <g transform="translate(104 78)">
          <circle cx="12" cy="12" r="14" fill="url(#cg-badge)" filter="drop-shadow(0 4px 8px rgba(57,134,110,0.3))" />
          <path d="M7 12 L11 16 L17 8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>
    </div>
  );
}
