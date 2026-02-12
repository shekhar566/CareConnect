import LocalSearch from "@/components/Search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import HomeFilter from "@/components/filter/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTION } from "@/constants/states";
import CommonFilter from "@/components/filter/CommonFilter";
import { HomePageFilters } from "@/constants/filters";
import Pagination from "@/components/Pagination";
import HomeAnimation from "@/components/wrappers/HomeAnimation";
import AskButton from "@/components/ui/AskButton";

// interface SearchParams {
//   searchParams: Promise<{ [key: string]: string }>;
// }
const Home = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { questions, isNext } = data || {};

  return (
    <>
      <HomeAnimation>
        <section
          className="flex w-full flex-col-reverse justify-between
      gap-4 sm:flex-row sm:items-center"
        >
          <h1 className="h1-bold text-dark100_light900">All Questions</h1>

          <Button
            className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
            asChild
          >
            <Link href={ROUTES.ASK_QUESTION} className="max-sm:w-full">
              <AskButton />
            </Link>
          </Button>
        </section>

        <section className="mt-11 flex justify-between gap-5 animate-in max-sm:flex-col sm:items-center">
          <LocalSearch
            route={ROUTES.HOME}
            imgSrc="/icons/search.svg"
            placeholder="Search questions..."
            iconPosition="left"
            otherClasses="flex-1"
          />

          <CommonFilter
            filters={HomePageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-md:flex"
          />
        </section>

        <div className="animate-in">
          <HomeFilter />
        </div>

        <DataRenderer
          success={success}
          error={error}
          data={questions}
          empty={EMPTY_QUESTION}
          render={(questions) => (
            <div className="mt-10 flex w-full flex-col gap-6">
              {questions.map((question) => (
                <QuestionCard key={question._id} question={question} />
              ))}
            </div>
          )}
        />

        <Pagination page={page} isNext={isNext || false} />
      </HomeAnimation>
    </>
  );
};
export default Home;
