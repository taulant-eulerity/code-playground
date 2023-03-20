const testings = require('../results');

test('Execute the results', () => {
  expect(testings(2, 2)).toBe(4);
});
test('Other', () => {
  expect(testings(3, 2)).toBe(6);
});
test('Third', () => {
  expect(testings(10, 10)).toBe(100);
});
test('Forth', () => {
  expect(testings(6, 3)).toBe(18);
});
