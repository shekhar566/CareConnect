// "use client";

// import { toast } from "@/hooks/use-toast";
// import { toggleSaveQuestion } from "@/lib/actions/collection.action";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { use, useState } from "react";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";

// const SaveQuestion = ({
//   questionId,
//   hasSavedQuestionPromise,
// }: {
//   questionId: string;
//   hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
// }) => {
//   const session = useSession();
//   const userId = session?.data?.user?.id;

//   const starRef = uesRef<HTMLImageElement>(null);
//   const { contextSafe } = useGSAP({ scope: starRef });

//   const { data } = use(hasSavedQuestionPromise);

//   const { saved: hasSaved } = data || {};

//   const [isLoading, setIsLoading] = useState(false);

//   const handleSave = async () => {
//     if (isLoading) return;
//     if (!userId)
//       return toast({
//         title: "You need to be logged in to save a question",
//         variant: "destructive",
//       });

//     setIsLoading(true);

//     try {
//       const { success, data, error } = await toggleSaveQuestion({
//         questionId,
//       });

//       if (!success) throw new Error(error?.message || "An error occurred ");

//       toast({
//         title: `Question ${data?.saved ? "saved" : "unsaved"} successfully`,
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error ? error.message : "An error occurred ",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Image
//       ref={starRef}
//       src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
//       width={20}
//       height={20}
//       alt="save"
//       className={`cursor-pointer ${isLoading && "opacity-50"}`}
//       aria-label="Save question"
//       onClick={handleSave}
//     />
//   );
// };

// export default SaveQuestion;
// function uesRef<T>(arg0: null) {
//   throw new Error("Function not implemented.");
// }

"use client";

import { toast } from "@/hooks/use-toast";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    [key: string]: unknown;
  };
}

const SaveQuestion = ({
  questionId,
  hasSavedQuestionPromise,
}: {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}) => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const starRef = useRef<HTMLImageElement>(null);
  const { contextSafe } = useGSAP({ scope: starRef });

  const { data } = use(hasSavedQuestionPromise);
  const { saved: hasSaved } = data || {};

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = contextSafe(async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoading) return;
    if (!userId)
      return toast({
        title: "You need to be logged in to save a question",
        variant: "destructive",
      });

    // 🎬 NEW ANIMATION: "The Blink & Catch" 🎬
    if (!hasSaved) {
      // === SAVING (Turning Yellow) ===
      // Instantly set it to invisible starting position
      gsap.set(starRef.current, {
        scale: 0.4,
        opacity: 0,
        rotation: -45,
      });

      // Animate to final state (Blink + Snap)
      gsap.to(starRef.current, {
        scale: 1, // Back to normal size
        opacity: 1, // Flash in
        rotation: 0, // Rotate flat
        duration: 0.6,
        ease: "elastic.out(1.2, 0.5)", // Snappy, crisp bounce
      });
    } else {
      // === UNSAVING (Turning Gray) ===
      // Quick shrink away
      gsap.to(starRef.current, {
        scale: 0.5,
        opacity: 0,
        rotation: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          // Reset properties invisibly so it's ready for next time
          gsap.set(starRef.current, { scale: 1, opacity: 1, rotation: 0 });
        },
      });
    }

    // Continue with Server Logic...
    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({
        questionId,
      });

      if (!success) throw new Error(error?.message || "An error occurred");

      toast({
        title: `Question ${data?.saved ? "saved" : "unsaved"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      // If error, reset state immediately so it doesn't look stuck
      gsap.set(starRef.current, { scale: 1, opacity: 1, rotation: 0 });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div
      className="cursor-pointer rounded-full p-1 transition-all hover:bg-light-800 active:scale-90 dark:hover:bg-dark-400"
      onClick={handleSave}
    >
      <Image
        ref={starRef}
        src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
        width={20}
        height={20}
        alt="save"
        // Ensure opacity is 1 initially unless loading
        className={`transition-opacity ${isLoading ? "opacity-50" : "opacity-100"}`}
        aria-label="Save question"
      />
    </div>
  );
};

export default SaveQuestion;
