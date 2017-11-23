$(document).ready(function() {


    // variable declarations
    var socket = io();
    var locationButton = $('#sendLocation');
    var messageTextBox = $('[name=message]');




    socket.on('connect', function() {
        console.log('Connected to server');
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    });

    // receive message from server
    socket.on('newMessage', function(message) {
        var formattedTime = moment(message.createdAt).format('h:mm a');
        var li = $('<li></li>');
        // set text content
        li.text(`${message.from} ${formattedTime}: ${message.text}`);

        // append to li
        $('#messages').append(li);
    });

    socket.on('newLocationMessage', function(message) {
        var formattedTime = moment(message.createdAt).format('h:mm a');
        var li = $('<li></li>');
        var anchor = $('<a target="_blank">My current location</a>');

        li.text(`${message.from} ${formattedTime}: `);

        anchor.attr('href', message.url);

        li.append(anchor);

        $('#messages').append(li);
    });

    $('#messageForm').on('submit', function(e) {
        e.preventDefault();
        // emit message from form (client side)
        socket.emit('createMessage', {
            from: 'User',
            text: messageTextBox.val()
        }, function() {
            messageTextBox.val('');
        });
    });

    locationButton.on('click', function() {
        if ( ! navigator.geolocation) {
            return alert('Geolocation not supported by your browser.');
        }

        locationButton.attr('disabled', 'disabled').text('Sending location..');

        navigator.geolocation.getCurrentPosition(function(position) {
            locationButton.removeAttr('disabled').text('Send location');
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function() {
            locationButton.attr('disabled', 'disabled').text('Send location');
            alert('Can\'t fetch the location');
        });
    });








});
