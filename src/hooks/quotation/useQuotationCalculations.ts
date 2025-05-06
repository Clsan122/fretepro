
export const useQuotationCalculations = () => {
  // Calculate the cubic measurement
  const calculateCubicMeasurement = (
    length: number, 
    width: number, 
    height: number
  ) => {
    return (length * width * height) / 1000000;
  };

  // Calculate insurance as a percentage of merchandise value
  const calculateInsurance = (
    merchandiseValue: number,
    insurancePercent: number
  ) => {
    return (merchandiseValue * insurancePercent) / 100;
  };

  // Calculate total value
  const calculateTotal = (
    quotedValue: number,
    toll: number,
    insurance: number,
    others: number
  ) => {
    return quotedValue + toll + insurance + others;
  };

  return {
    calculateCubicMeasurement,
    calculateInsurance,
    calculateTotal
  };
};
