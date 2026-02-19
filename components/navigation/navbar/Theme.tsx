"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

const Theme = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const sunRef = React.useRef(null);
  const moonRef = React.useRef(null);
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => setMounted(true), []);

  const handleToggle = () => {
    const isDark = resolvedTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    const tl = gsap.timeline();

    // 1. Shrink and Rotate out the current icon
    tl.to([sunRef.current, moonRef.current], {
      rotation: isDark ? -90 : 90,
      scale: 0,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setTheme(nextTheme);
      },
    });

    // 2. Pop and Rotate in the new icon
    tl.to([sunRef.current, moonRef.current], {
      rotation: 0,
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: "back.out(1.7)", // That signature GSAP "pop"
    });
  };

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="relative overflow-hidden"
    >
      <div ref={sunRef} className="dark:hidden">
        <Image
          src="/icons/sun.svg"
          alt="sun icon"
          width={24}
          height={24}
          className="active-theme"
        />
      </div>
      <div ref={moonRef} className="hidden dark:block">
        <Image
          src="/icons/moon.svg"
          alt="moon icon"
          width={24}
          height={24}
          className="active-theme"
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default Theme;
