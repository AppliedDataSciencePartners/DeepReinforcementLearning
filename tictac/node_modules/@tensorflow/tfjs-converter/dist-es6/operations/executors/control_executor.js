var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { getParamValue, getTensor } from './utils';
export function executeOp(node, tensorMap, context) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, pred, data_1, inputName, frameId, data, tensor, input;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = node.op;
                    switch (_a) {
                        case 'loopCond': return [3, 1];
                        case 'switch': return [3, 2];
                        case 'merge': return [3, 4];
                        case 'enter': return [3, 5];
                        case 'exit': return [3, 6];
                        case 'nextIteration': return [3, 7];
                    }
                    return [3, 8];
                case 1: return [2, [getParamValue('pred', node, tensorMap, context)]];
                case 2:
                    pred = getParamValue('pred', node, tensorMap, context);
                    data_1 = getParamValue('data', node, tensorMap, context);
                    return [4, pred.data()];
                case 3: return [2, (_b.sent())[0] ? [undefined, data_1] : [data_1, undefined]];
                case 4:
                    inputName = node.inputNames.find(function (name) { return getTensor(name, tensorMap, context) !== undefined; });
                    return [2, inputName ? [getTensor(inputName, tensorMap, context)] : undefined];
                case 5:
                    frameId = getParamValue('frameName', node, tensorMap, context);
                    data = getParamValue('tensor', node, tensorMap, context);
                    context.enterFrame(frameId);
                    return [2, [data]];
                case 6:
                    tensor = getParamValue('tensor', node, tensorMap, context);
                    context.exitFrame();
                    return [2, [tensor]];
                case 7:
                    input = getParamValue('tensor', node, tensorMap, context);
                    context.nextIteration();
                    return [2, [input]];
                case 8: throw TypeError("Node type " + node.op + " is not implemented");
            }
        });
    });
}
export var CATEGORY = 'control';
//# sourceMappingURL=control_executor.js.map