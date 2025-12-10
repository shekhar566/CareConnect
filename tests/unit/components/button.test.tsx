import { Button } from "@/components/ui/button";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Button Component - TDD Approach", () => {
  it("should render a button with text", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
  });

  it("should call the onClick function when the button is clicked", () => {
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));

    expect(onClick).toHaveBeenCalled();
  });

  it("should render the button with the correct variant", () => {
    render(<Button variant="destructive">Click me</Button>);

    const btn = screen.getByRole("button");

    expect(btn.className).toContain("bg-destructive");
    expect(btn.className).toContain("hover:bg-destructive/90");
  });

  it("should render the button with the correct disabled state", () => {
    render(<Button disabled>Click me</Button>);

    expect(screen.getByText("Click me")).toHaveAttribute("disabled");
  });
});
