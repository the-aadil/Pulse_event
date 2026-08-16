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
        viewBox="0 0 1550 430"
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
                stroke-width: 22;
                stroke-linecap: round;
                stroke-linejoin: round;
                fill: none;
                transition: stroke 0.3s ease;
              }
              .pulse-event-logo:hover .pulse-stroke {
                stroke: #FFA000;
              }
            `}
          </style>
        </defs>
        <g className="pulse-stroke">
          {/* Heartbeat Pulse Wave & 'P' Mark */}
          <path d="M 35,235 L 85,235 C 100,235 115,220 115,205 L 115,135 C 115,110 170,110 170,135 L 170,325 C 170,358 225,358 225,325 L 225,155 C 225,130 280,130 280,155 L 280,220 C 280,235 300,235 335,235 C 425,235 425,55 335,55 L 170,55" />
          {/* 'ulse' */}
          <path d="M 480,210 L 480,317.2 C 480,356.6 562,356.6 562,317.2 L 562,210" />
          <path d="M 610,115 L 610,350" />
          <path d="M 734,238 C 734,210 660,210 660,242 C 660,282 738,266 738,306 C 738,350 664,350 664,322" />
          <path d="M 860,324 C 858,352 780,352 780,282.8 C 780,208 862,208 862,282.8 L 780,282.8" />
          {/* 'Event' */}
          <path d="M 935,115 L 935,350" />
          <path d="M 935,115 L 1023,115" />
          <path d="M 935,232.5 L 998.36,232.5" />
          <path d="M 935,350 L 1023,350" />
          <path d="M 1065,210 L 1095.8,342 C 1107.24,353 1110.76,353 1122.2,342 L 1153,210" />
          <path d="M 1265,324 C 1263,352 1185,352 1185,282.8 C 1185,208 1267,208 1267,282.8 L 1185,282.8" />
          <path d="M 1300,350 L 1300,210 M 1300,232 C 1300,208 1382,208 1382,236 L 1382,350" />
          <path d="M 1425,160 L 1425,328 C 1425,352 1473,352 1473,340 M 1403,210 L 1457,210" />
        </g>
      </svg>
    </Link>
  );
}
