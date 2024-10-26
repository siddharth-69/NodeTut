const messagesList = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const chatForm = document.getElementById('chatForm');

const channel = new BroadcastChannel('chat');

function displayMessage(message) {
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('message');
    newMessageDiv.textContent = message;
    messagesList.appendChild(newMessageDiv);

    messagesList.scrollTop = messagesList.scrollHeight;
}

channel.onmessage = (event) => {
    const message = event.data;
    displayMessage(message);
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('*********'. e);

    const messageValue = messageInput.value;

    channel.postMessage(messageValue);

    displayMessage(messageValue);

    messageInput.value = '';
})