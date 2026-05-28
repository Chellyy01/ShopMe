export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}
export interface CartItem {
  id: number;
  products: CartProduct[];
  total: number;
  userId: number;
}
export interface CartsResponse {
  carts: CartItem[];
  total: number;
}
