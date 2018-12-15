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
const { isRealString } = require('./utils/validator');

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
var formattedTime = moment().format('HH:mm');
// ...newMessage => server/client
// createMessage => client/server
io.on('connection', (socket) => {
  // VALIDAÇÃO PARA NOME DE EXIBIÇÃO DE DA SALA
  // CONFIRMA SE É UMA STRING
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Nome de Exibição e Nome da Sala são obrigatórios para seu ingresso no BolaIdeia')
    }
    socket.join(params.room);

    socket.emit('newMessage', generateMessage('Admin', 'Seja Bem Vind@ ao Bola Idéia'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} entrou ás ${formattedTime}`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
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