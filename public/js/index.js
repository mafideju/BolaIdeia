var socket = io();

socket.on('connect', () => {
  console.log('Connectado ao Servidor')

  socket.emit('createMessage', {
    from: 'Buzz',
    text: 'Save the Dog'
  })
});
socket.on('disconnect', () => {
  console.log('Desconectado ao Servidor')
});

socket.on('newMessage', (message) => {
  console.log('Chegou Mensagem pra Você =)')
  console.log(message)
});



// socket.on('connect', () => {
//   console.log('Server Connection On')

//   socket.emit('message', {
//     to: 'client@side.com',
//     text: 'Follow back test'
//   })
// })
// socket.on('disconnect', () => {
//   console.log('Desconectado ao Servidor')
// });
// socket.on('message', (message) => {
//   console.log('Chegou Mensagem pra Você =)')
//   console.log(message)
// });