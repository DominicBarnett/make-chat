// chat.js
module.exports = (io, socket) => {
    
        // chat.js
        socket.on('new user', (username) => {
            console.log(`✋ ${username} has joined the chat! ✋`);
            //Send the username to all clients currently connected
            io.emit("new user", username);
        })
    
    }