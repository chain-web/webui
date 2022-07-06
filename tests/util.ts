export const sleep = (time: number) => {
  return new Promise((reslove) => {
    setTimeout(() => {
      reslove(1);
    }, time);
  });
};