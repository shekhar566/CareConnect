export * from "./router.mock";
export * from "./toast.mock";

// prevents TEST POLLUTION
export const resetAllMocks = () => {
  jest.clearAllMocks();
};
