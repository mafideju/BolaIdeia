const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');

const path = require('path');
const fs = require('fs');
const http = require('http');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
const { generateMessage, generateLocationMessage } = require('./utils/message');

const port = process.env.PORT || 7001;

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

// MIDDLEWARE PARA REGISTRO DE LOGS
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('error', err);
    }
  })
  next();
});
/*
const hora = new Date().getHours();
const minuto = new Date().getMinutes();
const horarioAtual = `${new Date().toDateString()} ${hora}:${minuto}`;
*/
var formattedTime = moment().format('DD/MM/YYYY HH:mm');
// ...newMessage => server/client
// createMessage => client/server
io.on('connection', (socket) => {
  console.warn('Usuario Conectado');

  socket.emit('newMessage', generateMessage('Admin', 'Seja Bem Vind@ ao Bola Idéia'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', `Nov@ Usuári@ Entrou em ${formattedTime}`))

  socket.on('createMessage', (message, callback) => {
    console.log('Conexão - ', message);

    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', coords => {
    io.emit('newLocationMessage', generateLocationMessage(`Admin`, coords.latitude, coords.longitude))
  })

  socket.on('disconnect', () => {
    console.error('SERVER DOWN');
  })
});

server.listen(port, () => {
  console.log(`Servidor Rodando na Porta ${port}`);
})

// https://www.google.com/maps?q=-23.728362699999998,-46.5329492