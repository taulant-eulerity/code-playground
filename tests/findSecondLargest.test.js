const testings = require('../results');

test('returns the second largest integer in the array', () => {
  expect(testings([3, 5, 2, 10, 7])).toBe(7);
});

test('returns the second largest integer in the array when there are negative numbers', () => {
  expect(testings([-3, -5, -2, -10, -7])).toBe(-3);
});

test('returns the second largest integer when there are only two elements', () => {
  expect(testings([1, 2])).toBe(1);
});

test('returns null when the array has only one element', () => {
  expect(testings([5])).toBeNull();
});

test('returns null when the array is empty', () => {
  expect(testings([])).toBeNull();
});