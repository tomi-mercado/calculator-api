import { expect, test } from "vitest";
import { calculate } from ".";

// Functional requirements:
// • The only operations available will be + - * /.
// • You can assume that you will always have a well-formed equation with at least 1 term.
// • The only term separator will be the (). We WON’T use {} or [] as term division.

test("Should handle empty strings", () => {
  expect(calculate("")).toBe(0);
});

test("Should throw if there is not an operand", () => {
  expect(() => {
    calculate("+");
  }).toThrow();
});

test("Should return the same number if there is just one number, even with spaces", () => {
  expect(calculate("11")).toBe(11);
});

test("Should be able to handle zero leading numbers", () => {
  expect(calculate("001 + 00003")).toBe(4);
});

test("Should throw if there is just one term", () => {
  expect(() => {
    calculate("1 +");
  }).toThrow();
  expect(() => {
    calculate("+ 1");
  }).toThrow();
});

test("Should throw with malformed parentheses", () => {
  expect(() => {
    calculate("12 + (5 * (2 + 3)))");
  }).toThrow();
});

test("Should allow two consecutives operators", () => {
  expect(calculate("1 + + 1")).toBe(2);
});

test("Should throw if there is an invalid operator", () => {
  expect(() => {
    calculate("1 % 1");
  }).toThrow();
});

test("Should throw if there is an invalid operand", () => {
  expect(() => {
    calculate("1 + a");
  }).toThrow();
});

test('Should return 2 when the input is "1 + 1"', () => {
  expect(calculate("1 + 1")).toBe(2);
});

test('Should return 0 when the input is "1 - 1"', () => {
  expect(calculate("1 - 1")).toBe(0);
});

test('Should return 1 when the input is "1 * 1"', () => {
  expect(calculate("1 * 1")).toBe(1);
});

test('Should return 1 when the input is "1 / 1"', () => {
  expect(calculate("1 / 1")).toBe(1);
});

test('Should return 2 when the input is "(1 + 1)"', () => {
  expect(calculate("(1 + 1)")).toBe(2);
});

test('Should return 2 when the input is "(1 + 1) + 1"', () => {
  expect(calculate("(1 + 1) + 1")).toBe(3);
});

test('Should return 2 when the input is "(1 + 1) - 1"', () => {
  expect(calculate("(1 + 1) - 1")).toBe(1);
});

test('Should return 2 when the input is "(1 + 1) * 1"', () => {
  expect(calculate("(1 + 1) * 1")).toBe(2);
});

test('Should return 2 when the input is "(1 + 1) / 1"', () => {
  expect(calculate("(1 + 1) / 1")).toBe(2);
});

test('Should work with nested parenthesis, returning 4 when the input is "((1 + 1) / 2) * 4"', () => {
  expect(calculate("((1 + 1) / 2) * 4")).toBe(4);
});

test('Should work with triple nested parenthesis, returning 33 when the input is "12 + ((5 + 2) * 3)"', () => {
  expect(calculate("12 + ((5 + 2) * 3)")).toBe(33);
});

test("Should be able to separate in terms without parentheses, returning 11 when the input is '3 + 4 * 2'", () => {
  expect(calculate("3 + 4 * 2 ")).toBe(11);
});
