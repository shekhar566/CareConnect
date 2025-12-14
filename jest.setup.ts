import "@testing-library/jest-dom";
import { mockToast, mockUseRouter, mockUseToast } from "./tests/mocks";

jest.mock("next/navigation", () => ({ useRouter: mockUseRouter }));
jest.mock("@/hooks/use-toast", () => ({
  useToast: mockUseToast,
  toast: mockToast,
}));
