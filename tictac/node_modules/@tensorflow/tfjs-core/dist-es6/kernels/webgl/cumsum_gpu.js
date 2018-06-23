import { getCoordsDataType } from './shader_compiler';
var CumSumProgram = (function () {
    function CumSumProgram(shape, exclusive, reverse) {
        this.variableNames = ['x'];
        this.outputShape = shape;
        var rank = shape.length;
        var finalDim = shape[shape.length - 1];
        var dtype = getCoordsDataType(rank);
        var outputCoords = getCoords(rank, 'coords');
        var sourceCoords = getCoords(rank, 'adjustableCoords');
        var finalCoord = getFinalCoord(rank, 'coords');
        var finalAdjustableCoord = getFinalCoord(rank, 'adjustableCoords');
        var indexAdjuster = reverse ? "return " + finalDim + " -i - 1;" : 'return i;';
        var comparator = reverse ? '<' : '>';
        this.userCode = "\n      int getIndex(int i) {\n        " + indexAdjuster + "\n      }\n\n      void main() {\n        " + dtype + " coords = getOutputCoords();\n        " + dtype + " adjustableCoords = " + dtype + "(" + outputCoords + ");\n        int finalCoord = int(" + finalCoord + ");\n        float val = 0.0;\n        for (int i = " + finalDim + " - 1; i >= 0; i -= 1) {\n          int idx = getIndex(i);\n          if (idx " + comparator + " finalCoord) {\n            continue;\n          }\n          if (idx == finalCoord && " + exclusive + ") {\n            continue;\n          }\n          " + finalAdjustableCoord + " = idx;\n          val += getX(" + sourceCoords + ");\n        }\n        setOutput(val);\n      }\n    ";
    }
    return CumSumProgram;
}());
export { CumSumProgram };
function getCoords(rank, name) {
    if (rank === 1) {
        return "" + name;
    }
    else if (rank === 2) {
        return name + ".x, " + name + ".y";
    }
    else if (rank === 3) {
        return name + ".x, " + name + ".y, " + name + ".z";
    }
    else if (rank === 4) {
        return name + ".x, " + name + ".y, " + name + ".z, " + name + ".w";
    }
    else {
        throw Error("Cumulative sum for rank " + rank + " is not yet supported");
    }
}
function getFinalCoord(rank, name) {
    if (rank === 1) {
        return "" + name;
    }
    else if (rank === 2) {
        return name + ".y";
    }
    else if (rank === 3) {
        return name + ".z";
    }
    else if (rank === 4) {
        return name + ".w";
    }
    else {
        throw Error("Cumulative sum for rank " + rank + " is not yet supported");
    }
}
//# sourceMappingURL=cumsum_gpu.js.map