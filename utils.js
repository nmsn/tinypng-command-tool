// 生成随机IP， 赋值给 X-Forwarded-For
export const getRandomIP = () =>
  Array.from(Array(4))
    .map(() => parseInt(Math.random() * 255))
    .join('.');

export const mb2b = num => {
  if (!Number(num)) {
    return 0;
  }
  return num * 1024 * 1024;
};
