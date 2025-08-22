const ContentFilter = {
  // Default banned keywords (can be overridden by database settings)
  defaultBannedKeywords: [
    // Profanity
    'profanity1', 'profanity2', 'profanity3',
    
    // Hate speech
    'hate1', 'hate2', 'hate3',
    
    // Violence
    'violence1', 'violence2', 'violence3',
    
    // Spam indicators
    'buy now', 'click here', 'free money', 'make money fast',
    'work from home', 'earn money', 'get rich quick',
    
    // Scam indicators
    'lottery winner', 'inheritance', 'nigerian prince',
    'bank transfer', 'urgent action required'
  ],

  // Content categories for AI moderation
  contentCategories: {
    safe: ['sports', 'fitness', 'training', 'nutrition', 'health'],
    moderate: ['politics', 'religion', 'controversial'],
    risky: ['violence', 'explicit', 'illegal', 'harmful']
  },

  /**
   * Check if content contains banned keywords
   * @param {string} content - The content to check
   * @param {Array} bannedKeywords - Array of banned keywords from database
   * @returns {Object} - Result with found keywords and severity
   */
  checkBannedKeywords(content, bannedKeywords = []) {
    if (!content || typeof content !== 'string') {
      return { found: [], severity: 'none', score: 0 };
    }

    const contentLower = content.toLowerCase();
    const allKeywords = [...this.defaultBannedKeywords, ...bannedKeywords];
    const foundKeywords = [];
    let totalSeverity = 0;

    allKeywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        const severity = this.getKeywordSeverity(keyword);
        foundKeywords.push({
          keyword,
          severity,
          position: contentLower.indexOf(keyword.toLowerCase())
        });
        totalSeverity += this.getSeverityScore(severity);
      }
    });

    const severity = this.calculateOverallSeverity(totalSeverity, foundKeywords.length);
    const score = this.calculateContentScore(foundKeywords.length, totalSeverity);

    return {
      found: foundKeywords,
      severity,
      score,
      count: foundKeywords.length
    };
  },

  /**
   * Get severity level for a keyword
   * @param {string} keyword - The keyword to check
   * @returns {string} - Severity level
   */
  getKeywordSeverity(keyword) {
    const criticalKeywords = ['violence', 'hate', 'illegal', 'harmful'];
    const highKeywords = ['profanity', 'explicit', 'scam'];
    const mediumKeywords = ['spam', 'inappropriate'];
    
    const keywordLower = keyword.toLowerCase();
    
    if (criticalKeywords.some(k => keywordLower.includes(k))) return 'critical';
    if (highKeywords.some(k => keywordLower.includes(k))) return 'high';
    if (mediumKeywords.some(k => keywordLower.includes(k))) return 'medium';
    
    return 'low';
  },

  /**
   * Get numerical score for severity level
   * @param {string} severity - Severity level
   * @returns {number} - Numerical score
   */
  getSeverityScore(severity) {
    const scores = {
      'critical': 10,
      'high': 7,
      'medium': 4,
      'low': 1
    };
    return scores[severity] || 1;
  },

  /**
   * Calculate overall severity based on found keywords
   * @param {number} totalSeverity - Total severity score
   * @param {number} keywordCount - Number of found keywords
   * @returns {string} - Overall severity level
   */
  calculateOverallSeverity(totalSeverity, keywordCount) {
    if (totalSeverity >= 20 || keywordCount >= 5) return 'critical';
    if (totalSeverity >= 15 || keywordCount >= 3) return 'high';
    if (totalSeverity >= 8 || keywordCount >= 2) return 'medium';
    if (totalSeverity >= 1) return 'low';
    return 'none';
  },

  /**
   * Calculate content score (0-100, lower is worse)
   * @param {number} keywordCount - Number of found keywords
   * @param {number} totalSeverity - Total severity score
   * @returns {number} - Content score (0-100)
   */
  calculateContentScore(keywordCount, totalSeverity) {
    let score = 100;
    
    // Deduct points for each keyword found
    score -= (keywordCount * 10);
    
    // Deduct points for severity
    score -= (totalSeverity * 2);
    
    // Ensure score doesn't go below 0
    return Math.max(0, score);
  },

  /**
   * Check content length and formatting
   * @param {string} content - The content to check
   * @returns {Object} - Formatting analysis
   */
  checkContentFormat(content) {
    if (!content) {
      return { isValid: false, issues: ['Content is empty'] };
    }

    const issues = [];
    const warnings = [];

    // Check content length
    if (content.length < 10) {
      issues.push('Content is too short');
    } else if (content.length > 2000) {
      issues.push('Content exceeds maximum length');
    }

    // Check for excessive capitalization
    const upperCaseCount = (content.match(/[A-Z]/g) || []).length;
    const totalLetters = (content.match(/[a-zA-Z]/g) || []).length;
    if (totalLetters > 0 && (upperCaseCount / totalLetters) > 0.7) {
      warnings.push('Excessive use of capital letters');
    }

    // Check for excessive punctuation
    const punctuationCount = (content.match(/[!?.,;:]/g) || []).length;
    if (punctuationCount > content.length * 0.1) {
      warnings.push('Excessive punctuation');
    }

    // Check for repeated characters
    const repeatedChars = content.match(/(.)\1{4,}/g);
    if (repeatedChars) {
      warnings.push('Repeated characters detected');
    }

    // Check for URL patterns
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = content.match(urlPattern);
    if (urls && urls.length > 3) {
      warnings.push('Multiple URLs detected');
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      length: content.length,
      hasUrls: !!urls,
      urlCount: urls ? urls.length : 0
    };
  },

  /**
   * Check for spam patterns
   * @param {string} content - The content to check
   * @returns {Object} - Spam detection result
   */
  checkSpamPatterns(content) {
    if (!content) {
      return { isSpam: false, patterns: [], score: 0 };
    }

    const contentLower = content.toLowerCase();
    const spamPatterns = [
      // Common spam phrases
      { pattern: 'make money fast', score: 8 },
      { pattern: 'work from home', score: 6 },
      { pattern: 'earn money', score: 5 },
      { pattern: 'click here', score: 4 },
      { pattern: 'buy now', score: 3 },
      { pattern: 'free money', score: 7 },
      { pattern: 'lottery winner', score: 9 },
      { pattern: 'inheritance', score: 8 },
      { pattern: 'nigerian prince', score: 10 },
      { pattern: 'bank transfer', score: 7 },
      { pattern: 'urgent action required', score: 8 },
      
      // Excessive promotional language
      { pattern: 'limited time offer', score: 6 },
      { pattern: 'act now', score: 5 },
      { pattern: 'don\'t miss out', score: 4 },
      { pattern: 'exclusive deal', score: 3 },
      
      // Suspicious financial terms
      { pattern: 'investment opportunity', score: 5 },
      { pattern: 'guaranteed returns', score: 7 },
      { pattern: 'risk-free', score: 6 }
    ];

    let totalScore = 0;
    const foundPatterns = [];

    spamPatterns.forEach(({ pattern, score }) => {
      if (contentLower.includes(pattern)) {
        foundPatterns.push({ pattern, score });
        totalScore += score;
      }
    });

    // Check for excessive repetition
    const words = contentLower.split(/\s+/);
    const wordCounts = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const repeatedWords = Object.entries(wordCounts)
      .filter(([word, count]) => count > 3 && word.length > 3)
      .map(([word, count]) => ({ word, count }));

    if (repeatedWords.length > 0) {
      totalScore += repeatedWords.length * 2;
      foundPatterns.push({
        pattern: 'repeated words',
        score: repeatedWords.length * 2,
        details: repeatedWords
      });
    }

    const isSpam = totalScore >= 10;

    return {
      isSpam,
      patterns: foundPatterns,
      score: totalScore,
      repeatedWords
    };
  },

  /**
   * Comprehensive content analysis
   * @param {string} content - The content to analyze
   * @param {Array} bannedKeywords - Custom banned keywords
   * @returns {Object} - Complete analysis result
   */
  analyzeContent(content, bannedKeywords = []) {
    const keywordCheck = this.checkBannedKeywords(content, bannedKeywords);
    const formatCheck = this.checkContentFormat(content);
    const spamCheck = this.checkSpamPatterns(content);

    const overallScore = Math.min(
      keywordCheck.score,
      formatCheck.isValid ? 100 : 50,
      spamCheck.isSpam ? 20 : 100
    );

    const recommendations = [];
    
    if (keywordCheck.found.length > 0) {
      recommendations.push('Review content for inappropriate language');
    }
    
    if (!formatCheck.isValid) {
      recommendations.push('Fix content formatting issues');
    }
    
    if (spamCheck.isSpam) {
      recommendations.push('Content appears to be spam');
    }

    return {
      content,
      analysis: {
        keywordCheck,
        formatCheck,
        spamCheck
      },
      overallScore,
      recommendations,
      timestamp: new Date().toISOString(),
      needsModeration: overallScore < 70
    };
  }
};

module.exports = ContentFilter;
