const testings = require('../results');

test('Execute the results', () => {
  expect(testings([1, 2, 3, 4, 5], 3)).toBe(2);
});
test('Other', () => {
  expect(testings([1, 2, 3, 4, 5], 5)).toBe(4);
});
test('Third', () => {
  expect(testings([1, 2, 3, 4, 5], 2)).toBe(1);
});
test('Forth', () => {
  expect(testings([1, 2, 3, 4, 5], 9)).toBe(undefined);
});

