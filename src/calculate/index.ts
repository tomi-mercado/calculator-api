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

const haveValidExpressions = (expressions: string[]) => {
  const numbersAmount = expressions.filter(
    (expression) => numberSchema.safeParse(expression).success
  ).length;
  const operationsAmount = expressions.filter(
    (expression) => operationSchema.safeParse(expression).success
  ).length;

  if (operationsAmount > 0) {
    return numbersAmount >= 2;
  }

  return numbersAmount === 1;
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

      const operationParseResult = operationSchema.safeParse(char);

      if (!operationParseResult.success && char !== "(" && char !== ")") {
        throw new Error(`Invalid operation: ${char}`);
      }

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
  // First pass - handle multiplication and division
  const intermediateResults: number[] = [];
  let currentOperation = "+";
  let currentNumber: number | null = null;

  for (const char of expression) {
    const numberParseResult = numberSchema.safeParse(char);
    const operationParseResult = operationSchema.safeParse(char);

    // If it's an operation, we store the current number if exists, and update the current operation
    if (operationParseResult.success) {
      currentOperation = char;

      if (currentNumber === null) {
        continue;
      }

      intermediateResults.push(currentNumber);
      currentNumber = null;
      continue;
    }

    // The char is not an operation, also it's not a number. Something is wrong here, so we need to throw.
    if (!numberParseResult.success) {
      throw new Error(`Invalid number: ${char}`);
    }

    const number = numberParseResult.data;

    const isMultiplication = currentOperation === "*";
    const isDivision = currentOperation === "/";

    // If it's not a multiplication or division, we store the current number and continue
    if (!isMultiplication && !isDivision) {
      if (currentNumber !== null) {
        intermediateResults.push(currentNumber);
      }

      currentNumber = number;

      continue;
    }

    // If it's a multiplication or division, we need to calculate the result with the current number, using the saved operation
    if (currentNumber === null) {
      currentNumber = intermediateResults.pop() ?? null;
    }

    // If there's no current number, we continue to the next iteration
    if (!currentNumber) {
      continue;
    }

    // We need to multiplie or divide the number that we have from a previous non multiplication or division, or the last intermediate result with the number that the current char represents
    currentNumber =
      currentOperation === "*"
        ? currentNumber * number
        : currentNumber / number;
  }

  if (currentNumber !== null) {
    intermediateResults.push(currentNumber);
  }

  // Second pass - handle addition and subtraction
  const sumAndSubOperations = expression.filter(
    (char) => char === "+" || char === "-"
  );
  const result = intermediateResults.reduce((acc, number, index) => {
    const currentOperation = sumAndSubOperations[index - 1] || "+";
    return currentOperation === "+" ? acc + number : acc - number;
  }, 0);

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

  if (parenthesis !== 0) {
    throw new Error(
      `Invalid operation. Check your parenthesis: ${expressions.join("")}`
    );
  }

  if (includesParenthesis(innerExpression)) {
    return getMoreInnerExpression(
      separateExpressions(removeInitialAndFinalParenthesis(innerExpression))
    );
  }

  return innerExpression;
};

export const calculate = (operation: string): number => {
  const parsedOperation = parseOperation(operation);

  if (parsedOperation === "") {
    return 0;
  }

  const expressions = separateExpressions(parsedOperation);

  if (!haveValidExpressions(expressions)) {
    throw new Error(
      `Invalid operation: ${operation}. At least 2 numbers are required to operate if an operator is present. Send a single number to calculate its value.`
    );
  }

  if (!includesParenthesis(parsedOperation)) {
    return resolveExpression(expressions);
  }

  const innerExpression = getMoreInnerExpression(expressions);
  const innerExpressionResult = resolveExpression(
    separateExpressions(innerExpression)
  );

  const newOperation = parsedOperation.replace(
    `(${innerExpression})`,
    innerExpressionResult.toString()
  );

  return calculate(newOperation);
};
