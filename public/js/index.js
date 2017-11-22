$(document).ready(function() {


    // variable declarations
    var socket = io();
    var locationButton = $('#sendLocation');




    socket.on('connect', function() {
        console.log('Connected to server');
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    });

    // receive message from server
    socket.on('newMessage', function(message) {
        var li = $('<li></li>');
        // set text content
        li.text(`${message.from}: ${message.text}`);

        // append to li
        $('#messages').append(li);
    });

    socket.on('newLocationMessage', function(message) {
        var li = $('<li></li>');
        var anchor = $('<a target="_blank">My current location</a>');

        li.text(`${message.from}: `);

        anchor.attr('href', message.url);

        li.append(anchor);

        $('#messages').append(li);
    });


    $('#messageForm').on('submit', function(e) {
        e.preventDefault();
        // emit message from form (client side)
        socket.emit('createMessage', {
            from: 'User',
            text: $('[name=message]').val()
        }, function() {

        });
    });

    locationButton.on('click', function() {
        if ( ! navigator.geolocation) {
            return alert('Geolocation not supported by your browser.');
        }

        navigator.geolocation.getCurrentPosition(function(position) {
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function() {
            alert('Can\'t fetch the location');
        });
    });








});
