"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.regexEsc = exports.isEmailValid = void 0;
var isEmailValid = exports.isEmailValid = function isEmailValid(input) {
  return /^[^@]+@[^@]+\.[^@]+$/.test(input);
};
var regexEsc = exports.regexEsc = function regexEsc(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};