/**
 * Entidad de dominio Guitarra.
 * Extiende el DTO añadiendo `quantity` para gestión del carrito.
 */
export class Guitar {
  public readonly id: number;
  public readonly name: string;
  public readonly image: string;
  public readonly description: string;
  public readonly price: number;
  public quantity: number;

  constructor(
    id: number,
    name: string,
    image: string,
    description: string,
    price: number,
    quantity: number = 0,
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
  }
}
