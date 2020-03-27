const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generatUrlMessage = (url) => {
    return {
        url,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generatUrlMessage
}