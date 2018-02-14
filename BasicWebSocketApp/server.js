
var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
var fs = require('fs');

httpd.listen(4000);

function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error');
            }
            res.writeHead(200, {'Content-type':'text/html'});
            res.end(data);
        });
}

io.sockets.on('connection', function (socket) {
    socket.on('clientMessage', function (content) {
        socket.emit('serverMessage', 'You said: ' + content);

        /*socket.get('username', function (err, username) {
            if (!username)
                username = socket.id;
            socket.broadcast.emit('serverMessage', username + 'said: ' + content);
        });*/
        var username = socket.username;
        //socket.username = username;
        /*var room = socket.room;
        var broadcast = socket.broadcast;
        var message = content;

        if (room)
            broadcast.to(room);*/
        socket.broadcast.emit('serverMessage',  username + ' said ' + content);
    });

    socket.on('login', function (username) {
        /*socket.set('username', username, function (err) {
            if (err)
                throw err;
            socket.emit('serverMessage', 'currently logged on as : ' + username);
            socket.broadcast.emit('serverMessage', 'User' + username + 'logged in');
        });*/

        socket.username = username;
        /*io.sockets.emit('chat', {
            msg: "Welcome, " + name + '!',
            msgr: "Nickname"
        });*/

        socket.emit('serverMessage', 'currently logged on as : ' + username);
        socket.broadcast.emit('serverMessage', 'User ' + username + ' logged in ');
    });

    socket.on('disconnect', function () {
        /*socket.get('username', function (err, username) {
            if (!username)
                username = socket.id;
            socket.broadcast.emit('serverMessage', 'User' + username + 'disconnected');
        });*/
        //var username = socket.username;
        //console.log('Chat message by ', username);
        //console.log('error ', err);
        //sender = name;

        socket.broadcast.emit('serverMessage', 'User' + socket.username + 'disconnected');
    });

    /*socket.on('join', function (room) {

        socket.join(room);
        /*if (room)
            socket.leave(room);*/
       /* socket.emit('serverMessage', ' You joined room ' + room);
        socket.broadcast.to(room).emit('serverMessage', 'User ' + username + ' joined the room ');
    });*/

    socket.emit('login');
});