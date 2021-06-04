"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = void 0;

var _app = _interopRequireDefault(require("./app"));

var _socket = _interopRequireDefault(require("socket.io"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//config app
var server = _app.default.listen(process.env.PORT); //web sockets


exports.server = server;
var io = new _socket.default(server);

_app.default.set('io', io);

io.on('connection', socket => {
  socket.room = 'default';
  socket.join(socket.room);
  socket.on('disconnect', /*#__PURE__*/_asyncToGenerator(function* () {
    socket.broadcast.to(socket.room).emit('user disconnected', {
      id: socket.id
    });
    socket.disconnect();
    socket.to(socket.room).emit('get clients', getSockets(socket.room));
  }));
  socket.on('get clients', room => {
    socket.to(room).emit('get clients', getSockets(room));
  });

  var getSockets = room => {
    return socket.adapter.rooms[room] ? Object.keys(socket.adapter.rooms[room].sockets) : [];
  };

  socket.on('swith channel', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (room) {
      yield socket.leave(socket.room);
      yield socket.join(room);
      socket.room = room;
      yield socket.broadcast.to(room).emit('user connected', {
        id: socket.id
      });
      socket.to(room).emit('get clients', getSockets(room));
    });

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
  socket.on('send message', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(function* (_ref3) {
      var {
        type_user,
        message,
        room
      } = _ref3;
      socket.broadcast.to(room).emit('get message', {
        id: socket.id,
        type_user,
        message
      });
    });

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }());
});
console.log("listen on port ".concat(process.env.PORT));