// Mock API for testing when backend is not available
const mockApi = {
  post: async (url, data) => {
    console.log('Mock API call:', url, data);
    
    if (url === '/auth/check-password-strength') {
      const { password } = data;
      const errors = [];
      
      if (password.length < 8) errors.push("Password must be at least 8 characters long");
      if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
      if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
      if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
      if (!/[^A-Za-z0-9]/.test(password)) errors.push("Password must contain at least one special character");
      
      const strength = Math.max(0, 100 - (errors.length * 20));
      
      return {
        data: {
          success: true,
          isValid: errors.length === 0,
          errors: errors,
          warnings: [],
          strength: strength,
          strengthLevel: strength >= 80 ? "Strong" : strength >= 60 ? "Medium" : "Weak"
        }
      };
    }
    
    if (url === '/auth/register') {
      return {
        data: {
          success: true,
          message: "User registered successfully (mock mode)",
          user: { id: "mock-id", username: data.username, email: data.email, role: "athlete" },
          token: "mock-token"
        }
      };
    }
    
    return { data: { success: true, message: "Mock response" } };
  },
  
  get: async (url) => {
    console.log('Mock API GET call:', url);
    return { data: { success: true, message: "Mock response" } };
  }
};

export default mockApi;
