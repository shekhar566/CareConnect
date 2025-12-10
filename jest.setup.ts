import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ replace: jest.fn(), push: jest.fn })),
}));
