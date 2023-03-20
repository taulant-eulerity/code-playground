const testings = require('../results');

test('Execute the results', () => {
  expect(testings([1, 2, 3, 4, 5])).toBe(15);
});
test('Other', () => {
  expect(testings([9, 2, 5, 7])).toBe(23);
});
test('Third', () => {
  expect(testings([12, 11, 3, 4])).toBe(30);
});
