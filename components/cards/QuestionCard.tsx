// import ROUTES from "@/constants/routes";
// import { getTimeStamp } from "@/lib/utils";
// import Link from "next/link";
// import React from "react";
// import TagCard from "./TagCard";
// import Metric from "@/components/Metric";
// import EditDeleteAction from "../user/EditDeleteAction";

// interface Props {
//   question: Question;
//   showActionBtns?: boolean;
// }

// const QuestionCard = ({
//   question: { _id, title, tags, author, createdAt, upvotes, answers, views },
//   showActionBtns = false,
// }: Props) => {
//   return (
//     <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
//       <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
//         <div className="flex-1">
//           <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
//             {getTimeStamp(createdAt)}
//           </span>

//           <Link href={ROUTES.QUESTION(_id)}>
//             <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
//               {title}
//             </h3>
//           </Link>
//         </div>

//         {showActionBtns && <EditDeleteAction type="Question" itemId={_id} />}
//       </div>

//       <div
//         className="mt-3.5 flex w-full flex-wrap
//       gap-2"
//       >
//         {tags.map((tag: Tag) => (
//           <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
//         ))}
//       </div>

//       <div className="flex-between mt-6 w-full flex-wrap gap-3">
//         <Metric
//           imgUrl={author.image}
//           alt={author.name}
//           value={author.name}
//           title={`• asked ${getTimeStamp(createdAt)}`}
//           href={ROUTES.PROFILE(author._id)}
//           textStyles="body-medium text-dark400_light700"
//           // isAuthor
//           titleStyles="max-sm:hidden"
//         />

//         <div
//           className="max:sm:flex-wrap max:sm:justify-start flex
//         items-center gap-3"
//         >
//           <Metric
//             imgUrl="/icons/like.svg"
//             alt="like"
//             value={upvotes}
//             title=" Votes"
//             textStyles="small-medium text-dark400_light800"
//           />

//           <Metric
//             imgUrl="/icons/message.svg"
//             alt="answers"
//             value={answers}
//             title=" Answers"
//             textStyles="small-medium text-dark400_light800"
//           />

//           <Metric
//             imgUrl="/icons/eye.svg"
//             alt="views"
//             value={views}
//             title=" Views"
//             textStyles="small-medium text-dark400_light800"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionCard;

import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import TagCard from "./TagCard";
import Metric from "@/components/Metric";
import EditDeleteAction from "../user/EditDeleteAction";

interface Props {
  question: Question;
  showActionBtns?: boolean;
}

// 1. HELPER: Urgency Colors
const getUrgencyStyle = (urgency: string) => {
  switch (urgency) {
    case "Critical":
      return "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    case "Medium":
      return "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
    case "Low":
      return "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    default:
      return "hidden";
  }
};

const QuestionCard = ({
  question: {
    _id,
    title,
    tags,
    author,
    createdAt,
    upvotes,
    answers,
    views,
    // NEW MEDICAL FIELDS (Destructured from question)
    patientAge,
    gender,
    urgency,
  },
  showActionBtns = false,
}: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>

          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        {showActionBtns && <EditDeleteAction type="Question" itemId={_id} />}
      </div>

      {/* 2. MEDICAL INFO SECTION (New) */}
      <div className="mt-3.5 flex flex-wrap items-center gap-3">
        {urgency && (
          <div
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getUrgencyStyle(
              urgency
            )}`}
          >
            {urgency} Priority
          </div>
        )}

        {(patientAge || gender) && (
          <div className="body-medium text-dark400_light700 flex items-center gap-1 rounded-md bg-light-800 px-3 py-1 dark:bg-dark-400">
            <span className="text-primary-500">🏥 Patient:</span>
            <span className="text-dark200_light900 font-semibold">
              {patientAge ? `${patientAge}yo` : "Age N/A"}
            </span>
            <span className="text-light-400">•</span>
            <span className="text-dark200_light900 font-semibold">
              {gender || "Unknown"}
            </span>
          </div>
        )}
      </div>
      {/* --------------------------- */}

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`• asked ${getTimeStamp(createdAt)}`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          titleStyles="max-sm:hidden"
        />

        <div className="max:sm:flex-wrap max:sm:justify-start flex items-center gap-3">
          <Metric
            imgUrl="/icons/like.svg"
            alt="like"
            value={upvotes}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />

          <Metric
            imgUrl="/icons/message.svg"
            alt="answers"
            value={answers}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />

          <Metric
            imgUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
