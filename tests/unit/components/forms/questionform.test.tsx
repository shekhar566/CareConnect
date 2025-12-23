import { render, screen } from "@testing-library/react";
import QuestionForm from "@/components/forms/QuestionForm";
import { MockEditor } from "@/tests/mocks/editor.mock";
import { resetAllMocks } from "@/tests/mocks";
import userEvent from "@testing-library/user-event";
import { createQuestion } from "@/lib/actions/question.action";

jest.mock("@/components/editor", () => MockEditor);
jest.mock("@/lib/actions/question.action", () => ({
  createQuestion: jest.fn(),
}));

const mockCreateQuestion = createQuestion as jest.Mock;

const user = userEvent.setup();

describe("QuestionForm Component", () => {
  beforeEach(() => {
    resetAllMocks();
    mockCreateQuestion.mockClear();
  });

  describe("Rendering", () => {
    it("should render all form fields", async () => {
      render(<QuestionForm />);

      expect(screen.getByLabelText(/Case Title/i)).toBeInTheDocument();
      expect(
        await screen.findByLabelText(/Detailed Case Description/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Specialties \/ Tags/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Post Case/i })
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("should show validation errors when form is submitted empty", async () => {
      render(<QuestionForm />);

      const titleInput = screen.getByRole("textbox", { name: /title/i });
      const submitBtn = screen.getByRole("button", {
        name: /Post Case/i,
      });
      await user.type(titleInput, "a".repeat(101));
      await user.click(submitBtn);

      expect(
        await screen.findByText(/Title cannot exceed 100 characters/i)
      ).toBeInTheDocument();
      expect(screen.queryByText(/Title is required/i)).not.toBeInTheDocument();
      expect(
        await screen.findByText(/At least one tag is required/i)
      ).toBeInTheDocument();
    });
  });
});
