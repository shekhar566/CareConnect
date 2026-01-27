import { generateText } from "ai";
import { testApiHandler } from "next-test-api-route-handler";
import { POST } from "@/app/api/ai/answers/route";

jest.mock("ai", () => ({
  generateText: jest.fn(),
}));

const mockedGenerateText = generateText as jest.Mock;

const validQuestion = "Pruritic polygonal purple papules on wrists";
const validContent = "Lichen Planus: Characterized by pruritic, polygonal...";
describe("POST /api/ai/answers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Success", () => {
    it("should return 200 and AI-generated text when request is valid", async () => {
      const mockResponse = "This is the generated markdown response";
      mockedGenerateText.mockResolvedValue({ text: mockResponse });

      const requestBody = {
        question: validQuestion,
        content: validContent,
        userAnswer: "Cure of itchy bumps on the flexor surfaces",
        patientAge: 30,
        gender: "Female",
        urgency: "Low",
      };

      await testApiHandler({
        appHandler: { POST },
        async test({ fetch }) {
          const res = await fetch({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });

          const json = await res.json();

          expect(res.status).toBe(200);
          expect(json).toEqual({ success: true, data: mockResponse });

          expect(mockedGenerateText).toHaveBeenCalledTimes(1);
          expect(mockedGenerateText.mock.calls[0][0].prompt).toContain(
            requestBody.question
          );
          expect(mockedGenerateText.mock.calls[0][0].prompt).toContain(
            requestBody.content
          );
          expect(mockedGenerateText.mock.calls[0][0].prompt).toContain(
            requestBody.userAnswer
          );
          expect(mockedGenerateText.mock.calls[0][0].prompt).toContain(
            String(requestBody.patientAge)
          );
          expect(mockedGenerateText.mock.calls[0][0].prompt).toContain(
            requestBody.gender
          );
          expect(mockedGenerateText.mock.calls[0][0].prompt).toContain(
            requestBody.urgency
          );
        },
      });
    });
  });
});
