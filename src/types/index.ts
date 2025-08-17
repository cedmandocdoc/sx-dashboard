export interface Metrics {
  total: number;
  active: number;
  inactive: number;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface ProductManagerProductAddedEvent extends CustomEvent<{
  product: Product;
}> {
}

export interface ProductManagerProductStatusToggledEvent extends CustomEvent<{
  productId: string;
  oldStatus: 'active' | 'inactive';
  newStatus: 'active' | 'inactive';
}> {
}