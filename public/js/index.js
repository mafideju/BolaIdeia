var socket = io();

socket.on('connect', () => {
  console.log('Connectado ao Servidor')

});
socket.on('disconnect', () => {
  console.log('Desconectado ao Servidor')
});

socket.on('newMessage', (message) => {
  console.log('Chegou Mensagem pra Você =)')
  console.log(message)
  var li = jQuery('<li></li>')
  li.text(`${message.from}: ${message.text}`)

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message) => {
  var li = jQuery('<li></li>')
  var a = jQuery('<a target="_blank">Local Atual</a>')

  li.text(`${message.from}: `)
  a.attr('href', message.url)
  li.append(a)

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  })
})

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation Não é Suportada por este Browser');
  }

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, () => {
    alert('Não rolou buscar a localização pelo Geolocation API');
  })
})