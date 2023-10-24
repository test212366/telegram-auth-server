var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const socketio = require('socket.io'), AuthController = require('./authController');
let socketEmit = null;
module.exports = (server) => {
    const users = {}, io = socketio(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
        socketEmit = socket;
        console.log('add ');
        users[socket.handshake.query.name] = socket;
        if (socketEmit !== null) {
            module.exports = socketEmit;
        }
    }));
    return io;
};
