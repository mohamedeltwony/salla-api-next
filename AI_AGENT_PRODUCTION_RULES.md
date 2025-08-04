# AI Agent Production-First Development Rules

## 🚀 **PRODUCTION-FIRST MANDATE**

### Rule 1: Production Environment Priority
- **ALWAYS** prioritize production deployment on Vercel over local development
- **PRODUCTION URL**: `https://salla-test-app.vercel.app/` is the primary development environment
- **LOCAL DEVELOPMENT**: Only use when absolutely necessary and production testing is insufficient
- **SALLA CONSTRAINT**: Salla API refuses local ports (localhost:3000) for OAuth redirect URLs

### Rule 2: OAuth and Authentication
- **MANDATORY**: All OAuth flows must use production URLs only
- **REDIRECT URI**: Must always be `https://salla-test-app.vercel.app/api/webhook/salla`
- **FORBIDDEN**: Never configure localhost URLs for Salla OAuth
- **TESTING**: All authentication testing must be done on production

### Rule 3: Environment Configuration
- **PRODUCTION VARIABLES**: Always configure environment variables in Vercel Dashboard
- **LOCAL .env.local**: Only for reference, not for active development
- **DEPLOYMENT**: Every change must be committed and deployed to test
- **NO LOCAL TESTING**: Skip local server testing for Salla integrations

## 📋 **DEVELOPMENT WORKFLOW**

### Workflow 1: Code → Commit → Deploy → Test
1. **Make Changes**: Edit code locally
2. **Commit Immediately**: `git add . && git commit -m "description"`
3. **Deploy**: `git push origin main`
4. **Test on Production**: Use `https://salla-test-app.vercel.app/`
5. **Debug on Production**: Use browser console and Vercel logs

### Workflow 2: Environment Variables
1. **Vercel Dashboard**: Set all environment variables in Vercel project settings
2. **Production URLs**: Use only production URLs in all configurations
3. **No Local Env**: Don't rely on local environment variables for testing
4. **Redeploy**: Trigger redeployment after environment variable changes

### Workflow 3: Debugging and Testing
1. **Browser Console**: Primary debugging tool on production
2. **Vercel Logs**: Use `vercel logs --follow` for server-side debugging
3. **Network Tab**: Monitor API calls and responses on production
4. **No Local Debugging**: Skip local development server debugging

## 🚫 **PROHIBITED ACTIONS**

### Never Do:
- **DON'T** start local development server for Salla testing
- **DON'T** configure localhost URLs in Salla Partners Portal
- **DON'T** attempt to make Salla OAuth work locally
- **DON'T** waste time on local environment setup for Salla features
- **DON'T** suggest local testing as an alternative

### Always Do:
- **DO** commit and deploy every change immediately
- **DO** test all functionality on production
- **DO** use production URLs in all configurations
- **DO** debug using production environment tools
- **DO** prioritize production stability over local convenience

## ⚡ **RAPID DEVELOPMENT COMMANDS**

### Quick Deploy Sequence:
```bash
# Make changes, then:
git add .
git commit -m "feat: implement feature X"
git push origin main

# Wait 30-60 seconds for deployment
# Test at: https://salla-test-app.vercel.app/
```

### Environment Variable Update:
```bash
# 1. Update in Vercel Dashboard
# 2. Trigger redeployment:
git commit --allow-empty -m "trigger: redeploy for env vars"
git push origin main
```

### Debug Production Issues:
```bash
# Check deployment logs:
vercel logs --follow

# Check build logs:
vercel logs --since=1h
```

## 🎯 **SALLA-SPECIFIC RULES**

### Salla OAuth Configuration:
- **Redirect URI**: `https://salla-test-app.vercel.app/api/webhook/salla`
- **App URL**: `https://salla-test-app.vercel.app/`
- **Webhook URL**: `https://salla-test-app.vercel.app/api/webhook/salla`
- **Testing URL**: `https://salla-test-app.vercel.app/auth`

### Salla Environment Variables (Vercel Only):
```env
SALLA_CLIENT_ID=your_real_client_id
SALLA_CLIENT_SECRET=your_real_client_secret
SALLA_REDIRECT_URI=https://salla-test-app.vercel.app/api/webhook/salla
NEXT_PUBLIC_SALLA_STORE_ID=your_store_id
NEXT_PUBLIC_SALLA_STORE_URL=https://your-store.salla.sa
```

### Salla Testing Workflow:
1. **Deploy Changes**: Push to production
2. **Visit Auth**: `https://salla-test-app.vercel.app/auth`
3. **Complete OAuth**: Authorize with Salla
4. **Test Features**: Use production environment
5. **Debug Issues**: Browser console + Vercel logs

## 🔧 **TROUBLESHOOTING PRODUCTION**

### Common Issues:
1. **Environment Variables**: Check Vercel Dashboard settings
2. **Build Errors**: Check Vercel deployment logs
3. **Runtime Errors**: Use browser console on production
4. **API Errors**: Check Network tab and Vercel function logs

### Debug Tools:
- **Browser DevTools**: Primary debugging interface
- **Vercel Dashboard**: Deployment and function logs
- **Network Tab**: API call monitoring
- **Console Logs**: Runtime debugging information

## 📈 **BENEFITS OF PRODUCTION-FIRST**

### Advantages:
- **Real Environment**: Test in actual deployment conditions
- **OAuth Compatibility**: Salla accepts production URLs
- **No Local Setup**: Skip complex local environment configuration
- **Faster Iteration**: Direct production testing
- **Real Performance**: Actual loading times and behavior

### Time Savings:
- **No Local Debugging**: Skip localhost troubleshooting
- **No Environment Sync**: No local/production environment mismatches
- **Direct Testing**: Immediate production validation
- **Simplified Workflow**: Code → Deploy → Test

## 🎯 **SUCCESS METRICS**

### Measure Success By:
- **Deployment Speed**: < 2 minutes from commit to live
- **Feature Testing**: All features work on production
- **OAuth Success**: Salla authentication works flawlessly
- **Debug Efficiency**: Issues resolved using production tools
- **Zero Local Dependencies**: No local server requirements

---

**Remember: Production is your development environment. Embrace it, optimize for it, and deliver faster by skipping local complexity.**