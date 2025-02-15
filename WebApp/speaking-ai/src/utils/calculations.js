export const calculateFactors = (number) => {
  const factors = [];
  for (let i = 1; i <= number; i++) {
    if (number % i === 0) {
      factors.push(i);
    }
  }
  return factors;
};
