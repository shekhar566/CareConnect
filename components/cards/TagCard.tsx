// import Link from "next/link";
// import React from "react";
// import ROUTES from "@/constants/routes";
// import { Badge } from "../ui/badge";
// import { cn, getDeviconClassName, getTechDescription } from "@/lib/utils";
// import Image from "next/image";

// interface Props {
//   _id: string;
//   name: string;
//   questions?: number;
//   showCount?: boolean;
//   compact?: boolean;
//   remove?: boolean;
//   isButton?: boolean;
//   handleRemove?: () => void;
// }

// const TagCard = ({
//   _id,
//   name,
//   questions,
//   showCount,
//   compact,
//   remove,
//   isButton,
//   handleRemove,
// }: Props) => {
//   const iconClass = getDeviconClassName(name);
//   const iconDescription = getTechDescription(name);

//   const handleClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//   };
//   const Content = (
//     <>
//       <Badge
//         className=" subtle-medium background-light800_dark300 text-light400_light500
//         rounded-md border-none px-4 py-2 uppercase flex flex-row gap-2"
//       >
//         <div className="flex-center space-x-2">
//           <i className={`${iconClass} text-sm`}></i>
//           <span>{name}</span>
//         </div>

//         {remove && (
//           <Image
//             src="/icons/close.svg"
//             width={12}
//             height={12}
//             alt="close icon"
//             className="cursor-pointer object-contain invert-0
//             dark:invert"
//             onClick={handleRemove}
//           />
//         )}
//       </Badge>

//       {showCount && (
//         <p className="small-medium text-dark500_light700">{questions}</p>
//       )}
//     </>
//   );

//   if (compact) {
//     return isButton ? (
//       <button onClick={handleClick} className="flex justify-between gap-2">
//         {Content}
//       </button>
//     ) : (
//       <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
//         {Content}
//       </Link>
//     );
//   }
//   return (
//     <Link href={ROUTES.TAG(_id)} className="shadow-light100_darknone">
//       <article
//         className="background-light900_dark200 light-border
//       flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]"
//       >
//         <div className="flex items-center justify-between gap-3">
//           <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
//             <p className="paragraph-semibold text-dark300_light900">{name}</p>
//           </div>
//           <i className={cn(iconClass, "text-2xl")} aria-hidden="true" />
//         </div>

//         <p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full">
//           {iconDescription}
//         </p>

//         <p className="small-medium text-dark400_light500 mt-3.5">
//           <span className="body-semibold primary-text-gradient mr-2.5">
//             {questions}+
//           </span>
//           Questions
//         </p>
//       </article>
//     </Link>
//   );
// };

// export default TagCard;

"use client";

import Link from "next/link";
import React, { useRef } from "react";
import gsap from "gsap";
import ROUTES from "@/constants/routes";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { techMap } from "@/constants/techMap";
import { cn, getTechDescription } from "@/lib/utils";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: Props) => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const description = getTechDescription(name);

  const colorClass =
    techMap[name.toLowerCase()] ||
    "text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700";

  const handleClick = (e: React.MouseEvent) => {
    if (isButton) {
      e.preventDefault();
    }
  };

  const handleMouseEnter = () => {
    gsap.to(badgeRef.current, {
      y: -2,
      scale: 1.02,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(badgeRef.current, {
      y: 0,
      scale: 1,
      duration: 0.2,
      ease: "power2.in",
    });
  };

  const Content = (
    <div
      ref={badgeRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Badge
        className={cn(
          "subtle-medium rounded-md px-4 py-2 uppercase flex flex-row gap-2 shadow-none border transition-none", // transition-none avoids conflicts with GSAP
          colorClass
        )}
      >
        <div className="flex-center space-x-2">
          <span>{name}</span>
        </div>

        {remove && (
          <Image
            src="/icons/close.svg"
            width={12}
            height={12}
            alt="close icon"
            className="cursor-pointer object-contain opacity-50 invert-0 hover:opacity-100 dark:invert"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleRemove?.();
            }}
          />
        )}
      </Badge>
    </div>
  );

  if (compact) {
    return isButton ? (
      <button
        onClick={handleClick}
        className="flex justify-between gap-2 outline-none"
      >
        {Content}
        {showCount && (
          <p className="small-medium text-dark500_light700">{questions}</p>
        )}
      </button>
    ) : (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
        {Content}
        {showCount && (
          <p className="small-medium text-dark500_light700">{questions}</p>
        )}
      </Link>
    );
  }

  return (
    <Link href={ROUTES.TAG(_id)} className="shadow-light100_darknone">
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
        <div className="flex items-center justify-between gap-3">
          <div className={cn("rounded-sm px-5 py-1.5 border", colorClass)}>
            <p className="paragraph-semibold">{name}</p>
          </div>
        </div>

        <p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full">
          {description}
        </p>

        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {questions}+
          </span>
          Cases
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
