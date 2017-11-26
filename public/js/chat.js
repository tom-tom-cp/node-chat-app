$(document).ready(function() {


    // variable declarations
    var socket = io();
    var messages = $('#messages');
    var locationButton = $('#sendLocation');
    var messageTextBox = $('[name=message]');
    var messageTemplate = $('#messageTemplate').html();
    var locationTemplate = $('#locationMessageTemplate').html();


    function scrollToBottom() {
        var clientHeight = messages.prop('clientHeight');
        var scrollTop = messages.prop('scrollTop');
        var scrollHeight = messages.prop('scrollHeight');
        var newMessage = messages.children('li:last-child');
        var newMessageHeight = newMessage.innerHeight();
        var lastMessageHeight = newMessage.prev().innerHeight();

        if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
            messages.scrollTop(scrollHeight);
        }
    }


    socket.on('connect', function() {
        var params = $.deparam(window.location.search);

        socket.emit('join', params, function (err) {
            if (err) {
                alert(err);
                window.location.href = '/';
            } else {
                console.log('No error');
            }
        });
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    });

    // users = array of users
    socket.on('updateUserList', function(users) {
        var ol = $('<ol></ol>');

        users.forEach(function(user) {
            ol.append($('<li></li>').text(user));
        });

        $('#users').html(ol);
    });

    // receive message from server
    socket.on('newMessage', function (message) {
        var formattedTime = moment(message.createdAt).format('h:mm a');

        var html = Mustache.render(messageTemplate, {
            text: message.text,
            from: message.from,
            createdAt: formattedTime
        });

        $('#messages').append(html);

        scrollToBottom();
    });

    socket.on('newLocationMessage', function(message) {
        var formattedTime = moment(message.createdAt).format('h:mm a');

        var html = Mustache.render(locationTemplate, {
            url: message.url,
            from: message.from,
            createdAt: formattedTime
        });

        $('#messages').append(html);

        scrollToBottom();
    });

    $('#messageForm').on('submit', function(e) {
        e.preventDefault();
        // emit message from form (client side)
        socket.emit('createMessage', {
            from: 'User',
            text: messageTextBox.val()
        }, function () {
            messageTextBox.val('');
        });
    });

    locationButton.on('click', function() {
        if (!navigator.geolocation) {
            return alert('Geolocation not supported by your browser.');
        }

        locationButton.attr('disabled', 'disabled').text('Sending location..');

        navigator.geolocation.getCurrentPosition(function (position) {
            locationButton.removeAttr('disabled').text('Send location');
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function () {
            locationButton.attr('disabled', 'disabled').text('Send location');
            alert('Can\'t fetch the location');
        });
    });








});