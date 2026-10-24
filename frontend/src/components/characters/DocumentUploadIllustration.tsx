interface IllustrationProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * DocumentUploadIllustration — Sculpted Claymorphic 3D illustration featuring
 * layered document pages, a stylized clay lens, and floating skill chips.
 * Adheres strictly to the CareerLens palette and Claymorphic UI language.
 */
export default function DocumentUploadIllustration({
  size = 140,
  className = '',
  animate = true,
}: IllustrationProps) {
  return (
    <div
      className={`doc-upload-illustration ${animate ? 'clay-float' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: 'drop-shadow(0 14px 28px rgba(66, 111, 206, 0.16))',
      }}
      role="img"
      aria-label="Claymorphic CV Analysis Illustration"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Back document gradient */}
          <linearGradient id="dui-back-doc" x1="20" y1="20" x2="110" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DADCF5" />
            <stop offset="100%" stopColor="#EAE5F4" />
          </linearGradient>

          {/* Front document gradient */}
          <linearGradient id="dui-front-doc" x1="35" y1="25" x2="125" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F8FAFD" />
            <stop offset="100%" stopColor="#E0EAF9" />
          </linearGradient>

          {/* Lens rim gradient */}
          <linearGradient id="dui-lens-rim" x1="75" y1="65" x2="145" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9D8AEF" />
            <stop offset="50%" stopColor="#426FCE" />
            <stop offset="100%" stopColor="#34345B" />
          </linearGradient>

          {/* Lens glass radial */}
          <radialGradient id="dui-lens-glass" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#E0EAF9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8BD8C4" stopOpacity="0.85" />
          </radialGradient>

          {/* Mint chip gradient */}
          <linearGradient id="dui-chip-mint" x1="0" y1="0" x2="50" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8BD8C4" />
            <stop offset="100%" stopColor="#4FAEAA" />
          </linearGradient>

          {/* Peach chip gradient */}
          <linearGradient id="dui-chip-peach" x1="0" y1="0" x2="40" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F0D78C" />
            <stop offset="100%" stopColor="#F0B69A" />
          </linearGradient>

          {/* Clay soft shadow */}
          <filter id="dui-clay-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#34345B" floodOpacity="0.14" />
          </filter>
        </defs>

        {/* Floating background ambient glow */}
        <circle cx="80" cy="80" r="65" fill="#EAE5F4" opacity="0.6" />

        {/* Back document page (tilted slightly left) */}
        <g transform="rotate(-7 70 80)">
          <rect
            x="32"
            y="26"
            width="68"
            height="90"
            rx="12"
            fill="url(#dui-back-doc)"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="1.5"
            filter="url(#dui-clay-shadow)"
          />
          {/* Subtle lines on back page */}
          <rect x="42" y="40" width="30" height="4" rx="2" fill="#9D8AEF" opacity="0.4" />
          <rect x="42" y="48" width="46" height="3" rx="1.5" fill="#9D8AEF" opacity="0.25" />
          <rect x="42" y="55" width="40" height="3" rx="1.5" fill="#9D8AEF" opacity="0.25" />
        </g>

        {/* Front document page */}
        <g filter="url(#dui-clay-shadow)">
          <rect
            x="42"
            y="30"
            width="72"
            height="94"
            rx="14"
            fill="url(#dui-front-doc)"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth="2"
          />

          {/* Header avatar & name line in front doc */}
          <circle cx="58" cy="48" r="7" fill="#426FCE" opacity="0.3" />
          <rect x="70" y="43" width="32" height="4" rx="2" fill="#34345B" opacity="0.6" />
          <rect x="70" y="50" width="22" height="3" rx="1.5" fill="#626580" opacity="0.4" />

          {/* Document text lines */}
          <rect x="52" y="62" width="52" height="3.5" rx="1.75" fill="#426FCE" opacity="0.25" />
          <rect x="52" y="70" width="45" height="3" rx="1.5" fill="#626580" opacity="0.25" />
          <rect x="52" y="77" width="48" height="3" rx="1.5" fill="#626580" opacity="0.25" />
          <rect x="52" y="84" width="38" height="3" rx="1.5" fill="#626580" opacity="0.25" />

          {/* Embedded mini skill chips inside doc */}
          <rect x="52" y="93" width="22" height="6" rx="3" fill="#8BD8C4" opacity="0.4" />
          <rect x="78" y="93" width="24" height="6" rx="3" fill="#9D8AEF" opacity="0.3" />
          <rect x="52" y="103" width="28" height="6" rx="3" fill="#F0B69A" opacity="0.4" />
        </g>

        {/* Stylized Clay Lens resting on the document */}
        <g filter="url(#dui-clay-shadow)">
          {/* Lens handle */}
          <path
            d="M120 120 L136 138"
            stroke="url(#dui-lens-rim)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M120 120 L136 138"
            stroke="#F0B69A"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Lens rim circle */}
          <circle
            cx="100"
            cy="100"
            r="26"
            fill="none"
            stroke="url(#dui-lens-rim)"
            strokeWidth="6"
          />

          {/* Lens glass */}
          <circle
            cx="100"
            cy="100"
            r="23"
            fill="url(#dui-lens-glass)"
          />

          {/* Lens highlight glint */}
          <ellipse
            cx="94"
            cy="92"
            rx="8"
            ry="4"
            transform="rotate(-30 94 92)"
            fill="#FFFFFF"
            opacity="0.85"
          />
          <circle cx="106" cy="107" r="2.5" fill="#FFFFFF" opacity="0.6" />
        </g>

        {/* Floating Clay Skill Chips */}
        {/* Mint Chip top-right */}
        <g filter="url(#dui-clay-shadow)">
          <rect x="105" y="24" width="42" height="18" rx="9" fill="url(#dui-chip-mint)" />
          <rect x="106" y="25" width="40" height="7" rx="3.5" fill="#FFFFFF" opacity="0.45" />
          <circle cx="115" cy="33" r="3" fill="#FFFFFF" />
          <rect x="122" y="31" width="16" height="3.5" rx="1.75" fill="#254E49" />
        </g>

        {/* Peach Chip bottom-left */}
        <g filter="url(#dui-clay-shadow)">
          <rect x="14" y="96" width="36" height="16" rx="8" fill="url(#dui-chip-peach)" />
          <rect x="15" y="97" width="34" height="6" rx="3" fill="#FFFFFF" opacity="0.45" />
          <circle cx="23" cy="104" r="2.5" fill="#704638" />
          <rect x="28" y="102" width="14" height="3" rx="1.5" fill="#704638" />
        </g>

        {/* Small floating sparkles/nodes */}
        <circle cx="28" cy="46" r="3.5" fill="#9D8AEF" opacity="0.8" />
        <circle cx="138" cy="74" r="3" fill="#8BD8C4" opacity="0.9" />
        <circle cx="40" cy="132" r="2.5" fill="#F0B69A" opacity="0.8" />
      </svg>
    </div>
  );
}
