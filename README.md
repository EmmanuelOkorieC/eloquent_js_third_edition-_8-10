# Eloquent Javascript, 3rd Edition: A modern Introduction to programming
An overview, with solutions and explanation of exercises in chapters eight to ten of the ebook Eloquent Javascript, 3rd Edition by Marijn Haverbeke

## Overview
### Chapter Eight: Bugs and Error
Flaws in computer programs are usually called *bugs*. It is good to think of *bugs* as programmer mistakes often unintentionally introduced to a program. There are various ways we can spot and handle errors (bugs) in javascript programs and they include;
* Strict mode
* Types
* Testing
* Debugging
* Error propagation
* Exceptions
* Assertions

#### Strict mode
Javascript can be made a little stricter by enabling strict mode. This is done by putting the string `"use strict"` at the top of a file or a function body. By enabling strict mode, we can spot problems that the javascript program would otherwise be happy to roll with like calling a constructor function without a *new* keyword, forgetting to define a binding with `let` or `const` in a for loop, giving a function multiple parameters with the same name amongst other things.

#### Types
 JavaScript does not allow us define types like in some other programming languages and only considers types when actually running the program, and even there often tries to implicitly convert values to the type it expects (type coercion), so it’s not much help. Still types provide a useful framework for talking about programs. We can improvise them in javascript by adding them as comments before function declarations or expressions so we don't get confused about the kind of value that goes in and out of our function.
```javascript
// (VillageState, Array) -> {direction: string, memory: Array}
function goalOrientedRobot(state, memory) {
// ...
}
```
There is a very popular javascript dialect programmers use called **TypeScript** that adds type to the language and checks them for us. (Note: check it out!)

#### Testing
Since the javascript language does not do much in helping us find mistakes, we will have to find them the hard way by running the program and seeing if it does the right thing. This is called *testing* and is a bit of work as one might have to run the program over and over again everytime a change is made. 

Automated testing is the process of writing a program that tests another program. It might be a bit more work to write them but once done, it takes only a few seconds to verify that your program behaves properly in all situations you wrote tests for. Tests usually take the form of **little labeled programs** that verify some aspect of **code**
```javascript
function test(label, body) {
if (!body()) console.log(`failed: ${label}`)
}

test("convert Latin text to uppercase", () => {
  return "hello".toUpperCase() == "HELLO"
})
test("convert Greek text to uppercase", () => {
return "Χαίρετε".toUpperCase() == "ΧΑΊΡΕΤΕ"
})
```
But Writing tests like this tends to produce rather repititive awkward code. Fortunately there are softwares that help us build and run collection of tests (test suites) by providing a language (in the form of functions and methods) suited to expressing tests and by outputting informative information when a test fails. (Note - Check out mocha, jest, cypress)

#### Debugging
The process of finding mistakes or problems (bugs) in programs is called *debugging*. Sometimes a mistake is obvious. An error message will point at a specific line of code in your program and when you look at the error description and that line of code, you can often see the problem. But other times, the line that triggered the problem, is simply the first place where a flaky value produced elsewhere gets used in an invalid way. Putting a few strategic `console.log` calls in the program is a good way to get additional information about what the program is doing so we can correct our mistakes. 

An alternative to using `console.log` is to use the *debugger* capabilities of our browser. This allows us to set a *breakpoint* on a specific line of code and when the execution of our program reaches that line, it is paused and we can inspect the value of bindings at that point. Another way to set a breakpoint is to include a `debugger` statement (consisting of simply that keyword) in our program.

#### Error propagation
If our program communicates with the outside world in anyway, it is possible to get malformed input, to get overloaded with work or to have network fail. These problems can't be prevented. So our job as programmers is to find a way to handle them. We can report to the user what went wrong and then give up, or simply take the bad input in stride and continue running. But in either situation, the program has to actively do something in response to the problem. For example, when a program requires a specific type of input and our user passes the wrong one, our program has to somehow recover - by asking for the input again, or indicating that a wrong value was passed, or by filling a default value 

#### Exceptions
Exceptions are a mechanism that makes it possible for code that runs into a problem to *raise* (or *throw*) an exception. An exception can be **any value** and raising one resembles a super-charged return from a function as it jumps out of not just the current function but also it's callers, all the way down to the first call that started the current execution (*unwinding the stack*). But if that was all exceptions did, they'd just provide a way to blow up our program and nothing more. Instead the power of exceptions lie in the fact that one can set 'obstacles' along the stack to catch the exception as it is zooming down. And once you've caught an exception, you can do something with it to address the problem and then continue to run the program.

The keyword `throw` is used to raise an exception. Catching one is done by wrapping a piece of code in a `try`/`catch` block 

The `Error` constructor (Standard javascript constructor that creates an object with a ***message*** property) is often used to create an exception value. Instances of this constructor gather information about the call stack that existed when the exception was created, a so-called *stack trace* and this information is stored in the ***stack*** property and can be helpful when debugging as it tells us the function where the problem occured and which functions made the failing call.

By *unwinding the stack*, exceptions cause control to leave our code and this might be a problem. Values that change before the exception is thrown don't revert back (which is ideally not what we want) and the code after the exception is thrown is prevented from running. One way to address this is to use a programming style that computes new values instead of changing existing data. That way when the code stops running in the middle of creating a new value, no one ever sees the half-finished value and there is no problem. But this isn't always practical. So we use another feature, a `finally` block. This block either directly follows a `try` statement or is used in addition to the `try`/`catch` block. The `finally` block runs the code we give it no matter what happens with exceptions in the `try` block. So we can use it to revert our changed value or simply run a code after the `try` or `try`/`catch` block.

Invalid uses of the language, such as referencing a nonexistent binding, looking up a property on null, or calling something that’s not a function, will also result in exceptions being raised. Such exceptions can also be caught. Because javascript does not provide a direct support for selectively catching exceptions, these bugs (if any) will be caught, instead of the actual exception we wrote for our catch block. Meaning our assumption about the error we are catching could be wrong and this causes a niggling number of issues. So as a general rule, it is better to **not blanket-catch exceptions** unless it's for the purpose of "routing" them somewhere e.g over a network to tell another system that our program crashed

To make an exception specific and be able to catch it then, 
   * We create a new class that extends the class `Error` and inherits it's properties.
   ```javascript
   class MadeupError extends Error {}
   ```
   * Make use of **the instance of this new class** when writing exceptions for our `catch` block.
   ```javascript
   function evaluate(a) {
   if (a < 5) {
      throw new MadeupError("a is too little")
  }
   else return a
   }
   ```
   * In the `catch` block, we check whether the error we got is the one we are interested in (an instance of the extended class) and if it's not, we re-throw it
   ```javascript
   try {
      evaluate(4)
   } catch(e) {
       if(e instanceOf MadeupError) {
        console.log(e)
        } else {
           throw e 
         }
   }
    ```

#### Assertions
Assertions are checks inside a program that verify that something is the way it is supposed to be. They are used **not** to handle situations that can come up in normal operation, but to find programmer mistakes. You can write them as uncaught exceptions that blow up your program when a mistake is made.

### Chapter Nine: Regular Expressions
Regular expressions are objects that represent patterns in strings. It can be either constructed with a `RegExp` constructor or written as a literal value by enclosing a pattern in forward slash (/) characters.
```javascript
let re1 = new RegExp("abc")
let re2 = /abc/
```
Both of those regular expression objects represent the same pattern and match a string With an "a" character followed by a "b" followed by a "c". 

Some other ways regular expressions express patterns in strings include;
* `/[abc]/` - Matches any character from the set of characters between the square bracket. In this case an "a" or a "b" or a "c"
* `/[a-z]/` - This matches any character in a range of characters. Within square brackets, a hyphen between two characters indicates a range of characters where ordering is determined by a characters's Unicode number. 
* `/[^01]/` - Matches **anything but** the characters in the square bracket. A caret character after a opening square bracket "inverts" the set of characters after it 
* `/\d/` - Matches any digit character
* `/\w/` - Matches an alphanumeric character (word or number)
* `/\s/` - Matches any whitespace character (space, tab, newline and similar)
* `/\D/` - Matches any character that is **not** a digit
* `/\W/` - Matches a **non** alphanumeric character
* `/\S/` - Matches a **non** whitespace character
* `/./` - Matches any character except for newline
* `/(abc)/` - Matches the group of characters between the parenthesis
* `/\w+/` - The plus sign after a character or group means It'll match **one or more** occurences of it
* `/\d*/` - The star sign after a character or group means it'll match **zero or more** occurences of it
* `/\pr?op/` - The question mark makes a part of a pattern optional, meaning it may occur zero times or one time.
* `/\d{3}/` - Matches a pattern that occurs exactly three times. Braces indicates that a pattern should occur a precise number of times. 
* `/\d{2, 4}/` - Matches a pattern that occurs at least twice and at most four times
* `/\d{5,}/`- Matches a pattern that appears five or more times
* `/a|b|c/` - This matches any one of the character or pattern it finds first. The pipe character denotes a choice between patterns. 

All characters that have a special meaning in regular expression like plus (+), star (*), question mark (?) must be preceeded by a backslash if they are meant to represent the character itself (*They must be escaped*).
* `/xyz+/` - Matches a sequence of characters "x", "y" and "z" but "z" can appear more than once
* `/xyz\+/` - Matches a sequence of characters "x", "y" and "z" followed by an actual plus sign.

Between square brackets, special characters lose their special meaning and do not necessarily need to be escaped.
* `/[\d.]/`- Matches any digit or an actual period character
* `[.*{}]` - Matches either a period character, a star sign, an opening curly brace or a closing curly brace.

#### Regular Expression Methods
Regular expression Objects have a number of methods and they include `test`, `exec`, `toString`

* `test` takes a string as argument and returns a boolean telling you whether the string you passed contains a match of the pattern in the expression.
```javascript
console.log(/abc/.test("abcdx")) //outputs true (matches abc)
console.log(/abc/.test("abxce")) //outputs false
console.log(/[^01]/.test("11000111100")) //outputs false
console.log(/[^01]/.test("111000200")) //outputs true (matches 2)
console.log(/[0-9]/.test("in 1990")) // outputs true (matches 1)
console.log(/boo+(hoo)+/.test("booohoohoo")) //outputs true
console.log(/\d{1,2}-\d{1,2}-\d{4}/.test("1-30-2003")) //outputs true
```

* `exec` behaves like `test` except when there is a match, it returns an "array-like" object with information about the match and null otherwise. 
```javascript
let match = /\d+/.exec("one two 100")
console.log(match) 
//outputs [ '100', index: 8, input: 'one two 100', groups: undefined ]
console.log(match.index) //outputs 8
console.log(match[0])  //outputs 100
```
When regular expressions contain "groups", the text that matched those groups will also show up in the array.
```javascript
let match = /bad(ly)/.exec("badly")
console.log(match)
// outputs [ 'badly', 'ly', index: 0, input: 'badly', groups: undefined ]
console.log(match[0]) // outputs badly
console.log(match[1]) // outputs ly
```
When a group does not end up being matched at all (for example, when followed by a question mark), its position in the output array will hold undefined. Similarly, when a group is matched multiple times, only the last match ends up in the array.
```javascript
console.log(/bad(ly)?/.exec("bad"))
// outputs [ 'bad', undefined, index: 0, input: 'bad', groups: undefined ]
console.log(/(\d)+/.exec("123"))
// outputs [ '123', '3', index: 0, input: '123', groups: undefined ]
```
* `toString` returns a string value of the regular expression

#### Word and String Boundaries
If we want to enforce that a match spans the **whole string**, we can add markers `^` and `$`. The caret matches the start of the input string whereas the dollar sign matches the end
```javascript
let regMatch = /\d{1,2}-\d{1,2}-\d{4}/.exec("110-4-20085")
console.log(regMatch[0]) 
//outputs 10-4-2008 (as that part of the string matches our pattern)

let regMatch2 = /^\d{1,2}-\d{1,2}-\d{4}$/.exec("110-4-20085")
console.log(regMatch2) //outputs null

let regMatch3 = /^\d{1,2}-\d{1,2}-\d{4}$/.exec("10-4-2008")
console.log(regMatch3[0]) //outputs 10-4-2008

let regMatch4 = /^\d{1,2}-\d{1,2}-\d{4}/.exec("10-4-20085")
console.log(regMatch4[0]) //outputs 10-4-2008
```
But if we want a match to span a **word** boundary, we use the marker `\b`.
```javascript
console.log(/cat/.test("concatenate")) //outputs true
console.log(/\bcat\b/.test("concatenate")) //outputs false
console.log(/\bcat\b/.test("con cat enate")) //outputs true
console.log(/\bcat/.test("con catenate")) //outputs true
```
#### String Methods that work with Regular Expressions
Strings have a few methods that work with regular expressions and they include `match`, `search`, `split`, `replace`.

* `match` method behaves similarly to the regular expression method `exec` 
```javascript
console.log ("one two 100".match(/\d+/))
//outputs [ '100', index: 8, input: 'one two 100', groups: undefined ]
```

* The `search` method behaves like `indexOf` and expects a regular expression as argument. It returns the first index on which the expression was found or -1 when it isn't found
```javascript
console.log("  word".search(/\S/)) //outputs 2
console.log("    ".search(/\S/)) //outputs -1
```

* The `split` method splits a string on the occurence of another string or on the occurence of a regular expression
```javascript
 console.log("Boy. Loves. Girl".split(/\.\s/))
 //outputs [ 'Boy', 'Loves', 'Girl' ]
```
* The `replace` method is used to replace part of a string with another string. It takes two arguments, say A and B. A represents the part of the string you would like to replace and can be a string type or a regular expression. B represents what you would like to replace A with and can be a string, a matched group(`$&`, `$1`, `$2`, `$3`...`$9`) or a function.
```javascript
console.log("papa".replace("p", "m")) //outputs mapa
console.log("Borobudur".replace(/[ou]/, "a")) //outputs Barobudur
console.log("Borobudur".replace(/[ou]/g, "a")) //outputs Barabadar
console.log("Liskov, Barbara\nMcCarthy, John\nWadler, Philip"
.replace(/(\w+), (\w+)/g, "$2 $1"))
//outputs Barbara Liskov 
//John McCarthy 
//Philip Wadler
console.log("the fbi and cia".replace(/\b(fbi|cia)\b/g,
str => str.toUpperCase()))
// outputs the CIA and FBI
```

When a `g`(*global*) option is added to the regular expression, all matches in the string will be replaced ( not just the first ). 

The `$&` in the replacement string refers to the whole text that match, `$1` refers to the first group, `$2` the second group and so on up to `$9`. 

The function in the replacement string is called with the matched groups (as well as the whole match) as arguments. The first argument is the whole match and subsequent arguments are the matched groups. The function's return value will be inserted into the new string

#### Backtracking and Greed
Conceptually, when we use `exec` or `test`, the Regular expression engine looks for a match from the start of the string till it either finds one or reaches the end of the string (at which point, it fails if there is no match). When working with branches (`|`) it follows the same approach except when it doesn't match the first pattern in the branch, it **backtracks** (remembers and returns to it's position before the branch) and tries another branch. Backtracking also happens for repitition operators like + and *. Matching `/^.*x/` against "abcxe" means the `.*` part will consume the whole string (since it matches an unlimited number of characters) before backtracking twice to match the final `x` in the pattern. This behaviour makes us refer to repition operators as being **greedy** (meaning they match as much as they can and backtrack from there). Putting a question mark after them(`+?`,`*?`, `??`, `{}?`) makes them **non-greedy** and starts by matching as little as possible, matching more only when the remaining pattern does not fit the smaller match.
```javascript
function stripComments(code) {
return code.replace(/\/\/.*|\/\*[^]*\*\//g, "")
}
console.log(stripComments("1 + /* 2 */3")) //outputs 1 + 3
console.log(stripComments("x = 10;// ten!")) //outputs x = 10;
console.log(stripComments("1 /* a */+/* b */ 1")) //1 1
```
The function `stripComments` removes all comments (`//...` or `/*...*/`) from a piece of javascript code. The  `\/\/.*` part before the *or*(`|`) matches two forward slashes followed by any number of non-newline characters. The `\/\*[^]*\*\/` part matches a multiline comment and we use `[^]*`(any character not in the empty set of characters) instead of `.*` here because block comments can continue on a new line and the period character does not match a newline. But the output for the last line apears to have gone wrong  because the `[^]*` part of the expression is greedy and consumes the whole string before backtracking to find the end of the pattern right after b. To get the right output then, we make `[^]*` non greedy
```javascript
 function stripComments(code) {
 return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "")
 }
 console.log(stripComments("1 /* a */+/* b */ 1")) //outputs 1 + 1
```
A lot of bugs in regular expression programs can be traced to unintentionally using a greedy operator where a nongreedy one would work better. So when using a repetition operator, it is good to consider the nongreedy variant first.

#### Dynamically creating Regular Expression Objects
For situations where we might not know the exact pattern we need to match against until the code is running e.g when we require user input, we can not use the slash notation. But we can build a string and use the `RegExp` constructor on that. 
```javascript
  let name = "harry"
  let text = "Harry is a suspicious character."
  let regexp = new RegExp("\\b(" + name + ")\\b", "gi")
  console.log(text.replace(regexp, "_$1_"))
  //outputs_Harry_ is a suspicious character.
```
`regexp` creates a new regular expression object by concatenating 3 strings. `"\\b("`, `name` and `")\\b"`. The parenthesis makes `name` a group. When creating the `\b` boundary markers, we use two backslashes because we are writing them in a normal string (`\b` *is escaped*). The second argument to the `RegExp` constructor contains options for the regular expression, "gi" for global and case insensitive (case insensitive makes it match an uppercase or lowercase character). 

But if our user for example includes a special character in their name, our code won't work. To work around this we can simply escape any special characters before building our regular expression object
```javascript
  let name = "dea+hl[]rd"
  let text = "This dea+hl[]rd guy is super annoying."
  let escaped = name.replace(/[\\[.+*?(){|^$]/g, "\\$&")
  let regexp = new RegExp("\\b" + escaped + "\\b", "gi")
  console.log(text.replace(regexp, "_$&_"))
  //outputs This _dea+hl[]rd_ guy is super annoying.
```
`escaped` replaces any one of the characters in the square bracket (\ or [ or . or + or * or ? or ( or ) or { or | or ^ or $ ) with a version that has two backslashes preceeding it ( because we are writing them in a normal string )

#### Regular Expression Properties
The `source` property of regular expressions is quite similar it's `toString` method and returns a string value of the regular expression.

The `lastIndex` property controls in some limited circumstances, where the next match will start. Those circumstances are that the regular expression must have the global ( g ) or sticky ( y ) option enabled, and the match must happen through the `exec` method. 

Ideally, the `lastIndex` property starts at zero and after a successful match, points to the index after the match
```javascript
let pattern = /y/g
console.log(pattern.lastIndex) //outputs 0
let match = pattern.exec("abc xxy tty")
console.log(match.index) //outputs 6 (finds a match at that index)
console.log(pattern.lastIndex) 
//outputs 7 (lastIndex points to the index after the match)
let match2 = pattern.exec("try the ray")
console.log(match2.index)
//outputs 10 (calling exec on pattern again means it searches from 7)
console.log(pattern.lastIndex)
//outputs 11 (points to the index after the match)
```
This `lastIndex` property can be assigned and it works in the same way. If no match is found though, the `lastIndex` is set back to zero
```javascript
let pattern = /y/g;
pattern.lastIndex = 3 //starts searching from index 3
let match = pattern.exec("xyzzy")
console.log(match.index) //outputs 4
console.log(pattern.lastIndex) //outputs 5
let match2 = pattern.exec("xyzzyxxz")
console.log(match2) //outputs null (does not find a match from index 5)
console.log(pattern.lastIndex) //outputs 0 (set back to it's original value)
```
The difference between the global and the sticky options is that, when sticky is enabled, the match will succeed only if it starts directly at lastIndex, whereas with global, it will search ahead for a position where a match can start.
```javascript
//both start at lastIndex 0
let global = /abc/g
console.log(global.exec("xyz abc"))
//outputs [ 'abc', index: 4, input: 'xyz abc', groups: undefined ]
let sticky = /abc/y
console.log(sticky.exec("xyz abc")) //outputs null

let sticky2 = /abc/y
console.log(sticky2.exec("abc xyz")) 
//outputs [ 'abc', index: 0, input: 'abc xyz', groups: undefined ]

```
Aside from affecting how the `lastIndex` property works when sharing regular expression values for multiple exec calls, the global option( g ) also changes the way `match` methods on strings work. When called with a global expression, instead of returning an array similar to that returned by exec, match will find all matches of the pattern in the string and return an array containing the matched strings.
```javascript
console.log("Banana".match(/an/g)) //outputs ["an", "an"]
```
So it is important to be cautious and use the global option only where they are necessary (calls to replace and places where you want to explicitly use lastIndex)

Because of how the global option works with `exec` calls and `lastIndex`, we can loop over a string and scan for all occurences of a pattern in it
```javascript
let input = "A string with 3 numbers in it... 42 and 88.";
let number = /\b\d+\b/g;
let match;
while (match = number.exec(input)) {
console.log("Found", match[0], "at", match.index);
}
//outputs Found 3 at 14  
//Found 42 at 33  
//Found 88 at 40
```
`match` gets reassigned  every `exec` call on  `number` till it points to `null` (doesn't find a match again) and breaks out of the loop

#### Some other interesting Topics from this chapter
* Date Method

Calling the `Date` class(*Standard javascript class*) using `new` returns an instance of the date object with the current date and time. This instance provides a couple of methods `getFullYear`, `getMonth`, `getDate`, `getHours`, `getMinutes`, `getSeconds` to extract it's components. 
```javascript
 let date = new Date().getFullYear()
 console.log(date)//outputs 2022
```
The method `getTime` when called on this instance returns the number of milliseconds since the start of 1970(*always a lot*).`Date.now` is a function that also returns the current milliseconds count

We can create an instance of the `Date` object  with a specific date or it's milliseconds value (For the milloseconds value, You can use negative numbers for times before 1970). 
```javascript
let date = new Date(2009, 11, 21, 10, 59, 59)
console.log(date) //outputs 2009-12-21T10:59:59
console.log(date.getTime()) //1261421999000
console.log(new Date(1261421999000)) //outputs 2009-12-21T10:59:59
```
Javascript uses a convention where month numbers start at zero so it is important to note this when passing a value for month to the `Date` class. 
* Unicode Option

Asides the `g`(global), `i`(case insensitive) and `y`(sticky) options in regular expressions, there is also a `u`(unicode) option for working with chracters that are composed of two code units.

### Chapter Ten: Modules
Modules give us a way to split our program into small pieces that communicate with each other. They allow us work with each piece in isolation and serve as a very efficient way to organize our code. They have a lot in common with Object interfaces

#### Module relationships
Modules have interfaces and dependencies.
* **Interfaces** : Expose data and functionality for other modules to use (anything outside of the interface is abstracted in the module)
* **Dependencies** : Other pieces a module relies on

#### Packages
One of the advantages of building a program out of separate pieces, and being actually able to run those pieces on their own, is that you might be able to apply the same piece in different programs. And to do this efficiently and be able to maintain your code across programs, you can make it a *package*. 

A *package* is a chunk of code that can be distributed (copied and installed). It may contain one or more modules and has information about other packages it depends on. NPM is an online service where one can download (and upload) packages. It is also a program (bundled with Node.js) that helps us install and manage them.

#### History of Modules in Javascript
Just putting your Javascript code into different files does not make it modularized. For one, the files will share the same global namespace and can intentionally or accidentally interfere with each other's bindings. For a while after javascript was created, This was how javscript programmers wrote code as the language did not have a built-in module system and this had a lot of downsides.

So Programmers decided to improvise a module system for the language and this led to the  the quite popular (at the time) IIFE (*Immediately invoked function expression*) module pattern. They used javascript **functions** to create **local scopes** and **objects** to represent **interfaces**

This is a module for going between day names and numbers. Its interface consists of `weekDay.name` and `weekDay.number`, and it hides its local binding `names` inside the scope of a function expression that is immediately invoked.
```javascript
const weekDay = function() {
const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
                 "Thursday", "Friday", "Saturday"]
return {
name(number) { return names[number]; },
number(name) { return names.indexOf(name); }
};
}()

console.log(weekDay.name(weekDay.number("Sunday")));
//outputs Sunday
```
This style of modules provides isolation, to a certain degree, but it does not declare dependencies. Instead, it just puts its interface into the global scope and expects its dependencies, if any, to do the same (Making it very hard for us to tell which modules depend on which). For a long time, this was the main approach used in web programming, until the development of the *CommonJS* modules.

The *CommonJS* group (in collaboration with Node.js) developed a module system that declares dependencies and the main concept behind this is a function called `require`. When you call this with the module name of a dependency, it makes sure the module is loaded and returns its interface. We can define require, in its most minimal form, like this:
```javascript
require.cache = Object.create(null);

function require(name) {
if (!(name in require.cache)) {
let code = readFile(name);
let module = {exports: {}};
require.cache[name] = module;
let wrapper = Function("require, exports, module", code);
wrapper(require, module.exports, module);
}
return require.cache[name].exports;
}
```
In this code, `readFile` is a made-up function that reads a file and **returns its contents as a string**. Standard JavaScript provides no such functionality—but different JavaScript environments, such as the browser and Node.js, provide their own ways of accessing files. The example just pretends that `readFile` exists.

To avoid loading the same module multiple times, `require` keeps a store (cache) of already loaded modules. When called, it first checks if the requested module has been loaded and, if not, loads it.

Loading follows the following steps: 
* `readFile` reads the file we pass in as argument, converts it to string and it's content is then assigned to `code` (We need to convert it to  string so we can pass it as argument to the wrapper function we create later)
* A `module` object is created and cached (stored in `require.cache` under the file name). 
* Then it progresses to the "function-generation" phase: 
   * Generates a wrapper function to properly scope variables-The `Function` constructor takes two arguments: a string containing a comma-separated list of argument names and a string containing the function body. It wraps the code in a function value so that it gets its own scope in our current module
   * It progresses to call this function passing in the actual arguments - a `require` function, the `module.export` object and the `module` object.(Note- The `require` function is passed so `code` would be able to load it's dependencies if it has any).
*  In the `code` file, anything bound to `exports`(representing the `module.exports` object) or `module.exports` is considered it's interface. Hence what we return after the "function-generation" phase is this interface.

The way the string given to `require` is translated to an actual filename or web address differs in different systems. When it starts with `"./"` or `"../"`, it is generally interpreted as relative to the current module’s filename. So `"./format-date"` would be the file named format-date.js in the same directory. When the name isn’t relative, Node.js will look for an installed package by that name.

The CommonJS module system in combination with NPM have allowed the javascript community to start sharing code on a large scale but they remain a bit of a duct-tape hack. For one, the things you add to `exports`  are not available in the local scope for example. And because `require` is a normal function call taking any kind of argument, not just a string literal, it can be hard to determine the dependencies of a module without running its code. The CommonJS module system is also not supported by browsers

All this litte issues led to javascript introducing it's own module system in 2015 called ESModules. They work well with browsers. The main concepts of dependencies and interfaces remain the same, but the details differ. Instead of calling a function to access a dependency, you use a special `import` keyword. Similarly, the `export` keyword is used to export things. It may appear in front of a function, class, or binding definition (let, const, or var). 

You can export multiple items and import them as a set of named bindings. When there is a binding named default, it is treated as the module’s main exported value and can be imported with any name. It is possible to rename imported bindings using the keyword `as`

This is an example of how it works with 2 files in the same directory 

File 1
```javascript
export function square(x) {
  return x ** 2
}

export function cube(x) {
  return x**3
}

export default function timesTwo(x) {
  return 2 * x
}

export let value = 5
```
File 2
```javascript
import twice, {cube as squareCube, square, value} from "./File1"

let num = twice(value)

console.log(num) //outputs 10
console.log(square(num)) //outputs 100
console.log(squareCube(num)) //outputs 1000
```
#### Bundlers and Minifiers
When you have a program with **a lot** of modules, loading the whole program over the network might take a lot more time than loading it as a single big file. So web programmers have started using tools that roll the program (which they painstakingly split into modules) back into a single big file before they publish it to the web. Such tools are called *bundlers*. 

Size of file also determines how fast a program can be transferred over the network thus the javascript community invented *minifiers*. These tools take a javascript program and make it smaller by automatically removing comments, white spaces, renaming bindings and replacing pieces of code with equivalent code that takes up less space

## Exercises
### Chapter Eight: Bugs and Error
* 8.1 Retry

For this exercise, i was tasked to write two functions. The **first** `primitiveMultiply` multiplies two numbers in 20% of cases and in the other 80% raises an exception of type `MultiplicatorUnitFailure`. The **second** fuction would wrap this first function and keep trying it until a call succeeds, after which it returns the result. I was also tasked to handle only the exceptions I am trying to handle. 

I started by creating a `MultiplicatorUnitFailure` class that extends from the `Error` constructor. An instance of this class would be the exception i raise in `primitiveMultiply`
```javascript
class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
 if((Math.round(Math.random() * 100)) <= 20) {
    return a * b
 } else {
  throw new MultiplicatorUnitFailure('Failed to multiply')
 }
}
```
Multiplying the `Math.random` function by 100 (percent value) and rounding it's value using `Math.round`  returns a random whole number between 0 to 100. If this number is less than or equal to 20, it multiplies the two numbers passed in as argument. Else it raises the `MultiplictorUnitFailure` exception. Then i progressed to write the second function `trial` 
```javascript
function trial(a, b) {
    for(;;) {
        try {
       let result = primitiveMultiply(a, b)
       console.log(result)
        break
        }
        catch(e) {
            if (e instanceof MultiplicatorUnitFailure) console.error(e)
            else throw e
        }
        }
}
trial(12, 5)
```
For this function, i wrote a continuous loop that only breaks when a call to `primitiveMultiply` succeeds. To be able to handle exceptions, this call is wrapped in a `try`/`catch` block. When the call to `primitiveMultiply` fails in the `try` block, the exception it raises is passed to the `catch` block where i can display it on the console if it is the error i want to handle, or re-throw it otherwise ( makes our code not get stuck in an unending loop if we introduce a bug). It then iterates again. 

When the call succeeds the value it returns is assigned to a local binding `result` and i log it to the console and break out of the loop

* 8.2 The Locked Box

For this exercise, i was given a sample object 
```javascript
const box =  {
  locked: true,
  unlock() { this.locked = false },
  lock() { this.locked = true },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
}
```
It represents a box with a lock. There is an array in the box, but we can get at it only when the box is unlocked. Directly accessing the private `_content` property is forbidden.  For this exercise, i was tasked to write a function called `withBoxUnlocked` that takes a function value as argument, unlocks the box, runs the function, and then ensures that the box is locked again before returning, regardless of whether the argument function returned normally or threw an exception. I was given a sample template to review my solution.
```javascript
const box = {
  locked: true,
  unlock() { this.locked = false },
  lock() { this.locked = true },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
} 

function withBoxUnlocked(body) {
// Your code here.
}

withBoxUnlocked(function() {
box.content.push("gold piece");
})

try {
withBoxUnlocked(function() {
throw new Error("Pirates on the horizon! Abort!");
})
} catch (e) {
console.log("Error raised:", e);
}

console.log(box.locked);
// true
```
For extra points, I was to make sure that if i call `withBoxUnlocked` when the box is already unlocked, the box stays unlocked.

I started by running the `body` function in a `try` block and using the `finally` block to lock the box object no matter what happens with the function call (whether it runs normally or throws an exception)
```javascript
 function withBoxUnlocked(body) {
  try {
  if(box.locked) {
  box.unlock()
  }
  body()
  } finally {
   box.lock()
 }
}
```
But this `body` function should only run when the box is unlocked. So i wrote an `if` statement before the function call to check if the box is locked. If it is, it unlocks before progressing to call the `body` function

Then i modified the code to make sure the box stays unlocked, if it is unlocked before i call `withBoxUnlocked`
```javascript
 function withBoxUnlocked(body) {
 let progress = 0
 try {
 if(box.locked) {
   box.unlock()
   progress = 1
 }
 body()
} finally {
   if(progress == 1)  box.lock()
}
}
```
I did this using the binding `progress` to track the state of the box. 

If it is locked before `withBoxUnlocked` is called, `progress` gets re-assigned 1 and the box is unlocked before the `body` function is called. 

If it is unlocked before `withBoxUnlocked` is called, `progress` remains 0 and it progresses to run the `body` function

The `finally` block locks the box only if `progress` is 1 (box is unlocked before `body` function is called). If not it remains unlocked

### Chapter Nine: Regular Expressions
* 9.1 RegExp Golf

For this exercise, i was tasked to write an "as small as possible" regular epression to test whether any of the given substrings occur in a string. The author adviced not to worry about word boundaries unless explicitly mentioned.
1. car and cat
2. pop and prop
3. ferret, ferry, and ferrari
4. Any word ending in ious
5. A whitespace character followed by a period, comma, colon, or semicolon
6. A word longer than six letters
7. A word without the letter e (or E)

For *car* and *cat*, i want the regular expression to match a "r" or a "t" at the end of "ca" so i put them between square brackets
```javascript
console.log(/ca[rt]/.test("car"))
console.log(/pr?op/.test("pop"))
console.log(/ferr(et|y|ari)/.test("ferrari"))
console.log(/ious\b/.test("I am impervious"))
console.log(/\s[.,:;]/.test(" ;"))
console.log(/\w{7,}/.test("mediocre"))
console.log(/\b[^e]+\b/i.test("grift"))
```
For *prop* and *pop*, i want "r" to be optional (appear zero times or one time) so i put a question mark in front of it. For *ferret*,*ferry* and *ferrari*, i thought since they all share "ferr", making the end an option using the pipe character would work. The fourth one required a word boundary at the end to match any word ending with "ious". The fifth one matches a white space followed by any option of characters I put in between square brackets. The sixth one matches a word that appears a precise number of times so i used curly braces.

The last one required word boundaries to show I want to match a word. The word would contain any character except "e" (used the square bracket and caret character for this) that appears one or more times (plus sign). I also added the option `i` so it can match uppercase or lowercase "e"

* 9.2 Quoting Style

For a written story, where I used single quotation marks throughout to mark pieces of dialogue, My task is to replace all the dialogue quotes with double quotes while keeping the single quotes used in contractions like "aren't". I have to think of a pattern that distinguishes these two kinds of quote usage and craft a call to the `replace` method that does the proper replacement.

A Single quote used in contraction is usually in between two characters in a word but The single quote i want to match either starts or ends a piece of dialogue and would not be in between word characters. It can appear at the beginning of a string or after a whitespace character. It can also appear before a white space character, before a period character or at the end of a string

```javascript
let story =`'How does that even work?' he muttered as he looked across 
the diner in excitement, 'You're extremely talented roseline'. 
Mark wasn't the sort of guy she liked but she was starting to fall for
him. He was cheerful and kind. 'Thank you, Mark'`
```
The call to the `replace` method takes a function `matcher` as it's replacement string argument. This function replaces all the matched single quotes with double quotes
```javascript
console.log(story.replace(/(^|\s)\'|\'(\s|\.|$)/g, matcher))

function matcher(_, first, second) {
    if(first) {
        return `${first}"` 
    } else if (second) {
        return `"${second}`
    } else if (first == undefined || second == undefined) {
        return `"`
    }
}
```
Since the beginning and end of a string are not actual characters, they are assigned `undefined` in the `matcher` function.  If `first` matches an actual character, it returns that character followed by a double quote (as the replacement string) and vice versa for `second` but if they match `undefined`(no character), it simply returns the double quote.

* 9.3 Numbers Again

For this exercise, i was tasked to write an expression that matches only Javascript-style numbers. 

It must support an optional minus or plus sign in front of the number, the decimal dot, and exponent notation—5e-3 or 1E10—again with an optional sign in front of the exponent. Also it is not necessary for there to be digits in front of or after the dot, but the number cannot be a dot alone. That is, .5 and 5. are valid JavaScript numbers, but a lone dot isn’t.

Since my number can start with an optional plus or minus sign, i started by matching that
```javascript
let expression = /[+-]?(\d+|\d+\.\d*|\.\d+|)([eE][+-]?\d*)?/
```
Then i matched either of 3 patterns,`\d+` matches a digit that occurs one or more times(matches 5, 55),`\d+\.\d*` matches a digit that occurs at least once followed by a period character followed by another digit that can occur zero times or more(matches 5.5, 5.55, 5.), `\.\d+` matches a period character followed by a digit that occurs at least once (matches .5, .55).

Any of these patterns can be followed by another optional group `[eE][+-]?\d*`. This matches an exponent "e" or "E" followed by an optional plus or minus sign followed by a digit that can occur zero or more times (matches e, E, e+, e-, E+, E-, e5, E5, e+5, e-5, E+5, E-5)

This worked perfectly but it was also matching wrong string values like "5Eaadffff" because the expression does not span the whole string. It just finds a match at "5E" and returns true for my test. To make the match span the whole string, i used markers `^` and `$`
```javascript
let expression = /^[+-]?(\d+|\d+\.\d*|\.\d+|)([eE][+-]?\d*)?$/
console.log(expression.test("1E10"))
```

### Chapter Ten: Modules
* 10.1 A Modular Robot

Given the following bindings that the project from chapter 7 creates
* `roads`
* `buildGraph`
* `roadGraph`
* `VillageState`
* `runRobot`
* `randomPick`
* `randomRobot`
* `mailRoute`
* `routeRobot`
* `findRoute`
* `goalOrientedRobot`

I was asked to answer the following questions if i were to write this project as a modular program
1. What modules would I create? 
2. Which module would depend on which other module, and what would their interfaces look like?
3. Which pieces are likely to be available prewritten on NPM? 
4. Would I prefer to use an NPM package or write them myself?

To answer questions one and two, I would create 5 modules that would look something like this
* helperFunctions.js (holds all the helper functions)
  * exports `buildGraph`
  * exports `randomPick`
  * exports `findRoute`

* graph.js (holds `roadGraph`)
  * imports `buildGraph` from helperFunctions.js
  * contains array `roads`
  * passes array `roads` to `buildGraph` to create `roadGraph`
  * exports `roadGraph`

* state.js (holds the `VillageState` class)
  * imports `roadGraph` from graph.js
  * imports `randomPick` from helperFunctions.js
  * exports `VillageState` class

* robots.js (holds all the robot functions)
  * imports `randomPick`, `findRoute` from helperFunctions.js
  * imports `roadGraph` from graph.js 
  * contains `mailRoute` 
  * exports `randomRobot`
  * exports `routeRobot`
  * exports `goalOrientedRobot`

* runRobot.js (robot simulation)
  * imports `VillageState` from state.js
  * imports `randomRobot`, `routeRobot`, `goalOrientedRobot` from robots.js
  * contains `runRobot` function
  * Now we can call the `runRobot` function passing in  `VillageState.random()`, any of the robots, memory(default is [])

For question three i would say the three helper functions `randomPick`, `findRoute` and `buildGraph`. For question four, it totally depends on how complex the code I have to write is. I would most likely write `randomPick` and `buildGraph` myself and use NPM packages for `findRoute`

* 10.2 Roads Module

For this exercise, i was tasked to write a CommonJS Module based on the example from Chapter 7, that contains the array of roads and exports the graph data structure representing them as `roadGraph`. It should depend on a module `./graph`, which exports a function `buildGraph` that is used to build the graph. This function expects an array of two-element arrays (the start and end points of the roads).

I started by creating the dependency `graph.js` and modifying `buildGraph` to take an array of two element arrays as argument
```javascript
function buildGraph(roads) {
    let graph = Object.create(null)
         function addEdge(from, to) {
             if(!graph[from]) {
               graph[from] = [to]
             }
             else {
                 graph[from].push(to)
             }
         }
     for(let [from, to] of roads) {
         addEdge(from, to)
         addEdge(to, from)
     }
     return graph
}

module.exports.buildGraph = buildGraph
```
Then i export the function `buildGraph`. And then proceeded to write the main module. 
```javascript
const {buildGraph} = require("./graph")

const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];
let updatedRoads = roads.map(string => string.split("-"))
const roadGraph = buildGraph(updatedRoads)

module.exports.roadGraph = roadGraph
```
`updatedRoads` represents the modified `roads` array converted to an array of two-element arrays (with the start and end points of the roads). This array is passed to `buildGraph` and it's resulting object value is assigned to `roadGraph`. 

* 10.3 Circular Dependencies

A circular dependency is a situation where module A depends on B, and B also, directly or indirectly, depends on A. Many module systems simply forbid this because whichever order you choose for loading such modules, you cannot make sure that each module’s dependencies have been loaded before it runs. 

CommonJS modules allow a limited form of cyclic dependencies. As long as the modules do not replace their default exports object and don’t access each other’s interface until after they finish loading, cyclic dependencies are okay.

For this exercise, I was asked to point out: 
1. How the `require` function from the chapter handles cycles
2. What would go wrong when a module in a cycle does replace its default exports object?

For two modules a.js and b.js in a cyclic dependency: 
* a.js require function loads b.js
* b.js require function tries to load a.js but if at this point, a.js has not finished loading,then b.js cannot access a.js exports object and we are stuck in a bit of an infinite loop
* If an unfinished copy of a.js exports object is provided for b.js though (before the require function is called), b.js finishes loading and it's exports object is returned to a.js so it can finish loading and provide a finished exports object
* The problem with this though is that when the unfinished copy of the a.js exports object is overwritten after b.js loads, b.js won't get hold of this finished interface (This answers question 2)