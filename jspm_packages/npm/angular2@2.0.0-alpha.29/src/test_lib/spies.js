/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  __.prototype = b.prototype;
  d.prototype = new __();
};
var change_detection_1 = require("../../change_detection");
var pipe_1 = require("../change_detection/pipes/pipe");
var test_lib_1 = require("./test_lib");
var SpyChangeDetector = (function(_super) {
  __extends(SpyChangeDetector, _super);
  function SpyChangeDetector() {
    _super.call(this, change_detection_1.DynamicChangeDetector);
  }
  return SpyChangeDetector;
})(test_lib_1.SpyObject);
exports.SpyChangeDetector = SpyChangeDetector;
var SpyProtoChangeDetector = (function(_super) {
  __extends(SpyProtoChangeDetector, _super);
  function SpyProtoChangeDetector() {
    _super.call(this, change_detection_1.DynamicChangeDetector);
  }
  return SpyProtoChangeDetector;
})(test_lib_1.SpyObject);
exports.SpyProtoChangeDetector = SpyProtoChangeDetector;
var SpyPipe = (function(_super) {
  __extends(SpyPipe, _super);
  function SpyPipe() {
    _super.call(this, pipe_1.BasePipe);
  }
  return SpyPipe;
})(test_lib_1.SpyObject);
exports.SpyPipe = SpyPipe;
var SpyPipeFactory = (function(_super) {
  __extends(SpyPipeFactory, _super);
  function SpyPipeFactory() {
    _super.apply(this, arguments);
  }
  return SpyPipeFactory;
})(test_lib_1.SpyObject);
exports.SpyPipeFactory = SpyPipeFactory;
exports.__esModule = true;
