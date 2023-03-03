import { isNumber } from "lodash";
import { TokenTypes } from "./Lexer";

export enum ValKind {
  IntVal,
  FloatVal,
  SciVal,
  FuncVal,
  VariableVal
}

export class Value {
  Valkind: ValKind;
  name: string = '';
  value: string | number = '';
  constructor(valKind: ValKind = ValKind.VariableVal) {
    this.Valkind = valKind;
  }
  getName(): string {
    return this.name;
  }

  getValue(): string | number {
    return this.value;
  }

  // Check the value if pure value all not
  // If not, we need to visit all the expressions in the tables to update
  // or in other words to get the values,
  isPureNumber(): boolean {
    return isNumber(this.value);
  }
  isOperator() { return false; }

  get getThis() {
    return this;
  }
}

export class IntegerValue extends Value {
  constructor(value: number) {
    super(ValKind.IntVal);
    this.value = value;
  }
}

export class FloatValue extends Value {
  constructor(value: number) {
    super(ValKind.FloatVal);
    this.value = value;
  }
}

export class ScinumberValue extends Value {
  constructor(value: number) {
    super(ValKind.SciVal);
    this.value = value;
  }
}

export class VariableValue extends Value {
  constructor(value: string) {
    super(ValKind.VariableVal);
    this.value = value;
  }
}

export class OperatorValue extends Value {
  operatorType: TokenTypes
  constructor(value: string, type: TokenTypes) {
    super(ValKind.VariableVal);
    this.value = value;
    this.operatorType = type;
  }
  getOperatorTokenType() {
    return this.operatorType;
  }

  override isOperator(): boolean {
    return true;
  }

  public isUnaryOperator(): boolean {
    if (this.operatorType === TokenTypes.Unary_minor ||
      this.operatorType === TokenTypes.Unary_plus
    )
      return true;
    return false;
  }

  public isBinaryOperator(): boolean {
    switch (this.operatorType) {
      case TokenTypes.Plus:
      case TokenTypes.Minor:
      case TokenTypes.Divide:
      case TokenTypes.Multi:
      case TokenTypes.Rem: // TODO: Update these codes
        return true;
      default:
        return false;
    }
  }
}

// Deal with the builtin functions
export class FunCallValue extends Value {

  // Define an argument array to store all the arguments


}