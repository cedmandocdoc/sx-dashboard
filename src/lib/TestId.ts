/**
 * Test IDs enum for Dashboard E2E tests
 * This enum contains all data-test-id selectors used across test files
 */

export enum TestId {
  // Dashboard selectors
  DASHBOARD = 'dashboard',
  TOTAL_PRODUCTS_METRIC = 'total-products-metric',
  ACTIVE_PRODUCTS_METRIC = 'active-products-metric',
  INACTIVE_PRODUCTS_METRIC = 'inactive-products-metric',
  
  // Remote module selectors
  REMOTE_MODULE_CONTAINER = 'remote-module-container',
  REMOTE_MODULE_LOADING = 'remote-module-loading',
  REMOTE_MODULE_ERROR = 'remote-module-error',
  
  // Product Manager remote selectors (same as product manager app)
  PRODUCT_FORM = 'product-form',
  TITLE_INPUT = 'product-title-input',
  SKU_INPUT = 'product-sku-input',
  PRICE_INPUT = 'product-price-input',
  STATUS_SELECT = 'product-status-select',
  ADD_BUTTON = 'add-product-button',
  PRODUCT_TABLE = 'product-table',
  PRODUCT_ROW = 'product-row',
  TOGGLE_BUTTON = 'toggle-status-button',
  EMPTY_STATE = 'empty-state',
  PRODUCT_TITLE = 'product-title',
  PRODUCT_SKU = 'product-sku',
  PRODUCT_PRICE = 'product-price',
  PRODUCT_STATUS = 'product-status',
}
