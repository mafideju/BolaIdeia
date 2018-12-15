const expect = require('expect');

const { Users } = require('./users');

describe('USERS AFFAIRS', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Marcio',
      room: 'Node'
    }, {
      id: '2',
      name: 'Andrew',
      room: 'React'
    }, {
      id: '3',
      name: 'Julienne',
      room: 'Node'
    }];
  });

  it('ADICIONAR NOVO USUARIO', () => {
    var users = new Users();
    var user = {
      id: '000',
      name: 'Marcio',
      room: 'Node'
    };
    var resUser = users.addUser(user.id, user.name, user.room)

    expect(users.users).toEqual([user])
  });
  it('REMOVER USUARIO', () => {
    var userId = '1';
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });
  it('LISTA DE USUARIOS GERAL', () => {
    var userId = '2';
    var user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });
  it('LISTA DE USUARIOS DE UMA SALA', () => {
    var userList = users.getUserList('Node');

    expect(userList).toEqual(['Marcio', 'Julienne']);
  });
})