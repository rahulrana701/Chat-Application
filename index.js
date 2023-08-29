const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const io = require('socket.io')(http);  // just making port for this , we can make any port we want 
// this socket.io server will listen to the incoming events.

const users = {};

// jaise hi connection aaye socket mei arrow function ko run krdo , io.on and socket.on are two different,
// ye io.on kya hai hamare socket.io instance hai ye hamare boht saare sockets connections ko listen krega 
// jaise ki rohan ne connect kiya , maine kiya and aur boht and socket.on ka mtlb ki , jb bhi ek particular 
// connection ke sath kuch hoga 
// and socket.on represents ki particular connection , and jb bhi ek particular connection ke sath kuch hoga  
// socket.on handles that it has various custom events.
// 
io.on('connection', (socket) => {
    // socket.on is accepting a event that is new-user-joined and whenever socket.on gets this event do this 
    // take this name and run this callback function 
    socket.on('new-user-joined', (name) => {
        console.log(name);
        users[socket.id] = name;
        //    brodcast.emit jisne join kiya hai usko chod ke sbko ye event emit kr deta hai, hum ye isliye kr rahe 
        // hai taaki hum dusro ko bata ske ki ye dekho humne join krliya and hum uska naam bhi bhej dege sath mei 
        // this event of broadcast.emit is emitted by server we have to handle this on client side 
        socket.broadcast.emit('user-joined', name);
    })

    // we can put any name of events we want.
    socket.on('send', (message) => {
        // means baaki sb logo ko bata do ki msg aaya hai recieve kro use
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
    })

    socket.on('disconnect', (name) => {
        socket.broadcast.emit('left', users[socket.id] );
        delete users[socket.id];
    })
})

// hr socket connection ki ek id hoti hai we are identifying user on the basis of their identity not name because 
// same name of persons can join 



































// io.on:
// io refers to the Socket.IO server instance. When you use io.on, you are setting up event listeners on
// the server side that will handle events emitted by clients. It's a way to listen for events that are
// emitted by any connected socket (client) to the server.


// socket.on:
// socket refers to an individual socket connection between a client and the Socket.IO server.
// When you use socket.on, you are setting up event listeners on a specific client socket to
// handle events that are emitted by that particular client.

