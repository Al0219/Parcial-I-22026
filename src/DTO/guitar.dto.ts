/**
 * DTO (Data Transfer Object) para Guitarra.
 * Representa la forma exacta del dato que proviene de la fuente (db.ts).
 */
export interface GuitarDTO {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}
