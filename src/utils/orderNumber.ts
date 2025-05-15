
export function generateOrderNumber(): string {
  // Get existing orders from localStorage
  const orders = JSON.parse(localStorage.getItem('collectionOrders') || '[]');
  
  // Get current year
  const year = new Date().getFullYear();
  
  // If no orders exist, start with number 1001
  if (orders.length === 0) {
    return `${year}1001`;
  }
  
  // Find the highest order number for the current year
  const currentYearOrders = orders.filter((order: any) => 
    order.orderNumber?.startsWith(year.toString())
  );
  
  if (currentYearOrders.length === 0) {
    return `${year}1001`;
  }
  
  // Get the highest number and increment by 1
  const highestNumber = Math.max(
    ...currentYearOrders.map((order: any) => 
      parseInt(order.orderNumber?.slice(-4) || '1000')
    )
  );
  
  return `${year}${(highestNumber + 1).toString().padStart(4, '0')}`;
}

// Add a helper function to check if an order already exists
export function orderExists(orderNumber: string): boolean {
  const orders = JSON.parse(localStorage.getItem('collectionOrders') || '[]');
  return orders.some((order: any) => order.orderNumber === orderNumber);
}
