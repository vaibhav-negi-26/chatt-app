const socket = io()

//Elements 
const $form = document.querySelector('form')
const $input = document.getElementById('field')
const $btn = document.getElementById('btn')
const $location = document.getElementById('location')
const $msg = document.querySelector('#msg')
const $sidebar = document.querySelector('#sidebar')

// templates
const msgtemplate = document.querySelector('#msgtemp').innerHTML
const linktempate = document.getElementById('linktemp').innerHTML
const sidetemplate = document.getElementById('side-content').innerHTML

//Query Parameters 
const {
    username,
    room
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// connection to a chat room
socket.emit('join', {
    username,
    room
}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

// autoscroll function
const autoscroll = () => {
    const $newMsg = $msg.lastElementChild
    
    const newMsgStyle = getComputedStyle($newMsg)
    const newMsgMargin = parseInt(newMsgStyle.marginBottom)
    const newMsgHeight = $newMsg.offsetHeight+newMsgMargin

    const visibleHeight = $msg.offsetHeight
    const containerHeight = $msg.scrollHeight

    const scrolloffset = $msg.scrollTop+visibleHeight
    if (containerHeight - newMsgHeight <= scrolloffset) {
        $msg.scrollTop = $msg.scrollHeight
    }
}

// message display 
socket.on('message', (msg) => {
    const html = Mustache.render(msgtemplate, {
        username: msg.username,
        msg: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $msg.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
socket.on('LocationMessage', (location) => {
    const html = Mustache.render(linktempate, {
        username: location.username,
        location: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    })
    $msg.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

// sidebar listner
socket.on('roomdata' ,({room , users}) => {
    const html = Mustache.render(sidetemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html
})

$form.addEventListener('submit', (e) => {
    e.preventDefault()
    const val = $input.value
    $btn.setAttribute('disabled', 'disabled')
    $input.value = ''
    $input.focus()

    socket.emit('sendMsg', val, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log("message delivered!")
        $btn.removeAttribute('disabled')
    })

})

$location.addEventListener('click', () => {

    $location.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert('Goelocation is no available in your browser')
    }

    navigator.geolocation.getCurrentPosition((postion) => {
        socket.emit('sendLocation', {
            latitude: postion.coords.latitude,
            longitude: postion.coords.longitude
        }, () => {
            console.log('Location Shared')
            $location.removeAttribute('disabled')
        })

    })
})