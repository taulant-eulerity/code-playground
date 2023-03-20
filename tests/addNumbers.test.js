const testings = require('../results');

test('Execute the results', () => {
  expect(testings(100, 101)).toBe(201);
});
test('Other', () => {
  expect(testings(2, 1)).toBe(3);
});
test('Third', () => {
  expect(testings(3, 3)).toBe(6);
});
test('Forth', () => {
  expect(testings(6, 3)).toBe(9);
});
