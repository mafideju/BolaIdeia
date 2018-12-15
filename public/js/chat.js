var socket = io();

const scrollToBottom = () => {
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', () => {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, err => {
    if (err) {
      window.location.href = '/';
      alert(err);
    } else {
      console.log('OK')
    }
  });
});
socket.on('disconnect', () => {
  console.log('Desconectado ao Servidor')
});



socket.on('updateUserList', (users) => {
  var ol = jQuery('<ol></ol>');

  users.forEach(user => {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
})

socket.on('newMessage', (message) => {
  var formattedTime = moment(message.createdAt).format('HH:mm');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
  var formattedTime = moment(message.createdAt).format('DD/MM/YYYY HH:mm');
  var template = jQuery('#location-message-template').html();

  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  if (messageTextBox !== '' || !messageTextBox) {
    socket.emit('createMessage', {
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