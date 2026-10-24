interface HeroIllustrationProps {
  className?: string;
}

/**
 * HeroIllustration — Custom sculpted Claymorphic illustration for the CareerLens hero.
 * Features:
 * - Layered resume/CV card with soft embossed lines
 * - Stylized 3D clay magnifying lens focusing on key skills
 * - Floating clay skill chips (Python, FastAPI, RAG, PyTorch)
 * - Mini job match card with progress bar
 * - Connected skill nodes with soft linking paths
 * - An upward career-growth trajectory line
 * - Coordinated palette: lavender, soft blue, mint, peach, and deep indigo
 */
export default function HeroIllustration({ className = '' }: HeroIllustrationProps) {
  return (
    <div
      className={`hero-illustration-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        height: 380,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="img"
      aria-label="CareerLens Hero Interactive Clay Illustration"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 520 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Radial ambient glow */}
          <radialGradient id="hi-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DADCF5" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#EAE5F4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#E0EAF9" stopOpacity="0" />
          </radialGradient>

          {/* Upward trajectory gradient */}
          <linearGradient id="hi-growth-path" x1="60" y1="320" x2="440" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9D8AEF" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#426FCE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8BD8C4" stopOpacity="0.9" />
          </linearGradient>

          {/* Main CV Card Gradient */}
          <linearGradient id="hi-cv-card" x1="120" y1="80" x2="300" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F8FAFD" />
            <stop offset="100%" stopColor="#EAE5F4" />
          </linearGradient>

          {/* Job Card Gradient */}
          <linearGradient id="hi-job-card" x1="280" y1="180" x2="460" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F5F9FE" />
            <stop offset="100%" stopColor="#E0EAF9" />
          </linearGradient>

          {/* Clay Lens Ring */}
          <linearGradient id="hi-lens-ring" x1="160" y1="120" x2="280" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9D8AEF" />
            <stop offset="45%" stopColor="#426FCE" />
            <stop offset="100%" stopColor="#34345B" />
          </linearGradient>

          {/* Lens Glass */}
          <radialGradient id="hi-lens-glass" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#E0EAF9" stopOpacity="0.75" />
            <stop offset="85%" stopColor="#8BD8C4" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#426FCE" stopOpacity="0.9" />
          </radialGradient>

          {/* Clay drop shadow */}
          <filter id="hi-shadow-lg" x="-15%" y="-15%" width="135%" height="135%">
            <feDropShadow dx="3" dy="8" stdDeviation="8" floodColor="#34345B" floodOpacity="0.12" />
          </filter>

          <filter id="hi-shadow-sm" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#34345B" floodOpacity="0.10" />
          </filter>
        </defs>

        {/* Ambient background glow */}
        <ellipse cx="260" cy="190" rx="200" ry="140" fill="url(#hi-glow)" />

        {/* Upward Career Growth Trajectory Line (Dashed + Animated style) */}
        <path
          d="M 70 310 C 140 310, 200 240, 270 190 C 340 140, 390 100, 450 70"
          stroke="url(#hi-growth-path)"
          strokeWidth="3.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />

        {/* Growth Milestone Nodes */}
        <circle cx="70" cy="310" r="5" fill="#9D8AEF" />
        <circle cx="270" cy="190" r="6" fill="#426FCE" />
        <circle cx="450" cy="70" r="8" fill="#8BD8C4" filter="url(#hi-shadow-sm)" />
        <circle cx="450" cy="70" r="4" fill="#FFFFFF" />

        {/* ========================================================
            1. Main Resume / Document Clay Card (Center Left)
            ======================================================== */}
        <g filter="url(#hi-shadow-lg)" className="clay-float">
          {/* Main Card Shape */}
          <rect
            x="110"
            y="90"
            width="170"
            height="220"
            rx="18"
            fill="url(#hi-cv-card)"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="2"
          />

          {/* Profile Header in Card */}
          <circle cx="145" cy="125" r="14" fill="#426FCE" opacity="0.25" />
          <circle cx="145" cy="125" r="9" fill="#426FCE" opacity="0.6" />
          <rect x="168" y="117" width="70" height="6" rx="3" fill="#34345B" opacity="0.8" />
          <rect x="168" y="127" width="45" height="4" rx="2" fill="#626580" opacity="0.5" />

          {/* Horizontal Divider */}
          <line x1="128" y1="148" x2="262" y2="148" stroke="#DADCF5" strokeWidth="1.5" strokeLinecap="round" />

          {/* Document Section Lines */}
          <rect x="128" y="162" width="110" height="5" rx="2.5" fill="#34345B" opacity="0.65" />
          <rect x="128" y="174" width="134" height="4" rx="2" fill="#626580" opacity="0.35" />
          <rect x="128" y="184" width="120" height="4" rx="2" fill="#626580" opacity="0.35" />
          <rect x="128" y="194" width="100" height="4" rx="2" fill="#626580" opacity="0.35" />

          {/* Verified Evidence Badges in Doc */}
          <rect x="128" y="210" width="44" height="12" rx="6" fill="#8BD8C4" opacity="0.6" />
          <rect x="178" y="210" width="50" height="12" rx="6" fill="#9D8AEF" opacity="0.45" />

          <rect x="128" y="230" width="134" height="4" rx="2" fill="#626580" opacity="0.35" />
          <rect x="128" y="240" width="115" height="4" rx="2" fill="#626580" opacity="0.35" />
          <rect x="128" y="250" width="85" height="4" rx="2" fill="#626580" opacity="0.35" />

          {/* Mini progress bar at bottom of doc */}
          <rect x="128" y="274" width="134" height="6" rx="3" fill="#EAE5F4" />
          <rect x="128" y="274" width="98" height="6" rx="3" fill="#426FCE" />
        </g>

        {/* ========================================================
            2. Stylized Clay Magnifying Lens (Overlapping center)
            ======================================================== */}
        <g filter="url(#hi-shadow-lg)" className="clay-float-alt">
          {/* Lens Handle */}
          <path
            d="M 230 230 L 265 275"
            stroke="url(#hi-lens-ring)"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 230 230 L 265 275"
            stroke="#F0B69A"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Lens Rim */}
          <circle
            cx="200"
            cy="200"
            r="44"
            fill="none"
            stroke="url(#hi-lens-ring)"
            strokeWidth="8"
          />

          {/* Lens Glass */}
          <circle
            cx="200"
            cy="200"
            r="40"
            fill="url(#hi-lens-glass)"
          />

          {/* Magnified target element inside lens */}
          <circle cx="195" cy="195" r="16" fill="#FFFFFF" opacity="0.7" />
          <path
            d="M 188 195 L 193 200 L 203 190"
            stroke="#254E49"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glint reflections on glass */}
          <ellipse
            cx="188"
            cy="180"
            rx="14"
            ry="7"
            transform="rotate(-35 188 180)"
            fill="#FFFFFF"
            opacity="0.85"
          />
          <circle cx="215" cy="215" r="4" fill="#FFFFFF" opacity="0.6" />
        </g>

        {/* ========================================================
            3. Mini Job Recommendation Card (Floating Right)
            ======================================================== */}
        <g filter="url(#hi-shadow-lg)" className="clay-float-orbit">
          <rect
            x="290"
            y="170"
            width="175"
            height="145"
            rx="16"
            fill="url(#hi-job-card)"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="2"
          />

          {/* Job Icon Pill */}
          <rect x="306" y="186" width="30" height="30" rx="8" fill="#426FCE" />
          <path
            d="M 314 198 L 328 198 M 317 195 L 325 195 M 315 195 C 315 193 317 192 319 192 L 323 192 C 325 192 327 193 327 195"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Match Score Badge */}
          <rect x="408" y="186" width="42" height="20" rx="10" fill="#8BD8C4" />
          <text
            x="429"
            y="200"
            textAnchor="middle"
            fill="#254E49"
            fontSize="10"
            fontFamily="Manrope, sans-serif"
            fontWeight="800"
          >
            88%
          </text>

          {/* Job Title & Company */}
          <text
            x="306"
            y="232"
            fill="#34345B"
            fontSize="12"
            fontFamily="Manrope, sans-serif"
            fontWeight="800"
          >
            AI Solutions Engineer
          </text>
          <text
            x="306"
            y="246"
            fill="#626580"
            fontSize="10"
            fontFamily="DM Sans, sans-serif"
          >
            Verified Enterprise Dataset
          </text>

          {/* Mini Coverage Bar */}
          <rect x="306" y="260" width="143" height="6" rx="3" fill="#E0EAF9" />
          <rect x="306" y="260" width="126" height="6" rx="3" fill="url(#hi-lens-ring)" />

          {/* Mini Skill Chips */}
          <rect x="306" y="276" width="40" height="16" rx="8" fill="#8BD8C4" opacity="0.4" />
          <text x="326" y="287" textAnchor="middle" fill="#254E49" fontSize="8" fontWeight="700">RAG</text>

          <rect x="352" y="276" width="48" height="16" rx="8" fill="#9D8AEF" opacity="0.3" />
          <text x="376" y="287" textAnchor="middle" fill="#5C477D" fontSize="8" fontWeight="700">FastAPI</text>

          <rect x="406" y="276" width="43" height="16" rx="8" fill="#F0B69A" opacity="0.4" />
          <text x="427" y="287" textAnchor="middle" fill="#704638" fontSize="8" fontWeight="700">Vectors</text>
        </g>

        {/* ========================================================
            4. Floating Clay Skill Chips & Floating Nodes
            ======================================================== */}
        {/* Chip 1: Python (Top Left) */}
        <g filter="url(#hi-shadow-sm)" className="clay-float">
          <rect x="55" y="100" width="70" height="26" rx="13" fill="#8BD8C4" />
          <rect x="56" y="101" width="68" height="10" rx="5" fill="#FFFFFF" opacity="0.5" />
          <circle cx="68" cy="113" r="4" fill="#FFFFFF" />
          <text x="96" y="117" textAnchor="middle" fill="#254E49" fontSize="10" fontWeight="800" fontFamily="DM Sans">
            Python
          </text>
        </g>

        {/* Chip 2: Hybrid RAG (Top Right) */}
        <g filter="url(#hi-shadow-sm)" className="clay-float-alt">
          <rect x="320" y="80" width="94" height="28" rx="14" fill="#9D8AEF" />
          <rect x="321" y="81" width="92" height="10" rx="5" fill="#FFFFFF" opacity="0.5" />
          <circle cx="334" cy="94" r="4" fill="#FFFFFF" />
          <text x="372" y="98" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800" fontFamily="DM Sans">
            Hybrid RAG
          </text>
        </g>

        {/* Chip 3: Cross-Encoder (Bottom Left) */}
        <g filter="url(#hi-shadow-sm)" className="clay-float-orbit">
          <rect x="50" y="220" width="98" height="26" rx="13" fill="#F0B69A" />
          <rect x="51" y="221" width="96" height="9" rx="4.5" fill="#FFFFFF" opacity="0.5" />
          <circle cx="63" cy="233" r="3.5" fill="#704638" />
          <text x="103" y="237" textAnchor="middle" fill="#704638" fontSize="9" fontWeight="800" fontFamily="DM Sans">
            Cross-Encoder
          </text>
        </g>

        {/* Chip 4: Career Plan (Bottom Center) */}
        <g filter="url(#hi-shadow-sm)" className="clay-float">
          <rect x="230" y="325" width="86" height="24" rx="12" fill="#F0D78C" />
          <text x="273" y="341" textAnchor="middle" fill="#34345B" fontSize="9" fontWeight="800" fontFamily="DM Sans">
            Career Plan
          </text>
        </g>

        {/* Connecting skill nodes */}
        <line x1="125" y1="113" x2="160" y2="120" stroke="#8BD8C4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
        <line x1="320" y1="94" x2="260" y2="160" stroke="#9D8AEF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
        <line x1="148" y1="233" x2="180" y2="215" stroke="#F0B69A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
      </svg>
    </div>
  );
}
