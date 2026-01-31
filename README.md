Property Rental App - Testing Guide

This project includes comprehensive test suites for both backend and frontend components.

## Test Structure

### Backend Tests (`/backend/tests/`)

- **bookingValidation.test.js** - Tests for time slot generation, conflict detection, and availability checking
- **user.controller.test.js** - Tests for user controller endpoints (reservations, favorites, etc.)
- **middleware.test.js** - Tests for authentication middleware

### Frontend Tests (`/frontend/__tests__/`)

- **navbar.test.tsx** - Tests for navigation component and user session handling
- **favorites.test.tsx** - Tests for favorites page functionality

## Running Tests

### Backend Tests

First, install Jest and related dependencies:

```bash
cd backend
npm install --save-dev jest @types/jest supertest
```

Run all backend tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

Run specific test file:

```bash
npm test -- bookingValidation.test.js
```

Run tests in watch mode:

```bash
npm test -- --watch
```

### Frontend Tests

First, install testing dependencies:

```bash
cd frontend
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Run all frontend tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

Run specific test file:

```bash
npm test -- navbar.test.tsx
```

## Test Coverage

### Backend Coverage

- Controllers: Reservation creation, deletion, updates, favorites management
- Validation: Time slot conflicts, availability checking
- Middleware: JWT authentication and authorization
- Models: Data validation (via controller tests)

### Frontend Coverage

- Components: Navbar user state management, initials display
- Pages: Favorites loading and display
- User Authentication: Session handling, logout functionality
- API Integration: Mocked axios requests

## Writing New Tests

### Backend Test Example

```javascript
import { functionToTest } from "../path/to/function.js";

describe("Feature Name", () => {
	it("should do something specific", async () => {
		// Arrange
		const input = "test-data";

		// Act
		const result = await functionToTest(input);

		// Assert
		expect(result).toBe(expected);
	});
});
```

### Frontend Test Example

```typescript
import { render, screen } from "@testing-library/react";
import Component from "@/path/to/component";

describe("Component Name", () => {
	it("should render correctly", () => {
		render(<Component />);

		const element = screen.getByText("Expected Text");
		expect(element).toBeInTheDocument();
	});
});
```

## Continuous Integration

Add these scripts to package.json files:

### Backend package.json

```json
{
	"scripts": {
		"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
		"test:watch": "npm test -- --watch",
		"test:coverage": "npm test -- --coverage"
	}
}
```

### Frontend package.json

```json
{
	"scripts": {
		"test": "jest",
		"test:watch": "jest --watch",
		"test:coverage": "jest --coverage"
	}
}
```

## Key Testing Principles

1. **Isolation** - Each test should be independent
2. **Clarity** - Test names should clearly describe what they test
3. **Coverage** - Aim for >80% code coverage
4. **Mocking** - Mock external dependencies (DB, APIs, storage)
5. **Assertions** - Each test should have clear assertions

## Common Issues

### Backend

- **Module import errors**: Ensure jest.config.js has correct ESM settings
- **DB connection**: Tests should mock database calls, not connect to real DB

### Frontend

- **SessionStorage**: Mocked in test files to avoid window undefined errors
- **Next.js components**: Image and Link components are mocked in jest.setup.js

## Test Reports

Coverage reports are generated in:

- Backend: `/backend/coverage/`
- Frontend: `/frontend/coverage/`

Open `coverage/lcov-report/index.html` in a browser to view detailed coverage reports.
