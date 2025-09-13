// Test API configuration
const api = axios.create({
  baseURL: "https://growathlete-1.onrender.com/api",
  withCredentials: true,
});

console.log("API Base URL:", api.defaults.baseURL);

// Test a simple request
api.get("/test")
  .then(response => {
    console.log("Backend test successful:", response.data);
  })
  .catch(error => {
    console.error("Backend test failed:", error.message);
  });

