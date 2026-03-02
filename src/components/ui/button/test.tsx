import { describe, expect, it } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { Button } from ".";

describe("component", () => {
  describe("Button", () => {
    it("should render correctly", () => {
      render(() => <Button>Hello, World!</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render correctly, asChild", () => {
      render(() => (
        <Button as="a" href="#">
          Hello, World!
        </Button>
      ));

      expect(screen.getByRole("link")).toBeInTheDocument();
    });
  });
});
