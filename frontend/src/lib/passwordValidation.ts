/**
 * Standard password validation rules
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 */

export const PASSWORD_PATTERN =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const PASSWORD_VALIDATION_RULES = {
	minLength: 8,
	maxLength: 30,
	requiresUppercase: true,
	requiresLowercase: true,
	requiresNumber: true,
	requiresSpecialChar: true,
	specialChars: "@$!%*?&",
};

export const getPasswordValidationMessage = (): string => {
	return `Password must be at least ${PASSWORD_VALIDATION_RULES.minLength} characters and contain: uppercase letter, lowercase letter, number, and special character (@$!%*?&)`;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
	const errors: string[] = [];

	if (password.length < PASSWORD_VALIDATION_RULES.minLength) {
		errors.push(`At least ${PASSWORD_VALIDATION_RULES.minLength} characters required`);
	}

	if (password.length > PASSWORD_VALIDATION_RULES.maxLength) {
		errors.push(`Maximum ${PASSWORD_VALIDATION_RULES.maxLength} characters allowed`);
	}

	if (!/[A-Z]/.test(password)) {
		errors.push("At least one uppercase letter required");
	}

	if (!/[a-z]/.test(password)) {
		errors.push("At least one lowercase letter required");
	}

	if (!/\d/.test(password)) {
		errors.push("At least one number required");
	}

	if (!/[@$!%*?&]/.test(password)) {
		errors.push(
			`At least one special character required (${PASSWORD_VALIDATION_RULES.specialChars})`,
		);
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};
