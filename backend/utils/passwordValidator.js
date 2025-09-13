// Password validation utility
const passwordValidator = {
  // Password strength requirements
  requirements: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    forbiddenPatterns: [
      /(.)\1{2,}/, // No 3+ consecutive identical characters
      /123|234|345|456|567|678|789|890/, // No sequential numbers
      /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i, // No sequential letters
      /qwerty|asdf|zxcv/i, // No common keyboard patterns
    ]
  },

  // Validate password strength
  validatePassword(password) {
    const errors = [];
    const warnings = [];

    // Check minimum length
    if (password.length < this.requirements.minLength) {
      errors.push(`Password must be at least ${this.requirements.minLength} characters long`);
    }

    // Check maximum length
    if (password.length > this.requirements.maxLength) {
      errors.push(`Password must be no more than ${this.requirements.maxLength} characters long`);
    }

    // Check for uppercase letter
    if (this.requirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Check for lowercase letter
    if (this.requirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // Check for numbers
    if (this.requirements.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Check for special characters
    if (this.requirements.requireSpecialChars && !/[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/~`]/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&^#()_+-=[]{};\':"\\|,.<>\\/~`)');
    }

    // Check for forbidden patterns
    this.requirements.forbiddenPatterns.forEach((pattern, index) => {
      if (pattern.test(password)) {
        const patternNames = [
          'consecutive identical characters',
          'sequential numbers',
          'sequential letters',
          'common keyboard patterns'
        ];
        warnings.push(`Avoid ${patternNames[index] || 'common patterns'}`);
      }
    });

    // Check for common weak passwords
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
      'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon',
      'master', 'hello', 'freedom', 'whatever', 'qazwsx', 'trustno1'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common. Please choose a more unique password');
    }

    // Check if password contains username or email (will be checked in route)
    // This is handled in the registration route

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      strength: this.calculateStrength(password)
    };
  },

  // Calculate password strength score (0-100)
  calculateStrength(password) {
    let score = 0;
    
    // Length score (0-25 points)
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 5;

    // Character variety score (0-50 points)
    if (/[a-z]/.test(password)) score += 10; // lowercase
    if (/[A-Z]/.test(password)) score += 10; // uppercase
    if (/\d/.test(password)) score += 10; // numbers
    if (/[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/~`]/.test(password)) score += 10; // special chars
    if (/[^a-zA-Z0-9@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/~`]/.test(password)) score += 10; // other chars

    // Complexity score (0-25 points)
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= 8) score += 10;
    if (uniqueChars >= 12) score += 10;
    if (uniqueChars >= 16) score += 5;

    // Penalty for patterns
    this.requirements.forbiddenPatterns.forEach(pattern => {
      if (pattern.test(password)) score -= 5;
    });

    return Math.max(0, Math.min(100, score));
  },

  // Get strength level description
  getStrengthLevel(score) {
    if (score < 30) return { level: 'Very Weak', color: 'red' };
    if (score < 50) return { level: 'Weak', color: 'orange' };
    if (score < 70) return { level: 'Fair', color: 'yellow' };
    if (score < 90) return { level: 'Good', color: 'lightgreen' };
    return { level: 'Strong', color: 'green' };
  }
};

module.exports = passwordValidator;
