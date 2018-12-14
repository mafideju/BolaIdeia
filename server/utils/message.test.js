// var expect = require('expect');

// var { generateMessage, generateLocationMessage } = require('./message');


// describe('Generate Message', () => {
//   it('Gerar o objeto mensagem corretamente', () => {
//     var froma = 'Jen';
//     var text = 'Mensagem em uma Garrafa';
//     var message = generateMessage(froma, text);

//     expect(message.createdAt).toBe('string');
//     expect(message).toMatchObject({ froma, text });
//   })
// })

// describe('generateLocationMessage', () => {
//   it('Gerar localização correta', () => {
//     var from = 'Mar';
//     var lat = 20;
//     var long = 20;
//     var url = 'https://www.google.com/maps?q=15,19';
//     var message = generateLocationMessage(from, lat, long);

//     expect(message.createdAt).toBe('number');
//     expect(message).toMatchObject({ from, url })
//   });
// });