import { test, expect } from '@playwright/test';
import { TEST_IDS } from './constants';

test.describe('Remote Module Error Handling', () => {
  test('should display error state when remote module is not available', async ({ page }) => {
    // Override the remote module URL to simulate unavailable remote
    await page.route('**/remoteEntry.js', route => {
      route.abort('failed');
    });
    
    await page.goto('/');
    
    // Wait for dashboard to load
    await expect(page.getByTestId(TEST_IDS.DASHBOARD)).toBeVisible();
    
    // Wait for error state to appear
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toBeVisible({ timeout: 10000 });
    
    // Verify error message content
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toContainText('Failed to Load Remote Module: Product Manager');
    
    // Verify error icon is displayed
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toContainText('⚠️');
    
    // Take screenshot of error state
    await expect(page).toHaveScreenshot('remote-module-error-state.png');
    
    // Verify dashboard metrics are still visible and functional
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.INACTIVE_PRODUCTS_METRIC)).toBeVisible();
    
    // Verify initial metrics are shown (should be 0 since no products can be added)
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText('0');
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toContainText('0');
    await expect(page.getByTestId(TEST_IDS.INACTIVE_PRODUCTS_METRIC)).toContainText('0');
  });

  test('should handle network timeout for remote module', async ({ page }) => {
    // Simulate slow network by delaying response
    await page.route('**/remoteEntry.js', route => {
      setTimeout(() => {
        route.abort('timedout');
      }, 5000);
    });
    
    await page.goto('/');
    
    // Wait for dashboard to load
    await expect(page.getByTestId(TEST_IDS.DASHBOARD)).toBeVisible();
    
    // Should show loading state initially
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_LOADING)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_LOADING)).toContainText('Loading Remote Module: Product Manager');
    
    // Take screenshot of loading state
    await expect(page).toHaveScreenshot('remote-module-loading-state.png');
    
    // Wait for timeout and error state
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toBeVisible({ timeout: 15000 });
    
    // Take screenshot of error state after timeout
    await expect(page).toHaveScreenshot('remote-module-timeout-error.png');
  });

  test('should handle malformed remote module response', async ({ page }) => {
    // Return invalid JavaScript for remote module
    await page.route('**/remoteEntry.js', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: 'invalid javascript content {{{',
      });
    });
    
    await page.goto('/');
    
    // Wait for dashboard to load
    await expect(page.getByTestId(TEST_IDS.DASHBOARD)).toBeVisible();
    
    // Should eventually show error state
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toBeVisible({ timeout: 10000 });
    
    // Verify error message
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toContainText('Failed to Load Remote Module: Product Manager');
    
    // Take screenshot of malformed response error
    await expect(page).toHaveScreenshot('remote-module-malformed-error.png');
  });

  test('should recover when remote module becomes available after error', async ({ page }) => {
    let shouldFail = true;
    
    // Initially fail, then succeed on retry
    await page.route('**/remoteEntry.js', route => {
      if (shouldFail) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });
    
    await page.goto('/');
    
    // Wait for initial error state
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toBeVisible({ timeout: 10000 });
    
    // Take screenshot of initial error
    await expect(page).toHaveScreenshot('remote-module-initial-error.png');
    
    // Now allow the module to load
    shouldFail = false;
    
    // Reload page to retry loading
    await page.reload();
    
    // Wait for successful load
    await expect(page.getByTestId(TEST_IDS.PRODUCT_FORM)).toBeVisible({ timeout: 10000 });
    
    // Verify error state is gone
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).not.toBeVisible();
    
    // Take screenshot of recovery
    await expect(page).toHaveScreenshot('remote-module-recovery.png');
    
    // Verify functionality works after recovery
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill('Recovery Test Product');
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill('RECOVERY-001');
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill('25.00');
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Verify product was added and metrics updated
    await expect(page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="RECOVERY-001"]`)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText('1');
  });

  test('should maintain dashboard functionality during remote module error', async ({ page }) => {
    // Block remote module loading
    await page.route('**/remoteEntry.js', route => {
      route.abort('failed');
    });
    
    await page.goto('/');
    
    // Wait for error state
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toBeVisible({ timeout: 10000 });
    
    // Verify dashboard elements are still interactive
    await expect(page.getByTestId(TEST_IDS.DASHBOARD)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.INACTIVE_PRODUCTS_METRIC)).toBeVisible();
    
    // Verify page header and navigation are still functional
    await expect(page.locator('h1')).toContainText('Product Dashboard');
    await expect(page.locator('header')).toBeVisible();
    
    // Verify page can be refreshed without breaking
    await page.reload();
    await expect(page.getByTestId(TEST_IDS.DASHBOARD)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toBeVisible({ timeout: 10000 });
    
    // Take final screenshot showing stable error state
    await expect(page).toHaveScreenshot('dashboard-stable-with-error.png');
  });
});
