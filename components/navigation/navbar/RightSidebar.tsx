import HotQuestionCard from "@/components/cards/HotQuestionCard";
import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
// import ROUTES from "@/constants/routes";
import { getHotQuestion } from "@/lib/actions/question.action";
import { getTopTag } from "@/lib/actions/tag.action";
// import Image from "next/image";
// import Link from "next/link";
import React from "react";

const RightSidebar = async () => {
  const [
    { success, data: hotQuestions, error },
    { success: tagSuccess, data: tags, error: tagError },
  ] = await Promise.all([getHotQuestion(), getTopTag()]);

  return (
    <section
      className="custom-scrollbar background-light900_dark200
     light-border sticky 
     right-0 top-0 flex h-screen w-[360px] flex-col
     gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300
     dark:shadow-none max-xl:hidden"
    >
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <DataRenderer
          data={hotQuestions}
          empty={{
            title: "No questions found",
            message: "No questions have been asked yet",
          }}
          success={success}
          error={error}
          render={(hotQuestions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {hotQuestions.map(({ _id, title }) => (
                // <Link
                //   key={_id}
                //   href={ROUTES.QUESTION(_id)}
                //   className="flex cursor-pointer items-center justify-between gap-7"
                // >
                //   <p className="body-large text-dark500_light700 line-clamp-2">
                //     {title}
                //   </p>

                //   <Image
                //     src={"/icons/chevron-right.svg"}
                //     alt="Chevron"
                //     width={20}
                //     height={20}
                //     className="invert-colors"
                //   />
                // </Link>
                <HotQuestionCard key={_id} _id={_id} title={title} />
              ))}
            </div>
          )}
        />
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900"> Popular Tags</h3>
        <DataRenderer
          data={tags}
          empty={{
            title: "No tags found",
            message: "No tags have been asked yet",
          }}
          success={tagSuccess}
          error={tagError}
          render={(tags) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {tags.map(({ _id, name, questions }) => (
                <TagCard
                  key={_id}
                  _id={_id}
                  name={name}
                  questions={questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSidebar;
