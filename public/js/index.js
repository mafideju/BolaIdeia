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
});
