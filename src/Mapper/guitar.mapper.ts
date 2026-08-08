import type { GuitarDTO } from '../DTO/guitar.dto';
import { Guitar } from '../Entity/guitar.entity';

/**
 * Mapper: transforma un GuitarDTO (dato crudo) en una Guitar (entidad de dominio).
 */
export class GuitarMapper {
  static fromDTO(dto: GuitarDTO): Guitar {
    return new Guitar(
      dto.id,
      dto.name,
      dto.image,
      dto.description,
      dto.price,
      0, // quantity inicial en 0
    );
  }

  static fromDTOList(dtos: GuitarDTO[]): Guitar[] {
    return dtos.map((dto) => GuitarMapper.fromDTO(dto));
  }
}
