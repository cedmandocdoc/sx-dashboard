import { test, expect } from '@playwright/test';
import { TEST_IDS, TEST_DATA, EXPECTED_METRICS } from './constants';

test.describe('Dashboard Integration - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for dashboard to load
    await expect(page.getByTestId(TEST_IDS.DASHBOARD)).toBeVisible();
  });

  test('should display initial metrics correctly', async ({ page }) => {
    // Take screenshot of initial state
    await expect(page).toHaveScreenshot('dashboard-initial-state.png');
    
    // Verify initial metrics
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.initialState.total.toString());
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.initialState.active.toString());
    await expect(page.getByTestId(TEST_IDS.INACTIVE_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.initialState.inactive.toString());
    
    // Verify remote module container is visible
    await expect(page.getByTestId(TEST_IDS.REMOTE_MODULE_CONTAINER)).toBeVisible();
  });

  test('should update metrics when products are added via remote module', async ({ page }) => {
    // Wait for remote module to load (check for product form)
    await expect(page.getByTestId(TEST_IDS.PRODUCT_FORM)).toBeVisible({ timeout: 10000 });
    
    // Add first product
    const product1 = TEST_DATA.VALID_PRODUCTS[0];
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(product1.title);
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill(product1.sku);
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(product1.price);
    await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(product1.status);
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Wait for product to appear and metrics to update
    await expect(page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product1.sku}"]`)).toBeVisible();
    
    // Verify metrics updated for one active product
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText('1');
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toContainText('1');
    await expect(page.getByTestId(TEST_IDS.INACTIVE_PRODUCTS_METRIC)).toContainText('0');
    
    // Add second product (inactive)
    const product2 = TEST_DATA.VALID_PRODUCTS[1];
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(product2.title);
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill(product2.sku);
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(product2.price);
    await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(product2.status);
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Wait for second product to appear
    await expect(page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product2.sku}"]`)).toBeVisible();
    
    // Verify final metrics
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.afterAddingTwoProducts.total.toString());
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.afterAddingTwoProducts.active.toString());
    await expect(page.getByTestId(TEST_IDS.INACTIVE_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.afterAddingTwoProducts.inactive.toString());
    
    // Take screenshot of final state
    await expect(page).toHaveScreenshot('dashboard-after-adding-products.png');
  });

  test('should update metrics when product status is toggled', async ({ page }) => {
    // Wait for remote module to load
    await expect(page.getByTestId(TEST_IDS.PRODUCT_FORM)).toBeVisible({ timeout: 10000 });
    
    // Add two products (one active, one inactive)
    const products = TEST_DATA.VALID_PRODUCTS;
    for (const product of products) {
      await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(product.title);
      await page.getByTestId(TEST_IDS.SKU_INPUT).fill(product.sku);
      await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(product.price);
      await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(product.status);
      await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
      
      await expect(page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`)).toBeVisible();
    }
    
    // Verify initial metrics after adding products
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.afterAddingTwoProducts.total.toString());
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.afterAddingTwoProducts.active.toString());
    await expect(page.getByTestId(TEST_IDS.INACTIVE_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.afterAddingTwoProducts.inactive.toString());
    
    // Toggle inactive product to active
    const inactiveProduct = products[1]; // second product is inactive
    const productRow = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${inactiveProduct.sku}"]`);
    await productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON).click();
    
    // Verify metrics updated after toggle
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.afterTogglingOneProduct.total.toString());
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.afterTogglingOneProduct.active.toString());
    await expect(page.getByTestId(TEST_IDS.INACTIVE_PRODUCTS_METRIC)).toContainText(EXPECTED_METRICS.afterTogglingOneProduct.inactive.toString());
    
    // Take screenshot after toggle
    await expect(page).toHaveScreenshot('dashboard-after-toggling-product.png');
  });

  test('should maintain real-time sync between dashboard and product manager', async ({ page }) => {
    // Wait for remote module to load
    await expect(page.getByTestId(TEST_IDS.PRODUCT_FORM)).toBeVisible({ timeout: 10000 });
    
    const product = TEST_DATA.VALID_PRODUCTS[0];
    
    // Add product and verify immediate metric update
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(product.title);
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill(product.sku);
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(product.price);
    await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(product.status);
    
    // Verify metrics before submission
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText('0');
    
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Verify immediate metric update after product addition
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText('1');
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toContainText('1');
    
    // Toggle product status and verify immediate metric update
    const productRow = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`);
    await productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON).click();
    
    // Verify metrics updated immediately after toggle
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toContainText('0');
    await expect(page.getByTestId(TEST_IDS.INACTIVE_PRODUCTS_METRIC)).toContainText('1');
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText('1'); // Total should remain same
  });

  test('should persist metrics across page reloads', async ({ page }) => {
    // Wait for remote module to load
    await expect(page.getByTestId(TEST_IDS.PRODUCT_FORM)).toBeVisible({ timeout: 10000 });
    
    // Add a product
    const product = TEST_DATA.VALID_PRODUCTS[0];
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(product.title);
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill(product.sku);
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(product.price);
    await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(product.status);
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Verify metrics are updated
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText('1');
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toContainText('1');
    
    // Reload page
    await page.reload();
    await expect(page.getByTestId(TEST_IDS.DASHBOARD)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.PRODUCT_FORM)).toBeVisible({ timeout: 10000 });
    
    // Verify metrics persisted after reload
    await expect(page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText('1');
    await expect(page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toContainText('1');
    await expect(page.getByTestId(TEST_IDS.INACTIVE_PRODUCTS_METRIC)).toContainText('0');
    
    // Verify product is still visible in remote module
    await expect(page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`)).toBeVisible();
  });
});
