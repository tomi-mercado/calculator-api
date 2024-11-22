import { expect, test } from "vitest";
import { calculate } from ".";

// Functional requirements:
// • The only operations available will be + - * /.
// • You can assume that you will always have a well-formed equation with at least 1 term.
// • The only term separator will be the (). We WON’T use {} or [] as term division.

test("Should throw if there is not an operand", () => {
  expect(() => {
    calculate("+");
  }).toThrow();
});

test("Should throw if there is not an operator", () => {
  expect(() => {
    calculate("1 1");
  }).toThrow();
  expect(() => {
    calculate("1");
  });
});

test("Should throw if there is just one term", () => {
  expect(() => {
    calculate("1 +");
  }).toThrow();
  expect(() => {
    calculate("+ 1");
  });
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

test("All mentioned cases should work if there are not spaces between the terms", () => {
  expect(calculate("(1+1)/1")).toBe(2);
  expect(calculate("(1+1)+1")).toBe(3);
  expect(calculate("(1+1)-1")).toBe(1);
  expect(calculate("(1+1)*1")).toBe(2);
  expect(calculate("(1+1)/1")).toBe(2);
  expect(calculate("((1+1)/2)*4")).toBe(4);
});
