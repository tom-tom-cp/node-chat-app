const path      = require('path'),
      express   = require('express'),
      socketIO  = require('socket.io'),
      http      = require('http');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', {
        text: 'This is a message.',
        from: 'Tomás',
        createdAt: '512545'
    });

    socket.on('createMessage', (message) => {
        console.log('New message: ', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
