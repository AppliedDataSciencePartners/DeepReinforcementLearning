"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var DEFAULT_FLOAT32_EPSILON = 1e-8;
var DEFAULT_FLOAT16_EPSILON = 1e-4;
function getOptimizerDefaultEpsilonValue() {
    if (environment_1.ENV.get('WEBGL_RENDER_FLOAT32_ENABLED')) {
        return DEFAULT_FLOAT32_EPSILON;
    }
    return DEFAULT_FLOAT16_EPSILON;
}
exports.getOptimizerDefaultEpsilonValue = getOptimizerDefaultEpsilonValue;
//# sourceMappingURL=optimizer_utils.js.map