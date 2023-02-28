export const toFixed = (num: number, digit = 3) => {
  const scale = 10 ** digit;
  return Math.floor(num * scale) / scale;
};
