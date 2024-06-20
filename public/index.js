$(document).ready(() => {
    const socket = io.connect();
    let currentUser;

    // Get the online users from the server
    socket.emit('get online users');
    socket.emit('user changed channel', "General");

    $('#create-user-btn').click((e) => {
        e.preventDefault();
        if ($('#username-input').val().length > 0) {
            socket.emit('new user', $('#username-input').val());
            currentUser = $('#username-input').val();
            $('.username-form').remove();
            $('.main-container').css('display', 'flex');
        }
    });

    $('#send-chat-btn').click((e) => {
        e.preventDefault();
        let channel = $('.channel-current').text();
        let message = $('#chat-input').val();
        if (message.length > 0) {
            socket.emit('new message', {
                sender: currentUser,
                message: message,
                channel: channel
            });
            $('#chat-input').val("");
        }
    });

    $('#new-channel-btn').click(() => {
        let newChannel = $('#new-channel-input').val();
        if (newChannel.length > 0) {
            socket.emit('new channel', newChannel);
            $('#new-channel-input').val("");
        }
    });

    // Socket listeners
    socket.on('new user', (username) => {
        console.log(`${username} has joined the chat`);
        if (!$(`.user-online:contains(${username})`).length) {
            $('.users-online').append(`<div class="user-online">${username}</div>`);
        }
    });

    socket.on('new message', (data) => {
        let currentChannel = $('.channel-current').text();
        if (currentChannel == data.channel) {
            $('.message-container').append(`
                <div class="message">
                    <p class="message-user">${data.sender}: </p>
                    <p class="message-text">${data.message}</p>
                </div>
            `);
        }
    });

    socket.on('get online users', () => {
        socket.emit('get online users', onlineUsers);
    });

    socket.on('user has left', (onlineUsers) => {
        $('.users-online').empty();
        for (username in onlineUsers) {
            $('.users-online').append(`<p>${username}</p>`);
        }
    });

    socket.on('new channel', (newChannel) => {
        // Check if the channel already exists
        if (!$(`.channels .channel:contains(${newChannel})`).length) {
            $('.channels').append(`<div class="channel">${newChannel}</div>`);
        }
    });

    socket.on('user changed channel', (data) => {
        $('.channel-current').addClass('channel');
        $('.channel-current').removeClass('channel-current');
        $(`.channel:contains('${data.channel}')`).addClass('channel-current');
        $('.channel-current').removeClass('channel');
        $('.message').remove();
        data.messages.forEach((message) => {
            $('.message-container').append(`
                <div class="message">
                    <p class="message-user">${message.sender}: </p>
                    <p class="message-text">${message.message}</p>
                </div>
            `);
        });
    });

    $(document).on('click', '.channel', (e) => {
        let newChannel = e.target.textContent;
        socket.emit('user changed channel', newChannel);
    });
});
