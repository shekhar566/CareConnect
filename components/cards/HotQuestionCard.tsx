"use client";

import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface Props {
  _id: string;
  title: string;
}

const HotQuestionCard = ({ _id, title }: Props) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseEnter = contextSafe(() => {
    // 1. Text turns Orange (or your primary color)
    gsap.to(textRef.current, {
      color: "#FF7000",
      x: 2,
      duration: 0.2,
    });

    // 2. Arrow Slides Right
    gsap.to(iconRef.current, {
      x: 5, // Move 5px right
      scale: 1.2, // Grow slightly
      duration: 0.2,
      ease: "power2.out",
    });
  });

  const handleMouseLeave = contextSafe(() => {
    // Reset Text
    gsap.to(textRef.current, {
      color: "inherit",
      x: 0,
      duration: 0.2,
    });

    // Reset Arrow
    gsap.to(iconRef.current, {
      x: 0,
      scale: 1,
      duration: 0.2,
    });
  });

  return (
    <Link
      ref={containerRef} // Scope for GSAP
      href={ROUTES.QUESTION(_id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex cursor-pointer items-center justify-between gap-7"
    >
      <p
        ref={textRef}
        className="body-medium text-dark500_light700 line-clamp-2"
      >
        {title}
      </p>

      {/* Wrapper div helps GSAP handle the Image transform better */}
      <div ref={iconRef}>
        <Image
          src="/icons/chevron-right.svg" // 👈 Fixed Path
          alt="Chevron"
          width={20}
          height={20}
          className="invert-colors" // 👈 Kept your class
        />
      </div>
    </Link>
  );
};

export default HotQuestionCard;
