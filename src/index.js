import app from './app'
import SocketServer from "socket.io";
import moment from 'moment-timezone'

//import db
import connect from './database/db'

//config app
export const server = app.listen(process.env.PORT)

//web sockets
const io = new SocketServer(server)
app.set('io', io)
io.on('connection', (socket) => {

  socket.room = 'default'
  socket.join(socket.room)

  socket.on('disconnect', async () => {
    await socket.disconnect() 
    socket.broadcast.to(socket.room).emit('user disconnected', {name: socket.name, type_user: socket.type_user, date: moment().locale('es').format('LLL'), id: socket.id})
    socket.broadcast.to(socket.room).emit('get clients', await getSockets(socket.room))
  })

  socket.on('get clients', async (room) => {
    socket.to(room).emit('get clients', await getSockets(room))
  })
  
  const getSockets = async (room) => {
    const users = new Array()
    const sock = socket.adapter.rooms[room] ? Object.keys(socket.adapter.rooms[room].sockets) : []
    for(let i = 0; i < sock.length; i++){
      let user = io.in(room).sockets[sock[i]]
      if(users.filter((item) => item.name === user.name && item.type_user === user.type_user && item.email === user.email).length === 0) users.push({name: user.name, type_user: user.type_user, id: user.id, email: user.email})
    }
    return users
  }
  
  socket.on('swith channel', async (data) => {
    await socket.leave(socket.room)
    await socket.join(data.room)
    socket.room = data.room
    socket.email = data.email
    socket.name = data.name
    socket.type_user = data.type_user
    socket.broadcast.to(data.room).emit('user connected', {name: socket.name, date: moment().locale('es').format('LLL'), type_user: socket.type_user, id: socket.id})
    socket.broadcast.to(data.room).emit('get clients', await getSockets(data.room))
  })

  socket.on('send message', async (message) => {
    const messageComplete = {id: socket.id, message, date: moment().locale('es').format('LLL'), type_user: socket.type_user, email: socket.email, name: socket.name, room: socket.room }
    socket.broadcast.to(socket.room).emit('get message', messageComplete)
    const db = await connect()
    await db.collection('messages').insertOne(messageComplete)
  })

})

console.log(`listen on port ${process.env.PORT}`) 