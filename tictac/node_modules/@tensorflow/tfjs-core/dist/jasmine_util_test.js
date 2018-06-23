"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var jasmine_util = require("./jasmine_util");
var backend_cpu_1 = require("./kernels/backend_cpu");
var test_util_1 = require("./test_util");
var webgl_1 = require("./webgl");
describe('canEmulateEnvironment', function () {
    beforeEach(function () {
        environment_1.ENV.reset();
    });
    afterEach(function () {
        environment_1.ENV.reset();
    });
    it('no registered backends', function () {
        var fakeFeatures = { 'BACKEND': 'fake-webgl' };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures)).toBe(false);
    });
    it('webgl backend, webgl emulation', function () {
        environment_1.ENV.registerBackend('fake-webgl', function () { return new backend_cpu_1.MathBackendCPU(); });
        var fakeFeatures = { 'BACKEND': 'fake-webgl' };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures)).toBe(true);
        environment_1.ENV.removeBackend('fake-webgl');
    });
    it('webgl backend, tensorflow emulation', function () {
        environment_1.ENV.registerBackend('fake-webgl', function () { return new backend_cpu_1.MathBackendCPU(); });
        var fakeFeatures = { 'BACKEND': 'fake-tensorflow' };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures)).toBe(false);
        environment_1.ENV.removeBackend('fake-webgl');
    });
    it('webgl backend, webgl 2.0 emulation on webgl 2.0', function () {
        environment_1.ENV.registerBackend('fake-webgl', function () { return new backend_cpu_1.MathBackendCPU(); });
        environment_1.ENV.set('WEBGL_VERSION', 2);
        var fakeFeatures = { 'BACKEND': 'fake-webgl', 'WEBGL_VERSION': 2 };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures)).toBe(true);
        environment_1.ENV.removeBackend('fake-webgl');
    });
    it('webgl backend, webgl 1.0 emulation on webgl 2.0', function () {
        environment_1.ENV.registerBackend('fake-webgl', function () { return new backend_cpu_1.MathBackendCPU(); });
        environment_1.ENV.set('WEBGL_VERSION', 2);
        var fakeFeatures = { 'BACKEND': 'fake-webgl', 'WEBGL_VERSION': 1 };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures)).toBe(true);
        environment_1.ENV.removeBackend('fake-webgl');
    });
    it('webgl backend, webgl 2.0 emulation on webgl 1.0 fails', function () {
        environment_1.ENV.registerBackend('fake-webgl', function () { return new backend_cpu_1.MathBackendCPU(); });
        environment_1.ENV.set('WEBGL_VERSION', 1);
        var fakeFeatures = { 'BACKEND': 'fake-webgl', 'WEBGL_VERSION': 2 };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures)).toBe(false);
        environment_1.ENV.removeBackend('fake-webgl');
    });
    it('webgl backend, webgl 1.0 no float emulation on webgl 2.0', function () {
        environment_1.ENV.registerBackend('fake-webgl', function () { return new backend_cpu_1.MathBackendCPU(); });
        environment_1.ENV.set('WEBGL_VERSION', 2);
        environment_1.ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', true);
        var fakeFeatures = {
            'BACKEND': 'fake-webgl',
            'WEBGL_VERSION': 1,
            'WEBGL_RENDER_FLOAT32_ENABLED': false
        };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures)).toBe(true);
        environment_1.ENV.removeBackend('fake-webgl');
    });
    it('webgl backend, webgl 1.0 no float emulation on webgl 1.0 no float', function () {
        environment_1.ENV.registerBackend('fake-webgl', function () { return new backend_cpu_1.MathBackendCPU(); });
        environment_1.ENV.set('WEBGL_VERSION', 1);
        environment_1.ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', false);
        environment_1.ENV.set('WEBGL_DOWNLOAD_FLOAT_ENABLED', false);
        var fakeFeatures = {
            'BACKEND': 'fake-webgl',
            'WEBGL_VERSION': 1,
            'WEBGL_RENDER_FLOAT32_ENABLED': false,
            'WEBGL_DOWNLOAD_FLOAT_ENABLED': false
        };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures)).toBe(true);
        environment_1.ENV.removeBackend('fake-webgl');
    });
});
describe('anyFeaturesEquivalentToDefault', function () {
    var testBackends;
    beforeEach(function () {
        testBackends = jasmine_util.TEST_BACKENDS;
    });
    afterEach(function () {
        jasmine_util.setTestBackends(testBackends);
    });
    it('ignores default', function () {
        var env = new environment_1.Environment();
        var features = [test_util_1.NATIVE_ENV];
        expect(jasmine_util.anyFeaturesEquivalentToDefault(features, env))
            .toBe(false);
    });
    it('equivalent features', function () {
        jasmine_util.setTestBackends([{
                name: 'fake-webgl',
                factory: function () { return new webgl_1.MathBackendWebGL(); },
                priority: 1000
            }]);
        var env = new environment_1.Environment();
        env.set('WEBGL_VERSION', 1);
        env.set('BACKEND', 'fake-webgl');
        var features = [test_util_1.NATIVE_ENV, { 'WEBGL_VERSION': 1, 'BACKEND': 'fake-webgl' }];
        expect(jasmine_util.anyFeaturesEquivalentToDefault(features, env))
            .toBe(true);
    });
    it('different features', function () {
        jasmine_util.setTestBackends([{
                name: 'fake-webgl',
                factory: function () { return new webgl_1.MathBackendWebGL(); },
                priority: 1
            }]);
        var env = new environment_1.Environment();
        env.set('WEBGL_VERSION', 0);
        env.set('BACKEND', 'fake-cpu');
        var features = [test_util_1.NATIVE_ENV].concat([{ 'WEBGL_VERSION': 1, 'BACKEND': 'fake-webgl' }]);
        expect(jasmine_util.anyFeaturesEquivalentToDefault(features, env))
            .toBe(false);
    });
});
//# sourceMappingURL=jasmine_util_test.js.map