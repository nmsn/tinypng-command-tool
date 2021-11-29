// 生
/**
 * @description 生成随机IP， 赋值给 X-Forwarded-For
 * @returns {String} 随机 IP 地址
 */
export const getRandomIP = (): string =>
  Array.from(Array(4))
    .map(() => parseInt((Math.random() * 255).toString()))
    .join('.');

/**
 * @description 兆字节转换
 * @param {Number} num 兆字节数
 * @return {Number} 字节数
 */
export const mb2b = (num: number) => {
  if (!Number(num)) {
    return 0;
  }
  return num * 1024 * 1024;
};
