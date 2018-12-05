const express = require('express');
const socketIO = require('socket.io');

const path = require('path');
const fs = require('fs');
const http = require('http');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

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

io.on('connection', (socket) => {
  console.warn('Usuario Conectado');

  socket.on('createMessage', message => {
    console.log('Conexão - ', message);

    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
  })

  socket.on('disconnect', () => {
    console.log('SERVER DOWN');
  })
});

server.listen(port, () => {
  console.log(`Servidor Rodando na Porta ${port}`);
})