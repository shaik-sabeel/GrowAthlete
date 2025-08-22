# Content Moderation System

## Overview

The GrowAthlete platform includes a comprehensive content moderation system designed to maintain a safe, respectful, and engaging community environment. This system provides both automated and manual moderation capabilities for various types of content including community posts, blog posts, and sports resumes.

## Features

### 🔒 Content Moderation
- **Community Posts**: Moderate user-generated posts with approval/rejection workflow
- **Blog Posts**: Manage blog content with draft, pending, approved, and published states
- **Sports Resumes**: Review and approve athlete resumes before they go live
- **Comments**: Moderate user comments on posts and blog articles

### 🚩 Content Flagging
- **User Reporting**: Allow users to flag inappropriate content
- **Multiple Categories**: Spam, inappropriate content, harassment, fake news, violence
- **Auto-flagging**: Automatic flagging when threshold is reached
- **Moderation Queue**: Centralized queue for flagged content review

### 🤖 Automated Moderation
- **Keyword Filtering**: Detect banned keywords and phrases
- **Spam Detection**: Identify spam patterns and promotional content
- **Content Analysis**: Score content based on multiple factors
- **Language Filtering**: Assess content appropriateness

### ⚙️ Moderation Settings
- **Configurable Thresholds**: Adjust auto-flag and auto-remove thresholds
- **Banned Keywords**: Manage list of prohibited terms
- **Category Management**: Organize keywords by severity and type
- **Whitelist Support**: Handle false positives

## Architecture

### Backend Models

#### CommunityPost
```javascript
{
  author: ObjectId,           // Reference to User
  content: String,            // Post content (max 2000 chars)
  media: Array,               // Media attachments
  tags: [String],             // Content tags
  status: String,             // pending, approved, rejected, flagged, removed
  moderationNotes: String,    // Admin notes
  moderatedBy: ObjectId,      // Admin who moderated
  moderatedAt: Date,          // Moderation timestamp
  rejectionReason: String,    // Reason for rejection
  flags: [Flag],              // User reports
  isFlagged: Boolean,         // Auto-calculated flag status
  flagCount: Number,          // Number of flags
  containsInappropriateContent: Boolean,
  inappropriateKeywords: [String],
  languageScore: Number       // 0-100 score
}
```

#### BlogPost
```javascript
{
  title: String,              // Blog title
  content: String,            // Blog content
  status: String,             // draft, pending, approved, published, archived
  author: ObjectId,           // Reference to User
  category: String,           // Blog category
  moderationNotes: String,    // Admin notes
  moderatedBy: ObjectId,      // Admin who moderated
  approvalDate: Date,         // Approval timestamp
  publishedAt: Date,          // Publication timestamp
  flags: [Flag],              // User reports
  // ... other fields
}
```

#### ContentModeration
```javascript
{
  autoModerationEnabled: Boolean,
  keywordFilteringEnabled: Boolean,
  languageFilteringEnabled: Boolean,
  imageModerationEnabled: Boolean,
  bannedKeywords: [BannedKeyword],
  whitelistedKeywords: [WhitelistedKeyword],
  autoFlagThreshold: Number,      // Default: 3
  autoRemoveThreshold: Number,    // Default: 5
  languageScoreThreshold: Number, // Default: 70
  moderationActions: [ModerationAction],
  autoModerationResults: [AutoModerationResult],
  stats: ModerationStats
}
```

### API Endpoints

#### Content Moderation Routes
```
GET    /api/moderation/community-posts     # Get posts for moderation
PATCH  /api/moderation/community-posts/:id/moderate  # Moderate a post
POST   /api/moderation/community-posts/:id/flag      # Flag a post

GET    /api/moderation/blog-posts          # Get blog posts for moderation
PATCH  /api/moderation/blog-posts/:id/moderate       # Moderate a blog post

GET    /api/moderation/sports-resumes      # Get resumes for moderation
PATCH  /api/moderation/sports-resumes/:id/moderate   # Moderate a resume

GET    /api/moderation/settings            # Get moderation settings
PATCH  /api/moderation/settings            # Update moderation settings
POST   /api/moderation/banned-keywords     # Add banned keyword
DELETE /api/moderation/banned-keywords/:keyword  # Remove banned keyword
GET    /api/moderation/stats               # Get moderation statistics
```

### Frontend Components

#### ContentModeration
- **Admin Dashboard**: Comprehensive moderation interface
- **Content Tables**: View and manage different content types
- **Moderation Actions**: Approve, reject, flag, or remove content
- **Settings Panel**: Configure moderation parameters
- **Statistics**: View moderation metrics and trends

#### ContentFlagModal
- **User Interface**: Allow users to flag inappropriate content
- **Reason Selection**: Choose from predefined flag categories
- **Description Input**: Provide additional context
- **Validation**: Prevent duplicate flagging

## Usage

### For Administrators

#### Accessing the Moderation Dashboard
1. Navigate to Admin Dashboard
2. Click on "Content Moderation" in the sidebar
3. Choose content type (Community Posts, Blog Posts, or Sports Resumes)

#### Moderating Content
1. **Review Content**: View content details and user information
2. **Take Action**: Choose appropriate moderation action:
   - **Approve**: Content goes live
   - **Reject**: Content is removed with reason
   - **Flag**: Mark for further review
   - **Remove**: Immediate removal
3. **Add Notes**: Provide context for moderation decision

#### Managing Settings
1. **Automated Moderation**: Enable/disable auto-moderation features
2. **Thresholds**: Adjust flag and removal thresholds
3. **Banned Keywords**: Add/remove prohibited terms
4. **Categories**: Organize keywords by severity and type

### For Users

#### Flagging Content
1. **Identify Issue**: Find inappropriate content
2. **Click Flag**: Use flag button on content
3. **Select Reason**: Choose appropriate category
4. **Add Details**: Provide additional context
5. **Submit**: Send to moderation team

#### Content Guidelines
- **Respectful Communication**: Maintain positive tone
- **No Spam**: Avoid promotional content
- **No Harassment**: Respect other users
- **Accurate Information**: Share truthful content
- **Appropriate Language**: Use family-friendly language

## Configuration

### Moderation Thresholds

#### Auto-flag Threshold
- **Default**: 3 flags
- **Range**: 1-10
- **Action**: Content automatically flagged for review

#### Auto-remove Threshold
- **Default**: 5 flags
- **Range**: 1-10
- **Action**: Content automatically removed

#### Language Score Threshold
- **Default**: 70
- **Range**: 0-100
- **Action**: Content below threshold flagged

### Banned Keywords

#### Severity Levels
- **Critical**: Immediate removal (violence, hate speech)
- **High**: Quick review (profanity, explicit content)
- **Medium**: Standard review (spam, inappropriate)
- **Low**: Light review (minor violations)

#### Categories
- **Profanity**: Offensive language
- **Hate Speech**: Discriminatory content
- **Violence**: Harmful or threatening content
- **Spam**: Unwanted promotional content
- **Other**: Miscellaneous violations

## Monitoring and Analytics

### Moderation Statistics
- **Total Moderated**: Count of all moderated content
- **Auto vs Manual**: Breakdown of moderation methods
- **Flagged Content**: Number of flagged items
- **Removed Content**: Number of removed items
- **False Positives**: Incorrectly flagged content

### Performance Metrics
- **Response Time**: Time to moderate content
- **Accuracy**: Correct moderation decisions
- **User Satisfaction**: Community feedback
- **Content Quality**: Overall platform standards

## Security and Privacy

### Data Protection
- **User Privacy**: Protect reporter identities
- **Content Encryption**: Secure storage of sensitive content
- **Access Control**: Admin-only moderation tools
- **Audit Trail**: Complete moderation history

### Anti-Abuse Measures
- **Duplicate Prevention**: One flag per user per content
- **False Report Detection**: Identify abuse of flagging system
- **Rate Limiting**: Prevent spam flagging
- **Account Restrictions**: Consequences for false reports

## Best Practices

### For Moderators
1. **Consistency**: Apply rules uniformly across all content
2. **Documentation**: Maintain clear moderation notes
3. **Communication**: Explain decisions when appropriate
4. **Escalation**: Refer complex cases to senior staff
5. **Training**: Regular updates on moderation policies

### For Users
1. **Read Guidelines**: Understand community standards
2. **Report Responsibly**: Only flag genuine violations
3. **Provide Context**: Give clear reasons for flags
4. **Respect Process**: Allow time for review
5. **Appeal Process**: Use proper channels for disputes

## Troubleshooting

### Common Issues

#### Content Not Appearing
- Check moderation status
- Verify approval workflow
- Review rejection reasons

#### Flagging Not Working
- Ensure user authentication
- Check for duplicate flags
- Verify content exists

#### Settings Not Saving
- Confirm admin permissions
- Check form validation
- Review server logs

### Support

#### Technical Issues
- Check server logs
- Verify API endpoints
- Test authentication
- Review database connections

#### Policy Questions
- Consult moderation guidelines
- Contact senior moderators
- Review community standards
- Check platform policies

## Future Enhancements

### Planned Features
- **AI-Powered Moderation**: Machine learning content analysis
- **Image Moderation**: Automated image content review
- **Real-time Monitoring**: Live content screening
- **Advanced Analytics**: Detailed moderation insights
- **Mobile Moderation**: Admin tools for mobile devices

### Integration Opportunities
- **Third-party Services**: External moderation APIs
- **Social Media**: Cross-platform content monitoring
- **Reporting Tools**: Enhanced analytics and reporting
- **Automation**: Workflow automation and triggers

## Conclusion

The content moderation system provides a robust foundation for maintaining a safe and engaging community on the GrowAthlete platform. By combining automated detection with human oversight, we ensure content quality while respecting user privacy and maintaining platform performance.

For questions or support, please contact the platform administration team or refer to the technical documentation.
