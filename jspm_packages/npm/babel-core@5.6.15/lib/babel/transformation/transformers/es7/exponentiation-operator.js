/* */ 
"format cjs";
"use strict";

var _toolsProtectJs2 = require("./../../../tools/protect.js");

var _toolsProtectJs3 = _interopRequireDefault(_toolsProtectJs2);

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

// https://github.com/rwaldron/exponentiation-operator

var _helpersBuildBinaryAssignmentOperatorTransformer = require("../../helpers/build-binary-assignment-operator-transformer");

var _helpersBuildBinaryAssignmentOperatorTransformer2 = _interopRequireDefault(_helpersBuildBinaryAssignmentOperatorTransformer);

var _types = require("../../../types");

var t = _interopRequireWildcard(_types);

_toolsProtectJs3["default"](module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var metadata = {
  stage: 2
};

exports.metadata = metadata;
var MATH_POW = t.memberExpression(t.identifier("Math"), t.identifier("pow"));

var visitor = _helpersBuildBinaryAssignmentOperatorTransformer2["default"]({
  operator: "**",

  build: function build(left, right) {
    return t.callExpression(MATH_POW, [left, right]);
  }
});
exports.visitor = visitor;