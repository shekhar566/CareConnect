"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const HomeAnimation = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".animate-in", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: containerRef }
  );

  return <div ref={containerRef}>{children}</div>;
};

export default HomeAnimation;
