const users = []

// addUser, removeUser, getUser, getUserInRoom

///////////////////////////////////////////////////////////////////////////////////////// addUser

const addUser = ({ id, username, room}) => {

    // cleaning data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validating data
    if (!username || !room) {
        return {
            error : "username and room are required!"
        }
    }

    // checking user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validating username
    if (existingUser) {
        return {
            error : "Username is already taken!"
        }
    }
    // storing user
    const user = {id,username,room}
    users.push(user)
    return {
        user
    }
}

///////////////////////////////////////////////////////////////////////////////////////// removeUser

const removeUser = (id) =>{
    const index = users.findIndex((user) => {
        return user.id === id
    })

   if (index !== -1) {
       return users.splice(index,1)[0]
   }
}

///////////////////////////////////////////////////////////////////////////////////////// removeUser

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

///////////////////////////////////////////////////////////////////////////////////////// removeUser

const getUserInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}