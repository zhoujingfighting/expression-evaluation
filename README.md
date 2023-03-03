## About Expression Evaluation

We adapt traditional compiler way to do expression's evaluation, that is to say, we use lexer, parser to do our work, the main reason for this is the convenience of later maintenance, we can add some functionalities freely to the tool

basically, `Expression Evaluation` can be a little complicated in `VCMB`, because the variables in variables' table can be referenced by each other

## About lexer and parser
We do the lexer work while parsing synchronously

### Lexer
The detailed implementation can be seen in `Lexer.ts` file, the main principle is to split all the `operands` and `operators` into correct token types, for example, when we handle this expression`-1.2*23+operand1*1.2e2`, we scan this string and analyze, and we split this string into different token types
> The token's name can be changed, it is just ok to understand the meaning
according to JavaScript documentation: [Operator_Precedence](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
* the leading `-` will be sliced into `unary_plus` token
* `1.2` will be sliced into `float_number` token
* `*` will be sliced into `binary_multi` token
* `23` will be sliced into `int_number` token
* `operand1` will be sliced into `identifier` token, in VCMB, this is another defined variable
* `1.2e2` will be sliced into `scientific_number` token
* TODO: we need to add some builtin function support

### Parser

The parser's main work is to build a postfix sequence to do the later expression evaluation, detailed implementation can be seen in `Parser.ts`

the postfix expression's philosophy can be referenced by:
* http://www.cs.nthu.edu.tw/~wkhon/ds/ds10/tutorial/tutorial2.pdf
* https://panda.ime.usp.br/panda/static/pythonds_pt/02-EDBasicos/InfixPrefixandPostfixExpressions.html

Please feel free to choose and search the related topics to understand what `postfix expression` is;

### Evaluator

After parsing, we can get a new `Evaluator` class based on the parsed expression string, this object is used to store all the information used to
* Calculate the expression
* Check the expression is legal or not
* Update all the referenced variables

The detailed implementation can be seen in `Evaluator.ts` file, right now, we just roughly accomplish this class simply which should later be modified

## Debug on local(not in VCMB)

