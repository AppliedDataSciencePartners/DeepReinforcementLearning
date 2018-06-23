"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var broadcast_util = require("../../ops/broadcast_util");
var CHECK_NAN_SNIPPET = "\n  if (isNaN(a)) return a;\n  if (isNaN(b)) return b;\n";
exports.ADD = 'return a + b;';
exports.SUB = 'return a - b;';
exports.MUL = 'return a * b;';
exports.DIV = 'return a / b;';
exports.INT_DIV = "\n  float resultSign = sign(a) * sign(b);\n  int ia = round(a);\n  int ib = round(b);\n  int result = ia / ib;\n  int amodb = ia - ib * result;\n\n  if (resultSign < 0.0 && amodb != 0) {\n    result -= 1;\n  }\n  return float(result);\n";
exports.POW = "\n  return (round(mod(b, 2.0)) == 0 || round(mod(b, 2.0)) == 2) ?\n      pow(abs(a), b) : sign(a) * pow(abs(a), b);\n";
exports.SQUARED_DIFFERENCE = 'return (a - b) * (a - b);';
exports.EQUAL = "return float(a == b);";
exports.NOT_EQUAL = "return float(a != b);";
exports.LESS = "return float(a < b);";
exports.LESS_EQUAL = "return float(a <= b);";
exports.GREATER = "return float(a > b);";
exports.GREATER_EQUAL = "return float(a >= b);";
exports.LOGICAL_AND = "return float(a >= 1.0 && b >= 1.0);";
exports.LOGICAL_OR = "return float(a >= 1.0 || b >= 1.0);";
exports.MAX = CHECK_NAN_SNIPPET + "\n  return max(a, b);\n";
exports.MIN = CHECK_NAN_SNIPPET + "\n  return min(a, b);\n";
exports.MOD = "return mod(a, b);";
exports.ATAN2 = CHECK_NAN_SNIPPET + "\n  return atan(a, b);\n";
exports.ELU_DER = "return (b >= 1.0) ? a : a * (b + 1.0);";
var BinaryOpProgram = (function () {
    function BinaryOpProgram(op, aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.supportsBroadcasting = true;
        this.outputShape =
            broadcast_util.assertAndGetBroadcastShape(aShape, bShape);
        this.userCode = "\n      float binaryOperation(float a, float b) {\n        " + op + "\n      }\n\n      void main() {\n        float a = getAAtOutCoords();\n        float b = getBAtOutCoords();\n        setOutput(binaryOperation(a, b));\n      }\n    ";
    }
    return BinaryOpProgram;
}());
exports.BinaryOpProgram = BinaryOpProgram;
//# sourceMappingURL=binaryop_gpu.js.map