import { getRandomIP, mb2b } from '../utils';

test('mb2b(1) to 1 * 1024 * 1024', () => {
  expect(mb2b(1)).toBe(1 * 1024 * 1024);
});

test('string to 0', () => {
  expect(mb2b('test')).toBe(0);
});

test('NaN to 0', () => {
  expect(mb2b(NaN)).toBe(0);
});

test('undefined to 0', () => {
  expect(mb2b(undefined)).toBe(0);
});

test('null to 0', () => {
  expect(mb2b(null)).toBe(0);
});

test('ip is correct', () => {
  expect(getRandomIP()).toMatch(
    /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
  );
});
