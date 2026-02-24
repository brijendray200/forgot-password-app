const { generateRandomPassword } = require('../utils/passwordGenerator');

describe('Password Generator Tests', () => {
  test('should generate password of correct length', () => {
    const password = generateRandomPassword(12);
    expect(password.length).toBe(12);
  });

  test('should generate password with only letters', () => {
    const password = generateRandomPassword(20);
    const onlyLetters = /^[a-zA-Z]+$/;
    expect(onlyLetters.test(password)).toBe(true);
  });

  test('should contain at least one uppercase letter', () => {
    const password = generateRandomPassword(12);
    const hasUppercase = /[A-Z]/.test(password);
    expect(hasUppercase).toBe(true);
  });

  test('should contain at least one lowercase letter', () => {
    const password = generateRandomPassword(12);
    const hasLowercase = /[a-z]/.test(password);
    expect(hasLowercase).toBe(true);
  });

  test('should not contain numbers', () => {
    const password = generateRandomPassword(15);
    const hasNumbers = /\d/.test(password);
    expect(hasNumbers).toBe(false);
  });

  test('should not contain special characters', () => {
    const password = generateRandomPassword(15);
    const hasSpecialChars = /[^a-zA-Z]/.test(password);
    expect(hasSpecialChars).toBe(false);
  });

  test('should generate different passwords each time', () => {
    const password1 = generateRandomPassword(12);
    const password2 = generateRandomPassword(12);
    expect(password1).not.toBe(password2);
  });
});
