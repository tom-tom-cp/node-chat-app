var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');

    socket.emit('createMessage', {
        from: 'Johnny',
        text: 'Hey! Wanna meet up?'
    });

});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newEmail', function(email) {
    console.log('new email', email);
});

socket.on('newMessage', function(newMessage) {
    console.log('newMessage', newMessage);
});
