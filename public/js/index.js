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

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  })
})
