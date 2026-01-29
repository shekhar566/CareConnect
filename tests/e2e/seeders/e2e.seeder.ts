import { BROWSER_USERS, COMMON_USERS } from "../fixtures/users";
import { SAMPLE_QUESTIONS } from "../fixtures/questions";
import { createTestUser } from "./user.seeder";
import { createTestQuestion } from "./question.seeder";

export async function seed() {
  try {
    const chromeUser = await createTestUser(BROWSER_USERS.chrome);

    const usersPromises = COMMON_USERS.map(async (user) =>
      createTestUser(user)
    );
    const allUsers = await Promise.all(usersPromises);

    const questionsPromises = SAMPLE_QUESTIONS.slice(0, 3).map(
      async (question) =>
        createTestQuestion({
          ...question,
          author: chromeUser._id.toString(),
        })
    );
    const allquestions = await Promise.all(questionsPromises);

    console.log("E2E database seeded with tested data");

    return {
      users: { chromeUser, ...allUsers },
      questions: allquestions,
    };
  } catch (e) {
    console.error("Failed to seed E2E data", e);
    throw e;
  }
}
