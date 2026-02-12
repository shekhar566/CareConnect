// "use client";
// import { toast } from "@/hooks/use-toast";
// import { createVote } from "@/lib/actions/vote.action";
// import { formatNumber } from "@/lib/utils";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { use, useState } from "react";

// interface Params {
//   targetType: "question" | "answer";
//   targetId: string;
//   upvotes: number;
//   downvotes: number;
//   hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
// }

// const Votes = ({
//   targetType,
//   targetId,
//   upvotes,
//   downvotes,
//   hasVotedPromise,
// }: Params) => {
//   const session = useSession();
//   const userId = session.data?.user?.id;

//   const { success, data } = use(hasVotedPromise);

//   const [isLoading, setIsLoading] = useState(false);

//   const { hasUpvoted, hasDownvoted } = data || {};

//   const handleVote = async (voteType: "upvote" | "downvote") => {
//     if (!userId)
//       return toast({
//         title: "Please login to vote",
//         description: "Only logged-in users can vote.",
//       });

//     setIsLoading(true);

//     try {
//       const result = await createVote({
//         targetId,
//         targetType,
//         voteType,
//       });

//       if (!result.success) {
//         return toast({
//           title: "Failed to vote",
//           description: result.error?.message,
//           variant: "destructive",
//         });
//       }

//       const successMessage =
//         voteType === "upvote"
//           ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
//           : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;

//       toast({
//         title: successMessage,
//         description: "Your vote has been recorded.",
//       });
//     } catch {
//       return toast({
//         title: "Failed to vote",
//         description: "An error occurred while voting. Please try again later.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div className="flex-center gap-2.5">
//       <div className="flex-center gap-1.5">
//         <Image
//           src={
//             success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
//           }
//           width={18}
//           height={18}
//           alt="upvoted"
//           className={`cursor-pointer ${isLoading && "opacity-50"}`}
//           aria-label="Upvote"
//           onClick={() => !isLoading && handleVote("upvote")}
//         />

//         <div className="flex-center backgroud-light700_dark400 min-w-5 rounded-sm p-1">
//           <p className="subtle-medium text-dark400_light900">
//             {formatNumber(upvotes)}
//           </p>
//         </div>
//       </div>

//       <div className="flex-center gap-1.5">
//         <Image
//           src={
//             success && hasDownvoted
//               ? "/icons/downvoted.svg"
//               : "/icons/downvote.svg"
//           }
//           width={18}
//           height={18}
//           alt="downvote"
//           className={`cursor-pointer ${isLoading && "opacity-50"}`}
//           aria-label="Downvote"
//           onClick={() => !isLoading && handleVote("downvote")}
//         />

//         <div className="flex-center backgroud-light700_dark400 min-w-5 rounded-sm p-1">
//           <p className="subtle-medium text-dark400_light900">
//             {formatNumber(downvotes)}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Votes;

"use client";

import { toast } from "@/hooks/use-toast";
import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface Params {
  targetType: "question" | "answer";
  targetId: string;
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}

const Votes = ({
  targetType,
  targetId,
  upvotes,
  downvotes,
  hasVotedPromise,
}: Params) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  // 1. Setup Refs for Animation Targets
  const upvoteRef = useRef<HTMLImageElement>(null);
  const downvoteRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Scope for safety

  const { contextSafe } = useGSAP({ scope: containerRef });

  const { success, data } = use(hasVotedPromise);
  const [isLoading, setIsLoading] = useState(false);

  // Safe destructuring with defaults
  const { hasUpvoted, hasDownvoted } = data || {
    hasUpvoted: false,
    hasDownvoted: false,
  };

  // 2. The Animation Logic 🎬
  const animateVote = contextSafe(
    (voteType: "upvote" | "downvote", isAdding: boolean) => {
      const targetRef =
        voteType === "upvote" ? upvoteRef.current : downvoteRef.current;

      // Physics: Upvote goes UP (-10), Downvote goes DOWN (+10)
      const yMove = voteType === "upvote" ? -10 : 10;

      if (isAdding) {
        // === VOTE ADDED: The "Jump" ===
        gsap.fromTo(
          targetRef,
          { y: 0, scale: 1 },
          {
            y: yMove, // Jump direction
            scale: 1.3, // Pop bigger
            duration: 0.3,
            ease: "back.out(2.5)", // The "Snap" effect
            yoyo: true, // Return to start
            repeat: 1,
          }
        );
      } else {
        // === VOTE REMOVED: The "Shake" ===
        gsap.to(targetRef, {
          x: voteType === "upvote" ? 2 : -2, // Shake side-to-side
          duration: 0.05,
          repeat: 3,
          yoyo: true,
          clearProps: "x",
        });
      }
    }
  );

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId)
      return toast({
        title: "Please login to vote",
        description: "Only logged-in users can vote.",
      });

    // 3. Trigger Animation IMMEDIATELY (Optimistic UI)
    const isAdding = voteType === "upvote" ? !hasUpvoted : !hasDownvoted;
    animateVote(voteType, isAdding);

    setIsLoading(true);

    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success) {
        return toast({
          title: "Failed to vote",
          description: result.error?.message,
          variant: "destructive",
        });
      }

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;

      toast({
        title: successMessage,
        description: "Your vote has been recorded.",
      });
    } catch {
      return toast({
        title: "Failed to vote",
        description: "An error occurred while voting. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5" ref={containerRef}>
      {/* ▲ UPVOTE SECTION */}
      <div className="flex-center gap-1.5">
        <Image
          ref={upvoteRef} // 👈 Attach Ref
          src={
            success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          width={18}
          height={18}
          alt="upvoted"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center backgroud-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      {/* ▼ DOWNVOTE SECTION */}
      <div className="flex-center gap-1.5">
        <Image
          ref={downvoteRef} // 👈 Attach Ref
          src={
            success && hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center backgroud-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
