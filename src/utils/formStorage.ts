
export const saveFormToSession = (formId: string, data: any) => {
  try {
    sessionStorage.setItem(formId, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

export const getFormFromSession = (formId: string) => {
  try {
    const data = sessionStorage.getItem(formId);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
};

export const clearFormSession = (formId: string) => {
  sessionStorage.removeItem(formId);
};
