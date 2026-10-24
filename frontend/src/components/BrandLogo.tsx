interface BrandLogoProps {
  size?: number;
  showText?: boolean;
}

export default function BrandLogo({ size = 40 }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CareerLens logo"
      role="img"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A99AFF" />
          <stop offset="100%" stopColor="#68D8CB" />
        </linearGradient>
        <linearGradient id="logo-gradient-2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A99AFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#68D8CB" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="20" cy="20" r="18" fill="url(#logo-gradient-2)" stroke="url(#logo-gradient)" strokeWidth="1.5" />
      {/* Lens circle */}
      <circle cx="20" cy="20" r="11" stroke="url(#logo-gradient)" strokeWidth="2.5" fill="none" />
      {/* Inner dot */}
      <circle cx="20" cy="20" r="4" fill="url(#logo-gradient)" />
      {/* Career path line — upward arc suggesting growth */}
      <path
        d="M12 26 Q16 18 20 16 Q24 14 28 12"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Discovery indicator — small checkmark / signal */}
      <circle cx="28" cy="12" r="3" fill="url(#logo-gradient)" />
    </svg>
  );
}
