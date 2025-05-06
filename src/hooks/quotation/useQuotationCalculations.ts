
export const useQuotationCalculations = () => {
  // Calculate the cubic measurement
  const calculateCubicMeasurement = (
    length: number, 
    width: number, 
    height: number
  ) => {
    return (length * width * height) / 1000000;
  };

  return {
    calculateCubicMeasurement
  };
};
