const socket = io()
const $form = document.querySelector('form')
const $input = document.getElementById('field')
const $btn = document.getElementById('btn')
const $location = document.getElementById('location')
const $msg = document.querySelector('#msg')


const msgtemplate = document.querySelector('#msgtemp').innerHTML
const linktempate = document.getElementById('linktemp').innerHTML

socket.on('message', (msg) => {
    const html = Mustache.render(msgtemplate, {
        msg: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $msg.insertAdjacentHTML('beforeend', html)
})
socket.on('LocationMessage', (location) => {
    const html = Mustache.render(linktempate, {
        location : location.url,
        createdAt : moment(location.createdAt).format('h:mm a')
    })
    $msg.insertAdjacentHTML('beforeend', html)
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