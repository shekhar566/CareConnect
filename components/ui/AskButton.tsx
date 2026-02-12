// "use client";

// import { useRef } from "react";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { Plus, ArrowRight } from "lucide-react"; // Or whatever icon library you use

// interface AskButtonProps {
//   onClick?: () => void;
//   className?: string;
// }

// const AskButton = ({ onClick, className = "" }: AskButtonProps) => {
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const iconRef = useRef<HTMLDivElement>(null);
//   const textRef = useRef<HTMLSpanElement>(null);

//   const { contextSafe } = useGSAP({ scope: buttonRef });

//   // 🖱️ Hover IN: Lift & Slide
//   const handleMouseEnter = contextSafe(() => {
//     // 1. Button Lifts
//     gsap.to(buttonRef.current, {
//       y: -2,
//       boxShadow: "0px 10px 20px rgba(0,0,0,0.15)", // Grow shadow
//       duration: 0.3,
//       ease: "power2.out",
//     });

//     // 2. Icon Slides & Bounces
//     gsap.to(iconRef.current, {
//       x: 4, // Move right
//       duration: 0.4,
//       ease: "back.out(1.7)", // The "Elastic" bounce
//     });
//   });

//   // 🖱️ Hover OUT: Reset
//   const handleMouseLeave = contextSafe(() => {
//     gsap.to(buttonRef.current, {
//       y: 0,
//       boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", // Reset shadow
//       duration: 0.3,
//       ease: "power2.out",
//     });

//     gsap.to(iconRef.current, {
//       x: 0,
//       duration: 0.3,
//       ease: "power2.out",
//     });
//   });

//   // 👆 Click: The "Press"
//   const handleMouseDown = contextSafe(() => {
//     gsap.to(buttonRef.current, {
//       scale: 0.95,
//       duration: 0.1,
//       ease: "power1.out",
//     });
//   });

//   const handleMouseUp = contextSafe(() => {
//     gsap.to(buttonRef.current, {
//       scale: 1,
//       duration: 0.1,
//       ease: "power1.out",
//     });
//   });

//   return (
//     <button
//       ref={buttonRef}
//       onClick={onClick}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       onMouseDown={handleMouseDown}
//       onMouseUp={handleMouseUp}
//       // Tailwind Classes:
//       // - bg-primary-500: Your main brand color
//       // - text-white: Contrast text
//       // - rounded-full: Modern pill shape
//       // - font-medium: Clean typography
//       className={`
//         group relative flex items-center gap-2 px-6 py-3
//         bg-blue-600 text-white rounded-full
//         shadow-md transition-colors hover:bg-blue-700
//         ${className}
//       `}
//     >
//       {/* Text Container */}
//       <span ref={textRef} className="font-medium text-sm md:text-base">
//         Ask a Question
//       </span>

//       {/* Icon Container (We animate this div, not the SVG directly) */}
//       <div ref={iconRef} className="flex items-center justify-center">
//         {/* You can swap this for <Plus /> if you prefer */}
//         <ArrowRight size={18} strokeWidth={2.5} />
//       </div>
//     </button>
//   );
// };

// export default AskButton;

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react"; // Or your icon

interface AskButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode; // Allow custom text
}

const AskButton = ({ onClick, className = "", children }: AskButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: buttonRef });

  // 🖱️ Hover IN: Just Lift & Slide (No Shadow)
  const handleMouseEnter = contextSafe(() => {
    // 1. Button Lifts (Subtle)
    gsap.to(buttonRef.current, {
      y: -2,
      duration: 0.3,
      ease: "power2.out",
    });

    // 2. Icon Slides
    gsap.to(iconRef.current, {
      x: 4,
      duration: 0.4,
      ease: "back.out(1.7)",
    });
  });

  // 🖱️ Hover OUT: Reset
  const handleMouseLeave = contextSafe(() => {
    gsap.to(buttonRef.current, {
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(iconRef.current, {
      x: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  // 👆 Click: The "Press"
  const handleMouseDown = contextSafe(() => {
    gsap.to(buttonRef.current, {
      scale: 0.98, // Subtle shrink
      duration: 0.1,
      ease: "power1.out",
    });
  });

  const handleMouseUp = contextSafe(() => {
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.1,
      ease: "power1.out",
    });
  });

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`
        group relative flex items-center justify-center gap-2 
        rounded-lg transition-all 
        ${className} 
      `}
    >
      {/* Button Text */}
      <span className="font-medium">{children || "Ask a Question"}</span>

      {/* Icon Container */}
      <div ref={iconRef} className="flex items-center">
        <ArrowRight size={18} strokeWidth={2.5} />
      </div>
    </button>
  );
};

export default AskButton;
