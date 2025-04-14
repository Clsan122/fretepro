
/**
 * Loads the Google API script
 */
export const loadGoogleAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("Google API loaded successfully");
      resolve();
    };
    
    script.onerror = () => {
      console.error("Error loading Google API");
      reject(new Error("Failed to load Google API"));
    };
    
    document.body.appendChild(script);
  });
};
