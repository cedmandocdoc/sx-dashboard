# Dashboard E2E Tests

This directory contains comprehensive end-to-end tests for the Dashboard application using Playwright.

## Test Structure

### Test Files

- **`dashboard-integration.test.ts`** - Tests for dashboard integration with remote product manager
  - Initial metrics display
  - Real-time metrics updates when products are added
  - Metrics updates when product status is toggled
  - Real-time synchronization between dashboard and remote module
  - State persistence across page reloads

- **`remote-module-error.test.ts`** - Tests for error handling when remote module is unavailable
  - Error state display when remote module fails to load
  - Network timeout handling
  - Malformed response handling
  - Recovery when remote module becomes available
  - Dashboard functionality during remote module errors

### Test Constants

The `constants.ts` file contains:
- **TEST_IDS**: Data-testid selectors for dashboard and remote module elements
- **TEST_DATA**: Test products for integration testing
- **EXPECTED_METRICS**: Expected metric values for different states
- **SELECTORS**: Helper functions for dynamic selectors

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. **Important**: Ensure both applications are built and the product manager is serving on port 4173:
   ```bash
   # In product manager directory
   cd ../sx-product-manager
   npm run build
   npm run preview  # This should run on port 4173
   
   # In dashboard directory (separate terminal)
   cd ../sx-dashboard
   npm run build
   ```

### Test Execution

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# Run specific test file
npx playwright test dashboard-integration.test.ts

# Run specific test
npx playwright test --grep "should display initial metrics correctly"
```

### Screenshot Testing

The tests include comprehensive screenshot testing:
- Initial dashboard state
- Dashboard after adding products
- Dashboard after toggling products
- Error states for remote module failures
- Loading states

Screenshots are stored in `test-results/` directory and can be updated with:
```bash
npx playwright test --update-snapshots
```

## Test Configuration

- **Base URL**: `http://localhost:4174` (Dashboard)
- **Remote Module**: Expected on `http://localhost:4173` (Product Manager)
- **Browsers**: Chromium, Firefox, WebKit
- **Retry**: 2 times on CI, 0 locally
- **Reporters**: HTML reporter
- **Traces**: Captured on first retry

## Architecture Testing

The tests validate the micro-frontend architecture:

1. **Module Federation**: Tests remote module loading and error handling
2. **Cross-App Communication**: Validates real-time metric updates
3. **Error Boundaries**: Tests graceful degradation when remote module fails
4. **State Management**: Ensures data consistency across applications

## Best Practices Used

1. **Data-testid attributes** for reliable element selection across applications
2. **Screenshot testing** for visual regression detection of integrated UI
3. **Error scenario testing** for robust micro-frontend behavior
4. **Network mocking** to simulate remote module failures
5. **Real-time validation** of cross-application data synchronization
6. **Timeout handling** for async micro-frontend loading
7. **Recovery testing** for resilient application behavior

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 4173 (product manager) and 4174 (dashboard) are available
2. **Remote module not found**: Make sure product manager is built and running on port 4173
3. **Federation errors**: Check that both applications are built with correct federation config
4. **Timeout errors**: Increase timeout for remote module loading (default: 10s)

### Debug Tips

1. **Check both applications are running**:
   ```bash
   # Terminal 1: Product Manager
   cd sx-product-manager && npm run preview
   
   # Terminal 2: Dashboard  
   cd sx-dashboard && npm run preview
   ```

2. **Use browser developer tools** to check network requests and module federation
3. **Check federation configuration** in vite.config.ts files
4. **Use `--headed` flag** to see both applications loading in browser
5. **Monitor console logs** for federation errors during test execution

### Module Federation Debugging

1. **Check remoteEntry.js** is accessible at `http://localhost:4173/assets/remoteEntry.js`
2. **Verify federation expose/consume** configuration matches between apps
3. **Check for CORS issues** if running on different domains
4. **Monitor network tab** for failed module requests during tests
