const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');

const path = require('path');
const fs = require('fs');
const http = require('http');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validator');
const { Users } = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

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
      return callback('Nome de Exibição e Nome da Sala são obrigatórios para seu ingresso no BolaIdeia')
    }
    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Seja Bem Vind@ ao Bola Idéia'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} entrou ás ${formattedTime}`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });

  socket.on('createLocationMessage', coords => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
    }
  })

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} saiu da sala...`));
    }
  })
});

server.listen(port, () => {
  console.log(`Servidor Rodando na Porta ${port}`);
})

// https://www.google.com/maps?q=-23.728362699999998,-46.5329492