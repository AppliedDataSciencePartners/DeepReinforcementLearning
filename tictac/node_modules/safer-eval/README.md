# safer-eval

[![NPM version](https://badge.fury.io/js/safer-eval.svg)](https://www.npmjs.com/package/safer-eval/)

> a safer eval

A safer approach for eval in node and browser. Before using this module, **ask
yourself if there are no better options** than using saferEval.
It is potentially better than the bad old `eval()` but still has some harmful potential.
Especially when it comes to passing `context` props.
Use [clones][] to wrap-up the methods you like to allow.
Checkout the "harmful context" tests section.

> **Warning:** The `saferEval` function may be harmful - so you are warned!

In node the `vm` module is used to sandbox the evaluation of `code`.

The browser version `browser.js` might not be as safe as the node version
`index.js` as here no real sandboxing is available. Please consider modules like
[sandboxr](https://www.npmjs.com/package/sandboxr).

Runs on node and in modern browsers:

|                | Versions |
| ---            | ---      |
| **node**       | ~~0.12~~, 4, 6, 7  |
| **Chrome**     | 55, 56   |
| **Firefox**    | 45, 51   |
| **Edge**       | 13, 14   |
| **IE**         | ~~11~~   |
| **Safari**     | 10       |
| **iOS Safari** | 10       |

## Installation

```
npm install --save safer-eval
```

## Usage

`context` allows the definition of passed in Objects into the sandbox.
Take care, injected `code` can overwrite those passed context props!
Check the tests under "harmful context"!

**Parameters**

**code**: `String`, a string containing javascript code

**context**: `Object`, define globals, properties for evaluation context

**Returns**: `Any`, evaluated code

**Example**:

in node:

```js
var saferEval = require('safer-eval')
var code = `{d: new Date('1970-01-01'), b: new Buffer('data')}`
var res = saferEval(code)
// => toString.call(res.d) = '[object Date]'
// => toString.call(res.b) = '[object Buffer]'
```

in browser:

```js
var saferEval = require('safer-eval')
var code = `{d: new Date('1970-01-01'), b: function () { return navigator.userAgent }`
var res = saferEval(code, {navigator: window.navigator})
// => toString.call(res.d) = '[object Date]'
// => toString.call(res.b) = '[object Function]'
// => res.b() = "Mozilla/5.0 (..."
```

To minimize any harmful code injection carefully select the methods you allow in `context`

```js
var code = `window.btoa('Hello, world')`

// AVOID passing a GLOBAL context!!!
var res = saferEval(code, {window: window})

// BETTER - code needs only access to window.btoa
const clones = require('clones')
var context = {
  window: {
    btoa: clones(window.btoa, window)
  }
}
var res = saferEval(code ,context)
// => res = 'SGVsbG8sIHdvcmxk'
```

## Reusing context

Use `new SaferEval()` to reuse a once created context.

```js
const {SaferEval} = require('safer-eval')
const safer = new SaferEval()
var code = `{d: new Date('1970-01-01'), b: new Buffer('data')}`
var res = safer.runInContext(code)
```

## License

[MIT](./LICENSE)

[clones]: https://github.com/commenthol/clones
