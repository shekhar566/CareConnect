import { Question, Tag } from "@/database";
import { TestQuestion } from "@/tests/e2e/fixtures/questions";

export async function createTestQuestion({
  title,
  content,
  author,
  tags,
}: TestQuestion & { author: string }) {
  const tagIds = await Promise.all(
    tags.map(async (tagName: string) => {
      const tag = await Tag.findByIdAndUpdate(
        { name: tagName },
        { $setOnInsert: { name: tagName } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return tag._id;
    })
  );

  const question = await Question.create({
    title,
    content,
    tags,
    tagIds,
    author,
  });

  console.log(`Created test question: ${title}`);
  return question;
}
