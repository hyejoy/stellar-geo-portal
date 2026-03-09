export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ko-KR').format(value) + '원';
};
