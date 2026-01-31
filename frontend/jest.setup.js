import "@testing-library/jest-dom";

// Mock Next.js Image component
jest.mock("next/image", () => ({
	__esModule: true,
	default: (props) => {
		// eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
		return <img {...props} />;
	},
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
	return ({ children, href }) => {
		return <a href={href}>{children}</a>;
	};
});

// Setup global mocks
global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));
