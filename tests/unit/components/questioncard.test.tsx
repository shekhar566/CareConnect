import { render, screen } from "@testing-library/react";
import {
  MockEditDeleteAction,
  MockedImage,
  MockMetric,
  MockLink,
} from "@/tests/mocks";

import { getTimeStamp } from "@/lib/utils";

import QuestionCard from "@/components/cards/QuestionCard";

jest.mock("next/link", () => MockLink);
jest.mock("next/image", () => MockedImage);
jest.mock("@/components/user/EditDeleteAction", () => MockEditDeleteAction);
jest.mock("@/components/Metric", () => MockMetric);

const mockQuestion: Question = {
  _id: "123",
  title: "How to unit test a Next.js component?",
  content: "This is a sample question content",
  tags: [
    { _id: "tag1", name: "INFECTIOUS" },
    { _id: "tag2", name: "EMERGENCY" },
  ],
  author: {
    _id: "user1",
    name: "Austin Mark",
    image: "/images/user.jpg",
  },
  createdAt: new Date("2025-09-01T12:00:00Z"),
  upvotes: 10,
  downvotes: 0,
  answers: 5,
  views: 66,
  patientAge: 0,
  gender: "Male",
  urgency: "Low",
};

const relativeTimeText = getTimeStamp(mockQuestion.createdAt);

describe("QuestionCard Component", () => {
  describe("Rendering", () => {
    it("should render all elements", () => {
      render(<QuestionCard question={mockQuestion} />);

      // Title
      expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: mockQuestion.title })
      ).toHaveAttribute("href", "/questions/123");
      // Tags
      expect(screen.getByText("INFECTIOUS")).toBeInTheDocument();
      expect(screen.getByText("EMERGENCY")).toBeInTheDocument();
      // Avatar
      expect(
        screen.getByRole("img", {
          name: mockQuestion.author.name,
        })
      );
      expect(screen.getByText(/Austin Mark/)).toBeInTheDocument();
      // Timestamp
      expect(screen.getByText(relativeTimeText)).toBeInTheDocument();
      // Metrics
      expect(screen.getByText(/10/)).toBeInTheDocument();
      expect(screen.getByText(/Votes/)).toBeInTheDocument();

      expect(screen.getByText(/5/)).toBeInTheDocument();
      expect(screen.getByText(/Answers/)).toBeInTheDocument();

      expect(screen.getByText(/66/)).toBeInTheDocument();
      expect(screen.getByText(/Views/)).toBeInTheDocument();

      expect(screen.getByText("Age N/A")).toBeInTheDocument();
      expect(screen.getByText("Low Priority")).toBeInTheDocument();
    });
    describe("Action Buttons", () => {
      it("should render edit/delete actions when showActionBtns is true", () => {
        render(<QuestionCard question={mockQuestion} showActionBtns={false} />);

        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
      });

      it("should hide edit/delete actions when showActionBtns is false", () => {
        render(<QuestionCard question={mockQuestion} showActionBtns={false} />);

        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Responsive Behaviour", () => {
    it("should hide timestamp on small screens", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      window.dispatchEvent(new Event("resize"));

      render(<QuestionCard question={mockQuestion} />);

      const timestamp = screen.getByText(relativeTimeText, {
        selector: "span",
      });
      expect(timestamp).toHaveClass("sm:hidden");
    });
    it("should show timestamp on large screens", () => {
      // Simulate a large screen
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 800,
      });
      window.dispatchEvent(new Event("resize"));

      render(<QuestionCard question={mockQuestion} />);

      // Check timestamp visibility
      const timestampFlex = screen.getByText(relativeTimeText, {
        selector: "span",
      });
      expect(timestampFlex).toBeVisible();

      // Check metrics visibility
      expect(
        screen.getByText(new RegExp(`• asked ${relativeTimeText}`))
      ).toBeVisible();
      expect(screen.getByText(/10/)).toBeVisible();
    });
  });
});
