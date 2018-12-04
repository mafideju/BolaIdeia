const express = require('express');
const path = require('path');
const fs = require('fs');

var app = express();

const port = process.env.PORT || 7001;

const publicPath = path.join(__dirname, '../public');

// MIDDLEWARE PARA REGISTRO DE LOGS
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('error', err)
    }
  })
  next();
})

app.use(express.static(publicPath))

app.listen(port, () => {
  console.log(`Servidor Rodando na Porta ${port}`)
})