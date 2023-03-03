import { toNumber } from "lodash";
import { OperatorValue, Value } from "./Value";

export class Evaluator {
  OperatorStack: OperatorValue[] = []; // Store all the operators
  OperandsStack: Value[] = []; // Store all the operands

  // Define an api to update the operand
  // TODO: here only check paren match. some other cases may happen
  isExpressionLegal() {
    return this.OperatorStack.filter(operatorVal => operatorVal.getValue() == '(' || operatorVal.getValue() == ')').length === 0;
  }

  // This api is for testing the parsing result
  getPostFixExp() {
    return this.OperandsStack.reduce((pre, cur) => pre += cur.getValue() + ',', '')
  }

  // Define an api to check if the expression is legal or not

  // Postfix expression calculate
  calculate(): number {
    let resultArray: number[] = [];
    const test = this.OperandsStack.reverse();
    let left = 0;
    let right = 0;
    for (let i = test.length - 1; i >= 0; i--) {
      if (!test[i].isOperator())
        resultArray.push(toNumber(test[i].getValue()));
      else {
        // Operator
        // unary operator
        // binary operator
        // complicated trinary operator??
        if ((test[i] as OperatorValue).isBinaryOperator()) {
          right = resultArray.pop()!;
          left = resultArray.pop()!;
          switch (test[i].getValue()) {
            case '+':
              resultArray.push(left + right);
              break;
            case '-':
              resultArray.push(left - right);
              break;
            case '*':
              resultArray.push(right * left);
              break;
            case '/':
              resultArray.push(left / right);
              break;
            case '%':
              resultArray.push(left % right);
              break;
            default:
              throw new Error("Unsupported operator!!!!");
          }
        } else if ((test[i] as OperatorValue).isUnaryOperator()){
          let tmp = resultArray.pop()!;
          switch (test[i].getValue()) {
            // TODO: tmp can also be expression
            case '+':
              resultArray.push(tmp)
              break;
            case '-':
              resultArray.push(-tmp)
            default:
              break;
          }
        }

      }
    }
    if (resultArray.length)
      return resultArray.pop()!;
    return 0;
  }

}

