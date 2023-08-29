const socket = io();

const form = document.getElementById('send-container');
const messageinput = document.getElementById('messageInp');
const messagecontainer = document.querySelector('.container');
var audio = new Audio('ting.mp3');

const appendes = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messagecontainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
}


const name = prompt('Enter your name to join');
// socket ko hum emit krdege ye event   
// giving the name of the user
socket.emit('new-user-joined', name);



socket.on('user-joined', (name) => {
    appendes(`${name} joined the chat`, 'right');
})


socket.on('recieve', (data) => {
    appendes(`${data.name} :${data.message}`, 'left');
})

socket.on('left', (name) => {
    appendes(`${name} left the chat`, 'left');
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageinput.value;
    appendes(`you : ${message}`, 'right');
    socket.emit('send', message);
    messageinput.value = '';
})
