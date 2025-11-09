# Testing Guide - Data Lineage Viewer SPFx App

## Overview

This guide explains how to test the Data Lineage Viewer app locally without requiring SharePoint admin or cyber team approval for every UI change. The app is designed to work in two modes:

1. **SharePoint Mode** - Connects to real SharePoint lists (production)
2. **Mock Data Mode** - Uses local test data (development/testing)

## Quick Start - Test Locally NOW

You can test UI changes immediately without any SharePoint connection:

```bash
cd data-lineage-spfx
npm run serve
```

Then open your browser to: `http://localhost:5432/workbench`

**What this does:**
- Starts local development server on port 4321
- Opens the SharePoint Workbench on port 5432
- Automatically falls back to mock data (no SharePoint needed)
- Enables hot reload - changes appear automatically

## Testing Workflows

### 1. Testing UI Changes (Most Common)

**Use Case:** You changed button text, colors, layout, or any visual element.

**Steps:**
```bash
# Start the dev server
npm run serve

# In your browser:
# 1. Go to http://localhost:5432/workbench
# 2. Click the "+" icon to add a web part
# 3. Select "Data Lineage Viewer"
# 4. Test your changes with mock data
```

**What You Can Test:**
- All UI components and layouts
- Color schemes (primary/secondary colors)
- Text and labels
- Dropdown filters
- Statistics display
- Graph visualization
- Responsive design
- Error messages
- Loading states

**No SharePoint Required!** ✅

### 2. Testing Property Pane Changes

**Use Case:** You modified configuration options in the property pane.

**Steps:**
```bash
npm run serve
```

In the workbench:
1. Add the web part
2. Click the **pencil icon** (edit) on the web part
3. The property pane opens on the right
4. Test all your property changes:
   - Description field
   - SharePoint List Name field
   - Primary Color field
   - Secondary Color field

**Mock data is used automatically** - you can see how the app reacts to different configurations.

### 3. Testing with Different Mock Data

**Location:** `src/webparts/dataLineageViewer/services/MockDataService.ts`

The mock data service provides realistic test data with multiple use cases:
- Análisis de Ventas (Sales Analysis)
- Customer Analytics
- Financial Reporting
- Supply Chain
- HR Analytics
- Marketing Campaign

**To add/modify test data:**
1. Edit `MockDataService.ts`
2. Update the `getMockData()` method
3. Save the file
4. The workbench auto-reloads with new data

**Example - Adding a new test scenario:**
```typescript
{
  UseCase: 'Your New Use Case',
  DataSources: 'Test Source',
  Ingestion: 'Test Ingestion',
  Storage: 'Test Storage',
  ProcessingTransformation: 'Test Processing',
  ConsumptionReporting: 'Test Reporting',
  Linaje: true
}
```

### 4. Testing Business Logic Changes

**Use Case:** You modified data processing or graph generation logic.

**Steps:**
```bash
# Run unit tests
npm test

# Or with watch mode for continuous testing
npm test -- --watch
```

**Test files location:**
- `src/webparts/dataLineageViewer/test/MockDataService.test.ts`
- `src/webparts/dataLineageViewer/test/DataProcessingService.test.ts`
- `src/webparts/dataLineageViewer/test/DataLineageViewer.test.tsx`

### 5. Building for Production

**Use Case:** You're ready to create a package for deployment.

**Steps:**
```bash
# Clean previous builds
npm run clean

# Build and package
npm run package-solution
```

**Output:** `sharepoint/solution/data-lineage-spfx.sppkg`

**Note:** Only do this when you're ready to deploy. For testing, use `npm run serve`.

## How Mock Data Works

### Automatic Fallback System

The app automatically uses mock data when SharePoint is not available:

**Code Location:** `src/webparts/dataLineageViewer/components/DataLineageViewer.tsx:68-119`

```typescript
// App tries SharePoint first
const spService = new SharePointService(spConfig);
const isConnected = await spService.testConnection();

if (isConnected) {
  // Use SharePoint data
} else {
  // Automatically fall back to mock data
  const mockData = MockDataService.getMockData();
}
```

### When Mock Data is Used

Mock data is automatically used when:
- Running in local workbench (`npm run serve`)
- SharePoint list doesn't exist
- SharePoint connection fails
- List name is incorrect
- Permissions are missing

**You'll see this message:**
> "Modo local: No se pudo conectar a SharePoint"
> "Usando datos de ejemplo - Para datos reales, configure la conexión a SharePoint"

### Mock Data Features

The mock data service provides:
- **8 sample data lineage flows**
- **6 different use cases**
- **Multiple data sources, ingestion tools, storage systems**
- **Realistic graph relationships**
- **Edge cases** (some flows with Linaje: false)

## Testing Different Scenarios

### Scenario 1: Empty Filter (All Use Cases)

1. Start the workbench
2. Add the web part
3. Keep "Todos" selected in the dropdown
4. **Expected:** See all data lineage flows visualized

### Scenario 2: Filtered by Use Case

1. Start the workbench
2. Add the web part
3. Select "Análisis de Ventas" from the dropdown
4. **Expected:** See only flows related to sales analysis

### Scenario 3: Custom Colors

1. Start the workbench
2. Add the web part
3. Open property pane (edit icon)
4. Enter Primary Color: `#ff0000` (red)
5. Enter Secondary Color: `#0000ff` (blue)
6. **Expected:** Graph nodes use your custom colors

### Scenario 4: Error Handling

To test error handling, temporarily break the mock data:

1. Edit `MockDataService.ts`
2. Make `getMockData()` return `[]` (empty array)
3. **Expected:** See appropriate error message in UI

## Advanced Testing

### Testing with SharePoint (When Ready)

When you DO need to test with real SharePoint data:

**Option A: Test on SharePoint Hosted Workbench**
```bash
# Build for testing (not production)
gulp bundle --ship=false

# Upload to test site collection only
# Go to: https://yourtenant.sharepoint.com/sites/testsite/_layouts/workbench.aspx
# Add your web part there
```

**Option B: Deploy to Test App Catalog**
```bash
npm run package-solution
# Upload to TEST app catalog (not production)
# Install on TEST site only
```

### Performance Testing

To test with large datasets:

1. Edit `MockDataService.ts`
2. Duplicate data entries (10x, 100x)
3. Test graph rendering performance
4. Test filter performance

### Browser Testing

Test in multiple browsers using the local workbench:
- Chrome: `http://localhost:5432/workbench`
- Edge: `http://localhost:5432/workbench`
- Firefox: `http://localhost:5432/workbench`

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
npm install
npm run serve
```

### Issue: "Task never defined: serve"

**Error:**
```
[18:38:47] Task never defined: serve
```

**Solution:**
This is already fixed in package.json. The script now uses `gulp serve-deprecated` instead of `gulp serve`. If you still see this error, make sure you have the latest package.json.

### Issue: Port already in use

**Solution:**
```bash
# Kill the process on port 4321
lsof -ti:4321 | xargs kill -9

# Windows:
# Use Task Manager or:
netstat -ano | findstr :4321
taskkill /PID <PID> /F

# Or change port in config/serve.json
```

### Issue: Changes not appearing

**Solution:**
1. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. Restart dev server
4. Check console for errors (F12)

### Issue: Mock data not loading

**Check:**
1. Console errors (F12)
2. MockDataService.ts syntax errors
3. Import statements are correct

### Issue: TypeScript errors

**Solution:**
```bash
# Check for errors
npm run build

# Clean and rebuild
npm run clean
npm run build
```

## File Structure Reference

```
data-lineage-spfx/
├── src/
│   └── webparts/
│       └── dataLineageViewer/
│           ├── components/
│           │   ├── DataLineageViewer.tsx          # Main component
│           │   ├── CytoscapeGraph.tsx             # Graph visualization
│           │   └── DataLineageViewer.module.scss  # Styles
│           ├── services/
│           │   ├── MockDataService.ts             # ← EDIT THIS for test data
│           │   ├── SharePointService.ts           # SharePoint integration
│           │   └── DataProcessingService.ts       # Business logic
│           ├── test/                              # Unit tests
│           └── DataLineageViewerWebPart.ts        # Web part definition
├── config/
│   └── serve.json                                 # Dev server config
└── package.json                                   # Scripts and dependencies
```

## Development Workflow

**Recommended workflow for making changes:**

1. **Make your change** in the source code
2. **Test locally** with `npm run serve`
3. **Verify with mock data** in workbench
4. **Run unit tests** with `npm test`
5. **Build** with `npm run build` (check for errors)
6. **Only when everything works:**
   - Package: `npm run package-solution`
   - Submit to SharePoint admin
   - Submit to cyber team

**This way you catch 99% of issues before involving other teams!**

## Mock Data vs SharePoint Data

| Feature | Mock Data Mode | SharePoint Mode |
|---------|----------------|-----------------|
| **Setup** | None - works immediately | Requires SharePoint list setup |
| **Speed** | Instant | Network dependent |
| **Data** | Predefined samples | Real production data |
| **Permissions** | None needed | SharePoint permissions required |
| **Approvals** | None | Cyber team + SharePoint admin |
| **Best For** | Development, UI testing | Production, real data validation |
| **Iteration Speed** | ⚡ Immediate | 🐌 Slow (waiting for approvals) |

## Best Practices

1. **Always test locally first** before requesting deployment
2. **Use mock data** for UI and layout changes
3. **Add unit tests** for business logic changes
4. **Test different use cases** with mock data filters
5. **Only involve SharePoint admin** when you need real data testing
6. **Only involve cyber team** when ready for production deployment

## Need Help?

**Common Questions:**

**Q: Do I need SharePoint running to test?**
A: No! Use `npm run serve` and test with mock data.

**Q: Can I test the property pane locally?**
A: Yes! The property pane works in the local workbench.

**Q: How do I test with different data?**
A: Edit `MockDataService.ts` to add/modify test data.

**Q: When do I need SharePoint admin?**
A: Only when deploying to production or testing with real SharePoint lists.

**Q: When do I need cyber team?**
A: Only when deploying the .sppkg package to the tenant app catalog.

**Q: Can I test on a real SharePoint page locally?**
A: No, but you can test on a SharePoint workbench without tenant deployment.

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Start local dev server (MOST COMMON)
npm run serve

# Run tests
npm test

# Build (check for errors)
npm run build

# Clean build artifacts
npm run clean

# Package for deployment (FINAL STEP)
npm run package-solution
```

## Summary

**You can now test 90% of your changes locally without bothering anyone!**

The only time you need approvals:
- Deploying to tenant app catalog (cyber team)
- Creating SharePoint lists (SharePoint admin)
- Testing with real production data (SharePoint admin)

For everything else: `npm run serve` and test away! 🚀
