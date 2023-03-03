import { StringChain, toNumber } from "lodash";
import { Evaluator } from "./Evaluator";
import { ExpressionLexer, TokenTypes } from "./Lexer";
import { FloatValue, IntegerValue, OperatorValue, ScinumberValue, Value, VariableValue } from "./Value";


// What parser should do?
// Check expression is legal or not
// 1 : Calculate the expression result
// 2 : Recursive calculate all the expressions
// Besides, we use postfix expression to calculate the expression
export class ExpressionParser {
  Lexer: ExpressionLexer;
  constructor() {
    this.Lexer = new ExpressionLexer();
  }

  parse(inputExpr: string, eva: Evaluator): boolean {
    this.Lexer.init(inputExpr);
    this.Lexer.lex();
    // Because we only have expression here so ,parseExpr() is the root entry
    if (this.parseExpr(eva))
      return true;

    return false;
  }

  // Parse expression
  parseExpr(eva: Evaluator): boolean {
    while (this.Lexer.getCode() !== TokenTypes.Eof) {
      const code = this.Lexer.getCode();
      const CurCodePrecedence = this.Lexer.getOperatorPrecedence(code);
      const StackTopPrecedence = this.Lexer.getOperatorPrecedence(eva.OperatorStack[eva.OperatorStack.length - 1]?.getOperatorTokenType());
      // Core recursive function for parser
      switch (this.Lexer.getCode()) {
        // Parser number
        case TokenTypes.INT_VAL:
          eva.OperandsStack.push(new IntegerValue(toNumber(this.Lexer.getCurTokenStr)));
          break;
        case TokenTypes.FLOAT_VAL:
          eva.OperandsStack.push(new FloatValue(toNumber(this.Lexer.getCurTokenStr)));
          break;
        case TokenTypes.SCI_VAL:
          eva.OperandsStack.push(new ScinumberValue(toNumber(this.Lexer.getCurTokenStr)));
          break;
        // Handle Operator
        case TokenTypes.Plus:
        case TokenTypes.Minor:
        case TokenTypes.Divide:
        case TokenTypes.Multi:
        case TokenTypes.Unary_minor:
        case TokenTypes.Unary_plus:
        case TokenTypes.Rem: // TODO: Update these codes
          // Deal with operator
          const OperatorVal = new OperatorValue(this.Lexer.getCharByToken(this.Lexer.getCode()), code);
          if (!eva.OperatorStack.length || eva.OperatorStack[eva.OperatorStack.length - 1].getValue() === '(') {
            eva.OperatorStack.push(OperatorVal);
          } else if (CurCodePrecedence > StackTopPrecedence) {
            eva.OperatorStack.push(OperatorVal);
          } else if (CurCodePrecedence <= StackTopPrecedence) {
            eva.OperandsStack.push(eva.OperatorStack.pop()!);
            continue;
          }
          break;
        case TokenTypes.LeftParen:
          eva.OperatorStack.push(new OperatorValue('(', code));
          break;
        case TokenTypes.RightParen:
          while (eva.OperatorStack.length >= 1 && eva.OperatorStack[eva.OperatorStack.length - 1].getOperatorTokenType() !== TokenTypes.LeftParen) {
            eva.OperandsStack.push(eva.OperatorStack.pop()!);
          }
          if (!eva.OperatorStack.length)
            throw new Error('Illegal expression, please check!!'); // paren number not match
          eva.OperatorStack.pop()!;
          break;
        case TokenTypes.Identifier:
          eva.OperandsStack.push(new VariableValue(this.Lexer.getCurTokenStr));
          break;
        case TokenTypes.FUNC_CALL:
          return this.parseFuncall();
        default:
          throw new Error("Unsupported token types: " + `${this.Lexer.getCurTokenStr}`);
      }
      this.Lexer.lex();
    }
    // Reach Eof, here we can check the operator expression is legal or not
    if (!eva.isExpressionLegal())
      throw new Error('Illegal expression, please check!!');
    while (eva.OperatorStack.length)
      eva.OperandsStack.push(eva.OperatorStack.pop()!);
    return false;
  }

  // TODO: Add function call support
  parseFuncall(): boolean {

    return false;

  }


}
interface VariableInfo {
  key:string;
  val:string;
  parsedVal?: Evaluator;
}
const test1:VariableInfo  = {
  key: "test1",
  val:"-23-43*1.2e3"
}
const test2:VariableInfo = {
  key: "test2",
  val:"100+test1"
}
let variablesTable = [test1, test2];
const parser = new ExpressionParser();

const yyy = variablesTable.map(item => {
  item.parsedVal = new Evaluator();
  parser.parse(item.val, item.parsedVal)
  return item;
})

// Need to recursively update all the tables until all the numbers all pure numbers
// if not, we need to throw error
const evaluator = new Evaluator();
parser.parse("-23-43+zhoujing1", evaluator);
console.log(evaluator.getPostFixExp());
console.log(evaluator.calculate());

