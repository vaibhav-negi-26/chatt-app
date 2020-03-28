const generateMessage = (username,text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generatUrlMessage = (username,url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generatUrlMessage
}