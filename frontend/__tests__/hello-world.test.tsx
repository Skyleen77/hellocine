import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HelloWorld from "../app/(app)/hello-world/page";

describe("Hello World", () => {
	it("renders a heading", () => {
		render(<HelloWorld />);

		const heading = screen.getByRole("heading", { level: 1 });

		expect(heading).toBeInTheDocument();
	});
});
