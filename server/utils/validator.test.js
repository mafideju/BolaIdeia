const expect = require('expect');

const { isRealString } = require('./validator')

describe('isRealString', () => {
  it('REJEITAR DADOS NONSTRING ', () => {
    var res = isRealString(98);
    expect(res).toBe(false);
  })
  it('REJEITAR DADOS EM BRANCO', () => {
    var res = isRealString('   ');
    expect(res).toBe(false);
  })
  it('PERMITIR STRINGS CON ESPAÇOS QUE SERÃO TRIMADOS DEPOIS', () => {
    var res = isRealString('   Marcio   ');
    expect(res).toBe(true);
  })
})