const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4 } = require('uuid');

let PORT = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${v4()}`);
});

app.get('/:vidId', (req, res) =>  {
    const { vidId } = req.params;
    res.render('video', {vidId});
});

io.on('connection', (socket) => {
    socket.on('join', (vidId, userId) => {
        // console.log(vidId, userId); 
        socket.join(vidId);
        socket.to(vidId).broadcast.emit('user-joined', userId);

        socket.on('disconnect', () => {
            socket.to(vidId).broadcast.emit('user-left', userId);
        })
    })
})

server.listen(PORT, () => console.log(`Server started on port: ${PORT}`));