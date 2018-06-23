# clones

[![NPM version](https://badge.fury.io/js/clones.svg)](https://www.npmjs.com/package/clones/)

> should deep clone everything even global objects, functions, circularities, ...

Companion for [safer-eval](https://github.com/commenthol/safer-eval).

Runs on node and in modern browsers:

|                | Versions |
| ---            | ---      |
| **node**       | ~~0.12~~, 4, 6, 7  |
| **Chrome**     | 55, 56   |
| **Firefox**    | 45, 51   |
| **Edge**       | 14       |
| **IE**         | ~~11~~   |
| **Safari**     | 10       |
| **iOS Safari** | 10       |

## Installation

```
npm i -S clones
```

## Usage

```js
const clones = require('clones')
const dest = clones(source, [bind])
```

**Parameters**

**Parameters**

**source**: `Object`, clone source

**bind**: `Object`, bind functions to this context

**Returns**: `Any`, deep clone of `source`

**Example**:
```js
const clones = require('clones')

var source = {
  obj: {a: {b: 1}},
  arr: [true, 1, {c: 'dee'}],
  fn: function () { return this.number + 12 }
}
// adding circularity
source.obj.a.e = source.obj.a

// do the cloning (with binding a context)
var dest = clones(source, {number: 30})
// => { obj: { a: { b: 1, e: [Circular] }, d: 2017-02-17T21:57:44.576Z },
//      arr: [ true, 1, { c: 'dee' } ],
//      fn: [Function: fn] }

// checks
assert.ok(dest !== source)                      // has different reference
assert.ok(dest.obj !== source.obj)              // has different reference
assert.ok(dest.obj.a !== source.obj.a)          // has different reference
assert.ok(dest.obj.a.e !== source.obj.a.e)      // different references for circularities
assert.equal(dest.obj.d.toISOString(),
  source.obj.d.toISOString())                   // has same content
assert.ok(dest.fn !== source.fn)                // has different function reference
source.fn = source.fn.bind({number: 29})        // bind `this` for `source`
assert.equal(dest.fn(), source.fn() + 1)        // returning the same result
```

### Clone prototypes or classes

```js
const clones = require('clones')
// clone built in `Array`
const C = clones.classes(Array)

let c = new C(1,2,3)
// => [1, 2, 3]
c.reverse()
// => [3, 2, 1]
```

## License

[MIT](./LICENSE)
