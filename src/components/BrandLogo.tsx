export default function BrandLogo({ className = "w-48" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 80" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Sign Background */}
      <path 
        d="M 15 20 L 180 20 L 205 40 L 180 60 L 15 60 C 10 60 10 55 10 55 L 10 25 C 10 25 10 20 15 20 Z" 
        fill="#FFB800" 
        stroke="#1c1917" 
        strokeWidth="2.5" 
      />
      
      {/* FIFTH AVENUE Text */}
      <text 
        x="18" y="48" 
        fontFamily="Impact, Arial Black, sans-serif" 
        fontSize="28" 
        fontWeight="900" 
        fill="white" 
        stroke="#1c1917" 
        strokeWidth="1.5" 
        letterSpacing="0.5" 
        style={{ filter: 'drop-shadow(2px 3px 0px #1c1917)' }}
      >
        FIFTH AVENUE
      </text>

      {/* Red Pill */}
      <rect 
        x="25" y="52" 
        width="75" height="18" 
        rx="9" 
        fill="#D31027" 
        stroke="#1c1917" 
        strokeWidth="2" 
      />
      <text 
        x="33" y="64" 
        fontFamily="Arial, sans-serif" 
        fontSize="10" 
        fontWeight="bold" 
        fill="white" 
        letterSpacing="1"
      >
        PIZZA CO
      </text>
    </svg>
  );
}
