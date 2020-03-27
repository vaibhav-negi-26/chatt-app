const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage , generatUrlMessage} = require('./utils/message')

// creating server
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
// serving up the html
const publicdir = path.join(__dirname,'../public')
app.use(express.static(publicdir))

io.on('connection', (socket) => {
    console.log('New Web Socket Connected')

    // welcome msg
    socket.emit('message', generateMessage('Welcome!'))
    
    // new user msg
    socket.broadcast.emit('message',generateMessage('A new user has joined!'))

    // sendig msg to all users
    socket.on('sendMsg', (msg , callback) => {
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('profanity is not allowed!')
        }
        io.emit('message', generateMessage(msg))
        callback()
    })

    // sharing geolocation
    socket.on('sendLocation', (location, callback) => {
        io.emit('LocationMessage', generatUrlMessage(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })
    // user leaves
    socket.on('disconnect' ,() => {
        io.emit('message',generateMessage('A user has left!'))
    })
})

server.listen(port, () => {
    console.log("listining at port : " + port)
})