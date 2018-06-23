'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isComment = isComment;
exports.isConditionalComment = isConditionalComment;
function isComment(content) {
    return (content || '').trim().search('<!--') === 0;
}

function isConditionalComment(content) {
    return (content || '').trim().search(/<!--\[if/) === 0;
}