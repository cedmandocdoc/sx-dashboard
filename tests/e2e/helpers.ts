import { Page, expect } from '@playwright/test';
import { TEST_IDS, TEST_DATA, EXPECTED_METRICS } from './constants';

/**
 * Helper utilities for Dashboard E2E tests
 */

export class DashboardHelpers {
  constructor(private page: Page) {}

  /**
   * Verifies dashboard metrics match expected values
   */
  async verifyMetrics(expectedMetrics: typeof EXPECTED_METRICS.initialState) {
    await expect(this.page.getByTestId(TEST_IDS.TOTAL_PRODUCTS_METRIC)).toContainText(expectedMetrics.total.toString());
    await expect(this.page.getByTestId(TEST_IDS.ACTIVE_PRODUCTS_METRIC)).toContainText(expectedMetrics.active.toString());
    await expect(this.page.getByTestId(TEST_IDS.INACTIVE_PRODUCTS_METRIC)).toContainText(expectedMetrics.inactive.toString());
  }

  /**
   * Waits for dashboard to be fully loaded
   */
  async waitForDashboard() {
    await expect(this.page.getByTestId(TEST_IDS.DASHBOARD)).toBeVisible();
  }

  /**
   * Takes screenshot of dashboard state
   */
  async takeScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`);
  }
}

export class RemoteModuleHelpers {
  constructor(private page: Page) {}

  /**
   * Waits for remote module to load successfully
   */
  async waitForRemoteModuleLoad(timeout = 10000) {
    await expect(this.page.getByTestId(TEST_IDS.PRODUCT_FORM)).toBeVisible({ timeout });
  }

  /**
   * Waits for remote module error state
   */
  async waitForRemoteModuleError(timeout = 10000) {
    await expect(this.page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toBeVisible({ timeout });
  }

  /**
   * Waits for remote module loading state
   */
  async waitForRemoteModuleLoading() {
    await expect(this.page.getByTestId(TEST_IDS.REMOTE_MODULE_LOADING)).toBeVisible();
  }

  /**
   * Verifies remote module error message
   */
  async verifyErrorMessage(expectedModuleName = 'Product Manager') {
    await expect(this.page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toContainText(`Failed to Load Remote Module: ${expectedModuleName}`);
    await expect(this.page.getByTestId(TEST_IDS.REMOTE_MODULE_ERROR)).toContainText('⚠️');
  }

  /**
   * Adds product through remote module
   */
  async addProduct(product: typeof TEST_DATA.VALID_PRODUCTS[0]) {
    await this.page.getByTestId(TEST_IDS.TITLE_INPUT).fill(product.title);
    await this.page.getByTestId(TEST_IDS.SKU_INPUT).fill(product.sku);
    await this.page.getByTestId(TEST_IDS.PRICE_INPUT).fill(product.price);
    await this.page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(product.status);
    await this.page.getByTestId(TEST_IDS.ADD_BUTTON).click();

    // Wait for product to appear
    await expect(
      this.page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`)
    ).toBeVisible();
  }

  /**
   * Toggles product status in remote module
   */
  async toggleProductStatus(sku: string) {
    const productRow = this.page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${sku}"]`);
    await productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON).click();
  }

  /**
   * Verifies product exists in remote module table
   */
  async verifyProductInTable(sku: string) {
    const productRow = this.page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${sku}"]`);
    await expect(productRow).toBeVisible();
  }
}

export class NetworkMockHelpers {
  constructor(private page: Page) {}

  /**
   * Blocks remote module loading to simulate network failure
   */
  async blockRemoteModule() {
    await this.page.route('**/remoteEntry.js', route => {
      route.abort('failed');
    });
  }

  /**
   * Simulates slow network by delaying remote module response
   */
  async slowRemoteModule(delayMs = 5000) {
    await this.page.route('**/remoteEntry.js', route => {
      setTimeout(() => {
        route.abort('timedout');
      }, delayMs);
    });
  }

  /**
   * Returns malformed response for remote module
   */
  async malformedRemoteModule() {
    await this.page.route('**/remoteEntry.js', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: 'invalid javascript content {{{',
      });
    });
  }

  /**
   * Sets up conditional remote module loading (fail first, then succeed)
   */
  async conditionalRemoteModule(shouldFail: () => boolean) {
    await this.page.route('**/remoteEntry.js', route => {
      if (shouldFail()) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });
  }

  /**
   * Removes all route mocks
   */
  async clearMocks() {
    await this.page.unroute('**/remoteEntry.js');
  }
}

export class IntegrationTestHelpers {
  dashboard: DashboardHelpers;
  remoteModule: RemoteModuleHelpers;
  network: NetworkMockHelpers;

  constructor(private page: Page) {
    this.dashboard = new DashboardHelpers(page);
    this.remoteModule = new RemoteModuleHelpers(page);
    this.network = new NetworkMockHelpers(page);
  }

  /**
   * Navigates to dashboard and waits for initial load
   */
  async navigateAndWait() {
    await this.page.goto('/');
    await this.dashboard.waitForDashboard();
  }

  /**
   * Performs full integration test setup
   */
  async setupIntegrationTest() {
    await this.navigateAndWait();
    await this.remoteModule.waitForRemoteModuleLoad();
  }

  /**
   * Adds products and verifies metrics update
   */
  async addProductsAndVerifyMetrics(products: typeof TEST_DATA.VALID_PRODUCTS) {
    for (const product of products) {
      await this.remoteModule.addProduct(product);
    }

    // Calculate expected metrics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const inactiveProducts = products.filter(p => p.status === 'inactive').length;

    await this.dashboard.verifyMetrics({
      total: totalProducts,
      active: activeProducts,
      inactive: inactiveProducts,
    });
  }

  /**
   * Waits for network to stabilize after operations
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Performs page reload and verifies state persistence
   */
  async reloadAndVerifyPersistence() {
    await this.page.reload();
    await this.dashboard.waitForDashboard();
    await this.remoteModule.waitForRemoteModuleLoad();
  }

  /**
   * Sets up error scenario and verifies error handling
   */
  async setupErrorScenario() {
    await this.network.blockRemoteModule();
    await this.navigateAndWait();
    await this.remoteModule.waitForRemoteModuleError();
  }
}
