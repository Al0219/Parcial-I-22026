import { db } from '../../data/db';
import { Guitar } from '../Entity/guitar.entity';
import { GuitarMapper } from '../Mapper/guitar.mapper';

/**
 * GuitarService — gestiona el catálogo y el estado global del carrito.
 * El carrito es un arreglo de entidades Guitar con quantity > 0.
 */
export class GuitarService {
  private readonly catalog: Guitar[];
  private cart: Guitar[];

  constructor() {
    // Mapea los DTOs de la base de datos a entidades de dominio
    this.catalog = GuitarMapper.fromDTOList(db);
    this.cart = [];
  }

  // ─── Catálogo ────────────────────────────────────────────────────────────────

  /** Devuelve la lista completa del catálogo. */
  getCatalog(): Guitar[] {
    return this.catalog;
  }

  // ─── Carrito ─────────────────────────────────────────────────────────────────

  /** Devuelve los ítems actuales del carrito (quantity > 0). */
  getCart(): Guitar[] {
    return this.cart;
  }

  /**
   * Agrega un producto al carrito.
   * Si ya existe, incrementa su cantidad en 1.
   * Si no existe, lo copia del catálogo con quantity = 1.
   */
  addToCart(id: number): void {
    const existing = this.cart.find((item) => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      const product = this.catalog.find((g) => g.id === id);
      if (!product) return;
      const cartItem = new Guitar(
        product.id,
        product.name,
        product.image,
        product.description,
        product.price,
        1,
      );
      this.cart.push(cartItem);
    }
  }

  /**
   * Incrementa en 1 la cantidad de un ítem del carrito.
   */
  incrementItem(id: number): void {
    const item = this.cart.find((i) => i.id === id);
    if (item) item.quantity += 1;
  }

  /**
   * Decrementa en 1 la cantidad de un ítem.
   * Si la cantidad llega a 0, el ítem es eliminado automáticamente.
   */
  decrementItem(id: number): void {
    const item = this.cart.find((i) => i.id === id);
    if (!item) return;

    item.quantity -= 1;

    if (item.quantity === 0) {
      this.removeItem(id);
    }
  }

  /**
   * Elimina un ítem del carrito por su id.
   */
  removeItem(id: number): void {
    this.cart = this.cart.filter((i) => i.id !== id);
  }

  /**
   * Calcula el total a pagar sumando (price × quantity) de cada ítem.
   */
  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  /**
   * Retorna la cantidad total de artículos en el carrito (suma de quantities).
   */
  getCartCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Indica si el carrito está vacío.
   */
  isCartEmpty(): boolean {
    return this.cart.length === 0;
  }
}
