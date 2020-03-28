const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {
    generateMessage,
    generatUrlMessage
} = require('./utils/message')
const {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
} = require('./utils/utils')


// creating server
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
// serving up the html
const publicdir = path.join(__dirname, '../public')
app.use(express.static(publicdir))

io.on('connection', (socket) => {
    console.log('New Web Socket Connected')

    // welcome msg
    socket.on('join', ({username , room},callback) => {

        const {error , user} = addUser({
            id : socket.id,
            username: username,
            room : room
        })
        if (error) {
            return callback(error)
        }

        // joining user to that room
        socket.join(user.room)
        // sending a greeting msg
        socket.emit('message', generateMessage("Admin",'Welcome!'))
        // msg to others when a user joins
        console.log(user.room+" : "+user.username)
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin",`${user.username} has joined!`))
        io.to(user.room).emit('roomdata', {
            room: user.room,
            users: getUserInRoom(user.room)  
        })

    })

    // sendig msg to all users
    socket.on('sendMsg', (msg, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('profanity is not allowed!')
        }
        io.to(user.room).emit('message', generateMessage(user.username,msg))
        callback()
    })

    // sharing geolocation
    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('LocationMessage', generatUrlMessage( user.username ,`https://www.google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })
    // user leaves
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage("Admin" ,`${user.username} has left`))
            io.to(user.room).emit('roomdata', {
                room: user.room,
                users: getUserInRoom(user.room)  
            })
        }
    })
})

server.listen(port, () => {
    console.log("listining at port : " + port)
})