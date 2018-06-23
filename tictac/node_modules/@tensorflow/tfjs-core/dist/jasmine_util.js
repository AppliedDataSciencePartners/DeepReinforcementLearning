"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var backend_cpu_1 = require("./kernels/backend_cpu");
var backend_webgl_1 = require("./kernels/backend_webgl");
var test_util_1 = require("./test_util");
function canEmulateFeature(feature, emulatedFeatures) {
    var emulatedFeature = emulatedFeatures[feature];
    if (feature === 'BACKEND') {
        return environment_1.ENV.findBackend(emulatedFeature) != null;
    }
    else if (feature === 'WEBGL_VERSION') {
        return environment_1.ENV.get(feature) >= emulatedFeature;
    }
    else if (feature === 'WEBGL_RENDER_FLOAT32_ENABLED' ||
        feature === 'WEBGL_DOWNLOAD_FLOAT_ENABLED' || feature === 'IS_CHROME') {
        if (environment_1.ENV.get(feature) === false && emulatedFeature === true) {
            return false;
        }
        return true;
    }
    return true;
}
function canEmulateEnvironment(emulatedFeatures) {
    var featureNames = Object.keys(emulatedFeatures);
    for (var i = 0; i < featureNames.length; i++) {
        var featureName = featureNames[i];
        if (!canEmulateFeature(featureName, emulatedFeatures)) {
            return false;
        }
    }
    return true;
}
exports.canEmulateEnvironment = canEmulateEnvironment;
function anyFeaturesEquivalentToDefault(emulatedFeatures, environment) {
    var _loop_1 = function (j) {
        var candidateDuplicateFeature = emulatedFeatures[j];
        if (candidateDuplicateFeature === test_util_1.NATIVE_ENV) {
            return "continue";
        }
        var featureNames = Object.keys(candidateDuplicateFeature);
        var featuresMatch = featureNames.every(function (featureName) { return candidateDuplicateFeature[featureName] ===
            environment.get(featureName); });
        if (featuresMatch) {
            return { value: true };
        }
    };
    for (var j = 0; j < emulatedFeatures.length; j++) {
        var state_1 = _loop_1(j);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
exports.anyFeaturesEquivalentToDefault = anyFeaturesEquivalentToDefault;
function describeWithFlags(name, featuresToRun, tests) {
    registerTestBackends();
    for (var i = 0; i < featuresToRun.length; i++) {
        var features = featuresToRun[i];
        if (features === test_util_1.NATIVE_ENV &&
            anyFeaturesEquivalentToDefault(featuresToRun, environment_1.ENV)) {
            continue;
        }
        if (canEmulateEnvironment(features)) {
            var testName = name + ' ' + JSON.stringify(features);
            executeTests(testName, tests, features);
        }
    }
}
exports.describeWithFlags = describeWithFlags;
setTestBackends([
    { name: 'test-webgl', factory: function () { return new backend_webgl_1.MathBackendWebGL(); }, priority: 101 },
    { name: 'test-cpu', factory: function () { return new backend_cpu_1.MathBackendCPU(); }, priority: 100 }
]);
var BEFORE_ALL = function (features) { };
var AFTER_ALL = function (features) { };
var BEFORE_EACH = function (features) { };
var AFTER_EACH = function (features) { };
function setBeforeAll(f) {
    BEFORE_ALL = f;
}
exports.setBeforeAll = setBeforeAll;
function setAfterAll(f) {
    AFTER_ALL = f;
}
exports.setAfterAll = setAfterAll;
function setBeforeEach(f) {
    BEFORE_EACH = f;
}
exports.setBeforeEach = setBeforeEach;
function setAfterEach(f) {
    AFTER_EACH = f;
}
exports.setAfterEach = setAfterEach;
function setTestBackends(testBackends) {
    exports.TEST_BACKENDS = testBackends;
}
exports.setTestBackends = setTestBackends;
function registerTestBackends() {
    exports.TEST_BACKENDS.forEach(function (testBackend) {
        if (environment_1.ENV.findBackend(testBackend.name) != null) {
            environment_1.ENV.removeBackend(testBackend.name);
        }
        environment_1.ENV.registerBackend(testBackend.name, testBackend.factory, testBackend.priority);
    });
}
exports.registerTestBackends = registerTestBackends;
function executeTests(testName, tests, features) {
    describe(testName, function () {
        beforeAll(function () {
            environment_1.ENV.setFeatures(features);
            registerTestBackends();
            BEFORE_ALL(features);
        });
        beforeEach(function () {
            BEFORE_EACH(features);
            if (features && features.BACKEND != null) {
                environment_1.Environment.setBackend(features.BACKEND);
            }
            environment_1.ENV.engine.startScope();
        });
        afterEach(function () {
            environment_1.ENV.engine.endScope(null);
            AFTER_EACH(features);
        });
        afterAll(function () {
            AFTER_ALL(features);
            environment_1.ENV.reset();
        });
        tests();
    });
}
//# sourceMappingURL=jasmine_util.js.map