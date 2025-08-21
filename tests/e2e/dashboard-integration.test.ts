import { test, expect } from '@playwright/test';
import { TestId } from '../../src/lib/TestId';

const TEST_DATA = {
  VALID_PRODUCTS: [
    {
      title: 'Dashboard Test Product',
      sku: 'DASH-001',
      price: '49.99',
      status: 'active' as const,
    },
    {
      title: 'Integration Test Widget',
      sku: 'DASH-002',
      price: '75.00',
      status: 'inactive' as const,
    },
  ],
} as const;

test.describe('Dashboard Integration - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for dashboard to load
    await expect(page.getByTestId(TestId.DASHBOARD)).toBeVisible();
  });

  test('should display initial metrics correctly', async ({ page }) => {
    // Take screenshot of initial state
    await expect(page).toHaveScreenshot('dashboard-initial-state.png', { fullPage: true });
    
    // Verify initial metrics
    await expect(page.getByTestId(TestId.TOTAL_PRODUCTS_METRIC)).toContainText('0');
    await expect(page.getByTestId(TestId.ACTIVE_PRODUCTS_METRIC)).toContainText('0');
    await expect(page.getByTestId(TestId.INACTIVE_PRODUCTS_METRIC)).toContainText('0');
    
    // Verify remote module container is visible
    await expect(page.getByTestId(TestId.REMOTE_MODULE_CONTAINER)).toBeVisible();
  });

  test('should update metrics when products are added via remote module', async ({ page }) => {
    // Wait for remote module to load (check for product form)
    await expect(page.getByTestId(TestId.PRODUCT_FORM)).toBeVisible({ timeout: 10000 });
    
    // Add first product
    const product1 = TEST_DATA.VALID_PRODUCTS[0];
    await page.getByTestId(TestId.TITLE_INPUT).fill(product1.title);
    await page.getByTestId(TestId.SKU_INPUT).fill(product1.sku);
    await page.getByTestId(TestId.PRICE_INPUT).fill(product1.price);
    await page.getByTestId(TestId.STATUS_SELECT).selectOption(product1.status);
    await page.getByTestId(TestId.ADD_BUTTON).click();
    
    // Wait for product to appear and metrics to update
    await expect(page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${product1.sku}"]`)).toBeVisible();
    
    // Verify metrics updated for one active product
    await expect(page.getByTestId(TestId.TOTAL_PRODUCTS_METRIC)).toContainText('1');
    await expect(page.getByTestId(TestId.ACTIVE_PRODUCTS_METRIC)).toContainText('1');
    await expect(page.getByTestId(TestId.INACTIVE_PRODUCTS_METRIC)).toContainText('0');
    
    // Add second product (inactive)
    const product2 = TEST_DATA.VALID_PRODUCTS[1];
    await page.getByTestId(TestId.TITLE_INPUT).fill(product2.title);
    await page.getByTestId(TestId.SKU_INPUT).fill(product2.sku);
    await page.getByTestId(TestId.PRICE_INPUT).fill(product2.price);
    await page.getByTestId(TestId.STATUS_SELECT).selectOption(product2.status);
    await page.getByTestId(TestId.ADD_BUTTON).click();
    
    // Wait for second product to appear
    await expect(page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${product2.sku}"]`)).toBeVisible();
    
    // Verify final metrics
    await expect(page.getByTestId(TestId.TOTAL_PRODUCTS_METRIC)).toContainText('2');
    await expect(page.getByTestId(TestId.ACTIVE_PRODUCTS_METRIC)).toContainText('1');
    await expect(page.getByTestId(TestId.INACTIVE_PRODUCTS_METRIC)).toContainText('1');
    
    // Take screenshot of final state
    await expect(page).toHaveScreenshot('dashboard-after-adding-products.png', { fullPage: true });
  });

  test('should update metrics when product status is toggled', async ({ page }) => {
    // Wait for remote module to load
    await expect(page.getByTestId(TestId.PRODUCT_FORM)).toBeVisible({ timeout: 10000 });
    
    // Add two products (one active, one inactive)
    const products = TEST_DATA.VALID_PRODUCTS;
    for (const product of products) {
      await page.getByTestId(TestId.TITLE_INPUT).fill(product.title);
      await page.getByTestId(TestId.SKU_INPUT).fill(product.sku);
      await page.getByTestId(TestId.PRICE_INPUT).fill(product.price);
      await page.getByTestId(TestId.STATUS_SELECT).selectOption(product.status);
      await page.getByTestId(TestId.ADD_BUTTON).click();
      
      await expect(page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${product.sku}"]`)).toBeVisible();
    }
    
    // Verify initial metrics after adding products
    await expect(page.getByTestId(TestId.TOTAL_PRODUCTS_METRIC)).toContainText('2');
    await expect(page.getByTestId(TestId.ACTIVE_PRODUCTS_METRIC)).toContainText('1');
    await expect(page.getByTestId(TestId.INACTIVE_PRODUCTS_METRIC)).toContainText('1');

    await expect(page).toHaveScreenshot('dashboard-before-toggling-product.png', { fullPage: true });
    
    // Toggle inactive product to active
    const inactiveProduct = products[1]; // second product is inactive
    const productRow = page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${inactiveProduct.sku}"]`);
    await productRow.getByTestId(TestId.TOGGLE_BUTTON).click();
    
    // Verify metrics updated after toggle
    await expect(page.getByTestId(TestId.TOTAL_PRODUCTS_METRIC)).toContainText('2');
    await expect(page.getByTestId(TestId.ACTIVE_PRODUCTS_METRIC)).toContainText('2');
    await expect(page.getByTestId(TestId.INACTIVE_PRODUCTS_METRIC)).toContainText('0');
    
    // Take screenshot after toggle
    await expect(page).toHaveScreenshot('dashboard-after-toggling-product.png', { fullPage: true });
  });
});
