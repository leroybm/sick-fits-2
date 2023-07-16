import formatMoney from '../lib/formatMoney';

describe('formatMoney', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('0,01 €');
    expect(formatMoney(11)).toEqual('0,11 €');
  });

  it('leaves off cents when it`s a whole dollar', () => {
    expect(formatMoney(5000)).toEqual('50 €');
    expect(formatMoney(100)).toEqual('1 €');
    expect(formatMoney(10000000)).toEqual('100 000 €');
  });

  it('should work whole and fractional dollars', () => {
    expect(formatMoney(111)).toEqual('1,11 €');
    expect(formatMoney(5101)).toEqual('51,01 €');
    expect(formatMoney(10015101)).toEqual('100 151,01 €');
  });
});
