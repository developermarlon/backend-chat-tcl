import app from './app'
import SocketServer from "socket.io";

//config app
export const server = app.listen(process.env.PORT)

//web sockets
const io = new SocketServer(server)
app.set('io', io)
io.on('connection', (socket) => {
  socket.room = 'default'
  socket.join(socket.room)

  socket.on('disconnect', async () => {
    socket.broadcast.to(socket.room).emit('user disconnected', {id: socket.id})
    socket.disconnect()
    socket.to(socket.room).emit('get clients', getSockets(socket.room))
  })

  socket.on('get clients', (room) => {
    socket.to(room).emit('get clients', getSockets(room))
  })

  const getSockets = (room) => {
    return socket.adapter.rooms[room] ? Object.keys(socket.adapter.rooms[room].sockets) : []
  }

  socket.on('swith channel', async (room) => {
    await socket.leave(socket.room)
    await socket.join(room)
    socket.room = room
    await socket.broadcast.to(room).emit('user connected', {id: socket.id})
    socket.to(room).emit('get clients', getSockets(room))
  })

  socket.on('send message', async ({type_user, message, room}) => {
    socket.broadcast.to(room).emit('get message', {id: socket.id, type_user, message})
  })

})

console.log(`listen on port ${process.env.PORT}`) 