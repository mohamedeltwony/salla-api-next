# AI Agent Development Rules

## 🚫 **STRICT PROHIBITION: NO MOCK DATA**

### Rule 1: Real API Integration Only
- **NEVER** create mock implementations, fake data, or placeholder responses
- **ALWAYS** use actual Salla API endpoints for all operations
- **MUST** implement proper authentication and error handling for real APIs
- **FORBIDDEN** to use mock services even for testing purposes
- If API is not working, **MUST** fix the actual integration, not create workarounds

### Rule 2: Authentication Requirements
- **ALWAYS** use valid access tokens from Salla OAuth flow
- **NEVER** bypass authentication with mock responses
- **MUST** implement proper token refresh mechanisms
- **REQUIRED** to validate all API calls with real credentials

### Rule 3: Data Integrity
- **ALL** data must come from actual Salla store/merchant accounts
- **NO** hardcoded product IDs, prices, or inventory data
- **MUST** reflect real-time store information
- **FORBIDDEN** to simulate successful operations that didn't actually occur

## 📝 **MANDATORY VERSION CONTROL**

### Rule 4: Critical Update Commits
- **MUST** create a git commit after every critical update including:
  - API endpoint modifications
  - Authentication flow changes
  - Database schema updates
  - Configuration changes
  - Security implementations
  - Error handling improvements
  - Feature additions or removals

### Rule 5: Commit Message Standards
- **REQUIRED** format: `type: brief description`
- **MUST** include detailed description for complex changes
- **EXAMPLES**:
  ```
  feat: implement Salla cart API integration
  fix: resolve authentication token refresh issue
  security: add input validation for user data
  config: update environment variables for production
  ```

### Rule 6: Commit Frequency
- **IMMEDIATE** commit after any working feature implementation
- **BEFORE** making breaking changes, commit current working state
- **AFTER** fixing critical bugs or security issues
- **WHEN** completing any user-requested functionality

## 🔒 **SECURITY & RELIABILITY**

### Rule 7: Error Handling
- **NEVER** hide API errors with fake success responses
- **ALWAYS** surface real error messages to help debugging
- **MUST** implement proper retry mechanisms for transient failures
- **REQUIRED** to log all API interactions for troubleshooting

### Rule 8: Environment Management
- **ALWAYS** use environment variables for sensitive data
- **NEVER** commit secrets or API keys to repository
- **MUST** provide clear setup instructions for required credentials
- **REQUIRED** to validate environment configuration before operations

## 🚨 **VIOLATION CONSEQUENCES**

### Immediate Actions Required:
1. **STOP** all development if mock data is detected
2. **REMOVE** any mock implementations immediately
3. **IMPLEMENT** proper API integration before continuing
4. **COMMIT** the fix with clear explanation

### Quality Assurance:
- **VERIFY** all operations work with real Salla store data
- **TEST** authentication flows with actual credentials
- **CONFIRM** error handling works with real API responses
- **VALIDATE** that user feedback reflects actual operation results

## 📋 **IMPLEMENTATION CHECKLIST**

Before completing any task:
- [ ] All API calls use real Salla endpoints
- [ ] Authentication is properly implemented
- [ ] No mock data or fake responses exist
- [ ] Error handling surfaces real API errors
- [ ] Changes are committed with descriptive messages
- [ ] Environment variables are properly configured
- [ ] User feedback reflects actual operation results

---

**Remember: The goal is to build a production-ready application that works with real Salla stores and provides accurate user feedback. Mock data undermines this objective and creates false confidence in the system.**