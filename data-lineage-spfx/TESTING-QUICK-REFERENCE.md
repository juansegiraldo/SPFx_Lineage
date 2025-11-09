# Testing Quick Reference - When Do I Need Approvals?

## 🎯 One-Page Guide: Do You Need Approvals?

### ❌ NO APPROVALS NEEDED - Just Code and Test!

| What You're Doing | Command | Where to Test |
|------------------|---------|---------------|
| Changing button text, labels, colors | `npm run serve` | http://localhost:5432/workbench |
| Modifying layout or styles | `npm run serve` | http://localhost:5432/workbench |
| Adding/removing UI components | `npm run serve` | http://localhost:5432/workbench |
| Changing property pane options | `npm run serve` | http://localhost:5432/workbench |
| Testing with different mock data | Edit `MockDataService.ts` + `npm run serve` | http://localhost:5432/workbench |
| Running unit tests | `npm test` | Terminal |
| Checking build errors | `npm run build` | Terminal |
| Testing graph interactions | `npm run serve` | http://localhost:5432/workbench |

**Bottom Line:** If you're just changing code or UI, **no approvals needed!** 🎉

---

### ⚠️ SHAREPOINT ADMIN APPROVAL NEEDED

| What You're Doing | Why Approval Needed |
|------------------|---------------------|
| Creating the "DataLineage" SharePoint list | Need permissions to create lists |
| Testing with real SharePoint data | Need access to production/test SharePoint site |
| Changing list schema/columns | Need permissions to modify list structure |
| Testing on SharePoint hosted workbench | Need access to SharePoint site |

**Minimize this by:** Testing everything possible locally first with mock data!

---

### 🔒 CYBER TEAM APPROVAL NEEDED

| What You're Doing | Why Approval Needed |
|------------------|---------------------|
| Deploying .sppkg to tenant app catalog | Security review required for tenant-wide deployment |
| Publishing to production | Security and compliance verification |
| Making app available to all users | Requires tenant admin permissions |

**Minimize this by:** Only requesting deployment when everything is fully tested and ready!

---

## 🚀 Recommended Workflow

### Step 1: Development (No Approvals)
```bash
# Make your changes
vim src/webparts/dataLineageViewer/components/DataLineageViewer.tsx

# Test immediately
npm run serve

# Open workbench
# → http://localhost:5432/workbench
# → Add web part
# → Test your changes

# Run unit tests
npm test

# Build to check for errors
npm run build
```

**Iterate as many times as needed!** No one to ask, no one to wait for.

### Step 2: Pre-Deployment (Still No Approvals)
```bash
# Final build check
npm run clean
npm run build

# Package locally
npm run package-solution
```

**Check the .sppkg file is created** in `sharepoint/solution/`

### Step 3: SharePoint Testing (SharePoint Admin Needed - ONCE)
**Only if you need to test with real SharePoint data:**
- Ask SharePoint admin to create test site
- Ask for DataLineage list to be created
- Test on SharePoint hosted workbench

### Step 4: Production Deployment (Cyber Team + Admin Needed - ONCE)
**Only when everything is tested and ready:**
- Submit .sppkg to cyber team for review
- After approval, SharePoint admin deploys to tenant catalog
- App is published to users

---

## 📊 Decision Tree

```
Are you changing code or UI?
├─ YES → Test locally with `npm run serve` (NO APPROVALS)
└─ NO → Continue

Do you need to test with real SharePoint data?
├─ YES → Contact SharePoint Admin (APPROVAL NEEDED)
└─ NO → Continue

Are you ready to deploy to production?
├─ YES → Contact Cyber Team + SharePoint Admin (APPROVALS NEEDED)
└─ NO → Keep testing locally!
```

---

## 🔥 Common Scenarios

### Scenario: "I changed a button label"
```bash
npm run serve
# Test in workbench
# Done! ✅
```
**Approvals needed:** None

---

### Scenario: "I changed the graph colors"
```bash
npm run serve
# Test in workbench
# Change colors in property pane
# Done! ✅
```
**Approvals needed:** None

---

### Scenario: "I added a new filter option"
```bash
# 1. Add code
# 2. Add mock data to test with
npm run serve
# 3. Test in workbench
# 4. Run tests
npm test
# Done! ✅
```
**Approvals needed:** None

---

### Scenario: "I need to test with real SharePoint data"
```bash
# 1. Test everything locally first
npm run serve

# 2. Build package
npm run package-solution

# 3. Contact SharePoint Admin
#    → Upload to TEST site app catalog
#    → Install on TEST site only
#    → Test on SharePoint workbench
```
**Approvals needed:** SharePoint Admin (for test site)

---

### Scenario: "Ready to deploy to production"
```bash
# 1. Final local testing
npm run serve
npm test
npm run build

# 2. Create production package
npm run clean
npm run package-solution

# 3. Contact Cyber Team
#    → Submit .sppkg for security review
#    → Wait for approval

# 4. After cyber approval, contact SharePoint Admin
#    → Deploy to tenant app catalog
#    → Publish app
#    → Make available to users
```
**Approvals needed:** Cyber Team + SharePoint Admin

---

## 📝 Key Points to Remember

1. **90% of your work needs NO approvals**
   - All UI changes
   - All code changes
   - All local testing
   - All unit testing

2. **Mock data is your friend**
   - Automatically used when SharePoint isn't available
   - Edit `MockDataService.ts` to add test scenarios
   - Perfect for development and iteration

3. **Test locally FIRST, always**
   - Catch bugs before involving others
   - Verify functionality works
   - Ensure build succeeds
   - Run all tests

4. **Only contact admins when:**
   - You need real SharePoint data testing (rare)
   - You're ready for production deployment (once)

5. **The magic command:** `npm run serve`
   - Use it constantly
   - No setup needed
   - Instant feedback
   - Full UI testing capability

---

## 🛠️ Essential Commands

```bash
# The one you'll use 99% of the time
npm run serve

# Other important ones
npm test              # Run unit tests
npm run build         # Check for errors
npm run clean         # Clean build artifacts
npm run package-solution  # Create .sppkg (final step)
```

---

## 🆘 Quick Troubleshooting

**Workbench won't open?**
```bash
# Kill and restart
Ctrl+C
npm run serve
```

**Changes not showing?**
- Hard refresh browser (Ctrl+F5)
- Clear cache
- Restart dev server

**"Task never defined: serve" error?**
- This is fixed in the latest package.json
- The script now uses `gulp serve-deprecated`
- Pull latest changes or update package.json

**Port in use?**
```bash
# Linux/Mac:
lsof -ti:4321 | xargs kill -9

# Windows:
netstat -ano | findstr :4321
taskkill /PID <PID> /F

# Then restart:
npm run serve
```

**Mock data not loading?**
- Check console (F12)
- Verify MockDataService.ts syntax
- Restart dev server

---

## 💡 Pro Tips

1. **Keep dev server running** while you code - changes auto-reload
2. **Use mock data for everything** until final SharePoint testing
3. **Run `npm test` frequently** to catch issues early
4. **Only package** when ready to deploy
5. **Document your changes** before requesting deployment

---

## 📞 Who to Contact When

| Need | Contact |
|------|---------|
| Help with local development | Fellow developers, documentation |
| Create test SharePoint site | SharePoint Admin |
| Deploy to production | Cyber Team → then SharePoint Admin |
| Bug in code | Fix it yourself and test locally! |
| UI feedback | Test locally, iterate, no approvals |

---

**Remember: `npm run serve` is your best friend! Use it liberally, test freely, iterate quickly!** 🚀
