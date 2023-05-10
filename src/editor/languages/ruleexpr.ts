export default {
  ignoreCase: false,
  defaultToken: "invalid",
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "(", close: ")", token: "delimiter.parenthesis" },
  ],

  typeKeywords: ["f64"],

  keywords: [
    "if",
    "else",
    "until",
    "func",
    "var",
    "type",
    "struct",
    "class",
    "dynamic",
    "extern",
    "return",
    "and",
    "or",
    "not",
    "xor",
    "continue",
    "import",
    "export",
    "while",
    "for",
    "const",
    "auto",
    "match",
    "when",
    "is",
    "as",
    "fit",
    "true",
    "false",
  ],

  operators: [
    "*",
    "/",
    "%",
    "+",
    "-",
    "<<",
    ">>",
    ">",
    "<",
    "<=",
    ">=",
    "==",
    "!=",
    "&&",
    "||",
    "=",
  ],

  builtins: [
    "sin",
    "cos",
    "tan",
    "cot",
    "asin",
    "acos",
    "atan",
    "atan2",
    "abs",
    "fabs",
    "exp",
    "sqrt",
    "pow",
    "floor",
    "min",
    "max",
    "trimf",
    "trapmf",
  ],

  // we include these common regular expressions
  symbols: /[=><!&|+\-*%]+/,
  escapes:
    /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers, keywords and builtins
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            "@typeKeywords": "type",
            "@keywords": "keyword",
            "@builtins": "predefined",
            "@default": "identifier",
          },
        },
      ],

      // to show class names nicely
      [/[A-Z][\w$]*/, "type.identifier"],

      // whitespace
      { include: "@whitespace" },

      // delimiters and operators
      [/[{}[\]()]/, "@brackets"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operator",
            "@default": "",
          },
        },
      ],
      [/[<>](?!@symbols)/, "@brackets"],

      // numbers
      [/(@digits)[eE]([-+]?(@digits))?/, "number.float"],
      [/(@digits)\.(@digits)([eE][-+]?(@digits))?/, "number.float"],
      [/0[xX](@hexdigits)/, "number.hex"],
      [/0[bB](@binarydigits)/, "number.binary"],
      [/(@digits)/, "number"],

      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],

      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
      [/"/, "string", "@string_double"],
    ],

    whitespace: [[/[ \t\r\n]+/, ""]],

    comment: [[/\/\/.*$/, "comment"]],

    string_double: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"],
    ],
  },
};
