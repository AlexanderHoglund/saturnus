// PLACEHOLDER building SVG — replace the markup below with your own SVG,
// or drop a file at /public/building.svg and swap this component for:
//   <img src="/building.svg" alt="The building" />
export default function Building({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 320"
      className={className}
      role="img"
      aria-label="The building"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      {/* body */}
      <rect x="60" y="70" width="120" height="230" />
      {/* stepped roof */}
      <path d="M60 70 L120 30 L180 70" />
      {/* windows grid */}
      <g opacity="0.85">
        <rect x="78" y="96" width="24" height="30" />
        <rect x="138" y="96" width="24" height="30" />
        <rect x="78" y="146" width="24" height="30" />
        <rect x="138" y="146" width="24" height="30" />
        <rect x="78" y="196" width="24" height="30" />
        <rect x="138" y="196" width="24" height="30" />
      </g>
      {/* door */}
      <path d="M104 300 L104 252 Q120 240 136 252 L136 300" />
    </svg>
  );
}
