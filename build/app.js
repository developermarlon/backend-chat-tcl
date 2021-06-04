"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cors = _interopRequireDefault(require("cors"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import packages
//settings
var app = (0, _express.default)();

_dotenv.default.config({
  path: ".env.".concat(process.env.NODE_ENV)
});

(0, _momentTimezone.default)().tz("America/Bogota").format(); //middlewares

app.use((0, _morgan.default)('dev'));
app.use(_express.default.json());
app.use((0, _cors.default)()); //public folder

app.use(_express.default.static(__dirname + '/public')); // export default app express

var _default = app;
exports.default = _default;