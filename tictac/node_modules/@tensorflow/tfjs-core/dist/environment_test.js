"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var device_util = require("./device_util");
var environment_1 = require("./environment");
var jasmine_util_1 = require("./jasmine_util");
var backend_cpu_1 = require("./kernels/backend_cpu");
var backend_webgl_1 = require("./kernels/backend_webgl");
var test_util_1 = require("./test_util");
jasmine_util_1.describeWithFlags('disjoint query timer enabled', test_util_1.WEBGL_ENVS, function () {
    afterEach(function () {
        environment_1.ENV.reset();
    });
    it('no webgl', function () {
        environment_1.ENV.setFeatures({ 'WEBGL_VERSION': 0 });
        expect(environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION')).toBe(0);
    });
    it('webgl 1', function () {
        var features = { 'WEBGL_VERSION': 1 };
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) {
                if (context === 'webgl' || context === 'experimental-webgl') {
                    return {
                        getExtension: function (extensionName) {
                            if (extensionName === 'EXT_disjoint_timer_query') {
                                return {};
                            }
                            else if (extensionName === 'WEBGL_lose_context') {
                                return { loseContext: function () { } };
                            }
                            return null;
                        }
                    };
                }
                return null;
            }
        });
        environment_1.ENV.setFeatures(features);
        expect(environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION')).toBe(1);
    });
    it('webgl 2', function () {
        var features = { 'WEBGL_VERSION': 2 };
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) {
                if (context === 'webgl2') {
                    return {
                        getExtension: function (extensionName) {
                            if (extensionName === 'EXT_disjoint_timer_query_webgl2') {
                                return {};
                            }
                            else if (extensionName === 'WEBGL_lose_context') {
                                return { loseContext: function () { } };
                            }
                            return null;
                        }
                    };
                }
                return null;
            }
        });
        environment_1.ENV.setFeatures(features);
        expect(environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION')).toBe(2);
    });
});
jasmine_util_1.describeWithFlags('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE', test_util_1.WEBGL_ENVS, function () {
    afterEach(function () {
        environment_1.ENV.reset();
    });
    it('disjoint query timer disabled', function () {
        var features = { 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION': 0 };
        var env = new environment_1.Environment(features);
        expect(env.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
            .toBe(false);
    });
    it('disjoint query timer enabled, mobile', function () {
        var features = { 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION': 1 };
        spyOn(device_util, 'isMobile').and.returnValue(true);
        var env = new environment_1.Environment(features);
        expect(env.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
            .toBe(false);
    });
    it('disjoint query timer enabled, not mobile', function () {
        var features = { 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION': 1 };
        spyOn(device_util, 'isMobile').and.returnValue(false);
        var env = new environment_1.Environment(features);
        expect(env.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
            .toBe(true);
    });
});
jasmine_util_1.describeWithFlags('WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED', test_util_1.WEBGL_ENVS, function () {
    afterEach(function () {
        environment_1.ENV.reset();
    });
    beforeEach(function () {
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) {
                if (context === 'webgl2') {
                    return {
                        getExtension: function (extensionName) {
                            if (extensionName === 'WEBGL_get_buffer_sub_data_async') {
                                return {};
                            }
                            else if (extensionName === 'WEBGL_lose_context') {
                                return { loseContext: function () { } };
                            }
                            return null;
                        }
                    };
                }
                return null;
            }
        });
    });
    it('WebGL 2 enabled', function () {
        var features = { 'WEBGL_VERSION': 2 };
        var env = new environment_1.Environment(features);
        expect(env.get('WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED'))
            .toBe(false);
    });
    it('WebGL 1 disabled', function () {
        var features = { 'WEBGL_VERSION': 1 };
        var env = new environment_1.Environment(features);
        expect(env.get('WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED'))
            .toBe(false);
    });
});
jasmine_util_1.describeWithFlags('WebGL version', test_util_1.WEBGL_ENVS, function () {
    afterEach(function () {
        environment_1.ENV.reset();
    });
    it('webgl 1', function () {
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) {
                if (context === 'webgl') {
                    return {
                        getExtension: function (a) {
                            return { loseContext: function () { } };
                        }
                    };
                }
                return null;
            }
        });
        var env = new environment_1.Environment();
        expect(env.get('WEBGL_VERSION')).toBe(1);
    });
    it('webgl 2', function () {
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) {
                if (context === 'webgl2') {
                    return {
                        getExtension: function (a) {
                            return { loseContext: function () { } };
                        }
                    };
                }
                return null;
            }
        });
        var env = new environment_1.Environment();
        expect(env.get('WEBGL_VERSION')).toBe(2);
    });
    it('no webgl', function () {
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) { return null; }
        });
        var env = new environment_1.Environment();
        expect(env.get('WEBGL_VERSION')).toBe(0);
    });
});
describe('Backend', function () {
    beforeAll(function () {
        spyOn(console, 'warn');
    });
    afterEach(function () {
        environment_1.ENV.reset();
    });
    it('custom cpu registration', function () {
        var backend;
        environment_1.ENV.registerBackend('custom-cpu', function () {
            backend = new backend_cpu_1.MathBackendCPU();
            return backend;
        });
        expect(environment_1.ENV.findBackend('custom-cpu')).toBe(backend);
        environment_1.ENV.removeBackend('custom-cpu');
    });
    it('webgl not supported, falls back to cpu', function () {
        environment_1.ENV.setFeatures({ 'WEBGL_VERSION': 0 });
        environment_1.ENV.registerBackend('custom-cpu', function () { return new backend_cpu_1.MathBackendCPU(); }, 103);
        var success = environment_1.ENV.registerBackend('custom-webgl', function () { return new backend_webgl_1.MathBackendWebGL(); }, 104);
        expect(success).toBe(false);
        expect(environment_1.ENV.findBackend('custom-webgl') == null).toBe(true);
        expect(environment_1.ENV.getBestBackendType()).toBe('custom-cpu');
        environment_1.ENV.removeBackend('custom-cpu');
    });
    it('default custom background null', function () {
        expect(environment_1.ENV.findBackend('custom')).toBeNull();
    });
    it('allow custom backend', function () {
        var backend = new backend_cpu_1.MathBackendCPU();
        var success = environment_1.ENV.registerBackend('custom', function () { return backend; });
        expect(success).toBeTruthy();
        expect(environment_1.ENV.findBackend('custom')).toEqual(backend);
        environment_1.ENV.removeBackend('custom');
    });
});
//# sourceMappingURL=environment_test.js.map