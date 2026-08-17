import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center", className)}
      aria-label="Pulse Event home"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1050 430"
        width="100%"
        height="auto"
        className="pulse-event-logo"
        style={{ maxHeight: "48px", display: "block" }}
        aria-label="Pulse Event Logo"
      >
        <defs>
          <style>
            {`
              .pulse-stroke {
                stroke: #FFB400;
                stroke-width: 28;
                stroke-linecap: round;
                stroke-linejoin: round;
                fill: none;
                filter: drop-shadow(0 0 12px rgba(255,180,0,0.8)) drop-shadow(0 0 24px rgba(255,180,0,0.4));
              }
              .logo-pulse {
                font-family: 'Playfair Display', 'Didot', 'Times New Roman', serif;
                font-size: 150px;
                font-weight: 700;
                fill: #f8fafc;
              }
              .logo-event {
                font-family: 'Playfair Display', 'Didot', 'Times New Roman', serif;
                font-size: 150px;
                font-weight: 700;
                letter-spacing: 0.05em;
                fill: #f8fafc;
              }
            `}
          </style>
        </defs>
        <g>
          {/* Heartbeat Pulse Wave & 'P' Mark */}
          <path className="pulse-stroke" d="M 35,235 L 85,235 C 100,235 115,220 115,205 L 115,135 C 115,110 170,110 170,135 L 170,325 C 170,358 225,358 225,325 L 225,155 C 225,130 280,130 280,155 L 280,220 C 280,235 300,235 335,235 C 425,235 425,55 335,55 L 170,55" />
          
          {/* Stacked lockup: "ulse" and "event" exactly matching font styles */}
          <text x="450" y="205" className="logo-pulse">ulse</text>
          <text x="380" y="340" className="logo-event">event</text>
        </g>
      </svg>
    </Link>
  );
}
