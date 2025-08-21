/**
 * Test constants for Dashboard E2E tests
 * This file contains all data-test-id selectors and test data used across test files
 */

export const TEST_IDS = {
  // Dashboard selectors
  DASHBOARD: 'dashboard',
  TOTAL_PRODUCTS_METRIC: 'total-products-metric',
  ACTIVE_PRODUCTS_METRIC: 'active-products-metric',
  INACTIVE_PRODUCTS_METRIC: 'inactive-products-metric',
  
  // Remote module selectors
  REMOTE_MODULE_CONTAINER: 'remote-module-container',
  REMOTE_MODULE_LOADING: 'remote-module-loading',
  REMOTE_MODULE_ERROR: 'remote-module-error',
  
  // Product Manager remote selectors (same as product manager app)
  PRODUCT_FORM: 'product-form',
  TITLE_INPUT: 'product-title-input',
  SKU_INPUT: 'product-sku-input',
  PRICE_INPUT: 'product-price-input',
  STATUS_SELECT: 'product-status-select',
  ADD_BUTTON: 'add-product-button',
  PRODUCT_TABLE: 'product-table',
  PRODUCT_ROW: 'product-row',
  TOGGLE_BUTTON: 'toggle-status-button',
  EMPTY_STATE: 'empty-state',
} as const;

export const TEST_DATA = {
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

export const SELECTORS = {
  getProductRowBySku: (sku: string) => `[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${sku}"]`,
  getToggleButtonBySku: (sku: string) => `${SELECTORS.getProductRowBySku(sku)} [data-testid="${TEST_IDS.TOGGLE_BUTTON}"]`,
} as const;

export const EXPECTED_METRICS = {
  initialState: {
    total: 0,
    active: 0,
    inactive: 0,
  },
  
  afterAddingTwoProducts: {
    total: 2,
    active: 1,
    inactive: 1,
  },
  
  afterTogglingOneProduct: {
    total: 2,
    active: 2,
    inactive: 0,
  },
} as const;
