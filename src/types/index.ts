export type Metrics = {
  total: number;
  active: number;
  inactive: number;
}

export type Product = {
  id: string;
  title: string;
  sku: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type ProductManagerProductAddedEvent = CustomEvent<{
  product: Product;
}>

export type ProductManagerProductStatusToggledEvent = CustomEvent<{
  productId: string;
  oldStatus: 'active' | 'inactive';
  newStatus: 'active' | 'inactive';
}>