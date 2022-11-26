let expression = /^[+-]?(\d+|\d+\.\d*|\.\d+|)([eE][+-]?\d*)?$/

console.log(expression.test("1E10"))
console.log(expression.test("5e-10"))
console.log(expression.test("5.5"))
console.log(expression.test(".3"))
console.log(expression.test("-5e-4"))
console.log(expression.test("-70e"))
console.log(expression.test("."))
