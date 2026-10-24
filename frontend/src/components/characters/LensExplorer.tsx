interface CharacterProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * Lens Explorer — Friendly sculpted character inspired by a magnifying lens.
 * Features a soft circular lens body, clay-like geometry, gentle floating motion,
 * and subtle lens reflection highlights.
 */
export default function LensExplorer({ size = 120, className = '', animate = true }: CharacterProps) {
  return (
    <div
      className={`lens-explorer-wrapper ${animate ? 'clay-float' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: 'drop-shadow(0 12px 20px rgba(44, 101, 227, 0.16))',
      }}
      role="img"
      aria-label="CareerLens Explorer Mascot"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main outer ring gradient */}
          <linearGradient id="le-ring-grad" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#AECCEF" />
            <stop offset="50%" stopColor="#679BF1" />
            <stop offset="100%" stopColor="#2C65E3" />
          </linearGradient>

          {/* Inner lens glass gradient */}
          <radialGradient id="le-glass-grad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#E2D9FA" stopOpacity="0.75" />
            <stop offset="85%" stopColor="#AECCEF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#679BF1" stopOpacity="0.95" />
          </radialGradient>

          {/* Handle gradient */}
          <linearGradient id="le-handle-grad" x1="110" y1="110" x2="150" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F3BEA0" />
            <stop offset="50%" stopColor="#C85726" />
            <stop offset="100%" stopColor="#99775A" />
          </linearGradient>

          {/* Soft inner glow */}
          <filter id="le-inner-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="2" dy="4" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.8 0" />
          </filter>
        </defs>

        {/* Tactile Handle with soft clay finish */}
        <g transform="rotate(45 118 118)">
          {/* Handle shadow */}
          <rect x="110" y="106" width="18" height="42" rx="9" fill="#252B3B" fillOpacity="0.12" transform="translate(2 3)" />
          {/* Handle main cylinder */}
          <rect x="110" y="106" width="18" height="42" rx="9" fill="url(#le-handle-grad)" />
          {/* Handle ring accent */}
          <rect x="109" y="104" width="20" height="6" rx="3" fill="#FFE5D6" />
        </g>

        {/* Outer Sculpted Clay Frame */}
        <circle cx="72" cy="72" r="54" fill="url(#le-ring-grad)" />
        {/* Top-left soft specular rim */}
        <circle cx="70" cy="70" r="52" stroke="#FFFFFF" strokeWidth="4" strokeOpacity="0.65" fill="none" />
        {/* Inner bezel recess */}
        <circle cx="72" cy="72" r="44" fill="#252B3B" fillOpacity="0.08" />

        {/* Translucent Glass Lens Face */}
        <circle cx="72" cy="72" r="42" fill="url(#le-glass-grad)" />

        {/* Friendly Explorer Eyes with animated gaze */}
        <g className="lens-explorer-eyes">
          {/* Left Eye */}
          <ellipse cx="58" cy="68" rx="5.5" ry="7.5" fill="#252B3B" />
          <circle cx="56" cy="65" r="2.2" fill="#FFFFFF" />
          {/* Right Eye */}
          <ellipse cx="86" cy="68" rx="5.5" ry="7.5" fill="#252B3B" />
          <circle cx="84" cy="65" r="2.2" fill="#FFFFFF" />
          {/* Subtle friendly smile */}
          <path d="M66 80 Q72 86 78 80" stroke="#252B3B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Soft rosy clay cheeks */}
          <circle cx="50" cy="76" r="4.5" fill="#F3BEA0" fillOpacity="0.75" />
          <circle cx="94" cy="76" r="4.5" fill="#F3BEA0" fillOpacity="0.75" />
        </g>

        {/* Lens curved reflection sweep */}
        <path
          d="M42 54 C50 40, 75 36, 96 44 C84 40, 58 44, 46 58 Z"
          fill="#FFFFFF"
          fillOpacity="0.7"
        />

        {/* Little decorative star sparkle */}
        <path
          d="M102 36 L104 31 L109 33 L105 37 L108 42 L103 39 L99 43 L100 38 Z"
          fill="#83DCCB"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
