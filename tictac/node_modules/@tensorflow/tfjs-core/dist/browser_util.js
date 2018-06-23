"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("./doc");
var BrowserUtil = (function () {
    function BrowserUtil() {
    }
    BrowserUtil.nextFrame = function () {
        return new Promise(function (resolve) { return requestAnimationFrame(function () { return resolve(); }); });
    };
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Timing' })
    ], BrowserUtil, "nextFrame", null);
    return BrowserUtil;
}());
exports.BrowserUtil = BrowserUtil;
//# sourceMappingURL=browser_util.js.map