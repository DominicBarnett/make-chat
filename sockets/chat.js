module.exports = (io, socket, onlineUsers, channels) => {
    socket.on('new user', (username) => {
      onlineUsers[username] = socket.id;
      socket["username"] = username;
      console.log(`✋ ${username} has joined the chat! ✋`);
      io.emit("new user", username);
    });
  
    socket.on('new message', (data) => {
      if (channels[data.channel]) {
        channels[data.channel].push({ sender: data.sender, message: data.message });
        io.to(data.channel).emit('new message', data);
      } else {
        console.error(`Channel ${data.channel} does not exist!`);
      }
    });
  
    socket.on('get online users', () => {
      socket.emit('get online users', onlineUsers);
    });
  
    socket.on('new channel', (newChannel) => {
      if (!channels[newChannel]) {
        channels[newChannel] = [];
        socket.join(newChannel);
        io.emit('new channel', newChannel);
        socket.emit('user changed channel', {
          channel: newChannel,
          messages: channels[newChannel]
        });
      }
    });
  
    socket.on('disconnect', () => {
      delete onlineUsers[socket.username];
      io.emit('user has left', onlineUsers);
    });
  
    socket.on('user changed channel', (newChannel) => {
      if (channels[newChannel]) {
        socket.join(newChannel);
        socket.emit('user changed channel', {
          channel: newChannel,
          messages: channels[newChannel]
        });
      }
    });
  };