"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
describe('version', function () {
    it('version is contained', function () {
        var expected = require('../package.json').version;
        expect(index_1.version_core).toBe(expected);
    });
});
//# sourceMappingURL=version_test.js.map