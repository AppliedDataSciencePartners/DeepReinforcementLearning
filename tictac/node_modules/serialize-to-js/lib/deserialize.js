/*
 * @copyright 2016- commenthol
 * @license MIT
 */
/* eslint no-new-func: 0 */

'use strict'

var saferEval = require('safer-eval')

/**
 * deserialize a serialized object to javascript
 *
 * _NOTE_: Deserialization uses `safer-eval` for code evaluation which may be "harmful".
 * *So now you are WARNED!*
 *
 * @example <caption>serializing regex, date, buffer, ...</caption>
 * var str = '{obj: {foo: "bar"}, arr: [1, "2"], regexp: /^test?$/, date: new Date("2016-04-15T16:22:52.009Z")}'
 * var res = deserialize(str)
 * console.log(res)
 * //> { obj: { foo: 'bar' },
 * //>   arr: [ 1, '2' ],
 * //>   regexp: /^test?$/,
 * //>   date: Sat Apr 16 2016 01:22:52 GMT+0900 (JST) }
 *
 * @throws {Error|TypeError} parsing error
 * @param {String} str - string containing serialized data
 * @param {Object|Boolean} [context] - pass context - if `true` unsafe execution
 * @return {Any} deserialized data
 */
function deserialize (str, context) {
  if (context === true) {
    return (new Function('"use strict"; return ' + str))() // unsafe execution
  }
  return saferEval(str, context)
}
module.exports = deserialize
