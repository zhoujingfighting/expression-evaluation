
// Need to take complicated case into consideration before implementation

/**
 * 1 : variables reference
 * 2 : function support
 * TODO:3 : condition support and other ?
 */
import { isAlpha, isDigit } from "./Utils";


export enum TokenTypes {
    INT_VAL, // integer value type
    FLOAT_VAL, // float value type
    SCI_VAL, // scientific value type

    // Arith operator
    Plus, // operand + operand
    Multi, // operand * operand
    Divide, // operand / operand
    Minor, // operand - operand
    Rem, // operand % operand

    //Unary operator
    Unary_plus, // + operand
    Unary_minor, // - operand

    // Paren
    LeftParen,
    RightParen,

    Identifier, // pure string identifiers

    FUNC_CALL, // Builtin function support

    Eof // End of current expression
}

// The operator priority level used to calculate the expression
// Based on https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
enum OPERATOR_PRECEDENCE {
    PRIO_LV0,
    PRIO_LV1,
    PRIO_LV2,
    PRIO_LV3,
    PRIO_LV4,
    PRIO_LV5,
    PRIO_LV6,
    PRIO_LV7,
    PRIO_LV8,
    PRIO_LV9,
    PRIO_LV10,
    PRIO_LV11,
    PRIO_LV12,
    PRIO_LV13,
    PRIO_LV14,
    PRIO_LV15,
    PRIO_LV16,
    PRIO_LV17,
    PRIO_LV18,
    PRIO_LV19,
};

export class ExpressionLexer {
    InputExpr: string = '';
    CurToken: TokenTypes = TokenTypes.Eof;
    CurIndex: number = -1; // Current index
    CurStr: string = ''; // Current token val
    init(inputExpr: string) {
        this.InputExpr = inputExpr;
        this.CurIndex = -1;
        this.CurStr = '';
    }
    getCode(): TokenTypes {
        return this.CurToken;
    }

    lex(): TokenTypes {
        return this.CurToken = this.lexToken();
    }

    // We do the lex during parse
    lexToken(isEmpty: boolean = false): TokenTypes {
        const nextChar = this.getNextChar();

        switch (nextChar) {
            case ' ':
            case '\t':
                return this.lexToken(true);
            case '+':
                if(this.CurToken === TokenTypes.Eof)
                    return TokenTypes.Unary_plus;
                return TokenTypes.Plus; // maybe leading + character
            case '-':
                if(this.CurToken === TokenTypes.Eof)
                    return TokenTypes.Unary_minor;
                return TokenTypes.Minor; // Maybe leading - character
            case '*':
                return TokenTypes.Multi;
            case '/':
                return TokenTypes.Divide;
            case '%':
                return TokenTypes.Rem;
            case undefined:
                return TokenTypes.Eof;
            case '(':
                return TokenTypes.LeftParen;
            case ')':
                return TokenTypes.RightParen;
            case '.':
                if (!isDigit(this.InputExpr[this.CurIndex + 1]))
                    throw new Error("Expecting a number after '.'");

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                return this.lexNumber();
            default:
                // Default we expect the CurChar is pure string
                if (isAlpha(nextChar) || nextChar == '_') // Maybe other chars
                    return this.lexIdentifier();
                else
                    throw Error("Unsupported characters " + `'${nextChar}'`);

        }
    }

    getNextChar(): string {
        return this.InputExpr[++this.CurIndex];
    }

    // Some times we need to check tokens ahead to decide what token
    // the lexed token is really is
    lookAhead(index: number) {
        let NewCode = TokenTypes.Eof;
        let NewToken = this.CurToken;
        const oldExpIndex = this.CurIndex;
        while (index--) {
            NewCode = this.lexToken();
        }
        // Restore state
        this.CurToken = NewToken;
        this.CurIndex = oldExpIndex;
        return NewCode;
    }

    // int, float, sci_number need to be identified
    // It can be very complicated
    // Integer: [0-9]+[uf]?
    // Float: [0-9]*\.[0-9]+[uf]?
    // Scientific: [0-9]*(\.[0-9]+)?[Ee][+-]?[0-9]+
    lexNumber() {
        let hasDot = false;
        let numberValue: string = '';
        const oldColumnNumber = this.CurIndex;
        // Float number
        if (this.getCurChar == '.') {
            this.CurIndex++
            // Float/SciNum: .123, .5e-9, starting with '.
            // eat all the numbers after dot '.
            while (isDigit(this.getCurChar))
                this.CurIndex++;

            if (this.getCurChar === undefined || this.getCurChar.toLowerCase() !== 'e') {
                this.setCurTokenStr(this.InputExpr.substring(oldColumnNumber, this.CurIndex));
                console.log("Float number here: ", this.CurStr);
                this.CurIndex--;
                return TokenTypes.FLOAT_VAL;
            }
        }

        //Eat digit in 0-9
        while (isDigit(this.getCurChar))
            this.CurIndex++;

        // Integer value
        if (this.getCurChar === undefined || (this.getCurChar.toLowerCase() !== 'e' && this.getCurChar !== '.')) {
            this.setCurTokenStr(this.InputExpr.substring(oldColumnNumber, this.CurIndex));
            console.log('Integer value parse!!', this.CurStr);
            this.CurIndex--;
            return TokenTypes.INT_VAL;
        }

        // Eat optional '.' in scientific number
        if (this.getCurChar == '.') {
            hasDot = true;
            this.CurIndex++;
        }

        // Eat mantissa [0-9]+
        while (isDigit(this.getCurChar))
            this.CurIndex++;

        if ((this.getCurChar === undefined || this.getCurChar.toLowerCase() === 'e' && !isAlpha(this.CurStr[this.CurIndex + 1]))) {
            this.CurIndex++;
            if (this.getCurChar === '+' || this.getCurChar === '-')
                this.CurIndex++;

            let i = 0;
            while (isDigit(this.getCurChar)) {
                i++;
                this.CurIndex++;
            }
            if (i === 0)
                throw new Error("Expecting digital number in exponent part");
            this.setCurTokenStr(this.InputExpr.substring(oldColumnNumber, this.CurIndex));
            console.log('Sci number parse!!', this.CurStr);
            this.CurIndex--;
            return TokenTypes.SCI_VAL;
        } else if (hasDot) {
            this.setCurTokenStr(this.InputExpr.substring(oldColumnNumber, this.CurIndex));
            console.log('Float value parse!!', this.CurStr);
            this.CurIndex--;
            return TokenTypes.FLOAT_VAL;
        } else {
            throw new Error("Unknown kind of number");
        }
    }

    lexIdentifier() {
        let TokenValue: string = '';
        while (isAlpha(this.getCurChar) || isDigit(this.getCurChar)) {
            TokenValue += this.getCurChar;
            this.CurIndex++;
        } // Get identifier name

        // TODO: support builtin function
        // default we thought the token is identifier
        this.setCurTokenStr(TokenValue);

        this.CurIndex--;
        if (this.lookAhead(1) == TokenTypes.LeftParen) {
            console.log('Funcall', TokenValue);
            return TokenTypes.FUNC_CALL;
        }
        console.log("Identifier:", TokenValue);
        return TokenTypes.Identifier;

    }

    setCurTokenStr(str: string) {
        this.CurStr = str;
    }

    get getCurTokenStr() {
        return this.CurStr;
    }

    get getCurChar(): string {
        return this.InputExpr[this.CurIndex];
    }

    getCharByToken(Token: TokenTypes): string {
        switch (Token) {
            case TokenTypes.Divide:
                return '/';
            case TokenTypes.Multi:
                return '*';
            case TokenTypes.Plus:
                return '+';
            case TokenTypes.Minor:
                return '-';
            case TokenTypes.Rem:
                return '%';
            case TokenTypes.Unary_plus:
                return '+';
            case TokenTypes.Unary_minor:
                return '-'
            default:
                throw new Error("Not added character yet, please add!!!");
        }
    }

    getOperatorPrecedence(Token: TokenTypes): OPERATOR_PRECEDENCE {
        switch (Token) {
            case TokenTypes.Plus:
            case TokenTypes.Minor:
                return OPERATOR_PRECEDENCE.PRIO_LV12;
            case TokenTypes.Divide:
            case TokenTypes.Multi:
            case TokenTypes.Rem:
                return OPERATOR_PRECEDENCE.PRIO_LV13;
            case TokenTypes.Unary_minor:
            case TokenTypes.Unary_plus:
                return OPERATOR_PRECEDENCE.PRIO_LV15;
            default:
                return OPERATOR_PRECEDENCE.PRIO_LV0;
        }
    }

}