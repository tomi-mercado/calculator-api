import z from "zod";

const numberSchema = z.preprocess((val) => {
  if (val === " ") {
    return NaN;
  }

  return val;
}, z.number({ coerce: true }));
const VALID_OPERATIONS = ["+", "-", "*", "/"] as const;
const operationSchema = z.enum(VALID_OPERATIONS);

const parseOperation = (operation: string) => {
  return operation.trim().replaceAll(" ", "");
};

const haveValidOperation = (operation: string) => {
  let chars = operation.split("");

  for (const char of chars) {
    if (!operationSchema.safeParse(char).success) {
      continue;
    }

    return true;
  }

  return false;
};

const MIN_NUMBERS = 2;
const haveValidNumbers = (operation: string) => {
  const chars = operation.split("");

  let numbers = 0;
  for (const char of chars) {
    if (numberSchema.safeParse(char).success) {
      numbers++;
    }

    if (numbers >= MIN_NUMBERS) {
      return true;
    }
  }

  return false;
};

const includesParenthesis = (operation: string) => {
  return operation.includes("(") && operation.includes(")");
};

/**
 * Separate the expressions in the operation, in an array of strings
 * We know that the valid operations, and the parenthesis, generate new expressions.
 * Given that information, we can separate the expressions in the operation.
 *
 * An expression will be a combination of numbers and operations
 */
const separateExpressions = (operation: string) => {
  let expressions: string[] = [];
  let currentNumber = "";

  for (const char of operation) {
    if (numberSchema.safeParse(char).success) {
      currentNumber += char;
    } else {
      if (currentNumber) {
        expressions.push(currentNumber);
      }

      // Since this should be previously validated, we can assume that char is an operation
      expressions.push(char);
      currentNumber = "";
    }
  }

  if (currentNumber) {
    expressions.push(currentNumber);
  }

  return expressions;
};

const removeInitialAndFinalParenthesis = (expression: string) => {
  const startAndEndWithParenthesis =
    expression.startsWith("(") && expression.endsWith(")");

  if (!startAndEndWithParenthesis) {
    return expression;
  }

  return expression.slice(1, expression.length - 1);
};

const resolveExpression = (expression: string[]) => {
  let result = 0;
  let currentOperation = "+";

  for (const char of expression) {
    if (operationSchema.safeParse(char).success) {
      currentOperation = char;
      continue;
    }

    const number = numberSchema.safeParse(char).data;

    if (!number) {
      continue;
    }

    switch (currentOperation) {
      case "+":
        result += number;
        break;
      case "-":
        result -= number;
        break;
      case "*":
        result *= number;
        break;
      case "/":
        result /= number;
        break;
    }
  }

  return result;
};

const getMoreInnerExpression = (expressions: string[]) => {
  if (!includesParenthesis(expressions.join(""))) {
    return expressions.join("");
  }

  let innerExpression = "";
  let parenthesis = 0;

  for (const expression of expressions) {
    if (expression === "(") {
      parenthesis++;
    }

    if (parenthesis > 0) {
      innerExpression += expression;
    }

    if (expression === ")") {
      parenthesis--;
    }
  }

  if (includesParenthesis(innerExpression)) {
    return getMoreInnerExpression(
      separateExpressions(removeInitialAndFinalParenthesis(innerExpression))
    );
  }

  return innerExpression;
};

export const calculate = (operation: string) => {
  if (!haveValidOperation(operation)) {
    throw new Error("Invalid operation");
  }

  if (!haveValidNumbers(operation)) {
    throw new Error("Invalid numbers");
  }

  const parsedOperation = parseOperation(operation);
  const expressions = separateExpressions(parsedOperation);

  let moreInnerExpression = getMoreInnerExpression(expressions);
  let result = resolveExpression(separateExpressions(moreInnerExpression));

  return result;
};
