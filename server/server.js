const path = require('path'),
    express = require('express'),
    socketIO = require('socket.io'),
    http = require('http'),
    {
        generateMessage,
        generateLocationMessage
    } = require('./utils/message'),
    {
        isRealString
    } = require('./utils/validation'),
    {
        Users
    } = require('./utils/users');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

/**
 * io.emit() -> sends a message to everyone using the server
 * 
 * socket.broadcast.emit -> sends message to eveyrone connected expect the current user (new user joined)
 * 
 * socket.emit -> emits specifically to one user
 * 
 * io.to(roomName).emit -> sends event to eveyrone in a specific room
 * 
 * socket.broadcast.to(roomName).emit -> sends to everyone in a room except the current user
 * 
 * 
 */

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name as room name are required');
        }

        socket.join(params.room); // user joins a room
        users.removeUser(socket.id); // remove user from any potential previous rooms
        users.addUser(socket.id, params.name, params.room); // add him to the new room

        io.to(params.room).emit('updateUserList', users.getUserList(params.room)); // update user list for params.room

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

        callback();
    });

    // receive message from client
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            // emit message to user's room via method generateMessage
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        // aknowledgement by the server console.log('got it') on the client console
        // send data back by providing one argument inside the callback()
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});