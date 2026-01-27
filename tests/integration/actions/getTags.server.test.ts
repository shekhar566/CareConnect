import { getTags } from "@/lib/actions/tag.action";
import { Question, Tag, User } from "@/database";
import { IUserDoc } from "@/database/user.model";
import { ITagDoc } from "@/database/tag.model";
import { getQuestions } from "@/lib/actions/question.action";

describe("getTags action", () => {
  describe("validation", () => {
    it("should return error if invalid params", async () => {
      const invalidParams = {
        page: "invalid",
        pageSize: -5,
      } as unknown as PaginatedSearchParams;

      const result = await getTags(invalidParams);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error && result.error.message).toContain(
        "Expected number, received string, Number must be greater than 0"
      );
    });
  });

  describe("Pagination and Sorting", () => {
    let testUser: IUserDoc;
    let testTags: ITagDoc[];

    beforeEach(async () => {
      // 1. Create test user
      testUser = await User.create({
        name: "Test User",
        username: "testuser",
        email: "test@example.com",
      });

      // 2. Create test tags
      testTags = await Tag.insertMany([
        { name: "EMERGENCY", questions: 0 },
        { name: "PEDIATRICS", questions: 0 },
        { name: "GERIATRICS", questions: 0 },
      ]);

      // 3. Create test questions
      const testQuestions = [
        {
          title: "The Cardiac Emergency",
          content: "Acute onset retrosternal chest pain radiating to left arm",
          author: testUser._id,
          tags: [testTags[1]._id],
          views: 66,
          upvotes: 50,
          answers: 5,
          createdAt: new Date("2024-01-01"),
          urgency: "Low",
          patientAge: 30,
          gender: "Male",
        },
        {
          title: "The Pediatric Mystery",
          content: "4-year-old female with persistent fever...",
          author: testUser._id,
          tags: [testTags[0]._id],
          views: 200,
          upvotes: 75,
          answers: 0,
          createdAt: new Date("2024-02-01"),
          urgency: "Medium",
          patientAge: 45,
          gender: "Female",
        },
        {
          title: "The Dermatology Visual",
          content: "Pruritic polygonal purple papules on wrists",
          author: testUser._id,
          tags: [testTags[2]._id],
          views: 150,
          upvotes: 100,
          answers: 3,
          createdAt: new Date("2024-03-01"),
          urgency: "Critical",
          patientAge: 50,
          gender: "Male",
        },
      ];

      await Question.insertMany(testQuestions);
    });

    afterEach(async () => {
      await Question.deleteMany({});
      await Tag.deleteMany({});
      await User.deleteMany({});
    });

    it("should return the first page of questions sorted by creation date (default behavior)", async () => {
      const result = await getQuestions({ page: 1, pageSize: 2 });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(2);
      expect(result.data?.questions[0].title).toBe("The Dermatology Visual"); // Mar 1
      expect(result.data?.questions[1].title).toBe("The Pediatric Mystery"); // Feb 1
      expect(result.data?.isNext).toBe(true);
    });

    it("should return the second page of questions when paginated", async () => {
      const result = await getQuestions({ page: 2, pageSize: 2 });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(1);
      expect(result.data?.questions[0].title).toBe("The Cardiac Emergency"); // Jan 1
      expect(result.data?.isNext).toBe(false);
    });

    it("should sort questions by newest when filter is 'newest'", async () => {
      const result = await getQuestions({
        page: 1,
        pageSize: 10,
        filter: "newest",
      });

      expect(result.success).toBe(true);
      expect(result.data?.questions[0].title).toBe("The Dermatology Visual");
      expect(result.data?.questions[1].title).toBe("The Pediatric Mystery");
      expect(result.data?.questions[2].title).toBe("The Cardiac Emergency");
    });

    it("should filter and sort unanswered questions when filter is 'unanswered'", async () => {
      const result = await getQuestions({
        page: 1,
        pageSize: 10,
        filter: "unanswered",
      });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(1);
      expect(result.data?.questions[0].title).toBe("The Pediatric Mystery");
      expect(result.data?.questions[0].answers).toBe(0);
    });

    it("should sort questions by upvotes when filter is 'popular'", async () => {
      const result = await getQuestions({
        page: 1,
        pageSize: 10,
        filter: "popular",
      });

      expect(result.success).toBe(true);

      expect(result.data?.questions[0].title).toBe("The Dermatology Visual");
      expect(result.data?.questions[0].upvotes).toBe(100);
    });
    it("should return the second page of tags when paginated", async () => {
      const { success, data } = await getTags({ page: 2, pageSize: 2 });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(1);
      expect(data?.isNext).toBe(false);
    });
  });

  describe("Search Funtionality", () => {
    beforeEach(async () => {
      const testTags = [
        { name: "EMERGENCY", questions: 100, createdAt: "2026-01-01" },
        { name: "PEDIATRICS", questions: 50, createdAt: "2026-02-01" },
        { name: "GERIATRICS", questions: 200, createdAt: "2026-03-01" },
      ];

      await Tag.insertMany(testTags);
    });

    afterEach(async () => {
      await Tag.deleteMany({});
    });

    it("should filter tags by partial name match (case insensitive)", async () => {
      const { success, data } = await getTags({
        page: 1,
        pageSize: 10,
        query: "ICS",
      });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(2);
      expect(data?.tags.map((tag) => tag.name)).toEqual(
        expect.arrayContaining(["PEDIATRICS", "GERIATRICS"])
      );
    });

    it("should return an empty array when no tags", async () => {
      const { success, data } = await getTags({
        page: 1,
        pageSize: 10,
        query: "nonexistent",
      });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(0);
    });
  });
});
