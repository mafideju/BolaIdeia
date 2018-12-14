var socket = io();

socket.on('connect', () => {
  console.log('Connectado ao Servidor')

});
socket.on('disconnect', () => {
  console.log('Desconectado ao Servidor')
});

socket.on('newMessage', (message) => {
  var formattedTime = moment(message.createdAt).format('HH:mm');

  var li = jQuery('<li></li>')
  li.text(`${message.from} as ${formattedTime} diz: ${message.text}`)

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message) => {
  var formattedTime = moment(message.createdAt).format('DD/MM/YYYY HH:mm');

  var li = jQuery('<li></li>')
  var a = jQuery(`<a target="_blank">Local Atual</a><span> em ${formattedTime} horas.</span>`)

  li.text(`${message.from}: `)
  a.attr('href', message.url)
  li.append(a)

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  if (messageTextBox !== '' || !messageTextBox) {
    socket.emit('createMessage', {
      from: 'User',
      text: messageTextBox.val()
    }, function () {
      messageTextBox.val('')
    })
  }
})

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation Não é Suportada por este Browser');
  }

  locationButton.attr('disabled', 'disabled').text('Enviando Locação...');

  navigator.geolocation.getCurrentPosition(position => {
    locationButton.removeAttr('disabled').text('Local');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, () => {
    alert('Não rolou buscar a localização pelo Geolocation API');
  })
})