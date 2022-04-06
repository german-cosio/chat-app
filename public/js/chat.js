const socket = io();

//Elements
const chatForm = document.querySelector('#chat-form');
const sendLocationButton = document.querySelector('#send-location');
const messageInput = document.querySelector('#message');
const sendButton = document.querySelector('#send-button');
const messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

const { username, room }= Qs.parse(location.search, {
     ignoreQueryPrefix: true
});

// Listeners
socket.on('message', (message) => { 
     console.log(message);
     const html = Mustache.render(messageTemplate, {
           message: message.text,
           createdAt: moment(message.createdAt).format('h:mm a'),
     });
     messages.insertAdjacentHTML('beforeend', html);
     });

socket.on('locationMessage', (location) => { 
     const html = Mustache.render(locationTemplate, {
               url: location.url,
               createdAt: moment(location.createdAt).format('h:mm a'),
     });
    messages.insertAdjacentHTML('beforeend', html);
     console.log(location);
     });

// Emitters
chatForm.addEventListener('submit', (e) => {
     e.preventDefault();
     sendButton.setAttribute('disabled', 'disabled');
     const message = e.target.elements.message.value;
     socket.emit('sendMessage', message, (serverMessage) => {
          console.log(serverMessage);
     });
     sendButton.removeAttribute('disabled');
     messageInput.value = '';
     messageInput.focus();
});

sendLocationButton.addEventListener('click', () => {
     if (!navigator.geolocation) {
          return alert('Geolocation is not supported by your browser.');
     }
     sendLocationButton.setAttribute('disabled', 'disabled');
     sendLocationButton.textContent = 'Sending location...';
     navigator.geolocation.getCurrentPosition((position) => {
          sendLocationButton.removeAttribute('disabled');
          sendLocationButton.textContent = 'Send location';
          socket.emit('sendLocation', {
               latitude: position.coords.latitude,
               longitude: position.coords.longitude
          },
          (serverMessage) => {
               console.log(serverMessage);
          }
          );
     }, () => {
          sendLocationButton.removeAttribute('disabled');
          sendLocationButton.textContent = 'Send location';
          alert('Unable to fetch location.');
     });
     }
     );

     socket.emit('join', { username, room } );